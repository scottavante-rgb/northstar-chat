// api/chat.js
export default async function handler(req, res) {
  const apiKey = process.env.TEST_OPENAI_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "TEST_OPENAI_KEY is missing. Please add it in Vercel → Settings → Environment Variables."
    });
  }

  try {
    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",   // you can change to gpt-4 or gpt-4o
        messages: [
          { role: "system", content: "You are a helpful AI assistant." },
          { role: "user", content: message }
        ],
        max_tokens: 200
      })
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices?.[0]?.message?.content || "No response" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
