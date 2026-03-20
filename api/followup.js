import { buildFollowupPrompt } from "../lib/prompts.js";
import { callGeminiNonStreaming } from "../lib/gemini.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { answers } = req.body;
  if (!answers) return res.status(400).json({ error: "answers required" });

  const prompt = buildFollowupPrompt(answers);

  try {
    console.log("[followup] Trying Gemini...");
    const result = await callGeminiNonStreaming(prompt, "You are a brand naming strategist. Return ONLY valid JSON.");
    const match = result.match(/\[[\s\S]*\]/);
    if (match) {
      const questions = JSON.parse(match[0]);
      console.log(`[followup] Gemini returned ${questions.length} questions`);
      return res.json({ questions });
    }
    return res.json({ questions: [] });
  } catch (err) {
    console.error(`[followup] Gemini failed: ${err.message}`);
    return res.json({ questions: [] });
  }
}
