import { SimulationError } from "./SimulationError";
import { STEP_TYPES } from "./stepTypes";

class Environment {
    constructor(parent = null) {
        this.parent = parent;
        this.values = new Map();
    }

    define(name, value) {
        this.values.set(name, value);
    }

    assign(name, value, line = 1, column = 1) {
        if (this.values.has(name)) {
            this.values.set(name, value);
            return;
        }

        if (this.parent) {
            this.parent.assign(name, value, line, column);
            return;
        }

        throw new SimulationError(`Undefined variable '${name}'.`, {
            line,
            column,
            kind: "RuntimeError",
        });
    }

    get(name, line = 1, column = 1) {
        if (this.values.has(name)) {
            return this.values.get(name);
        }

        if (this.parent) {
            return this.parent.get(name, line, column);
        }

        throw new SimulationError(`Undefined variable '${name}'.`, {
            line,
            column,
            kind: "RuntimeError",
        });
    }

    toObject() {
        const snapshot = this.parent ? this.parent.toObject() : {};
        for (const [name, value] of this.values.entries()) {
            snapshot[name] = value;
        }
        return snapshot;
    }
}

function captureState(env, line = null) {
    const visible = env.toObject();
    const state = {
        line,
        variables: {},
        arr: [],
    };

    if (Array.isArray(visible.arr)) {
        state.arr = [...visible.arr];
    }

    for (const [name, value] of Object.entries(visible)) {
        if (name === "arr") {
            continue;
        }

        if (Array.isArray(value)) {
            continue;
        }

        state.variables[name] = value;
    }

    return state;
}

function emitStep(context, env, line, type, payload = {}) {
    const resolvedLine = Number.isInteger(line) ? line : (context.currentLine ?? 1);
    context.currentLine = resolvedLine;

    context.stepCounter += 1;
    context.steps.push({
        id: context.stepCounter,
        type,
        line: resolvedLine,
        payload,
        state: captureState(env, resolvedLine),
    });
}

function toInteger(value, line, message) {
    if (typeof value !== "number" || !Number.isFinite(value) || !Number.isInteger(value)) {
        throw new SimulationError(message, {
            line,
            kind: "RuntimeError",
        });
    }

    return value;
}

function toBoolean(value, line) {
    if (typeof value === "boolean") {
        return value;
    }

    if (typeof value === "number") {
        return value !== 0;
    }

    throw new SimulationError("Condition did not evaluate to a boolean-compatible value.", {
        line,
        kind: "RuntimeError",
    });
}

function assertArrayIndex(array, index, line) {
    const integerIndex = toInteger(index, line, "Array index must be an integer.");
    if (integerIndex < 0 || integerIndex >= array.length) {
        throw new SimulationError(`Array index ${integerIndex} is out of bounds.`, {
            line,
            kind: "RuntimeError",
        });
    }
    return integerIndex;
}

function evaluateArrayContainer(node, env, context) {
    if (node.type === "Identifier") {
        const value = env.get(node.name, node.line);
        return {
            value,
            name: node.name,
        };
    }

    const result = evaluateExpression(node, env, context);
    return {
        value: result.value,
        name: null,
    };
}

