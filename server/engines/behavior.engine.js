/**
 * Behavior Engine
 * Calculates behavior score based on performance
 */

export default function behaviorEngine(data) {
    const { timeTaken, incorrectAttempts } = data;
    
    // Start with 100 points
    let behaviorScore = 100;
    
    // Deduct 10 points per incorrect attempt
    behaviorScore -= incorrectAttempts * 10;
    
    // Deduct points for slow time (over 60 seconds)
    if (timeTaken > 60) {
        behaviorScore -= Math.floor((timeTaken - 60) / 10);
    }
    
    // Clamp between 0-100
    behaviorScore = Math.max(0, Math.min(100, behaviorScore));
    
    return { behaviorScore };
}
