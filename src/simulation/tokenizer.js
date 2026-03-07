import { SimulationError } from "./SimulationError";

const KEYWORDS = new Set(["int", "for", "if", "else", "while", "return"]);
const TWO_CHAR_SYMBOLS = new Set(["<=", ">=", "==", "++", "--"]);
const ONE_CHAR_SYMBOLS = new Set(["+", "-", "*", "/", "=", ">", "<", ";", "(", ")", "{", "}", "[", "]", ".", ","]);

function isIdentifierStart(char) {
    return /[A-Za-z_]/.test(char);
}

function isIdentifierPart(char) {
    return /[A-Za-z0-9_]/.test(char);
}

function isDigit(char) {
    return /[0-9]/.test(char);
}

export function tokenize(source, { lineOffset = 0 } = {}) {
    const tokens = [];
    let cursor = 0;
    let line = 1 + lineOffset;
    let column = 1;

    function advance() {
        const char = source[cursor];
        cursor += 1;
        if (char === "\n") {
            line += 1;
            column = 1;
        } else {
            column += 1;
        }
        return char;
    }

    function peek(offset = 0) {
        return source[cursor + offset];
    }

    while (cursor < source.length) {
        const char = peek();

        if (char === " " || char === "\t" || char === "\r") {
            advance();
            continue;
        }

        if (char === "\n") {
            advance();
            continue;
        }

        if (char === "/" && peek(1) === "/") {
            while (cursor < source.length && peek() !== "\n") {
                advance();
            }
            continue;
        }

        if (char === "/" && peek(1) === "*") {
            const startLine = line;
            const startColumn = column;
            advance();
            advance();
            while (cursor < source.length && !(peek() === "*" && peek(1) === "/")) {
                advance();
            }
            if (cursor >= source.length) {
                throw new SimulationError("Unterminated block comment.", {
                    line: startLine,
                    column: startColumn,
                    kind: "SyntaxError",
                });
            }
            advance();
            advance();
            continue;
        }

        if (isIdentifierStart(char)) {
            const startLine = line;
            const startColumn = column;
            let value = "";
            while (cursor < source.length && isIdentifierPart(peek())) {
                value += advance();
            }
            const type = KEYWORDS.has(value) ? "keyword" : "identifier";
            tokens.push({ type, value, line: startLine, column: startColumn });
            continue;
        }

        if (isDigit(char)) {
            const startLine = line;
            const startColumn = column;
            let value = "";
            while (cursor < source.length && isDigit(peek())) {
                value += advance();
            }
            tokens.push({ type: "number", value, line: startLine, column: startColumn });
            continue;
        }

        const twoChar = `${char}${peek(1) || ""}`;
        if (TWO_CHAR_SYMBOLS.has(twoChar)) {
            const startLine = line;
            const startColumn = column;
            advance();
            advance();
            tokens.push({ type: "symbol", value: twoChar, line: startLine, column: startColumn });
            continue;
        }

        if (ONE_CHAR_SYMBOLS.has(char)) {
            const startLine = line;
            const startColumn = column;
            advance();
            tokens.push({ type: "symbol", value: char, line: startLine, column: startColumn });
            continue;
        }

        throw new SimulationError(`Unexpected character '${char}'.`, {
            line,
            column,
            kind: "SyntaxError",
        });
    }

    tokens.push({ type: "eof", value: "<eof>", line, column });
    return tokens;
}
