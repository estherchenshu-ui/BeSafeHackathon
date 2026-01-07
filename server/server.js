import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import commentsRoutes from './routes/commentsRoutes.js';
import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://127.0.0.1:27017/safetok_db'; 

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL
}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.use('/api', commentsRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
