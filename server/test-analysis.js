/**
 * AI Engine Test Script
 * Tests all engines with sample data
 */

import { runAnalysis } from './services/analysis.service.js';

console.log('=================================');
console.log('AI Engine Test Suite');
console.log('=================================\n');

// Test Case 1: Strong Performance
console.log('Test 1: Strong Performance');
console.log('---------------------------');
const test1 = runAnalysis({
    userId: 'test-user-1',
    questionId: 'array-traversal',
    questionCategory: 'array',
    timeTaken: 45,
    incorrectAttempts: 0,
    edgeCaseFailures: 0,
    success: true
});

console.log('Behavior Score:', test1.behavior.behaviorScore);
console.log('Exploitability Score:', test1.exploitability.score);
console.log('Risk Level:', test1.exploitability.riskLevel);
console.log('Primary Weakness:', test1.vulnerability.primaryWeakness);
console.log('Strategy:', test1.strategy.strategyType);
console.log('Escalation Stage:', test1.escalation.escalationStage);
console.log('Next Question:', test1.nextQuestion.nextQuestion?.title || 'N/A');
console.log('\n');

// Test Case 2: Moderate Performance
console.log('Test 2: Moderate Performance');
console.log('---------------------------');
const test2 = runAnalysis({
    userId: 'test-user-2',
    questionId: 'bubble-sort',
    questionCategory: 'array',
    timeTaken: 120,
    incorrectAttempts: 2,
    edgeCaseFailures: 1,
    success: true
});

console.log('Behavior Score:', test2.behavior.behaviorScore);
console.log('Exploitability Score:', test2.exploitability.score);
console.log('Risk Level:', test2.exploitability.riskLevel);
console.log('Primary Weakness:', test2.vulnerability.primaryWeakness);
console.log('Strategy:', test2.strategy.strategyType);
console.log('Escalation Stage:', test2.escalation.escalationStage);
console.log('Next Question:', test2.nextQuestion.nextQuestion?.title || 'N/A');
console.log('\n');

// Test Case 3: Weak Performance
console.log('Test 3: Weak Performance');
console.log('---------------------------');
const test3 = runAnalysis({
    userId: 'test-user-3',
    questionId: 'binary-search',
    questionCategory: 'array',
    timeTaken: 200,
    incorrectAttempts: 4,
    edgeCaseFailures: 2,
    success: false
});

console.log('Behavior Score:', test3.behavior.behaviorScore);
console.log('Exploitability Score:', test3.exploitability.score);
console.log('Risk Level:', test3.exploitability.riskLevel);
console.log('Primary Weakness:', test3.vulnerability.primaryWeakness);
console.log('Strategy:', test3.strategy.strategyType);
console.log('Escalation Stage:', test3.escalation.escalationStage);
console.log('Next Question:', test3.nextQuestion.nextQuestion?.title || 'N/A');
console.log('\n');

// Test Case 4: Multiple Attempts (Pattern Memory)
console.log('Test 4: Pattern Memory (Multiple Attempts)');
console.log('---------------------------');
const userId = 'test-user-4';

// Simulate 5 attempts
for (let i = 1; i <= 5; i++) {
    const result = runAnalysis({
        userId,
        questionId: `question-${i}`,
        questionCategory: 'linkedlist',
        timeTaken: 60 + (i * 10),
        incorrectAttempts: i % 2,
        edgeCaseFailures: 0,
        success: true
    });
    
    console.log(`Attempt ${i}:`);
    console.log('  Mistake Frequency:', result.patterns.mistakeFrequency);
    console.log('  Average Attempts:', result.patterns.averageAttempts);
    console.log('  Total Questions:', result.patterns.totalQuestions);
}
console.log('\n');

// Test Case 5: Escalation System
console.log('Test 5: Escalation System (Consecutive Successes)');
console.log('---------------------------');
const escalationUserId = 'test-user-5';

// Simulate 6 consecutive successes
for (let i = 1; i <= 6; i++) {
    const result = runAnalysis({
        userId: escalationUserId,
        questionId: `question-${i}`,
        questionCategory: 'stack',
        timeTaken: 50,
        incorrectAttempts: 0,
        edgeCaseFailures: 0,
        success: true
    });
    
    console.log(`Success ${i}:`);
    console.log('  Escalation Stage:', result.escalation.escalationStage);
    console.log('  Pressure Multiplier:', result.escalation.pressureMultiplier);
    console.log('  Consecutive Successes:', result.escalation.consecutiveSuccesses);
}
console.log('\n');

// Test Case 6: Full Analysis Output
console.log('Test 6: Complete Analysis Structure');
console.log('---------------------------');
const fullTest = runAnalysis({
    userId: 'test-user-6',
    questionId: 'queue-enqueue-dequeue',
    questionCategory: 'queue',
    timeTaken: 90,
    incorrectAttempts: 1,
    edgeCaseFailures: 0,
    success: true
});

console.log(JSON.stringify(fullTest, null, 2));
console.log('\n');

console.log('=================================');
console.log('All Tests Completed Successfully!');
console.log('=================================');
