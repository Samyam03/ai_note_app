import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY });

// Free-tier model: gemini-2.5-flash (or use gemini-1.5-flash if quota issues)
const GENERATION_MODEL = "gemini-2.5-flash";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function generateAIResponse(prompt, retries = 1) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
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
    } catch (err) {
      const is429 = err?.status === 429 || err?.message?.includes("429");
      const delayMs = 12000; // ~12s cooldown when quota is exceeded
      if (is429 && attempt < retries) {
        await sleep(delayMs);
        continue;
      }
      if (is429) {
        throw new Error(
          "Gemini API quota exceeded. Please wait a minute and try again, or check your API plan and billing."
        );
      }
      throw err;
    }
  }
}