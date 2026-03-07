import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import vexaraImage from "../assets/hunters/vexara.png";
import kaelImage from "../assets/hunters/kael.png";
import ironrailImage from "../assets/hunters/ironrail.png";
import playerImage from "../assets/hunters/Player.png";
import {
    buildHunterQuestionSet,
    getHunterByLevel,
    getMaxLevel,
    getTopicStats,
    getWeakTopics,
    loadHunterProgress,
    recordHunterAttempt,
    resetHunterProgress,
    saveHunterProgress,
} from "../hunterProtocol/engine";

function formatPercent(value) {
    return `${Math.round(value * 100)}%`;
}

function formatTopicLabel(topic) {
    return topic
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

const HUNTER_PORTRAITS = {
    vexara: vexaraImage,
    kael: kaelImage,
    ironrail: ironrailImage,
};

const MAX_BATTLE_POINTS = 8;

export default function HunterProtocolPage() {
    const [progress, setProgress] = useState(() => loadHunterProgress());
    const [level, setLevel] = useState(() => Math.max(1, progress.completedLevels + 1));
    const [phase, setPhase] = useState("intro");
    const [roundQuestions, setRoundQuestions] = useState([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [hunterPower, setHunterPower] = useState(MAX_BATTLE_POINTS);
    const [playerHealth, setPlayerHealth] = useState(MAX_BATTLE_POINTS);

    const hunter = useMemo(() => getHunterByLevel(level), [level]);

    const currentQuestion = roundQuestions[questionIndex] || null;
    const maxLevel = getMaxLevel();
    const activeHunterPortrait = hunter ? HUNTER_PORTRAITS[hunter.id] || null : null;

    const weakTopics = useMemo(() => getWeakTopics(progress.attempts, 3), [progress.attempts]);
    const topicStats = useMemo(() => getTopicStats(progress.attempts), [progress.attempts]);
    const levelOptions = useMemo(
        () => Array.from({ length: maxLevel }, (_, index) => getHunterByLevel(index + 1)).filter(Boolean),
        [maxLevel],
    );

    const hunterLine = useMemo(() => {
        if (!hunter) {
            return "No hunter detected.";
        }

        if (phase === "intro") {
            return hunter.intro;
        }

        if (phase === "question" && currentQuestion) {
            return currentQuestion.prompt;
        }

        if (phase === "feedback" && feedback) {
            return feedback.isCorrect ? hunter.successLine : hunter.failLine;
        }

        if (phase === "analysis") {
            return "You are being profiled for adaptive pressure. Weak routes will be targeted next.";
        }

        if (phase === "complete") {
            return "You endured the interrogation sequence. The protocol records your mastery map.";
        }

        return "Awaiting your response.";
    }, [currentQuestion, feedback, hunter, phase]);

    const handleStartRound = () => {
        if (!hunter) {
            return;
        }

        const questions = buildHunterQuestionSet({
            hunterId: hunter.id,
            attempts: progress.attempts,
            seenQuestionIds: [],
            roundSize: 8,
            hunterLevel: hunter.level,
        });

        setRoundQuestions(questions);
        setPhase("question");
        setQuestionIndex(0);
        setSelectedOption(null);
        setFeedback(null);
        setHunterPower(MAX_BATTLE_POINTS);
        setPlayerHealth(MAX_BATTLE_POINTS);
    };

    const handleSubmitAnswer = () => {
        if (!currentQuestion || selectedOption === null) {
            return;
        }

        const isCorrect = selectedOption === currentQuestion.correctOption;
        const nextProgress = recordHunterAttempt(progress, {
            question: currentQuestion,
            correct: isCorrect,
        });

        setProgress(nextProgress);
        setFeedback({
            isCorrect,
            question: currentQuestion,
        });
        if (isCorrect) {
            setHunterPower((value) => Math.max(0, value - 1));
        } else {
            setPlayerHealth((value) => Math.max(0, value - 1));
        }
        setPhase("feedback");
    };

    const handleAdvance = () => {
        if (!currentQuestion) {
            return;
        }

        const nextIndex = questionIndex + 1;

        if (nextIndex < roundQuestions.length) {
            setQuestionIndex(nextIndex);
            setSelectedOption(null);
            setFeedback(null);
            setPhase("question");
            return;
        }

        if (level < maxLevel) {
            setPhase("analysis");
            return;
        }

        setPhase("complete");
    };

    const handleNextHunter = () => {
        const nextLevel = level + 1;
        const nextProgress = {
            ...progress,
            completedLevels: Math.max(progress.completedLevels, level),
        };

        saveHunterProgress(nextProgress);
        setProgress(nextProgress);
        setLevel(nextLevel);
        setRoundQuestions([]);
        setQuestionIndex(0);
        setSelectedOption(null);
        setFeedback(null);
        setHunterPower(MAX_BATTLE_POINTS);
        setPlayerHealth(MAX_BATTLE_POINTS);
        setPhase("intro");
    };

    const handleRestart = () => {
        const fresh = resetHunterProgress();
        setProgress(fresh);
        setLevel(1);
        setPhase("intro");
        setRoundQuestions([]);
        setQuestionIndex(0);
        setSelectedOption(null);
        setFeedback(null);
        setHunterPower(MAX_BATTLE_POINTS);
        setPlayerHealth(MAX_BATTLE_POINTS);
    };

    const handleLevelChange = (event) => {
        const requestedLevel = Number(event.target.value);

        if (!Number.isInteger(requestedLevel) || requestedLevel === level) {
            return;
        }

        setLevel(requestedLevel);
        setRoundQuestions([]);
        setQuestionIndex(0);
        setSelectedOption(null);
        setFeedback(null);
        setHunterPower(MAX_BATTLE_POINTS);
        setPlayerHealth(MAX_BATTLE_POINTS);
        setPhase("intro");
    };

    const hunterMeterHeight = `${(hunterPower / MAX_BATTLE_POINTS) * 100}%`;
    const playerMeterHeight = `${(playerHealth / MAX_BATTLE_POINTS) * 100}%`;

    const getOptionClassName = (index) => {
        const states = ["battle-card"];

        if (phase === "question" && selectedOption === index) {
            states.push("selected");
        }

        if (phase === "feedback" && feedback) {
            if (index === feedback.question.correctOption) {
                states.push("revealed-correct");
            }

            if (selectedOption === index && !feedback.isCorrect) {
                states.push("revealed-wrong");
            }

            if (selectedOption === index && feedback.isCorrect) {
                states.push("shield-impact");
            }
        }

        return states.join(" ");
    };

    if (!hunter) {
        return (
            <div className="hunter-page">
                <div className="hunter-panel">
                    <h1>Hunter protocol unavailable</h1>
                    <p>No hunter level found for this configuration.</p>
                    <Link to="/" className="secondary-btn">Back To Landing</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="hunter-page">
            <header className="hunter-header">
                <div className="hunter-header-main">
                    <div className="hunter-title-row">
                        <div className="hunter-title-block">
                            <p className="section-kicker">Hunter Protocol</p>
                            <h1>Level {hunter.level}: {hunter.name}</h1>
                            <p>{hunter.title}</p>
                        </div>
                        <div className="hunter-header-meta" aria-label="Battle log summary">
                            <div className="hunter-stat-chip">
                                <span>Attempts</span>
                                <strong>{progress.attempts.length}</strong>
                            </div>
                            <div className="hunter-stat-chip">
                                <span>Cleared</span>
                                <strong>{progress.completedLevels}</strong>
                            </div>
                            <div className="hunter-stat-chip">
                                <span>Weak Topics</span>
                                <strong>
                                    {weakTopics.length > 0
                                        ? weakTopics.map((topic) => formatTopicLabel(topic)).join(", ")
                                        : "None"}
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hunter-header-actions">
                    <label className="level-picker" htmlFor="hunter-level-select">
                        <span>Level</span>
                        <select id="hunter-level-select" value={level} onChange={handleLevelChange}>
                            {levelOptions.map((item) => (
                                <option key={item.id} value={item.level}>
                                    L{item.level} - {item.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <Link to="/" className="secondary-btn">Landing</Link>
                    <Link to="/questions" className="secondary-btn">Simulation</Link>
                </div>
            </header>

            <section className="hunter-layout">
                <article className="hunter-panel">
                    {(phase === "intro" || phase === "question" || phase === "feedback") ? (
                        <section className="interrogation-arena" aria-label="Interrogation showdown arena">
                            <div className="arena-bg arena-bg-left" aria-hidden="true" />
                            <div className="arena-bg arena-bg-right" aria-hidden="true" />

                            <section className={`arena-side hunter ${phase === "feedback" && feedback?.isCorrect ? "damage-flash" : ""}`}>
                                <div className="hunter-bubble-wrapper">
                                    <div className="arena-prompt hunter-dialogue-bubble">
                                        <span>{hunter.name} asks:</span>
                                        <p>{hunterLine}</p>
                                    </div>
                                </div>

                                <div className="arena-side-shell">
                                    <div className="combat-meter hunter-meter" aria-label="Hunter power">
                                        <div className="combat-meter-track">
                                            <div className="combat-meter-fill" style={{ height: hunterMeterHeight }} />
                                        </div>
                                        <div className="combat-meter-meta">
                                            <strong>{hunterPower}</strong>
                                            <span>Hunter</span>
                                        </div>
                                    </div>

                                    {activeHunterPortrait ? (
                                        <img
                                            src={activeHunterPortrait}
                                            alt={hunter.name}
                                            className="arena-character"
                                        />
                                    ) : (
                                        <div className="showdown-fallback">{hunter.name}</div>
                                    )}
                                </div>
                            </section>

                            <section className="arena-center" aria-label="Question and battle cards">
                                <p className="showdown-kicker">Choose the best card to stop the hacker's attack</p>

                                <div className="arena-conversation-rail">
                                    <div className="arena-conversation-bottom">
                                        {phase === "intro" ? (
                                            <div className="arena-answer-bubble" aria-label="Begin interrogation">
                                                <span>Your move:</span>
                                                <p className="hunter-dialogue">
                                                    Step into the protocol when you are ready.
                                                </p>
                                                <div className="hunter-actions">
                                                    <button
                                                        type="button"
                                                        className="primary-btn"
                                                        onClick={handleStartRound}
                                                    >
                                                        Begin Interrogation
                                                    </button>
                                                </div>
                                            </div>
                                        ) : null}

                                        {(phase === "question" || phase === "feedback") && currentQuestion ? (
                                            <div className="arena-answer-bubble" aria-label="Player answer cards">
                                                <span>You answer:</span>
                                                <p className="hunter-progress">Round {questionIndex + 1} / {roundQuestions.length}</p>
                                                <p className="hunter-topic-chip">
                                                    Topic: {formatTopicLabel(currentQuestion.topic)} | Difficulty: {currentQuestion.difficulty}
                                                </p>

                                                <div className="battle-cards-grid">
                                                    {currentQuestion.options.map((option, index) => (
                                                        <button
                                                            type="button"
                                                            key={option}
                                                            onClick={() => setSelectedOption(index)}
                                                            disabled={phase === "feedback"}
                                                            className={getOptionClassName(index)}
                                                        >
                                                            <span className="battle-card-id">{index + 1}</span>
                                                            <p>{option}</p>
                                                        </button>
                                                    ))}
                                                </div>

                                                {phase === "question" ? (
                                                    <div className="hunter-actions">
                                                        <button
                                                            type="button"
                                                            className="primary-btn"
                                                            onClick={handleSubmitAnswer}
                                                            disabled={selectedOption === null}
                                                        >
                                                            Lock Card
                                                        </button>
                                                    </div>
                                                ) : null}

                                                {phase === "feedback" && feedback ? (
                                                    <div className="arena-feedback-line">
                                                        <p className={feedback.isCorrect ? "success-text" : "error-text"}>
                                                            {feedback.isCorrect ? `${hunter.name} lost power.` : "You lost health."}
                                                        </p>
                                                        <p>{feedback.question.explanation}</p>
                                                        <button type="button" className="primary-btn" onClick={handleAdvance}>
                                                            Next Exchange
                                                        </button>
                                                    </div>
                                                ) : null}
                                            </div>
                                        ) : null}

                                        {phase === "question" && !currentQuestion ? (
                                            <div className="arena-answer-bubble" aria-label="Reload round">
                                                <span>Sync issue</span>
                                                <p>The round did not load correctly. Start the hunter round again.</p>
                                                <div className="hunter-actions">
                                                    <button
                                                        type="button"
                                                        className="primary-btn"
                                                        onClick={handleStartRound}
                                                    >
                                                        Reload Round
                                                    </button>
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </section>

                            <section className={`arena-side player ${phase === "feedback" && feedback && !feedback.isCorrect ? "damage-flash" : ""}`}>
                                <div className="arena-side-shell player-side-shell">
                                <img
                                    src={playerImage}
                                    alt="Player character"
                                    className="arena-character player-character"
                                />
                                <div className="combat-meter player-meter" aria-label="Player health">
                                    <div className="combat-meter-track">
                                        <div className="combat-meter-fill" style={{ height: playerMeterHeight }} />
                                    </div>
                                    <div className="combat-meter-meta">
                                        <strong>{playerHealth}</strong>
                                        <span>You</span>
                                    </div>
                                </div>
                                </div>
                            </section>
                        </section>
                    ) : null}

                    {phase === "analysis" ? (
                        <div className="hunter-phase-block">
                            <h2>Adaptive Analysis Complete</h2>
                            <p>
                                Your performance has been scanned. Next hunter will target weak zones first,
                                then test transfer under higher difficulty.
                            </p>
                            <p>
                                Priority topics: {weakTopics.length > 0 ? weakTopics.map((topic) => formatTopicLabel(topic)).join(", ") : "No dominant weakness yet"}
                            </p>
                            <button type="button" className="primary-btn" onClick={handleNextHunter}>
                                Face Next Hunter
                            </button>
                        </div>
                    ) : null}

                    {phase === "complete" ? (
                        <div className="hunter-phase-block">
                            <h2>Protocol Complete</h2>
                            <p>You survived all hunter levels. Your weakness map is now your training blueprint.</p>
                            <div className="hunter-summary-grid">
                                {topicStats.length === 0 ? (
                                    <p>No attempts recorded.</p>
                                ) : (
                                    topicStats
                                        .sort((a, b) => b.total - a.total)
                                        .map((row) => (
                                            <div key={row.topic} className="hunter-topic-stat">
                                                <strong>{formatTopicLabel(row.topic)}</strong>
                                                <span>{row.correct} correct / {row.incorrect} incorrect</span>
                                                <span>Mastery: {formatPercent(row.mastery)}</span>
                                            </div>
                                        ))
                                )}
                            </div>
                            <button type="button" className="secondary-btn" onClick={handleRestart}>
                                Restart Protocol
                            </button>
                        </div>
                    ) : null}
                </article>
            </section>
        </div>
    );
}
