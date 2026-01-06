// server/controllers/commentsController.js
import Comment from '../models/Comment.js';

// --- כאן את מייבאת את הפונקציה של בת 4 ---
// (בינתיים נשים פה דמה, בהמשך תשני את הנתיב לקובץ שלה ב-utils/analyze.js)
import { analyze } from '../utils/analyze.js'; 
// אם בת 4 עדיין לא סיימה, תשתמשי בפונקציה הזמנית שכתבנו קודם בתוך הקובץ הזה.

// 1. הוספת תגובה וניתוח (POST /api/analyze)
export const addComment = async (req, res) => {
  try {
    const { username, text } = req.body;

    // א. קריאה ללוגיקה של בת 4
    const analysisResult = analyze(text); 
    // נניח שבת 4 מחזירה אובייקט כזה: { sentiment: 'negative', score: -5 }

    // ב. יצירת רשומה חדשה ל-MongoDB
    const newComment = new Comment({
      username: username || 'אנונימי',
      text: text,
      sentiment: analysisResult.sentiment,
      score: analysisResult.score || 0
    });

    // ג. שמירה בדאטה בייס (פעולה אסינכרונית - לוקחת זמן)
    await newComment.save();

    res.status(201).json(newComment); // מחזירים לפרונט את מה שנשמר
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. קבלת כל ההיסטוריה (GET /api/history)
export const getHistory = async (req, res) => {
  try {
    // שליפה מה-DB, ממוין מהחדש לישן
    const comments = await Comment.find().sort({ timestamp: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. קבלת סטטיסטיקות (GET /api/stats)
export const getStats = async (req, res) => {
  try {
    const total = await Comment.countDocuments();
    const positive = await Comment.countDocuments({ sentiment: 'positive' });
    const negative = await Comment.countDocuments({ sentiment: 'negative' });
    
    // חישוב ניקוד בריאות כללי (לוגיקה פשוטה לדוגמה)
    // בת 4 אמורה לתת לך את הלוגיקה המדויקת לחישוב הציון הכללי (calculateScore)
    // בינתיים נעשה חישוב פשוט: מתחילים מ-70, כל שלילית מורידה, כל חיובית מעלה
    let healthScore = 70 + (positive * 2) - (negative * 5);
    if (healthScore > 100) healthScore = 100;
    if (healthScore < 0) healthScore = 0;

    res.json({
      total,
      positive,
      negative,
      neutral: total - positive - negative,
      score: healthScore
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};