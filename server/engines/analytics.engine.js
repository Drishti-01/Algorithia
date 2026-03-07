/**
 * Analytics Engine
 * Tracks patterns and provides insights
 */

export function analyzePatterns(data) {
    const {
        userHistory,
        currentPerformance,
        questionCategory
    } = data;
    
    if (!userHistory || userHistory.length === 0) {
        return {
            trend: 'new',
            categoryStrength: {},
            weakCategories: [],
            strongCategories: [],
            averageScore: 0,
            totalAttempts: 0
        };
    }
    
    // Calculate category-wise performance
    const categoryScores = {};
    const categoryCounts = {};
    
    userHistory.forEach(entry => {
        const cat = entry.category || 'array';
        if (!categoryScores[cat]) {
            categoryScores[cat] = 0;
            categoryCounts[cat] = 0;
        }
        categoryScores[cat] += entry.score || 0;
        categoryCounts[cat] += 1;
    });
    
    // Calculate averages
    const categoryStrength = {};
    Object.keys(categoryScores).forEach(cat => {
        categoryStrength[cat] = Math.floor(categoryScores[cat] / categoryCounts[cat]);
    });
    
    // Identify weak and strong categories
    const weakCategories = Object.keys(categoryStrength)
        .filter(cat => categoryStrength[cat] < 60)
        .sort((a, b) => categoryStrength[a] - categoryStrength[b]);
    
    const strongCategories = Object.keys(categoryStrength)
        .filter(cat => categoryStrength[cat] >= 75)
        .sort((a, b) => categoryStrength[b] - categoryStrength[a]);
    
    // Calculate overall trend
    const recentScores = userHistory.slice(-5).map(h => h.score || 0);
    const averageRecent = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    const averageOverall = userHistory.reduce((sum, h) => sum + (h.score || 0), 0) / userHistory.length;
    
    let trend = 'stable';
    if (averageRecent > averageOverall + 10) trend = 'improving';
    else if (averageRecent < averageOverall - 10) trend = 'declining';
    
    return {
        trend,
        categoryStrength,
        weakCategories,
        strongCategories,
        averageScore: Math.floor(averageOverall),
        totalAttempts: userHistory.length,
        recentAverage: Math.floor(averageRecent)
    };
}
