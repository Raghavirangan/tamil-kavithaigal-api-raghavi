
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Parse category and custom theme parameters out of the request URL
  const { category, theme } = req.query;
  const targetCategory = category || "general";
  const customTheme = theme ? ` (${theme})` : "";

  // Dynamic system instructions based on the selected type of Tamil poetry
  let systemPrompt = "You are a professional classical Tamil poet. Output only the pure, raw poetry stanza lines. Do not add any greeting sentences or conversational text.";
  let userPrompt = "";

  switch(targetCategory) {
    case "love":
      systemPrompt += " Write deep emotional love poetry (காதல் கவிதை) using metaphors like rain, eyes, or shadows.";
      userPrompt = `காதல் மற்றும் பிரிவின் ஏக்கம் பற்றிய கவிதை வரிகள் எழுதுக${customTheme}.`;
      break;
    case "friendship":
      systemPrompt += " Write touching friendship poetry (நட்பு கவிதை) highlighting trust, lifelong support, and unspoken bonds.";
      userPrompt = `உண்மையான நட்பின் இலக்கணம் மற்றும் பாசம் பற்றிய கவிதை வரிகள் எழுதுக${customTheme}.`;
      break;
    case "nature":
      systemPrompt += " Write scenic nature poetry (இயற்கை கவிதை) emphasizing the beauty of mountains, rivers, flowers, and seasons.";
      userPrompt = `இயற்கையின் அழகு, பசுமை மற்றும் அமைதி பற்றிய கவிதை வரிகள் எழுதுக${customTheme}.`;
      break;
    case "motivation":
      systemPrompt += " Write powerful inspirational and motivational poetry (நம்பிக்கை கவிதை) to build courage, perseverance, and success.";
      userPrompt = `வாழ்க்கை வெற்றி, தன்னம்பிக்கை மற்றும் விடாமுயற்சி பற்றிய எழுச்சிமிகு கவிதை வரிகள் எழுதுக${customTheme}.`;
      break;
    default:
      userPrompt = `${theme || "வாழ்க்கை"} பற்றிய ஒரு அழகான தமிழ் கவிதை வரிகள் எழுதுக.`;
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer gsk_Q48ghqmWhaYSfkeUb0JDWGdyb3FYG0Aiz2cCjRvh3YaDVsE"
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
    const poemResult = data.choices[0].message.content;

    return res.status(200).json({
      status: "success",
      category: targetCategory,
      kavithai: poemResult
    });

  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
}