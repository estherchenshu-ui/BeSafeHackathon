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
      score: analysisResult.score // הציון הזה כבר כולל את ה-x1.5 אם היה שלילי
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
    // שלב א: סכימת כל הניקוד מהדאטה בייס
    const aggregation = await Comment.aggregate([
      { 
        $group: { 
          _id: null, 
          totalSum: { $sum: "$score" } // סוכם את הכל (חיובי ושלילי)
        } 
      }
    ]);

    // אם אין תגובות, הסכום הוא 0
    const totalImpactSum = aggregation.length > 0 ? aggregation[0].totalSum : 0;

    // שלב ב: חישוב הציון הכללי (80 + הסכום)
    const healthScore = calculateHealthScore(totalImpactSum);
    const status = getStatus(healthScore);

    // שלב ג: הבאת נתונים לתצוגה גרפית (כמויות)
    const total = await Comment.countDocuments();
    const positive = await Comment.countDocuments({ sentiment: 'positive' });
    const negative = await Comment.countDocuments({ sentiment: 'negative' });
    const neutral = total - positive - negative;
    
    // תגובות מהיום
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const commentsToday = await Comment.countDocuments({ timestamp: { $gte: startOfDay } });

    res.json({
      total,
      today: commentsToday,
      breakdown: { positive, negative, neutral },
      percentages: {
          positive: total > 0 ? Math.round((positive / total) * 100) : 0,
          negative: total > 0 ? Math.round((negative / total) * 100) : 0
      },
      healthScore, 
      status,
      // שדה בונוס לדיבוג - הסכום הגולמי
      debug_sum: totalImpactSum 
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