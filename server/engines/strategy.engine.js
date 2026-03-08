/**
 * Strategy Engine
 * Determines teaching strategy based on exploitability
 */

export default function strategyEngine(data) {
    const { exploitabilityScore } = data;
    
    let strategy;
    
    if (exploitabilityScore >= 60) {
        // High exploitability - target weaknesses
        strategy = 'exploit';
    } else if (exploitabilityScore >= 30) {
        // Moderate exploitability - test boundaries
        strategy = 'probe';
    } else {
        // Low exploitability - provide support
        strategy = 'support';
    }
    
    return { strategy };
}
