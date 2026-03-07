import { parse } from "./parser";
import { interpret } from "./interpreter";
import { SimulationError } from "../simulation/SimulationError";
import { tokenize } from "../simulation/tokenizer";

export function generateSimulationSteps({
    userCode,
    lineOffset = 0,
    inputArray,
    loopLimit = 100,
}) {
    try {
        const tokens = tokenize(userCode, { lineOffset });
        const ast = parse(tokens);
        const execution = interpret(ast, {
            inputArray,
            loopLimit,
        });

        return {
            ast,
            steps: execution.steps,
            finalState: execution.finalState,
        };
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