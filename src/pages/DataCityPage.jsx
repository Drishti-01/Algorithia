import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EditorPanel } from "../components/EditorPanel";
import { GamePanel } from "../components/GamePanel";
import { createProgramTemplate } from "../constants/template";
import { QUESTIONS_BY_ID } from "../data/questions";
import { generateSimulationSteps } from "../engine/stepGenerator";
import { gameBridge } from "../game/gameBridge";
import { SimulationError } from "../simulation/SimulationError";
import { STEP_TYPES } from "../simulation/stepTypes";

const LINE_HIGHLIGHT_DELAY_MS = 400;
const STEP_ANIMATION_DELAY_MS = 500;
const MAX_LOG_ITEMS = 12;

function createInitialState(inputArray) {
    return {
        line: null,
        variables: {},
        arr: [...inputArray],
    };
}

function wait(duration) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, duration);
    });
}

function describeStep(step) {
    const { payload } = step;

    switch (step.type) {
        case STEP_TYPES.LINE:
            return `Line ${step.line}`;
        case STEP_TYPES.READ_ARRAY:
            return `Read arr[${payload.index}] => ${payload.value}`;
        case STEP_TYPES.WRITE_ARRAY:
            return `Write arr[${payload.index}] = ${payload.value}`;
        case STEP_TYPES.SWAP:
            return `Swap arr[${payload.leftIndex}] with arr[${payload.rightIndex}]`;
        case STEP_TYPES.COMPARE:
            return `Compare arr[${payload.leftIndex}] and arr[${payload.rightIndex}]`;
        case STEP_TYPES.CREATE_VARIABLE:
            return `Create ${payload.name} = ${payload.value}`;
        case STEP_TYPES.ASSIGN_VARIABLE:
            return `Assign ${payload.name} = ${payload.value}`;
        case STEP_TYPES.VISIT:
            return `Visit index ${payload.index}`;
        default:
            return step.type;
    }
}

function normalizeError(error, fallbackLine) {
    if (error instanceof SimulationError) {
        return error;
    }

    return new SimulationError(error?.message || "Simulation failed.", {
        line: fallbackLine,
        kind: "RuntimeError",
    });
}

