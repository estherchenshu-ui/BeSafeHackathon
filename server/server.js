import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import commentsRoutes from './routes/commentsRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL
}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.use('/api/comments', commentsRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
