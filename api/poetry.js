export default async function handler(req, res) {
  // Global CORS configurations so developers can consume your endpoint safely
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Parse custom theme parameters out of the URL string (e.g., ?theme=rain)
  const { theme } = req.query;
  const targetTheme = theme || "காதல் (Love)";

  try {
    // Calling the production open-source engine model on Groq
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer gsk_Q48ghqmWhaYSfkeUb0JDWGdyb3FYG0Aiz2cCjRvh3YaDVsE"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a professional classical Tamil poet. Output only the pure, raw poetry stanza lines. Do not add any greeting sentences or conversational fluff." },
          { role: "user", content: `${targetTheme} பற்றிய ஒரு அழகான தமிழ் கவிதை வரிகள் எழுதுக.` }
        ]
      })
    });

    const data = await response.json();
    const poemResult = data.choices[0].message.content;

    // Return the response formatted beautifully like NewsAPI
    return res.status(200).json({
      status: "success",
      theme: targetTheme,
      kavithai: poemResult
    });

  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
}
