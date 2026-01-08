// utils/score.js

/**
 * מחשב את הציון הסופי.
 * מתחילים מ-80 כדי לאפשר עליה וירידה דינמית.
 */
export function calculateHealthScore(totalImpact) {
    const BASE_SCORE = 80; // נקודת ההתחלה
    
    let currentScore = BASE_SCORE + totalImpact;

    // שומרים על גבולות הגיוניים (0 עד 100)
    return Math.max(0, Math.min(100, currentScore));
}

export function getStatus(score) {
    if (score >= 80) return 'Safe';      // ירוק: הכל מצוין
    if (score >= 60) return 'Warning';   // כתום: צריך לשים לב
    return 'Danger';                     // אדום: סכנה מיידית
}