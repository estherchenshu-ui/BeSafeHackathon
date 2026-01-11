// server/models/Comment.js
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  text: { type: String, required: true },
  sentiment: { type: String, enum: ['positive', 'negative', 'neutral'], default: 'neutral' },
  score: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now } // זה השדה הקריטי
});
export default mongoose.model('Comment', commentSchema);