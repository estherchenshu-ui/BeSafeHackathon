// server/utils/analyze.js
import { positiveWords, negativeWords, emojiScores, negationWords } from './words.js';
import { analyzeWithAI } from './aiProvider.js';

// פונקציית עזר לניקוי טקסט
function normalize(text) {
    if (!text) return "";
    return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

// בדיקה אם יש מילת שלילה לפני המילה הנוכחית (כמו "לא טוב")
function hasNegation(words, index) {
    const start = Math.max(0, index - 2);
    const prevWords = words.slice(start, index);
    return prevWords.some(w => negationWords.has(w));
}

export async function analyzeComment(text) {
    // הגנות בסיסיות
    if (!text || typeof text !== 'string' || text.trim() === '') {
        return { sentiment: 'neutral', score: 0, impact: 0, debugSource: 'Empty' };
    }

    const clean = normalize(text);
    const words = clean.split(' ');
    let score = 0;
    let identified = false;

    // --- 1. ניתוח מילים מקומי ---
  // בתוך הפונקציה analyzeComment בקובץ server/utils/analyze.js

    // --- 1. ניתוח מילים מקומי ---
    words.forEach((word, i) => {
        let cleanWord = word.replace(/[^\p{L}]/gu, ''); 
        
        // 🔥 התיקון הקריטי: כיווץ אותיות חוזרות (3 פעמים ומעלה) לאות אחת 🔥
        // הופך את "רעההה" ל-"רעה", ואת "ממששש" ל-"ממש"
        cleanWord = cleanWord.replace(/(.)\1{2,}/g, '$1');

        // בדיקה מול המילון החיובי
        if (positiveWords[cleanWord]) {
            score += hasNegation(words, i) ? -positiveWords[cleanWord] : positiveWords[cleanWord];
            identified = true;
        }
        // בדיקה מול המילון השלילי (עכשיו זה ימצא את "רעה"!)
        else if (negativeWords[cleanWord]) {
            score += hasNegation(words, i) ? 0 : negativeWords[cleanWord];
            identified = true;
        }
    });

    // --- 2. ניתוח אימוג'ים ---
    const emojiRegex = /\p{Emoji}/gu;
    const emojisFound = text.match(emojiRegex) || [];
    emojisFound.forEach(emoji => {
        if (emojiScores[emoji]) {
            score += emojiScores[emoji];
            identified = true;
        }
    });

    // --- 3. החלטה אם להשתמש ב-AI ---
    const noWordsFound = !identified;
    // אם הציון גבולי (בין -3 ל 3) ויש הרבה מילים, אולי פספסנו הקשר
    const isAmbiguous = (score >= -3 && score <= 3 && words.length >= 4);
    // חשד לסרכזם: ציון חיובי אבל משפט קצר מדי
    const isSuspiciouslyShort = (score >= 2 && words.length <= 5);

    const needsAI = noWordsFound || isAmbiguous || isSuspiciouslyShort;
    let usedAI = false; 

    if (needsAI) {
        try {
            // שימי לב: הטווח פה הוא -10 עד 10
            const prompt = `
            Task: Analyze this Hebrew comment: "${text}".
            
            1. DETECT SARCASM: 
               - Phrases like "יופי של עבודה", "ממש גאון" are often SARCASTIC.
               - If sarcasm -> Score MUST be NEGATIVE (e.g., -5).
            
            2. DETECT NEUTRALITY:
               - Questions/Facts -> Score 0.

            3. Sentiment Score:
               - Range: -10 (Toxic) to 10 (Love/Support).
               - 0 is for Neutral.
            
            Return ONLY JSON: {"score": number}`;
            
            const aiRaw = await analyzeWithAI(prompt);
            const cleanJson = aiRaw.replace(/```json|```/g, '').trim();
            const aiResult = JSON.parse(cleanJson);
            
            score = aiResult.score;
            usedAI = true;
            
        } catch (e) { 
            console.error("❌ AI Error Details:", e.message);
            // במקרה של שגיאה נשארים עם הציון המקומי
        }
    }

    // --- 4. חישובים סופיים והחלת קנסות ---
    
    let finalScore = score;

    // 👇 הנה השינוי שביקשת: ענישה מתונה יותר (1.2 במקום 1.5)
    if (finalScore < 0) {
        finalScore = finalScore * 1.2;
    }

    // קביעת סנטימנט מילולי
    let sentiment = 'neutral';
    if (finalScore >= 3) sentiment = 'positive';
    if (finalScore <= -2) sentiment = 'negative';

    return { 
        sentiment,  
        score: finalScore,           // זה הציון שיישמר ב-DB (המשוקלל)
        impact: finalScore,          // לצורך תצוגה
        debugSource: usedAI ? 'AI' : 'Local' 
    };
}