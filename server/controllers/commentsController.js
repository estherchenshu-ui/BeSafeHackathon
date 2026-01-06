// server/controllers/commentsController.js
import Comment from '../models/Comment.js';

// 👇 ייבוא הפונקציות של בת 4 (מהתיקייה utils)
import { analyze } from '../utils/analyze.js'; 
import { calculateScore, getStatus } from '../utils/score.js'; 

// 1. הוספת תגובה (POST /api/analyze)
export const addComment = async (req, res) => {
  try {
    const { username, text } = req.body;

    // שלב א: שליחה לבת 4 לניתוח הטקסט
    // היא מחזירה לך: { sentiment: 'negative', score: -5 }
    const analysisResult = analyze(text); 

    // שלב ב: יצירת רשומה ל-MongoDB עם התוצאות שלה
    const newComment = new Comment({
      username: username || 'אנונימי',
      text: text,
      sentiment: analysisResult.sentiment, // בת 4 קבעה אם זה חיובי/שלילי
      score: analysisResult.score || 0     // בת 4 קבעה כמה זה משפיע
    });

    await newComment.save();
    res.status(201).json(newComment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. סטטיסטיקות (GET /api/stats)
export const getStats = async (req, res) => {
  try {
    // שלב א: את (בת 3) מביאה את המספרים מה-DB
    // זה התפקיד שלך כי את אחראית על הנתונים
    const total = await Comment.countDocuments();
    const positive = await Comment.countDocuments({ sentiment: 'positive' });
    const negative = await Comment.countDocuments({ sentiment: 'negative' });
    const neutral = total - positive - negative;

    // שלב ב: את שולחת את המספרים לבת 4 לחישוב הציון המשוקלל
    // את לא צריכה לדעת את הנוסחה, רק לקרוא לפונקציה שלה
    const healthScore = calculateScore(total, positive, negative);
    
    // אופציונלי: לקבל ממנה גם סטטוס מילולי (למשל "Warning")
    const status = getStatus(healthScore);

    // שלב ג: מחזירה הכל לפרונט
    res.json({
      total,
      positive,
      negative,
      neutral,
      score: healthScore,
      status: status
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. היסטוריה (נשאר אותו דבר)
export const getHistory = async (req, res) => {
  try {
    const comments = await Comment.find().sort({ timestamp: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};