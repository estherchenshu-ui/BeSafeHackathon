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
    
    // 1. חישוב הציון הנוכחי הכללי (מכל ההיסטוריה)
    const totalImpactSum = allComments.reduce((sum, c) => sum + c.score, 0);
    const currentHealthScore = Math.round(calculateHealthScore(totalImpactSum));

    // 2. לוגיקת "חלונות זמן" - 10 הימים האחרונים (עבור הגרף)
    const healthHistory = [];
    const now = new Date();

    for (let i = 9; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(now.getDate() - i);
      const endOfTargetDay = i === 0 ? now : new Date(targetDate.setHours(23, 59, 59, 999));
      
      const impactAtPoint = allComments
        .filter(c => new Date(c.createdAt) <= endOfTargetDay)
        .reduce((sum, c) => sum + c.score, 0);
      
      healthHistory.push(Math.round(calculateHealthScore(impactAtPoint)));
    }

    // 3. סינון הודעות להיום בלבד (עבור האחוזים והפיד)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayComments = allComments.filter(c => new Date(c.createdAt) >= startOfDay);

    // חישוב פילוח (Breakdown) ואחוזים - מהיום בלבד
    const positiveToday = todayComments.filter(c => c.sentiment === 'positive').length;
    const negativeToday = todayComments.filter(c => c.sentiment === 'negative').length;
    const neutralToday = todayComments.length - positiveToday - negativeToday;
    const totalToday = todayComments.length;

    res.json({
      today: totalToday,
      liveComments: [...todayComments].reverse(), 
      healthScore: currentHealthScore,
      trendData: healthHistory,
      breakdown: { 
        positive: positiveToday, 
        negative: negativeToday, 
        neutral: neutralToday 
      },
      percentages: {
        positive: totalToday > 0 ? Math.round((positiveToday / totalToday) * 100) : 0,
        negative: totalToday > 0 ? Math.round((negativeToday / totalToday) * 100) : 0
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
// הוספי בסוף הקובץ server/controllers/commentsController.js

// הוסיפי את הפונקציה הזו בסוף הקובץ commentsController.js

export const getPeriodReport = async (req, res) => {
  try {
    const { period } = req.query; 
    
    let startDate = new Date();
    let groupDefinition = {};
    let sortDefinition = {};

    // הגדרת טווחי זמן (אותו דבר כמו קודם)
    switch (period) {
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        groupDefinition = { year: { $year: "$createdAt" }, week: { $week: "$createdAt" } };
        sortDefinition = { "_id.year": 1, "_id.week": 1 };
        break;
      case 'year':
        startDate.setMonth(startDate.getMonth() - 12);
        groupDefinition = { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } };
        sortDefinition = { "_id.year": 1, "_id.month": 1 };
        break;
      case '6months':
      default:
        startDate.setMonth(startDate.getMonth() - 6);
        groupDefinition = { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } };
        sortDefinition = { "_id.year": 1, "_id.month": 1 };
        break;
    }

    const reportDataRaw = await Comment.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: groupDefinition,
          avgScore: { $avg: "$score" },
          count: { $sum: 1 },
          // --- כאן השינוי הגדול: ספירה מותנית ---
          positiveCount: { 
            $sum: { $cond: [{ $eq: ["$sentiment", "positive"] }, 1, 0] } 
          },
          negativeCount: { 
            $sum: { $cond: [{ $eq: ["$sentiment", "negative"] }, 1, 0] } 
          }
        }
      },
      { $sort: sortDefinition }
    ]);

    // עיגול המספרים
    const reportData = reportDataRaw.map(item => ({
      ...item,
      avgScore: Math.round(item.avgScore)
    }));

    // שליפת תגובות קיצון
    const bestComment = await Comment.findOne({ createdAt: { $gte: startDate } }).sort({ score: -1 });
    const worstComment = await Comment.findOne({ createdAt: { $gte: startDate } }).sort({ score: 1 });

    // --- חישוב אחוזי שינוי מפוצלים (חיובי בנפרד, שלילי בנפרד) ---
    let changes = {
      positive: 0, // אחוז שינוי בתגובות חיוביות
      negative: 0  // אחוז שינוי בתגובות שליליות
    };

    if (reportData.length >= 2) {
      const current = reportData[reportData.length - 1];
      const previous = reportData[reportData.length - 2];

      // חישוב אחוז שינוי לחיוביות
      if (previous.positiveCount > 0) {
        changes.positive = Math.round(((current.positiveCount - previous.positiveCount) / previous.positiveCount) * 100);
      } else {
        changes.positive = current.positiveCount > 0 ? 100 : 0;
      }

      // חישוב אחוז שינוי לשליליות
      if (previous.negativeCount > 0) {
        changes.negative = Math.round(((current.negativeCount - previous.negativeCount) / previous.negativeCount) * 100);
      } else {
        changes.negative = current.negativeCount > 0 ? 100 : 0;
      }
    }

    res.json({
      period, 
      data: reportData, 
      bestComment,
      worstComment,
      changes // האובייקט החדש עם האחוזים
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};