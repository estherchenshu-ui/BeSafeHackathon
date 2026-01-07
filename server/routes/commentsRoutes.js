import express from 'express';
import { addComment, getHistory, getStats } from '../controllers/commentsController.js';

const router = express.Router();

router.post('/analyze', addComment); // בת 3: שומרת ומנתחת
router.get('/history', getHistory);  // בת 3: מחזירה היסטוריה
router.get('/stats', getStats);      // בת 3: מחזירה סטטיסטיקה

export default router;