// server/controllers/commentsController.js
import Comment from '../models/Comment.js';
import { analyzeComment } from '../utils/analyze.js'; 
import { calculateHealthScore, getStatus } from '../utils/score.js';

/**
 * הוספת תגובה חדשה, ניתוח שלה ושמירה למסד הנתונים
 */
export const addComment = async (req, res) => {
  try {
    const { username, text, createdAt } = req.body;
    
    // ניתוח התגובה (סנטימנט וניקוד)
    const analysisResult = await analyzeComment(text); 

    const newComment = new Comment({
      username: username || 'אנונימי',
      text: text,
      sentiment: analysisResult.sentiment,
      score: Math.round(analysisResult.score), // שמירת הניקוד המדויק
      createdAt: createdAt || new Date()
    });

    await newComment.save();

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * קבלת סטטיסטיקה מעודכנת עבור ה-Live Feed
 */
export const getStats = async (req, res) => {
  try {
    // משיכת כל התגובות מהמסד לצורך חישוב הציון הכללי
    const allComments = await Comment.find();
    
    // חישוב סך כל הניקוד (השפעה מצטברת) - התיקון לבעיית הציון התקוע
    const totalImpactSum = allComments.reduce((sum, c) => sum + (Number(c.score) || 0), 0);
    
    // חישוב ציון הבריאות הסופי (מבוסס על ה-BASE_SCORE ב-utils/score.js)
    const currentHealthScore = calculateHealthScore(totalImpactSum);

    // הכנת נתונים לגרף הטרנד (10 ימים אחרונים)
    const healthHistory = [];
    const now = new Date();
    for (let i = 9; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(now.getDate() - i);
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      
      const impactAtPoint = allComments
        .filter(c => new Date(c.createdAt) <= endOfDay)
        .reduce((sum, c) => sum + (Number(c.score) || 0), 0);
      
      healthHistory.push(calculateHealthScore(impactAtPoint));
    }

    // סינון תגובות מהיום בלבד עבור הפיד המרכזי
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayComments = allComments.filter(c => new Date(c.createdAt) >= startOfDay);

    const positiveToday = todayComments.filter(c => c.sentiment === 'positive').length;
    const negativeToday = todayComments.filter(c => c.sentiment === 'negative').length;

    res.json({
      healthScore: currentHealthScore,
      today: todayComments.length,
      liveComments: [...todayComments].reverse(), 
      trendData: healthHistory,
      breakdown: { 
        positive: positiveToday, 
        negative: negativeToday, 
        neutral: todayComments.length - positiveToday - negativeToday 
      },
      percentages: {
        positive: todayComments.length > 0 ? Math.round((positiveToday / todayComments.length) * 100) : 0,
        negative: todayComments.length > 0 ? Math.round((negativeToday / todayComments.length) * 100) : 0
      },
      status: getStatus(currentHealthScore)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * קבלת היסטוריית תגובות (50 אחרונות)
 */
export const getHistory = async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 }).limit(50); 
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * יצירת דוח תקופתי (חודש, חצי שנה, שנה)
 */
// server/controllers/commentsController.js

export const getPeriodReport = async (req, res) => {
  try {
    const { period } = req.query; 
    let startDate = new Date();
    let groupDefinition = {};
    let sortDefinition = {};

    // הגדרת טווחי זמנים וקבצות
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
      default: // 6months
        startDate.setMonth(startDate.getMonth() - 6);
        groupDefinition = { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } };
        sortDefinition = { "_id.year": 1, "_id.month": 1 };
        break;
    }

    // שליפת הנתונים מהמסד
    const reportDataRaw = await Comment.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: groupDefinition,
          totalPeriodScore: { $sum: "$score" }, 
          count: { $sum: 1 },
          positiveCount: { $sum: { $cond: [{ $eq: ["$sentiment", "positive"] }, 1, 0] } },
          negativeCount: { $sum: { $cond: [{ $eq: ["$sentiment", "negative"] }, 1, 0] } }
        }
      },
      { $sort: sortDefinition }
    ]);

    // המרה לציון בריאות
    const reportData = reportDataRaw.map(item => ({
      ...item,
      avgScore: calculateHealthScore(item.totalPeriodScore) 
    }));

    // שליפת תגובות קיצון
    const bestComment = await Comment.findOne({ createdAt: { $gte: startDate } }).sort({ score: -1 });
    const worstComment = await Comment.findOne({ createdAt: { $gte: startDate } }).sort({ score: 1 });

    // חישוב אחוזי שינוי (מותאם לעיצוב הפרונט)
    let changes = { positive: 0, negative: 0 };
    
    if (reportData.length >= 2) {
        const current = reportData[reportData.length - 1];
        const previous = reportData[reportData.length - 2];

        // חיובי: עלייה = ירוק (חיובי), ירידה = אדום (שלילי)
        changes.positive = previous.positiveCount > 0 
            ? Math.round(((current.positiveCount - previous.positiveCount) / previous.positiveCount) * 100) 
            : (current.positiveCount > 0 ? 100 : 0);

        // שלילי: ירידה בתלונות = ירוק (חיובי), עלייה בתלונות = אדום (שלילי)
        changes.negative = previous.negativeCount > 0 
            ? Math.round(((previous.negativeCount - current.negativeCount) / previous.negativeCount) * 100) 
            : (current.negativeCount > 0 ? -100 : 0); 
    }

    res.json({ period, data: reportData, bestComment, worstComment, changes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};