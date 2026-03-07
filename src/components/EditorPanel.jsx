import { LockedJavaEditor } from "./LockedJavaEditor";

export function EditorPanel({
    title,
    subtitle,
    userCode,
    onUserCodeChange,
    currentLine,
    error,
    templatePrefix,
    templateSuffix,
    onTemplateViolation,
    onRun,
    onReset,
    isRunning,
}) {
    return (
        <section className="editor-column">
            <header className="city-panel-header">
                <h2>{title}</h2>
                <p>{subtitle}</p>
            </header>

            <div className="editor-shell">
                <LockedJavaEditor
                    userCode={userCode}
                    onUserCodeChange={onUserCodeChange}
                    currentLine={currentLine}
                    error={error}
                    templatePrefix={templatePrefix}
                    templateSuffix={templateSuffix}
                    onTemplateViolation={onTemplateViolation}
                />
            </div>

            <div className="button-row">
                <button
                    type="button"
                    className="primary-btn"
                    onClick={onRun}
                    disabled={isRunning}
                >
                    {isRunning ? "Running..." : "Run Simulation"}
                </button>
                <button
                    type="button"
                    className="secondary-btn"
                    onClick={onReset}
                >
                    Reset
                </button>
            </div>
        </section>
    );
}