function evaluateExpression(node, env, context) {
    switch (node.type) {
        case "Literal":
            return {
                value: node.value,
                source: null,
            };

        case "Identifier": {
            const value = env.get(node.name, node.line);
            return {
                value,
                source: {
                    kind: "variable",
                    name: node.name,
                },
            };
        }

        case "MemberExpression": {
            const object = evaluateExpression(node.object, env, context);
            if (node.property === "length" && Array.isArray(object.value)) {
                return {
                    value: object.value.length,
                    source: null,
                };
            }

            throw new SimulationError(`Unsupported member access '.${node.property}'.`, {
                line: node.line,
                kind: "UnsupportedSyntax",
            });
        }

        case "ArrayAccess": {
            const arrayRef = evaluateArrayContainer(node.array, env, context);
            if (!Array.isArray(arrayRef.value)) {
                throw new SimulationError("Target is not an array.", {
                    line: node.line,
                    kind: "RuntimeError",
                });
            }

            const indexResult = evaluateExpression(node.index, env, context);
            const index = assertArrayIndex(arrayRef.value, indexResult.value, node.line);

            emitStep(context, env, node.line, STEP_TYPES.VISIT, { index });
            emitStep(context, env, node.line, STEP_TYPES.READ_ARRAY, {
                index,
                value: arrayRef.value[index],
            });

            return {
                value: arrayRef.value[index],
                source: {
                    kind: "arrayElement",
                    arrayName: arrayRef.name,
                    index,
                },
            };
        }

        case "UnaryExpression": {
            const argument = evaluateExpression(node.argument, env, context);
            const numeric = toInteger(argument.value, node.line, "Unary operator requires an integer operand.");
            if (node.operator === "-") {
                return { value: -numeric, source: null };
            }
            if (node.operator === "+") {
                return { value: numeric, source: null };
            }

            throw new SimulationError(`Unsupported unary operator '${node.operator}'.`, {
                line: node.line,
                kind: "UnsupportedSyntax",
            });
        }

        case "BinaryExpression": {
            const left = evaluateExpression(node.left, env, context);
            const right = evaluateExpression(node.right, env, context);

            const isComparison = [">", "<", "==", ">=", "<="].includes(node.operator);
            if (
                isComparison
                && left.source
                && right.source
                && left.source.kind === "arrayElement"
                && right.source.kind === "arrayElement"
            ) {
                emitStep(context, env, node.line, STEP_TYPES.COMPARE, {
                    leftIndex: left.source.index,
                    rightIndex: right.source.index,
                    leftValue: left.value,
                    rightValue: right.value,
                });
            }

            if (node.operator === "+") {
                const leftValue = toInteger(left.value, node.line, "Arithmetic operands must be integers.");
                const rightValue = toInteger(right.value, node.line, "Arithmetic operands must be integers.");
                return { value: leftValue + rightValue, source: null };
            }

            if (node.operator === "-") {
                const leftValue = toInteger(left.value, node.line, "Arithmetic operands must be integers.");
                const rightValue = toInteger(right.value, node.line, "Arithmetic operands must be integers.");
                return { value: leftValue - rightValue, source: null };
            }

            if (node.operator === "*") {
                const leftValue = toInteger(left.value, node.line, "Arithmetic operands must be integers.");
                const rightValue = toInteger(right.value, node.line, "Arithmetic operands must be integers.");
                return { value: leftValue * rightValue, source: null };
            }

            if (node.operator === "/") {
                const leftValue = toInteger(left.value, node.line, "Arithmetic operands must be integers.");
                const rightValue = toInteger(right.value, node.line, "Arithmetic operands must be integers.");

                if (rightValue === 0) {
                    throw new SimulationError("Division by zero.", {
                        line: node.line,
                        kind: "RuntimeError",
                    });
                }

                const quotient = leftValue / rightValue;
                return {
                    value: quotient < 0 ? Math.ceil(quotient) : Math.floor(quotient),
                    source: null,
                };
            }

            if (node.operator === ">") {
                return { value: left.value > right.value, source: null };
            }

            if (node.operator === "<") {
                return { value: left.value < right.value, source: null };
            }

            if (node.operator === ">=") {
                return { value: left.value >= right.value, source: null };
            }

            if (node.operator === "<=") {
                return { value: left.value <= right.value, source: null };
            }

            if (node.operator === "==") {
                return { value: left.value === right.value, source: null };
            }

            throw new SimulationError(`Unsupported operator '${node.operator}'.`, {
                line: node.line,
                kind: "UnsupportedSyntax",
            });
        }

        default:
            throw new SimulationError(`Unsupported expression type '${node.type}'.`, {
                line: node.line ?? 1,
                kind: "UnsupportedSyntax",
            });
    }
}

function executeVarDeclaration(statement, env, context) {
    let value = 0;
    let source = null;

    if (statement.initializer) {
        const initializerResult = evaluateExpression(statement.initializer, env, context);
        value = initializerResult.value;
        source = initializerResult.source;
    }

    env.define(statement.name, value);

    if (source && source.kind === "arrayElement" && source.arrayName === "arr") {
        context.tempArrayOrigins.set(statement.name, source.index);
    } else {
        context.tempArrayOrigins.delete(statement.name);
    }

    emitStep(context, env, statement.line, STEP_TYPES.CREATE_VARIABLE, {
        name: statement.name,
        value,
    });
}

