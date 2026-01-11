// server/controllers/commentsController.js
import Comment from '../models/Comment.js';
import { analyzeComment } from '../utils/analyze.js'; 
import { calculateHealthScore, getStatus } from '../utils/score.js';

// 1. הוספת תגובה (POST)
// server/controllers/commentsController.js
export const addComment = async (req, res) => {
  try {
    const { username, text, createdAt } = req.body; // הוסיפי את createdAt כאן
    
    const analysisResult = await analyzeComment(text); 

    const newComment = new Comment({
      username: username || 'אנונימי',
      text: text,
      sentiment: analysisResult.sentiment,
      score: Math.round(analysisResult.score),
      createdAt: createdAt || new Date() // אם שלחת תאריך ב-Postman, הוא ישתמש בו
    });

    await newComment.save();

    
    // החזרה לפוסטמן (כולל שדות דיבוג שלא נשמרו ב-DB)
    res.status(201).json({
      ...newComment.toObject(),
      source_CHECK: analysisResult.debugSource, // כדי שתדעי אם זה AI
      debug_final_score: analysisResult.score   // כדי לוודא את הניקוד
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. קבלת סטטיסטיקה (GET)
// 2. קבלת סטטיסטיקה (GET)
export const getStats = async (req, res) => {
  try {
    const allComments = await Comment.find().sort({ createdAt: 1 });
    
    // 1. חישוב הציון הנוכחי הכללי
    const totalImpactSum = allComments.reduce((sum, c) => sum + c.score, 0);
    const currentHealthScore = Math.round(calculateHealthScore(totalImpactSum));

    // 2. לוגיקת "חלונות זמן" - 10 הימים האחרונים
    const healthHistory = [];
    const now = new Date();

    for (let i = 9; i >= 0; i--) {
      // יצירת תאריך עבור כל יום ב-10 הימים האחרונים
      const targetDate = new Date();
      targetDate.setDate(now.getDate() - i);
      
      // הגדרת נקודת הזמן לסוף אותו יום (23:59:59)
      // עבור היום הנוכחי (i=0), זה יחשב את הניקוד עד לרגע זה ממש
      const endOfTargetDay = i === 0 ? now : new Date(targetDate.setHours(23, 59, 59, 999));
      
      // חישוב סך הניקוד המצטבר שהיה קיים עד סוף אותו יום ספציפי
      const impactAtPoint = allComments
        .filter(c => new Date(c.createdAt) <= endOfTargetDay)
        .reduce((sum, c) => sum + c.score, 0);
      
      // המרת הניקוד לציון בריאות ועיגול
      healthHistory.push(Math.round(calculateHealthScore(impactAtPoint)));
    }

    // 3. סינון הודעות להיום בלבד (נשאר ללא שינוי)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayComments = allComments
      .filter(c => new Date(c.createdAt) >= startOfDay)
      .reverse();

    const positive = allComments.filter(c => c.sentiment === 'positive').length;
    const negative = allComments.filter(c => c.sentiment === 'negative').length;

    res.json({
      today: todayComments.length,
      liveComments: todayComments, 
      healthScore: currentHealthScore,
      trendData: healthHistory, // עכשיו מייצג 10 ימים
      breakdown: { positive, negative, neutral: allComments.length - positive - negative },
      percentages: {
        positive: allComments.length > 0 ? Math.round((positive / allComments.length) * 100) : 0,
        negative: allComments.length > 0 ? Math.round((negative / allComments.length) * 100) : 0
      },
      status: getStatus(currentHealthScore)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    // שינוי מ-timestamp ל-createdAt
    const comments = await Comment.find().sort({ createdAt: -1 }).limit(50); 
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};