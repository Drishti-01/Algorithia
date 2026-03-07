/**
 * Question Data Exports
 * Central export point for all question data
 */

// Import from expanded questions (40+ questions with levels)
import { 
    EXPANDED_QUESTIONS,
    EXPANDED_QUESTIONS_BY_ID,
    QUESTIONS_BY_LEVEL,
    QUESTIONS_BY_CATEGORY,
    QUESTIONS_BY_GROUP
} from './expanded-questions';

// Export as QUESTIONS for compatibility
export const QUESTIONS = EXPANDED_QUESTIONS;
export const QUESTIONS_BY_ID = EXPANDED_QUESTIONS_BY_ID;

// Export additional groupings
export {
    QUESTIONS_BY_LEVEL,
    QUESTIONS_BY_CATEGORY,
    QUESTIONS_BY_GROUP
};

// Export count
export const TOTAL_QUESTIONS = EXPANDED_QUESTIONS.length;
