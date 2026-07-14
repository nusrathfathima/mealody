// api/generate.js
// Serverless function (runs on Vercel) — keeps your Anthropic API key secret.
// The browser calls THIS endpoint; this function adds the secret key and calls Anthropic.

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, maxTokens } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Missing prompt" });
    }

    // Clients may request a bigger output budget (recipes need more room than
    // meal plans), but we CLAMP it server-side so nobody hitting this endpoint
    // directly can demand huge outputs on your API key.
    const mt = Math.min(Math.max(parseInt(maxTokens, 10) || 1600, 256), 3000);

    // The secret key lives in an environment variable on Vercel — never in code.
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Server is missing ANTHROPIC_API_KEY" });
    }

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: mt,
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return res.status(anthropicRes.status).json({ error: "Anthropic error", detail: errText });
    }

    const data = await anthropicRes.json();
    // Pass the response straight back to the browser
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Server error", detail: String(err) });
  }
}
