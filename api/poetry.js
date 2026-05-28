// api/poetry.js

export default async function handler(req, res) {
    // 1. Unlocked CORS Policy (Allows both your Vercel Sandbox and JSFiddle)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 2. Capture incoming parameters from both GET queries and POST bodies safely
    const category = req.query.category || req.body.category || 'general';

    // 3. Handle GET Requests (Generating Poems)
    if (req.method === 'GET') {
        
        // Dynamic fallback poems array dictionary
        let poemText = "உன் நினைவுகளின் தேடலில்...\n(A beautiful custom verse is waiting for you!)";
        
        // Normalizing category names to match both English choices and Tamil choices from your UI
        if (category.includes('love') || category.includes('காதல்')) {
            poemText = "காதல் என்பது கவிதை மழையாய்...\nநெஞ்சினில் நனையும் இனிய நிலவாய்! 🌸";
        } else if (category.includes('nature') || category.includes('இயற்கை')) {
            poemText = "பச்சை பசேல் என்ற வயல்வெளியும்...\nகூவும் குயிலின் கீதமும் இயற்கை அழகு! 🍃";
        } else if (category.includes('life') || category.includes('வாழ்க்கை')) {
            poemText = "விழுும்போது விதையாவாய்...\nஎழும்போது விருட்சமாவாய்! இதுவே வாழ்க்கை! ☀️";
        } else if (category.includes('Friendship') || category.includes('நட்பு')) {
            poemText = "முகவரி இல்லா பயணத்தில் கூட...\nமுடிவில்லா அன்பு தருவது தூய்மையான நட்பு! 🤝";
        }

        // Return the exact structure your sandbox UI expects
        return res.status(200).json({
            id: `poem_${Date.now()}`,
            category: category,
            kavithai: poemText,
            poem: poemText // Duplicate fallback key just in case your UI looks for data.poem
        });
    }

    // 4. Handle POST Requests (Likes and Custom Creations)
    if (req.method === 'POST') {
        const { id, title, content } = req.body;

        // Sandbox/JSFiddle Like Operation Counter Handler (FIXED Math.floor here)
        if (id) {
            return res.status(200).json({
                message: "Like registered successfully!",
                id: id,
                likes: Math.floor(Math.random() * 30) + 5
            });
        }

        // Custom Submission Handler
        if (title || content) {
            return res.status(201).json({
                message: "Poem created successfully!",
                status: "success"
            });
        }
    }

    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
