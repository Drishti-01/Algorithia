import { SimulationError } from "./SimulationError";

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.cursor = 0;
    }

    parseProgram() {
        const statements = [];
        while (!this.isAtEnd()) {
            statements.push(this.parseStatement());
        }
        return {
            type: "Program",
            body: statements,
        };
    }

    parseStatement() {
        if (this.matchKeyword("int")) {
            return this.parseVarDeclaration(this.previous(), true);
        }

        if (this.matchKeyword("for")) {
            return this.parseForStatement(this.previous());
        }

        if (this.matchKeyword("if")) {
            return this.parseIfStatement(this.previous());
        }

        if (this.checkType("keyword")) {
            const token = this.peek();
            throw new SimulationError(`Unsupported syntax '${token.value}'.`, {
                line: token.line,
                column: token.column,
                kind: "UnsupportedSyntax",
            });
        }

        if (this.matchSymbol("{")) {
            return this.parseBlockStatement(this.previous());
        }

        return this.parseSimpleAssignmentOrUpdate(true);
    }

    parseBlockStatement(openBraceToken) {
        const statements = [];
        while (!this.checkSymbol("}") && !this.isAtEnd()) {
            statements.push(this.parseStatement());
        }
        this.consumeSymbol("}", "Expected '}' to close block.");
        return {
            type: "BlockStatement",
            statements,
            line: openBraceToken.line,
        };
    }

    parseStatementBlock() {
        if (this.matchSymbol("{")) {
            return this.parseBlockStatement(this.previous());
        }

        const statement = this.parseStatement();
        return {
            type: "BlockStatement",
            line: statement.line,
            statements: [statement],
        };
    }

    parseIfStatement(ifToken) {
        this.consumeSymbol("(", "Expected '(' after 'if'.");
        const condition = this.parseExpression();
        this.consumeSymbol(")", "Expected ')' after if condition.");
        const consequent = this.parseStatementBlock();

        let alternate = null;
        if (this.matchKeyword("else")) {
            alternate = this.parseStatementBlock();
        }

        return {
            type: "IfStatement",
            line: ifToken.line,
            condition,
            consequent,
            alternate,
        };
    }

    parseForStatement(forToken) {
        this.consumeSymbol("(", "Expected '(' after 'for'.");

        let initializer = null;
        if (!this.checkSymbol(";")) {
            if (this.matchKeyword("int")) {
                initializer = this.parseVarDeclaration(this.previous(), false);
            } else {
                initializer = this.parseSimpleAssignmentOrUpdate(false);
            }
        }
        this.consumeSymbol(";", "Expected ';' after for initializer.");

        let condition = null;
        if (!this.checkSymbol(";")) {
            condition = this.parseExpression();
        }
        this.consumeSymbol(";", "Expected ';' after for condition.");

        let update = null;
        if (!this.checkSymbol(")")) {
            update = this.parseSimpleAssignmentOrUpdate(false);
        }
        this.consumeSymbol(")", "Expected ')' after for update.");

        const body = this.parseStatementBlock();

        return {
            type: "ForStatement",
            line: forToken.line,
            initializer,
            condition,
            update,
            body,
        };
    }

    parseVarDeclaration(intToken, expectSemicolon) {
        const nameToken = this.consumeType("identifier", "Expected variable name after 'int'.");
        let initializer = null;

        if (this.matchSymbol("=")) {
            initializer = this.parseExpression();
        }

        if (expectSemicolon) {
            this.consumeSymbol(";", "Expected ';' after variable declaration.");
        }

        return {
            type: "VarDeclaration",
            line: intToken.line,
            name: nameToken.value,
            initializer,
        };
    }

    parseSimpleAssignmentOrUpdate(expectSemicolon) {
        const target = this.parseAssignableTarget();

        let statement;
        if (this.matchSymbol("++", "--")) {
            const operatorToken = this.previous();
            statement = {
                type: "UpdateStatement",
                line: operatorToken.line,
                target,
                operator: operatorToken.value,
            };
        } else {
            const equalsToken = this.consumeSymbol("=", "Expected '=' in assignment statement.");
            const expression = this.parseExpression();
            statement = {
                type: "AssignmentStatement",
                line: equalsToken.line,
                target,
                expression,
            };
        }

        if (expectSemicolon) {
            this.consumeSymbol(";", "Expected ';' after statement.");
        }

        return statement;
    }

    parseAssignableTarget() {
        const identifierToken = this.consumeType("identifier", "Expected assignment target.");
        let node = {
            type: "Identifier",
            line: identifierToken.line,
            name: identifierToken.value,
        };

        while (this.matchSymbol("[")) {
            const bracketToken = this.previous();
            const index = this.parseExpression();
            this.consumeSymbol("]", "Expected ']' after array index.");
            node = {
                type: "ArrayAccess",
                line: bracketToken.line,
                array: node,
                index,
            };
        }

        if (this.checkSymbol(".")) {
            const token = this.peek();
            throw new SimulationError("Member assignment is not supported.", {
                line: token.line,
                column: token.column,
                kind: "UnsupportedSyntax",
            });
        }

        return node;
    }

    parseExpression() {
        return this.parseEquality();
    }

    parseEquality() {
        let expression = this.parseComparison();

        while (this.matchSymbol("==")) {
            const operator = this.previous();
            const right = this.parseComparison();
            expression = {
                type: "BinaryExpression",
                line: operator.line,
                operator: operator.value,
                left: expression,
                right,
            };
        }

        return expression;
    }

    parseComparison() {
        let expression = this.parseTerm();

        while (this.matchSymbol(">", "<", ">=", "<=")) {
            const operator = this.previous();
            const right = this.parseTerm();
            expression = {
                type: "BinaryExpression",
                line: operator.line,
                operator: operator.value,
                left: expression,
                right,
            };
        }

        return expression;
    }

    parseTerm() {
        let expression = this.parseFactor();

        while (this.matchSymbol("+", "-")) {
            const operator = this.previous();
            const right = this.parseFactor();
            expression = {
                type: "BinaryExpression",
                line: operator.line,
                operator: operator.value,
                left: expression,
                right,
            };
        }

        return expression;
    }

    parseFactor() {
        let expression = this.parseUnary();

        while (this.matchSymbol("*", "/")) {
            const operator = this.previous();
            const right = this.parseUnary();
            expression = {
                type: "BinaryExpression",
                line: operator.line,
                operator: operator.value,
                left: expression,
                right,
            };
        }

        return expression;
    }

    parseUnary() {
        if (this.matchSymbol("-", "+")) {
            const operator = this.previous();
            const right = this.parseUnary();
            return {
                type: "UnaryExpression",
                line: operator.line,
                operator: operator.value,
                argument: right,
            };
        }

        return this.parsePrimary();
    }

    parsePrimary() {
        if (this.matchType("number")) {
            const numberToken = this.previous();
            return {
                type: "Literal",
                line: numberToken.line,
                value: Number(numberToken.value),
            };
        }

        if (this.matchType("identifier")) {
            const identifierToken = this.previous();
            let expression = {
                type: "Identifier",
                line: identifierToken.line,
                name: identifierToken.value,
            };

            while (true) {
                if (this.matchSymbol("[")) {
                    const bracketToken = this.previous();
                    const index = this.parseExpression();
                    this.consumeSymbol("]", "Expected ']' after array index.");
                    expression = {
                        type: "ArrayAccess",
                        line: bracketToken.line,
                        array: expression,
                        index,
                    };
                    continue;
                }

                if (this.matchSymbol(".")) {
                    const dotToken = this.previous();
                    const property = this.consumeType("identifier", "Expected member name after '.'.");
                    expression = {
                        type: "MemberExpression",
                        line: dotToken.line,
                        object: expression,
                        property: property.value,
                    };
                    continue;
                }

                break;
            }

            return expression;
        }

        if (this.matchSymbol("(")) {
            const expression = this.parseExpression();
            this.consumeSymbol(")", "Expected ')' after expression.");
            return expression;
        }

        const token = this.peek();
        throw new SimulationError(`Unexpected token '${token.value}'.`, {
            line: token.line,
            column: token.column,
            kind: "SyntaxError",
        });
    }

    matchKeyword(keyword) {
        if (!this.checkType("keyword")) {
            return false;
        }
        if (this.peek().value !== keyword) {
            return false;
        }
        this.advance();
        return true;
    }

    matchType(type) {
        if (!this.checkType(type)) {
            return false;
        }
        this.advance();
        return true;
    }

    matchSymbol(...symbols) {
        if (!this.checkType("symbol")) {
            return false;
        }
        if (!symbols.includes(this.peek().value)) {
            return false;
        }
        this.advance();
        return true;
    }

    consumeType(type, message) {
        if (this.checkType(type)) {
            return this.advance();
        }

        const token = this.peek();
        throw new SimulationError(message, {
            line: token.line,
            column: token.column,
            kind: "SyntaxError",
        });
    }

    consumeSymbol(symbol, message) {
        if (this.checkType("symbol") && this.peek().value === symbol) {
            return this.advance();
        }

        const token = this.peek();
        throw new SimulationError(message, {
            line: token.line,
            column: token.column,
            kind: "SyntaxError",
        });
    }

    checkType(type) {
        if (this.isAtEnd()) {
            return false;
        }
        return this.peek().type === type;
    }

    checkSymbol(symbol) {
        if (!this.checkType("symbol")) {
            return false;
        }
        return this.peek().value === symbol;
    }

    isAtEnd() {
        return this.peek().type === "eof";
    }

    advance() {
        if (!this.isAtEnd()) {
            this.cursor += 1;
        }
        return this.previous();
    }

    peek() {
        return this.tokens[this.cursor];
    }

    previous() {
        return this.tokens[this.cursor - 1];
    }
}

export function parse(tokens) {
    const parser = new Parser(tokens);
    return parser.parseProgram();
}