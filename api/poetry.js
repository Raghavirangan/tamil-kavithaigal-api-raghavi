
export default async function handler(req, res) {
  // Enable global CORS headers so external developers can use your link
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. Grab parameters right out of the incoming link address
  const { category, theme, key } = req.query;

  // 2. Security Check: If the link doesn't contain a key starting with kavithai_, block them!
  if (!key || !key.startsWith('kavithai_')) {
    return res.status(401).json({
      status: "error",
      message: "API key is missing or invalid. Please append your key to the link: &key=kavithai_yourname_xxxxxx"
    });
  }

  const targetCategory = category || "general";
  const customTheme = theme ? ` (${theme})` : "";

  let systemPrompt = "You are a professional classical Tamil poet. Output only the pure, raw poetry stanza lines. Do not add any greeting sentences or conversational fluff.";
  let userPrompt = "";

  switch(targetCategory) {
    case "love":
      userPrompt = `காதல் பற்றிய ஒரு அழகான தமிழ் கவிதை வரிகள் எழுதுக${customTheme}.`;
      break;
    case "friendship":
      userPrompt = `நட்பு பற்றிய ஒரு அழகான தமிழ் கவிதை வரிகள் எழுதுக${customTheme}.`;
      break;
    case "nature":
      userPrompt = `இயற்கை பற்றிய ஒரு அழகான தமிழ் கவிதை வரிகள் எழுதுக${customTheme}.`;
      break;
    case "motivation":
      userPrompt = `தன்னம்பிக்கை மற்றும் வாழ்க்கை வெற்றி பற்றிய கவிதை வரிகள் எழுதுக${customTheme}.`;
      break;
    default:
      userPrompt = `${theme || "வாழ்க்கை"} பற்றிய ஒரு அழகான தமிழ் கவிதை வரிகள் எழுதுக.`;
  }

  try {
    // 3. Connect to the AI layer using a fresh, active production key
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Using a fresh background cloud authorization token
        "Authorization": "Bearer gsk_y36wOnq2gN5b8mB868XOWGdyb3FYpQ7Z3p3tVvVx9MxL2z" 
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      return res.status(502).json({
        status: "error",
        message: "The background engine is refreshing. Please try again in a few moments."
      });
    }

    const poemResult = data.choices[0].message.content;

    // 4. Send back clean structured JSON data directly inside the browser window
    return res.status(200).json({
      status: "success",
      authorized_user: key.split('_')[1] || "developer",
      category: targetCategory,
      kavithai: poemResult
    });

  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
}