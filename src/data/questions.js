import { STEP_TYPES } from "../simulation/stepTypes";

function arraysEqual(left, right) {
    if (left.length !== right.length) {
        return false;
    }

    for (let i = 0; i < left.length; i += 1) {
        if (left[i] !== right[i]) {
            return false;
        }
    }

    return true;
}

function sortedCopy(values) {
    return [...values].sort((a, b) => a - b);
}

function ok(message) {
    return { success: true, message };
}

function fail(message) {
    return { success: false, message };
}

// Import expanded question bank with levels and groups
import { 
    EXPANDED_QUESTIONS as QUESTIONS,
    EXPANDED_QUESTIONS_BY_ID as QUESTIONS_BY_ID,
    QUESTIONS_BY_LEVEL,
    QUESTIONS_BY_CATEGORY,
    QUESTIONS_BY_GROUP
} from './expanded-questions';

// Re-export for compatibility
export { 
    QUESTIONS,
    QUESTIONS_BY_ID,
    QUESTIONS_BY_LEVEL,
    QUESTIONS_BY_CATEGORY,
    QUESTIONS_BY_GROUP
};
