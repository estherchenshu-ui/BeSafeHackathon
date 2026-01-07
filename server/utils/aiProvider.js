import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

console.log("AI Provider initialized with Gemini model.");

export async function analyzeWithAI(prompt) {
  const response = await ai.models.generateContent({
    model: 'gemini-flash-latest',
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
  });

  return response.text;
}
