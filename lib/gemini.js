const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash";

export async function streamGemini(userMessage, systemPrompt, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("NO_KEY");

  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: [{ text: userMessage }] }],
    generationConfig: {
      maxOutputTokens: 65536,
      temperature: 1.0,
      thinkingConfig: { thinkingBudget: 16384 },
    },
  };

  const url = `${GEMINI_URL}:streamGenerateContent?alt=sse&key=${apiKey}`;
  let response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (response.status === 429) {
    console.log("[Gemini] Rate limited, retrying in 10s...");
    await new Promise(r => setTimeout(r, 10000));
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  if (!response.ok) throw new Error(`Gemini ${response.status}`);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let hasContent = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const parsed = JSON.parse(data);
        for (const part of (parsed?.candidates?.[0]?.content?.parts || [])) {
          if (part.thought) continue;
          if (part.text) {
            hasContent = true;
            res.write(`data: ${JSON.stringify({ text: part.text })}\n\n`);
          }
        }
      } catch {}
    }
  }
  if (!hasContent) throw new Error("Empty response");
}

export async function callGeminiNonStreaming(userMessage, systemPrompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("NO_KEY");

  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: [{ text: userMessage }] }],
    generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
  };

  const url = `${GEMINI_URL}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error(`Gemini ${response.status}`);

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.map(p => p.text).filter(Boolean).join("") || "";
}
