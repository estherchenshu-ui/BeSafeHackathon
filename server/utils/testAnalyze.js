// utils/testAnalyze.js
import { analyzeComment } from './analyze.js';

async function runTests() {
    console.log("🚀 BeSafe Sentiment Analysis - סבב בדיקות מקיף 🚀");
    console.log("-----------------------------------------------");

    const testCases = [
        // 1. מקרי הצלחה פשוטים (מילון מקומי)
        { text: "הסרטון הזה פשוט מדהים", expected: "positive", desc: "חיובי ישיר" },
        { text: "מגעיל ברמות, שונא את זה", expected: "negative", desc: "שלילי ישיר" },

        // 2. בדיקת שלילה (היפוך משמעות)
        { text: "זה בכלל לא טוב", expected: "negative", desc: "שלילה של חיובי" },
        { text: "לא מאכזב בכלל", expected: "neutral/positive", desc: "שלילה של שלילי" },

        // 3. אימוג'ים וסלנג (נרמול)
        { text: "מדהיםםםםםם!!!!! 😍🔥", expected: "positive", desc: "אותיות חוזרות ואימוג'ים" },
        { text: "🤮🤮👎", expected: "negative", desc: "אימוג'ים שליליים בלבד" },

        // 4. מקרי קצה וציניות (שליחה ל-AI)
        { text: "יופי של עבודה", expected: "negative", desc: "ציניות/עקיצה (דרוש AI)" },
        { text: "ממש חכם מצידך", expected: "negative", desc: "תוקפנות פסיבית (דרוש AI)" },

        // 5. ניטרלי
        { text: "אפשר לשאול באיזה עיר זה?", expected: "neutral", desc: "שאלה אינפורמטיבית" },
        { text: "הלכתי היום לעבודה", expected: "neutral", desc: "משפט חיווי פשוט" }
    ];

    for (const test of testCases) {
        try {
            const result = await analyzeComment(test.text);
            
            const status = (result.sentiment === test.expected || 
                           (test.expected.includes(result.sentiment))) ? "✅ עבר" : "❌ נכשל";

            console.log(`📝 טקסט: "${test.text}"`);
            console.log(`📌 סוג בדיקה: ${test.desc}`);
            console.log(`📊 תוצאה: ${result.sentiment} (ציון: ${result.score}) | מקור: ${result.source}`);
            console.log(`🏁 סטטוס: ${status}`);
            console.log("-----------------------------------------------");
        } catch (error) {
            console.error(`❌ שגיאה בבדיקה של: "${test.text}":`, error.message);
        }
    }
}

runTests();