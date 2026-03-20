import { buildGenerationSystemPrompt, buildDiscoverySummary } from "../lib/prompts.js";
import { streamGemini } from "../lib/gemini.js";

export const config = {
  maxDuration: 300, // 5 minutes max for streaming
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { answers } = req.body;
  if (!answers) return res.status(400).json({ error: "answers required" });

  const systemPrompt = buildGenerationSystemPrompt();
  const userMessage = buildDiscoverySummary(answers);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    console.log("[generate] Trying Gemini...");
    await streamGemini(userMessage, systemPrompt, res);
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error(`[generate] Gemini failed: ${err.message}`);
    res.write(`data: ${JSON.stringify({ error: "AI provider is unavailable. Please try again in a few minutes." })}\n\n`);
    res.end();
  }
}
