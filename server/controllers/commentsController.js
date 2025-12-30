// שימי לב: אנחנו מייבאים מהקובץ החדש שלך CommentsPull
import { comments } from '../data/CommentsPull.js';

// משתנה ששומר את המיקום הנוכחי שלנו ברשימה
// הוא נמצא מחוץ לפונקציה כדי שלא יתאפס בכל פעם שמבקשים תגובה
let currentIndex = 0;

// פונקציה לתגובות לייב (מחזירה אחת כל פעם לפי הסדר)
export const getLiveComment = (req, res) => {
    // 1. שולפים את התגובה לפי האינדקס הנוכחי
    const currentComment = comments[currentIndex];

    // 2. מקדמים את האינדקס ב-1 לפעם הבאה
    currentIndex++;

    // 3. בדיקה: אם הגענו לסוף הרשימה, נאפס את האינדקס להתחלה (0)
    // ככה זה יעבוד בלולאה אינסופית והשידור החי לא ייגמר אף פעם
    if (currentIndex >= comments.length) {
        currentIndex = 0;
    }
    
    // 4. שולחים את התגובה חזרה ללקוח
    res.json(currentComment);
};

// פונקציה להיסטוריה (מחזירה את כל התגובות בבת אחת)
export const getAllComments = (req, res) => {
    res.json(comments);
};