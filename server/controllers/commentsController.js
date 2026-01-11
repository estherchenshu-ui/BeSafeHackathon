// server/controllers/commentsController.js
import Comment from '../models/Comment.js';
import { analyzeComment } from '../utils/analyze.js'; 
import { calculateHealthScore, getStatus } from '../utils/score.js';

// 1. הוספת תגובה (POST)
export const addComment = async (req, res) => {
  try {
    const { username, text } = req.body;
    
    // ניתוח הטקסט (כולל החלת הקנס אם צריך)
    const analysisResult = await analyzeComment(text); 

    // יצירת הרשומה לשמירה
    const newComment = new Comment({
      username: username || 'אנונימי',
      text: text,
      sentiment: analysisResult.sentiment,
      score:Math.round(analysisResult.score) // הציון הזה כבר כולל את ה-x1.5 אם היה שלילי
    });

    // שמירה בפועל
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
export const getStats = async (req, res) => {
  try {
    const allComments = await Comment.find().sort({ createdAt: 1 });
    
    // 1. חישוב הציון הנוכחי הכללי
    const totalImpactSum = allComments.reduce((sum, c) => sum + c.score, 0);
    const currentHealthScore = Math.round(calculateHealthScore(totalImpactSum));

    // 2. לוגיקת "חלונות זמן" - 10 הדקות האחרונות
    const healthHistory = [];
    const now = new Date();

    for (let i = 9; i >= 0; i--) {
      // יצירת נקודת זמן עבור כל דקה (מ-10 דקות אחורה ועד עכשיו)
      const pointInTime = new Date(now.getTime() - i * 60000);
      
      // חישוב סך הניקוד המצטבר שהיה קיים עד לאותה דקה ספציפית
      const impactAtPoint = allComments
        .filter(c => new Date(c.createdAt) <= pointInTime)
        .reduce((sum, c) => sum + c.score, 0);
      
      // המרת הניקוד לציון בריאות ועיגול
      healthHistory.push(Math.round(calculateHealthScore(impactAtPoint)));
    }

    // 3. סינון הודעות להיום בלבד עבור ה-Live Feed
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
      trendData: healthHistory, // המערך כבר מסודר כרונולוגית מהישן לחדש
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

// 3. היסטוריה (רגיל)
export const getHistory = async (req, res) => {
  try {
    const comments = await Comment.find().sort({ timestamp: -1 }).limit(20);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};