function detectSwapEvent(context, writeIndex, valueSource) {
    if (!valueSource || valueSource.kind !== "variable") {
        return null;
    }

    if (!context.tempArrayOrigins.has(valueSource.name)) {
        return null;
    }

    const tempOrigin = context.tempArrayOrigins.get(valueSource.name);
    if (!context.pendingArrayCopy) {
        return null;
    }

    if (
        context.pendingArrayCopy.toIndex === tempOrigin
        && context.pendingArrayCopy.fromIndex === writeIndex
    ) {
        return {
            leftIndex: tempOrigin,
            rightIndex: writeIndex,
        };
    }

    return null;
}

function executeAssignment(statement, env, context) {
    if (statement.target.type === "Identifier") {
        const result = evaluateExpression(statement.expression, env, context);
        env.assign(statement.target.name, result.value, statement.line);

        if (result.source && result.source.kind === "arrayElement" && result.source.arrayName === "arr") {
            context.tempArrayOrigins.set(statement.target.name, result.source.index);
        } else {
            context.tempArrayOrigins.delete(statement.target.name);
        }

        context.pendingArrayCopy = null;

        emitStep(context, env, statement.line, STEP_TYPES.ASSIGN_VARIABLE, {
            name: statement.target.name,
            value: result.value,
        });
        return;
    }

    if (statement.target.type !== "ArrayAccess") {
        throw new SimulationError("Unsupported assignment target.", {
            line: statement.line,
            kind: "UnsupportedSyntax",
        });
    }

    const arrayRef = evaluateArrayContainer(statement.target.array, env, context);
    if (!Array.isArray(arrayRef.value)) {
        throw new SimulationError("Assignment target is not an array.", {
            line: statement.line,
            kind: "RuntimeError",
        });
    }

    const indexResult = evaluateExpression(statement.target.index, env, context);
    const index = assertArrayIndex(arrayRef.value, indexResult.value, statement.line);

    emitStep(context, env, statement.line, STEP_TYPES.VISIT, { index });

    const valueResult = evaluateExpression(statement.expression, env, context);
    const swapEvent = detectSwapEvent(context, index, valueResult.source);

    arrayRef.value[index] = valueResult.value;

    if (swapEvent) {
        emitStep(context, env, statement.line, STEP_TYPES.SWAP, {
            leftIndex: swapEvent.leftIndex,
            rightIndex: swapEvent.rightIndex,
        });
        context.pendingArrayCopy = null;
        return;
    }

    emitStep(context, env, statement.line, STEP_TYPES.WRITE_ARRAY, {
        index,
        value: valueResult.value,
    });

    if (
        valueResult.source
        && valueResult.source.kind === "arrayElement"
        && valueResult.source.arrayName === "arr"
    ) {
        context.pendingArrayCopy = {
            toIndex: index,
            fromIndex: valueResult.source.index,
        };
    } else {
        context.pendingArrayCopy = null;
    }
}

function executeUpdate(statement, env, context) {
    if (statement.target.type === "Identifier") {
        const currentValue = env.get(statement.target.name, statement.line);
        const numeric = toInteger(currentValue, statement.line, "Update target must be an integer.");
        const delta = statement.operator === "++" ? 1 : -1;
        const nextValue = numeric + delta;
        env.assign(statement.target.name, nextValue, statement.line);

        context.tempArrayOrigins.delete(statement.target.name);
        context.pendingArrayCopy = null;

        emitStep(context, env, statement.line, STEP_TYPES.ASSIGN_VARIABLE, {
            name: statement.target.name,
            value: nextValue,
        });
        return;
    }

    if (statement.target.type !== "ArrayAccess") {
        throw new SimulationError("Unsupported update target.", {
            line: statement.line,
            kind: "UnsupportedSyntax",
        });
    }

    const arrayRef = evaluateArrayContainer(statement.target.array, env, context);
    if (!Array.isArray(arrayRef.value)) {
        throw new SimulationError("Update target is not an array.", {
            line: statement.line,
            kind: "RuntimeError",
        });
    }

    const indexResult = evaluateExpression(statement.target.index, env, context);
    const index = assertArrayIndex(arrayRef.value, indexResult.value, statement.line);
    const currentValue = toInteger(arrayRef.value[index], statement.line, "Array value must be an integer.");
    const delta = statement.operator === "++" ? 1 : -1;
    const nextValue = currentValue + delta;

    emitStep(context, env, statement.line, STEP_TYPES.VISIT, { index });

    arrayRef.value[index] = nextValue;
    context.pendingArrayCopy = null;

    emitStep(context, env, statement.line, STEP_TYPES.WRITE_ARRAY, {
        index,
        value: nextValue,
    });
}

