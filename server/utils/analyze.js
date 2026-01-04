// server/utils/analyze.js
import { positiveWords, negativeWords, positiveEmojis, negativeEmojis } from './words.js';

/**
 * Analyzes the sentiment of a given text based on project guidelines.
 * @param {string} text - The input comment to analyze.
 * @returns {Object} { sentiment, impact, tags }
 */
export const analyze = (text) => {
    // נרמול בסיסי: הפיכה למילים והסרת סימני פיסוק
    const words = text.toLowerCase().replace(/[.,!?;:]/g, "").split(/\s+/);
    
    let totalImpact = 0;
    let tags = [];

    words.forEach(word => {
        // בדיקת מילים שליליות: אימפקט של -3 עד -6
        if (negativeWords.includes(word)) {
            totalImpact -= 5; 
            if (!tags.includes('offensive')) tags.push('offensive');
        } 
        // בדיקת מילים חיוביות: אימפקט של +2 עד +5
        else if (positiveWords.includes(word)) {
            totalImpact += 4;
            if (!tags.includes('supportive')) tags.push('supportive');
        }
    });

    // הכללת אימוג'ים בחישוב
    positiveEmojis.forEach(emoji => { if (text.includes(emoji)) totalImpact += 2; });
    negativeEmojis.forEach(emoji => { if (text.includes(emoji)) totalImpact -= 3; });

    // קביעת הסנטימנט הסופי
    let sentiment = 'neutral';
    if (totalImpact > 0) sentiment = 'positive';
    else if (totalImpact < 0) sentiment = 'negative';

    return {
        sentiment,
        impact: totalImpact,
        tags
    };
};