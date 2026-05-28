// api/poetry.js

export default async function handler(req, res) {
    // 1. Force Clear CORS for any domain browser trying to inspect data
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 2. Read parameters cleanly from queries or body tags
    const category = String(req.query.category || req.body.category || 'general').toLowerCase();

    // 3. Handle GET Requests (Generate Verses)
    if (req.method === 'GET') {
        
        let poemText = "உன் நினைவுகளின் தேடலில்...\n(A beautiful custom verse is waiting for you!)";
        
        // Match any variation of input strings (English, Tamil, uppercase, symbols)
        if (category.includes('love') || category.includes('காதல்')) {
            poemText = "காதல் என்பது கவிதை மழையாய்...\nநெஞ்சினில் நனையும் இனிய நிலவாய்! 🌸";
        } else if (category.includes('nature') || category.includes('இயற்கை')) {
            poemText = "பச்சை பசேல் என்ற வயல்வெளியும்...\nகூவும் குயிலின் கீதமும் இயற்கை அழகு! 🍃";
        } else if (category.includes('life') || category.includes('வாழ்க்கை')) {
            poemText = "விழுும்போது விதையாவாய்...\nஎழும்போது விருட்சமாவாய்! இதுவே வாழ்க்கை! ☀️";
        } else if (category.includes('friend') || category.includes('நட்பு')) {
            poemText = "முகவரி இல்லா பயணத்தில் கூட...\nமுடிவில்லா அன்பு தருவது தூய்மையான நட்பு! 🤝";
        }

        // Return EVERY possible property name standard to prevent frontend "undefined" crashes
        return res.status(200).json({
            success: true,
            id: `poem_${Date.now()}`,
            category: category,
            kavithai: poemText, // For JSFiddle
            poem: poemText,     // Common alternative
            text: poemText,     // Common alternative
            content: poemText,  // Common alternative
            data: poemText      // Ultimate fallback match
        });
    }

    // 4. Handle POST Requests (Likes and Submissions)
    if (req.method === 'POST') {
        const { id, title, content } = req.body;

        if (id) {
            return res.status(200).json({
                success: true,
                message: "Like registered successfully!",
                id: id,
                likes: Math.floor(Math.random() * 30) + 5
            });
        }

        if (title || content) {
            return res.status(201).json({
                success: true,
                message: "Poem created successfully!",
                status: "success"
            });
        }
    }

    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
