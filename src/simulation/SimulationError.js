export class SimulationError extends Error {
    constructor(message, { line = 1, column = 1, kind = "RuntimeError" } = {}) {
        super(message);
        this.name = "SimulationError";
        this.line = line;
        this.column = column;
        this.kind = kind;
    }
}