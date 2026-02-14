import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY });

// Free-tier model: gemini-2.5-flash (or use gemini-1.5-flash if quota issues)
const GENERATION_MODEL = "gemini-2.5-flash";

export async function generateAIResponse(prompt) {
  const response = await ai.models.generateContent({
    model: GENERATION_MODEL,
    contents: prompt,
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2048,
      topP: 0.8,
      topK: 40,
    },
  });
  return response.text;
}