function executeIfStatement(statement, env, context) {
    const conditionResult = evaluateExpression(statement.condition, env, context);
    if (toBoolean(conditionResult.value, statement.line)) {
        executeStatement(statement.consequent, env, context, false);
        return;
    }

    if (statement.alternate) {
        executeStatement(statement.alternate, env, context, false);
    }
}

function executeForStatement(statement, env, context) {
    const loopEnv = new Environment(env);

    if (statement.initializer) {
        emitStep(context, loopEnv, statement.line, STEP_TYPES.LINE, {});
        executeStatement(statement.initializer, loopEnv, context, false);
    }

    let iterationCount = 0;
    while (true) {
        emitStep(context, loopEnv, statement.line, STEP_TYPES.LINE, {});

        if (statement.condition) {
            const condition = evaluateExpression(statement.condition, loopEnv, context);
            if (!toBoolean(condition.value, statement.line)) {
                break;
            }
        }

        iterationCount += 1;
        if (iterationCount > context.loopLimit) {
            throw new SimulationError("Possible infinite loop detected.", {
                line: statement.line,
                kind: "RuntimeError",
            });
        }

        executeStatement(statement.body, loopEnv, context, false);

        if (statement.update) {
            emitStep(context, loopEnv, statement.line, STEP_TYPES.LINE, {});
            executeStatement(statement.update, loopEnv, context, false);
        }
    }
}

function executeBlock(statement, env, context) {
    const scopedEnv = new Environment(env);
    for (const child of statement.statements) {
        executeStatement(child, scopedEnv, context, true);
    }
}

function executeStatement(statement, env, context, shouldEmitLine) {
    if (shouldEmitLine && statement.type !== "BlockStatement") {
        emitStep(context, env, statement.line, STEP_TYPES.LINE, {});
    }

    switch (statement.type) {
        case "VarDeclaration":
            executeVarDeclaration(statement, env, context);
            return;

        case "AssignmentStatement":
            executeAssignment(statement, env, context);
            return;

        case "UpdateStatement":
            executeUpdate(statement, env, context);
            return;

        case "IfStatement":
            executeIfStatement(statement, env, context);
            return;

        case "ForStatement":
            executeForStatement(statement, env, context);
            return;

        case "BlockStatement":
            executeBlock(statement, env, context);
            return;

        default:
            throw new SimulationError(`Unsupported statement type '${statement.type}'.`, {
                line: statement.line ?? 1,
                kind: "UnsupportedSyntax",
            });
    }
}

export function interpret(ast, { inputArray = [5, 3, 8, 1, 4], loopLimit = 100 } = {}) {
    if (!ast || ast.type !== "Program") {
        throw new SimulationError("Invalid AST input.", {
            line: 1,
            kind: "RuntimeError",
        });
    }

    const globalEnv = new Environment();
    globalEnv.define("arr", [...inputArray]);

    const solveEnv = new Environment(globalEnv);
    const context = {
        loopLimit,
        steps: [],
        stepCounter: 0,
        tempArrayOrigins: new Map(),
        pendingArrayCopy: null,
        currentLine: 1,
    };

    for (const statement of ast.body) {
        executeStatement(statement, solveEnv, context, true);
    }

    const lastLine = context.steps.length > 0 ? context.steps[context.steps.length - 1].line : null;
    const finalState = captureState(solveEnv, lastLine);

    return {
        steps: context.steps,
        finalState,
    };
}
