import { positiveWords, negativeWords, emojiScores, negationWords } from './words.js';
import { analyzeWithAI } from './aiProvider.js';

function normalize(text) {
    if (!text) return "";
    return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

function hasNegation(words, index) {
    const start = Math.max(0, index - 2);
    const prevWords = words.slice(start, index);
    return prevWords.some(w => negationWords.has(w));
}

export async function analyzeComment(text) {
    if (!text || typeof text !== 'string' || text.trim() === '') {
        return { sentiment: 'neutral', impact: 0 };
    }

    const clean = normalize(text);
    const words = clean.split(' ');
    let score = 0;
    let identified = false;

    // ניתוח מילים
    words.forEach((word, i) => {
        const cleanWord = word.replace(/[^\p{L}]/gu, ''); 
        
        if (positiveWords[cleanWord]) {
            score += hasNegation(words, i) ? -positiveWords[cleanWord] : positiveWords[cleanWord];
            identified = true;
        }
        else if (negativeWords[cleanWord]) {
            score += hasNegation(words, i) ? 0 : negativeWords[cleanWord];
            identified = true;
        }
    });

    // ניתוח אימוג'ים
    const emojiRegex = /\p{Emoji}/gu;
    const emojisFound = text.match(emojiRegex) || [];
    emojisFound.forEach(emoji => {
        if (emojiScores[emoji]) {
            score += emojiScores[emoji];
            identified = true;
        }
    });

    // --- לוגיקה משופרת לזיהוי מתי צריך AI ---
    
    // 1. לא זיהינו כלום
    const noWordsFound = !identified;
    
    // 2. גבולי: ציון נמוך (בין -3 ל 3) ויש הרבה מילים (אולי פספסנו הקשר)
    const isAmbiguous = (score >= -3 && score <= 3 && words.length >= 4);

    // 3. חשד לסרכזם: ציון חיובי כלשהו (אפילו 2 ומעלה!) ומשפט קצר.
    // זה יתפוס את "יופי של עבודה" (ציון 3, אורך 3)
    const isSuspiciouslyShort = (score >= 2 && words.length <= 5);

    const needsAI = noWordsFound || isAmbiguous || isSuspiciouslyShort;
    
    // משתנה לדיבוג - כדי שתדעי בטסט אם זה עבר דרך AI
    let usedAI = false; 

    if (needsAI) {
        try {
          const prompt = `
            Task: Analyze this Hebrew comment: "${text}".
            
            1. DETECT SARCASM: 
               - Phrases like "יופי של עבודה", "ממש גאון", "כל הכבוד באמת" are often SARCASTIC in short comments.
               - If sarcasm is detected -> Score MUST be NEGATIVE (e.g., -5).
            
            2. DETECT NEUTRALITY:
               - Simple questions (e.g., "איפה זה?", "מאיפה החולצה?") are NEUTRAL -> Score 0.
               - Simple facts (e.g., "אני בעבודה") are NEUTRAL -> Score 0.
               - Polite requests are NEUTRAL -> Score 0.

            3. Sentiment Score:
               - Range: -10 (Toxic) to 10 (Love/Support).
               - 0 is for Neutral/Questions.
            
            Return ONLY JSON: {"score": number}`;
            
            const aiRaw = await analyzeWithAI(prompt);
            const cleanJson = aiRaw.replace(/```json|```/g, '').trim();
            const aiResult = JSON.parse(cleanJson);
            
            score = aiResult.score;
            usedAI = true;
            
        } catch (e) { 
            console.error("❌ AI Error Details:", e.message);
        }
    }

    // --- חישובים סופיים ---
    
    let sentiment = 'neutral';
    // העליתי את הרף ל-3. כלומר: צריך להיות ממש חיובי כדי לקבל ירוק.
    // סתם "עבודה" לא יספיק.
    if (score >= 3) sentiment = 'positive';
    if (score <= -2) sentiment = 'negative'; // שלילי נשאר רגיש

    let impact = score / 2;

    return { 
        sentiment,  
        impact,
        debugSource: usedAI ? 'AI' : 'Local' // הוספתי את זה רק בשביל הטסט שלך!
    };
}