import { SimulationError } from "./SimulationError";
import { interpret } from "./interpreter";
import { parse } from "./parser";
import { tokenize } from "./tokenizer";

export function simulateSolveBody({
    userCode,
    lineOffset = 0,
    inputArray = [5, 3, 8, 1, 4],
    loopLimit = 100,
}) {
    try {
        const tokens = tokenize(userCode, { lineOffset });
        const ast = parse(tokens);
        return interpret(ast, {
            inputArray,
            loopLimit,
        });
    } catch (error) {
        if (error instanceof SimulationError) {
            throw error;
        }

        throw new SimulationError(error.message || "Simulation failed.", {
            line: 1,
            kind: "RuntimeError",
        });
    }
}