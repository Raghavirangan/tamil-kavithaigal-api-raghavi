// api/poetry.js

export default async function handler(req, res) {
    // 1. Enable CORS headers so JSFiddle can talk to your API safely
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle browser preflight CORS checks
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 2. Handle GET Requests (Fetching a poem)
    if (req.method === 'GET') {
        const { category } = req.query;

        // Default fallback poem
        let poemText = "உன் நினைவுகளின் தேடலில்...\n(This is a beautiful placeholder poem from your backend!)";
        
        if (category === 'love') {
            poemText = "காதல் என்பது கவிதை மழையாய்...\nநெஞ்சினில் நனையும் இனிய நிலவாய்! 🌸";
        } else if (category === 'nature') {
            poemText = "பச்சை பசேல் என்ற வயல்வெளியும்...\nகூவும் குயிலின் கீதமும் இயற்கை அழகு! 🍃";
        } else if (category === 'life') {
            poemText = "விழுும்போது விதையாவாய்...\nஎழும்போது விருட்சமாவாய்! இதுவே வாழ்க்கை! ☀️";
        }

        return res.status(200).json({
            id: `poem_${category || 'general'}_${Date.now()}`,
            kavithai: poemText
        });
    }

    // 3. Handle POST Requests (Liking a poem OR Submitting a poem)
    if (req.method === 'POST') {
        const { id, title, content } = req.body;

        // Case A: It's a "Like" action (frontend sends an 'id')
        if (id) {
            console.log(`Poem upvoted: ${id}`);
            const simulatedLikesCount = Math.floor(Math.random() * 45) + 5; 
            
            return res.status(200).json({
                message: "Like registered successfully!",
                id: id,
                likes: simulatedLikesCount
            });
        }

        // Case B: It's a "Create/Submit" action (frontend sends 'title' and 'content')
        if (title && content) {
            console.log("New poem submitted:", { title, content });
            
            return res.status(201).json({
                message: "Poem created successfully!",
                status: "success"
            });
        }

        return res.status(400).json({ error: "Invalid POST request data format structure." });
    }

    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
