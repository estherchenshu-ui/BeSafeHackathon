import { analyzeComment } from './analyze.js';

// פונקציית עזר להשהיה (Time delay)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTests() {
    console.log("🚀 BeSafe Sentiment Analysis - סבב בדיקות 2.0 🚀");
    console.log("-----------------------------------------------");

    const testCases = [
        { text: "הסרטון הזה פשוט מדהים", expected: "positive", desc: "חיובי ישיר" },
        { text: "מגעיל ברמות, שונא את זה", expected: "negative", desc: "שלילי ישיר" },
        { text: "זה בכלל לא טוב", expected: "negative", desc: "שלילה של חיובי" },
        { text: "מדהיםםםםםם!!!!! 😍🔥", expected: "positive", desc: "אימוג'ים" },
        { text: "עבודה יפה! ", expected: "positive", desc: "ניטרלי" },
        
        // המבחנים שנכשלו קודם:
        { text: "יופי של עבודה", expected: "negative", desc: "ציניות (AI)" },
        { text: "ממש חכם מצידך", expected: "negative", desc: "תוקפנות (AI)" },
        
        // מבחני ניטרליות:
        { text: "אפשר לשאול באיזה עיר זה?", expected: "neutral", desc: "שאלה" },
        { text: "הלכתי היום לעבודה", expected: "neutral", desc: "משפט סתמי" }
    ];

    // שיניתי ללולאת for רגילה כדי שתהיה גישה לאינדקס (לדעת מתי הסוף)
    for (let i = 0; i < testCases.length; i++) {
        const test = testCases[i];

        try {
            const result = await analyzeComment(test.text);
            
            // בדיקה אם התוצאה תואמה לציפייה
            const isPass = result.sentiment === test.expected || test.expected.includes(result.sentiment);
            const status = isPass ? "✅ עבר" : "❌ נכשל";
            
            console.log(`📝 טקסט: "${test.text}"`);
            console.log(`📊 ציפייה: ${test.expected} | בפועל: ${result.sentiment}`);
            console.log(`📉 Impact: ${result.impact} | מנוע: ${result.debugSource}`);
            console.log(`🏁 סטטוס: ${status}`);
            console.log("-----------------------------------------------");

            // השהיה רק אם זה לא הטסט האחרון
            // מחכים 15 שניות כדי לא לעבור את המגבלה של 5 בקשות בדקה
            if (i < testCases.length - 1) {
                console.log("⏳ ממתין 15 שניות למניעת עומס על ה-AI...");
                await sleep(15000); 
            }

        } catch (error) {
            console.error(`❌ שגיאה:`, error.message);
            // גם במקרה של שגיאה, כדאי לחכות לפני הניסיון הבא
            if (i < testCases.length - 1) await sleep(15000);
        }
    }
}

runTests();