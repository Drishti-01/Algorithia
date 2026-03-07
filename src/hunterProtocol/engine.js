import { HUNTERS, HUNTER_QUESTIONS } from "../data/hunterQuestions";

const STORAGE_KEY = "algorithia-hunter-progress-v1";
const DEFAULT_ROUND_SIZE = 4;

function safeParse(raw) {
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function normalizeProgress(progress) {
    if (!progress || typeof progress !== "object") {
        return {
            attempts: [],
            perQuestionAttempts: {},
            completedLevels: 0,
        };
    }

    return {
        attempts: Array.isArray(progress.attempts) ? progress.attempts : [],
        perQuestionAttempts: progress.perQuestionAttempts && typeof progress.perQuestionAttempts === "object"
            ? progress.perQuestionAttempts
            : {},
        completedLevels: Number.isInteger(progress.completedLevels) ? progress.completedLevels : 0,
    };
}

export function loadHunterProgress() {
    if (typeof window === "undefined") {
        return normalizeProgress(null);
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    return normalizeProgress(safeParse(raw));
}

export function saveHunterProgress(progress) {
    if (typeof window === "undefined") {
        return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeProgress(progress)));
}

export function resetHunterProgress() {
    const fresh = normalizeProgress(null);
    saveHunterProgress(fresh);
    return fresh;
}

export function recordHunterAttempt(progress, { question, correct }) {
    const normalized = normalizeProgress(progress);
    const nextAttemptCount = (normalized.perQuestionAttempts[question.id] || 0) + 1;

    const attempt = {
        questionId: question.id,
        hunterId: question.hunterId,
        topic: question.topic,
        correct,
        attemptCount: nextAttemptCount,
        timestamp: Date.now(),
    };

    const next = {
        ...normalized,
        attempts: [...normalized.attempts, attempt],
        perQuestionAttempts: {
            ...normalized.perQuestionAttempts,
            [question.id]: nextAttemptCount,
        },
    };

    saveHunterProgress(next);
    return next;
}

export function getTopicStats(attempts) {
    const stats = {};

    for (const attempt of attempts) {
        if (!stats[attempt.topic]) {
            stats[attempt.topic] = {
                topic: attempt.topic,
                correct: 0,
                incorrect: 0,
                total: 0,
                recent: [],
            };
        }

        const row = stats[attempt.topic];
        row.total += 1;
        row.recent.push(attempt.correct);

        if (attempt.correct) {
            row.correct += 1;
        } else {
            row.incorrect += 1;
        }
    }

    return Object.values(stats).map((row) => {
        const accuracy = row.total === 0 ? 0 : row.correct / row.total;
        const recentSlice = row.recent.slice(-3);
        const recentMistakes = recentSlice.filter((ok) => !ok).length;
        const recentPenalty = recentSlice.length === 0 ? 0 : recentMistakes / recentSlice.length;
        const mastery = clamp(accuracy - recentPenalty * 0.35, 0, 1);
        const weaknessScore = clamp((1 - mastery) + recentPenalty * 0.25, 0, 2);

        return {
            topic: row.topic,
            correct: row.correct,
            incorrect: row.incorrect,
            total: row.total,
            mastery,
            weaknessScore,
        };
    });
}

export function getWeakTopics(attempts, limit = 2) {
    return getTopicStats(attempts)
        .filter((row) => row.total > 0)
        .sort((a, b) => b.weaknessScore - a.weaknessScore)
        .slice(0, limit)
        .map((row) => row.topic);
}

function randomize(items) {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export function buildHunterQuestionSet({ hunterId, attempts, seenQuestionIds = [], roundSize = DEFAULT_ROUND_SIZE, hunterLevel = 1 }) {
    const weakTopics = new Set(getWeakTopics(attempts, 3));
    const seen = new Set(seenQuestionIds);

    const pool = HUNTER_QUESTIONS.filter((question) => question.hunterId === hunterId);
    const unseenPool = pool.filter((question) => !seen.has(question.id));
    const candidates = unseenPool.length > 0 ? unseenPool : pool;

    const weakCandidates = randomize(candidates.filter((question) => weakTopics.has(question.topic)));
    const normalCandidates = randomize(candidates.filter((question) => !weakTopics.has(question.topic)));

    // Adjust weak topic targeting based on hunter level
    // Level 1: 40% (3/8), Level 2: 60% (5/8), Level 3: 75% (6/8)
    const weakTopicPercentage = hunterLevel === 1 ? 0.4 : hunterLevel === 2 ? 0.6 : 0.75;
    const weakQuestionCount = Math.ceil(roundSize * weakTopicPercentage);

    const selected = [];
    for (const question of weakCandidates) {
        if (selected.length >= weakQuestionCount) {
            break;
        }
        selected.push(question);
    }

    for (const question of normalCandidates) {
        if (selected.length >= roundSize) {
            break;
        }
        if (!selected.find((item) => item.id === question.id)) {
            selected.push(question);
        }
    }

    if (selected.length < roundSize) {
        for (const question of randomize(candidates)) {
            if (selected.length >= roundSize) {
                break;
            }
            if (!selected.find((item) => item.id === question.id)) {
                selected.push(question);
            }
        }
    }

    return selected;
}

export function getHunterByLevel(level) {
    return HUNTERS.find((hunter) => hunter.level === level) || null;
}

export function getMaxLevel() {
    return HUNTERS.length;
}
