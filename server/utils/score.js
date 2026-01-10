// server/utils/score.js

/**
 * מחשב את הציון הסופי.
 * מתחילים מ-80 (ציון "טוב מאוד").
 */
export function calculateHealthScore(totalImpactSum) {
    const BASE_SCORE = 80; 
    
    // חישוב פשוט: 80 ועוד ההשפעה המצטברת
    let currentScore = BASE_SCORE + totalImpactSum;

    // מגבלות: לא פחות מ-0 ולא יותר מ-100
    return Math.floor(Math.max(0, Math.min(100, currentScore)));
}

export function getStatus(score) {
    // התיקון הסופי:
    // 80 ומעלה = ירוק (כדי שההתחלה תהיה ירוקה)
    if (score >= 80) return { label: 'Safe', color: '#4CAF50' };
    
    // 60 עד 79 = כתום
    if (score >= 60) return { label: 'Warning', color: '#FFC107' };
    
    // מתחת ל-60 = אדום
    return { label: 'Danger', color: '#F44336' };
}