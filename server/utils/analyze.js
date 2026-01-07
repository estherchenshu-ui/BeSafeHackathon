import { positiveWords, negativeWords, emojiScores, negationWords } from './words.js';
import { analyzeWithAI } from './aiProvider.js';

// פונקציית עזר לניקוי וסידור הטקסט
function normalize(text) {
    if (!text) return "";
    return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

// פונקציית עזר לבדיקת מילות שלילה (כמו "לא", "בלי")
function hasNegation(words, index) {
    const start = Math.max(0, index - 2);
    const prevWords = words.slice(start, index);
    return prevWords.some(w => negationWords.has(w));
}

export async function analyzeComment(text) {
    // 1. הגנה ראשונית: אם הטקסט ריק או לא תקין, מחזירים תוצאה ניטרלית מיד
    if (!text || typeof text !== 'string' || text.trim() === '') {
        return { sentiment: 'neutral', impact: 0 };
    }

    const clean = normalize(text);
    const words = clean.split(' ');
    let score = 0;
    let identified = false;

    // 2. ניתוח מילים (לוקאלי)
    words.forEach((word, i) => {
        // מנקים סימני פיסוק (כדי ש"מדהים!" יזוהה כ"מדהים")
        const cleanWord = word.replace(/[^\p{L}]/gu, ''); 
        
        if (positiveWords[cleanWord]) {
            // אם יש שלילה ("לא מדהים") -> הופך לשלילי, אחרת חיובי
            score += hasNegation(words, i) ? -positiveWords[cleanWord] : positiveWords[cleanWord];
            identified = true;
        }
        else if (negativeWords[cleanWord]) {
            // אם יש שלילה ("לא גרוע") -> הופך ל-0 (ניטרלי), אחרת שלילי
            score += hasNegation(words, i) ? 0 : negativeWords[cleanWord];
            identified = true;
        }
    });

    // 3. ניתוח אימוג'ים (לוקאלי)
    const emojiRegex = /\p{Emoji}/gu;
    const emojisFound = text.match(emojiRegex) || [];
    emojisFound.forEach(emoji => {
        if (emojiScores[emoji]) {
            score += emojiScores[emoji];
            identified = true;
        }
    });

    // 4. החלטה חכמה מתי לעבור ל-AI
    
    // תנאי א': לא זיהינו שום מילה מהמילון
    const noWordsFound = !identified;
    
    // תנאי ב': הציון גבולי (בין -2 ל-2) ויש מספיק מילים (אולי פספסנו הקשר)
    const isAmbiguous = (score >= -2 && score <= 2 && words.length >= 4);

    // תנאי ג' (התיקון החדש): הציון גבוה מאוד (מעל 5) אבל המשפט קצר (פחות מ-4 מילים)
    // זה חשוד כסרכזם כמו "גאון הדור" או "ממש יופי"
    const isSuspiciouslyShort = (score > 5 && words.length < 4);

    const needsAI = noWordsFound || isAmbiguous || isSuspiciouslyShort;
    
    if (needsAI) {
        try {
            const prompt = `
            Task: Analyze this Hebrew comment from TikTok: "${text}".
            
            Your specific goal is to detect SARCASM and CYBERBULLYING.
            
            Guidance for Hebrew Slang:
            - Be careful with words like "גאון" (genius), "יופי" (great), "בהצלחה" (good luck), "חי בסרט" (delusional).
            - If positive words are used in a short, dismissive way, it is likely SARCASM.
            - If sarcasm is detected, the score MUST be NEGATIVE (e.g., -5).
            
            Score range: -10 (very toxic/hurtful) to 10 (very supportive/loving).
            
            Return ONLY JSON: {"score": number}`;
            
            const aiRaw = await analyzeWithAI(prompt);
            
            // ניקוי התשובה מסימנים מיותרים ופירסור ה-JSON
            const cleanJson = aiRaw.replace(/```json|```/g, '').trim();
            const aiResult = JSON.parse(cleanJson);
            
            // מעדכנים את הציון לפי ה-AI
            score = aiResult.score;
            
        } catch (e) { 
            // במקרה של שגיאה ב-AI, ממשיכים עם הציון הלוקאלי שחושב למעלה
            console.log("AI analysis failed, using local score:", e.message); 
        }
    }

    // 5. חישובים סופיים להחזרה (ללא החזרת ה-score הגולמי)
    
    // קביעת הסנטימנט (המילה) לפי הציון הסופי
    let sentiment = 'neutral';
    if (score >= 2) sentiment = 'positive';
    if (score <= -2) sentiment = 'negative';

    // חישוב האימפקט: חלוקה ב-2 כדי למתן את התנודות בגרף הבריאות
    let impact = score / 2;

    // החזרה פשוטה של מה שצריך לתצוגה ול-DB
    return { 
        sentiment: sentiment,  
        impact: impact         
    };
}