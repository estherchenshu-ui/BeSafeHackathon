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
    // 1. חישוב הציון הנוכחי
    const allComments = await Comment.find().sort({ createdAt: 1 });
    const totalImpactSum = allComments.reduce((sum, c) => sum + c.score, 0);
    const currentHealthScore = calculateHealthScore(totalImpactSum);

    // 2. בניית הנתונים לגרף (TrendData)
    // אנחנו נחשב איך ה-Health Score השתנה אחרי כל תגובה ב-10 התגובות האחרונות
    let runningImpact = totalImpactSum;
    const healthHistory = [];
    
    // הולכים מהסוף להתחלה כדי לראות את המגמה
    const lastTen = [...allComments].reverse().slice(0, 10);
    
    lastTen.forEach(c => {
        healthHistory.push(calculateHealthScore(runningImpact));
        runningImpact -= c.score; // מחסירים את ההשפעה כדי לדעת מה היה הציון קודם
    });

    // 3. ספירת כמויות לאחוזים (נשאר כפי שהיה כדי לא להרוס)
    const total = allComments.length;
    const positive = allComments.filter(c => c.sentiment === 'positive').length;
    const negative = allComments.filter(c => c.sentiment === 'negative').length;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const commentsToday = allComments.filter(c => c.createdAt >= startOfDay).length;

    res.json({
      today: commentsToday,
      total,
      healthScore: currentHealthScore,
      trendData: healthHistory.reverse(), // הופכים חזרה שיוצג משמאל לימין
      breakdown: { positive, negative, neutral: total - positive - negative },
      percentages: {
          positive: total > 0 ? Math.round((positive / total) * 100) : 0,
          negative: total > 0 ? Math.round((negative / total) * 100) : 0
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