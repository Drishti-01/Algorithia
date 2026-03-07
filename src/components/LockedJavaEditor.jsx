import { useEffect, useMemo, useRef } from "react";
import Editor from "@monaco-editor/react";
import {
    DEFAULT_INPUT_ARRAY,
    DEFAULT_USER_CODE,
    buildTemplateCode,
    createProgramTemplate,
    lineCount,
} from "../constants/template";

const fallbackTemplate = createProgramTemplate(DEFAULT_INPUT_ARRAY);

export function LockedJavaEditor({
    userCode,
    onUserCodeChange,
    currentLine,
    error,
    onTemplateViolation,
    templatePrefix = fallbackTemplate.prefix,
    templateSuffix = fallbackTemplate.suffix,
}) {
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const decorationsRef = useRef([]);

    const fullCode = useMemo(
        () => buildTemplateCode(templatePrefix, userCode ?? DEFAULT_USER_CODE, templateSuffix),
        [templatePrefix, templateSuffix, userCode],
    );

    const editableStartLine = useMemo(() => lineCount(templatePrefix), [templatePrefix]);
    const editableEndLine = useMemo(
        () => editableStartLine + lineCount(userCode ?? "") - 1,
        [editableStartLine, userCode],
    );
    const totalLines = useMemo(() => lineCount(fullCode), [fullCode]);

    useEffect(() => {
        const monaco = monacoRef.current;
        const editor = editorRef.current;
        const model = editor?.getModel();

        if (!monaco || !editor || !model) {
            return;
        }

        const nextDecorations = [];

        if (editableStartLine > 1) {
            nextDecorations.push({
                range: new monaco.Range(1, 1, editableStartLine - 1, 1),
                options: {
                    isWholeLine: true,
                    className: "locked-region-line",
                },
            });
        }

        if (editableEndLine < totalLines) {
            nextDecorations.push({
                range: new monaco.Range(editableEndLine + 1, 1, totalLines, 1),
                options: {
                    isWholeLine: true,
                    className: "locked-region-line",
                },
            });
        }

        if (typeof currentLine === "number") {
            nextDecorations.push({
                range: new monaco.Range(currentLine, 1, currentLine, 1),
                options: {
                    isWholeLine: true,
                    className: "execution-line-highlight",
                },
            });
        }

        decorationsRef.current = editor.deltaDecorations(decorationsRef.current, nextDecorations);
    }, [currentLine, editableEndLine, editableStartLine, totalLines]);

    useEffect(() => {
        const monaco = monacoRef.current;
        const editor = editorRef.current;
        const model = editor?.getModel();

        if (!monaco || !model) {
            return;
        }

        const markers = [];

        if (error && typeof error.line === "number") {
            const startColumn = Number.isInteger(error.column) ? error.column : 1;
            markers.push({
                startLineNumber: error.line,
                endLineNumber: error.line,
                startColumn,
                endColumn: startColumn + 1,
                message: error.message,
                severity: monaco.MarkerSeverity.Error,
            });
        }

        monaco.editor.setModelMarkers(model, "simulation", markers);
    }, [error]);

    function handleEditorMount(editor, monaco) {
        editorRef.current = editor;
        monacoRef.current = monaco;

        monaco.editor.defineTheme("dataCityTheme", {
            base: "vs-dark",
            inherit: true,
            rules: [
                { token: "comment", foreground: "7dd3fc" },
                { token: "keyword", foreground: "f97316" },
                { token: "number", foreground: "facc15" },
            ],
            colors: {
                "editor.background": "#030712",
                "editorLineNumber.foreground": "#475569",
                "editorLineNumber.activeForeground": "#93c5fd",
                "editorGutter.background": "#030712",
                "editor.selectionBackground": "#1d4ed855",
                "editorCursor.foreground": "#f8fafc",
            },
        });

        monaco.editor.setTheme("dataCityTheme");
    }

    function handleChange(nextValue) {
        const candidate = nextValue ?? "";

        if (candidate.startsWith(templatePrefix) && candidate.endsWith(templateSuffix)) {
            const extracted = candidate.slice(
                templatePrefix.length,
                candidate.length - templateSuffix.length,
            );
            onUserCodeChange(extracted);
            onTemplateViolation?.("");
            return;
        }

        onTemplateViolation?.("Only code inside solve() is editable.");
    }

    return (
        <Editor
            height="100%"
            defaultLanguage="java"
            value={fullCode}
            onChange={handleChange}
            onMount={handleEditorMount}
            options={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 14,
                minimap: { enabled: false },
                automaticLayout: true,
                scrollBeyondLastLine: false,
                tabSize: 4,
                insertSpaces: true,
                lineNumbersMinChars: 3,
                renderLineHighlight: "none",
            }}
        />
    );
}
