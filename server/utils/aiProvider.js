import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("AI Provider initialized with OpenAI.");

export async function analyzeWithAI(prompt) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // זול ומהיר, מצוין ל-sentiment
    messages: [
      { role: "user", content: prompt }
    ],
    temperature: 0.2,
  });

  return response.choices[0].message.content;
}
