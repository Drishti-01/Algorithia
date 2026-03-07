/**
 * Adaptive Trap Engine
 * Recommends next question based on strategy
 */

// Load questions from frontend
let QUESTIONS = null;

function loadQuestions() {
    if (!QUESTIONS) {
        try {
            const questionsModule = require('../../src/data/questions.js');
            QUESTIONS = questionsModule.QUESTIONS || [];
        } catch (error) {
            console.error('Failed to load questions:', error.message);
            QUESTIONS = [];
        }
    }
    return QUESTIONS;
}

module.exports = function(data) {
    const { questionId, strategy, questionCategory } = data;
    
    const questions = loadQuestions();
    
    if (questions.length === 0) {
        return { nextQuestion: null };
    }
    
    // Filter out current question
    const availableQuestions = questions.filter(q => q.id !== questionId);
    
    if (availableQuestions.length === 0) {
        return { nextQuestion: questions[0] };
    }
    
    let selectedQuestion = null;
    
    // Strategy: EXPLOIT - harder question
    if (strategy === 'exploit') {
        const hardQuestions = availableQuestions.filter(q => 
            q.difficulty === 'Hard' || q.difficulty === 'Medium'
        );
        if (hardQuestions.length > 0) {
            selectedQuestion = hardQuestions[Math.floor(Math.random() * hardQuestions.length)];
        }
    }
    
    // Strategy: PROBE - medium question
    if (!selectedQuestion && strategy === 'probe') {
        const mediumQuestions = availableQuestions.filter(q => 
            q.difficulty === 'Medium'
        );
        if (mediumQuestions.length > 0) {
            selectedQuestion = mediumQuestions[Math.floor(Math.random() * mediumQuestions.length)];
        }
    }
    
    // Strategy: SUPPORT - easier question
    if (!selectedQuestion && strategy === 'support') {
        const easyQuestions = availableQuestions.filter(q => 
            q.difficulty === 'Easy'
        );
        if (easyQuestions.length > 0) {
            selectedQuestion = easyQuestions[Math.floor(Math.random() * easyQuestions.length)];
        }
    }
    
    // Fallback: random question
    if (!selectedQuestion) {
        selectedQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    }
    
    return {
        nextQuestion: {
            id: selectedQuestion.id,
            title: selectedQuestion.title,
            difficulty: selectedQuestion.difficulty,
            category: selectedQuestion.category || 'array'
        }
    };
};
