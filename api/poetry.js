
export default async function handler(req, res) {
  // 1. Absolute global CORS access definition layers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. Extract link parameters out of the incoming HTTP query line
  const { category, theme, key } = req.query;

  // 🚪 SECURITY GATE CHECKPOINT: Reject requests missing validation tokens
  if (!key || !key.startsWith('kavithai_')) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized request. Missing token or invalid credentials string. Please append your key at the end of your link: &key=YOUR_API_KEY"
    });
  }

  const targetCategory = category || "general";
  const customTheme = theme ? ` (${theme})` : "";

  let systemPrompt = "You are a professional classical Tamil poet. Output only the pure, raw poetry stanza lines. Do not add any greeting sentences or conversational fluff.";
  let userPrompt = "";

  // 3. Dynamic genre logic routing matrix
  switch(targetCategory) {
    case "love":
      userPrompt = `காதல் மற்றும் பிரிவின் ஏக்கம் பற்றிய கவிதை வரிகள் எழுதுக${customTheme}.`;
      break;
    case "friendship":
      userPrompt = `உண்மையான நட்பின் இலக்கணம் மற்றும் பாசம் பற்றிய கவிதை வரிகள் எழுதுக${customTheme}.`;
      break;
    case "nature":
      userPrompt = `இயற்கையின் அழகு, பசுமை மற்றும் அமைதி பற்றிய கவிதை வரிகள் எழுதுக${customTheme}.`;
      break;
    case "motivation":
      userPrompt = `வாழ்க்கை வெற்றி, தன்னம்பிக்கை மற்றும் விடாமுயற்சி பற்றிய எழுச்சிமிகு கவிதை வரிகள் எழுதுக${customTheme}.`;
      break;
    default:
      userPrompt = `${theme || "வாழ்க்கை"} பற்றிய ஒரு அழகான தமிழ் கவிதை வரிகள் எழுதுக.`;
  }

  try {
    // 4. Secure cloud request dispatch using your permanent personal Groq engine key
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
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

    // 🛡️ Safety check layer if the cloud pipeline responses ever flag empty
    if (!data.choices || data.choices.length === 0) {
      return res.status(502).json({
        status: "error",
        message: data.error ? data.error.message : "The backend LLM server did not produce a valid text choices packet arrays."
      });
    }

    const poemResult = data.choices[0].message.content;

    // 5. Package pristine structured JSON payloads right inside the window
    return res.status(200).json({
      status: "success",
      authorized_user: key.split('_')[1] || "developer",
      category: targetCategory,
      theme: theme || "general",
      kavithai: poemResult
    });

  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
}