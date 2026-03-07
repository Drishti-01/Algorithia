/**
 * Adaptive Trap Engine
 * Recommends next question based on strategy
 */

import { QUESTIONS } from '../data/questions';

export function recommendNextQuestion(data) {
    const { questionId, strategy, questionCategory } = data;
    
    if (QUESTIONS.length === 0) {
        return { nextQuestion: null };
    }
    
    // Filter out current question
    const availableQuestions = QUESTIONS.filter(q => q.id !== questionId);
    
    if (availableQuestions.length === 0) {
        return { nextQuestion: QUESTIONS[0] };
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
}