function DataCitySession({ question }) {
    const isLinkedList = question.category === "linkedlist";
    const isStack = question.category === "stack";
    const isQueue = question.category === "queue";
    const template = createProgramTemplate(question.input);

    const [userCode, setUserCode] = useState(question.starterCode);
    const [templateWarning, setTemplateWarning] = useState("");
    const [runtimeError, setRuntimeError] = useState(null);
    const [validation, setValidation] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [currentLine, setCurrentLine] = useState(null);
    const [currentState, setCurrentState] = useState(createInitialState(question.input));
    const [eventLog, setEventLog] = useState([]);

    const runTokenRef = useRef(0);

    const resetPlayback = useCallback((inputArray, linkedListData, stackData, queueData) => {
        runTokenRef.current += 1;
        setIsRunning(false);
        setCurrentLine(null);
        setCurrentState(createInitialState(inputArray));
        setEventLog([]);
        
        if (isLinkedList && linkedListData) {
            gameBridge.emit("reset", { linkedListData });
        } else if (isStack && stackData) {
            gameBridge.emit("reset", { stackData });
        } else if (isQueue && queueData) {
            gameBridge.emit("reset", { queueData });
        } else {
            gameBridge.emit("reset", { array: [...inputArray] });
        }
    }, [isLinkedList, isStack, isQueue]);

    useEffect(() => {
        if (isLinkedList && question.linkedListData) {
            gameBridge.emit("reset", { linkedListData: question.linkedListData });
        } else if (isStack && question.stackData) {
            gameBridge.emit("reset", { stackData: question.stackData });
        } else if (isQueue && question.queueData) {
            gameBridge.emit("reset", { queueData: question.queueData });
        } else {
            gameBridge.emit("reset", { array: [...question.input] });
        }

        return () => {
            runTokenRef.current += 1;
        };
    }, [question.input, question.linkedListData, question.stackData, question.queueData, isLinkedList, isStack, isQueue]);

    const playSteps = useCallback(async (steps, finalState, inputArray, linkedListData, stackData, queueData) => {
        const activeToken = ++runTokenRef.current;
        setIsRunning(true);

        if (isLinkedList && linkedListData) {
            gameBridge.emit("reset", { linkedListData });
        } else if (isStack && stackData) {
            gameBridge.emit("reset", { stackData });
        } else if (isQueue && queueData) {
            gameBridge.emit("reset", { queueData });
        } else {
            gameBridge.emit("reset", { array: [...inputArray] });
        }

        for (const step of steps) {
            if (activeToken !== runTokenRef.current) {
                return { cancelled: true };
            }

            setCurrentLine(step.line ?? null);
            await wait(LINE_HIGHLIGHT_DELAY_MS);

            if (activeToken !== runTokenRef.current) {
                return { cancelled: true };
            }

            setCurrentState(step.state);
            setEventLog((previous) => [describeStep(step), ...previous].slice(0, MAX_LOG_ITEMS));
            gameBridge.emit("step", { step });
            await wait(STEP_ANIMATION_DELAY_MS);
        }

        if (activeToken === runTokenRef.current) {
            setIsRunning(false);
            setCurrentState(finalState);
            setCurrentLine(finalState.line ?? null);
            return { cancelled: false };
        }

        return { cancelled: true };
    }, [isLinkedList, isStack, isQueue]);

    const handleRun = useCallback(async () => {
        setRuntimeError(null);
        setTemplateWarning("");
        setValidation(null);
        setEventLog([]);
        setCurrentLine(null);
        setCurrentState(createInitialState(question.input));

        let simulation;
        try {
            simulation = generateSimulationSteps({
                userCode,
                lineOffset: template.editableStartLine - 1,
                inputArray: question.input,
                loopLimit: 100,
            });
        } catch (error) {
            setIsRunning(false);
            setRuntimeError(normalizeError(error, template.editableStartLine));
            return;
        }

        if (simulation.steps.length === 0) {
            setRuntimeError(new SimulationError("No executable statements found in solve().", {
                line: template.editableStartLine,
                kind: "SyntaxError",
            }));
            return;
        }

        const playResult = await playSteps(simulation.steps, simulation.finalState, question.input, question.linkedListData, question.stackData, question.queueData);
        if (playResult.cancelled) {
            return;
        }

        setValidation(question.validate({
            finalState: simulation.finalState,
            steps: simulation.steps,
            input: question.input,
        }));
    }, [playSteps, question, template.editableStartLine, userCode]);

    const handleReset = useCallback(() => {
        setRuntimeError(null);
        setTemplateWarning("");
        setValidation(null);
        resetPlayback(question.input, question.linkedListData, question.stackData, question.queueData);
    }, [question.input, question.linkedListData, question.stackData, question.queueData, resetPlayback]);

    const variableRows = Object.entries(currentState.variables);

    return (
        <div className="city-page">
            <header className="city-topbar">
                <div>
                    <p className="section-kicker">Data City Simulation</p>
                    <h1>{question.title}</h1>
                    <p>{question.description}</p>
                    <p className="expected-line">Expected: {question.expectedBehavior}</p>
                </div>
                <div className="topbar-links">
                    <Link to="/questions" className="secondary-btn">All Questions</Link>
                    <Link to="/" className="secondary-btn">Landing</Link>
                </div>
            </header>

            <div className="city-layout">
                <section className="game-column">
                    <header className="city-panel-header">
                        <h2>
                            {isLinkedList ? "LinkedList Harbor" : 
                             isStack ? "Stack Tower" :
                             isQueue ? "Queue Lane" :
                             "Array District"}
                        </h2>
                        <p>
                            {isLinkedList 
                                ? `Nodes: [${question.linkedListData.values.join(", ")}]`
                                : isStack
                                ? `Stack: [${question.stackData.values.join(", ")}]`
                                : isQueue
                                ? `Queue: [${question.queueData.values.join(", ")}]`
                                : `Input: [${question.input.join(", ")}]`
                            }
                        </p>
                    </header>
                    <div className="game-frame">
                        <GamePanel 
                            initialArray={question.input}
                            linkedListData={question.linkedListData}
                            stackData={question.stackData}
                            queueData={question.queueData}
                            district={isLinkedList ? "linkedlist" : isStack ? "stack" : isQueue ? "queue" : "array"}
                        />
                    </div>
                </section>

                <EditorPanel
                    title="Java-like Editor"
                    subtitle="Only solve() is editable. Program shell and input are locked."
                    userCode={userCode}
                    onUserCodeChange={setUserCode}
                    currentLine={currentLine}
                    error={runtimeError}
                    templatePrefix={template.prefix}
                    templateSuffix={template.suffix}
                    onTemplateViolation={setTemplateWarning}
                    onRun={handleRun}
                    onReset={handleReset}
                    isRunning={isRunning}
                />
            </div>

            {templateWarning ? <p className="warning-text">{templateWarning}</p> : null}
            {runtimeError ? (
                <p className="error-text">{runtimeError.kind}: {runtimeError.message}</p>
            ) : null}
            {validation ? (
                <p className={validation.success ? "success-text" : "error-text"}>{validation.message}</p>
            ) : null}

            <section className="state-grid">
                <article className="state-card">
                    <h3>Execution State</h3>
                    <p>Line: {currentLine ?? "-"}</p>
                    <p>Array: [{currentState.arr.join(", ")}]</p>
                </article>

                <article className="state-card">
                    <h3>Variables</h3>
                    {variableRows.length === 0 ? (
                        <p>(none)</p>
                    ) : (
                        <ul>
                            {variableRows.map(([name, value]) => (
                                <li key={name}>{name} = {value}</li>
                            ))}
                        </ul>
                    )}
                </article>
            </section>

            <section className="state-card event-card">
                <h3>Recent Steps</h3>
                {eventLog.length === 0 ? (
                    <p>No steps yet.</p>
                ) : (
                    <ul>
                        {eventLog.map((entry, index) => (
                            <li key={`${entry}-${index}`}>{entry}</li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}

export default function DataCityPage() {
    const { id } = useParams();
    const question = QUESTIONS_BY_ID[id];

    if (!question) {
        return (
            <div className="city-not-found">
                <h1>Question not found</h1>
                <p>The selected challenge id does not exist.</p>
                <Link to="/questions" className="primary-btn">Return To Question Hub</Link>
            </div>
        );
    }

    return <DataCitySession key={question.id} question={question} />;
}
