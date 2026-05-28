// api/poetry.js

export default async function handler(req, res) {
    // Enable CORS so your frontend applications can read this data without errors
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Array of beautiful Tamil poems
    const tamilPoems = [
        "காதல் என்பது கவிதை மழையாய்...\nநெஞ்சினில் நனையும் இனிய நிலவாய்! 🌸",
        "பச்சை பசேல் என்ற வயல்வெளியும்...\nகூவும் குயிலின் கீதமும் இயற்கை அழகு! 🍃",
        "விழுும்போது விதையாவாய்...\nஎழும்போது விருட்சமாவாய்! இதுவே வாழ்க்கை! ☀️",
        "முகவரி இல்லா பயணத்தில் கூட...\nமுடிவில்லா அன்பு தருவது தூய்மையான நட்பு! 🤝",
        "தாய்மொழி என்பது உயிர் போன்றது...\nதமிழ்மொழி பேசுவது பெருமை தருவது! ✍️"
    ];

    // Pick a random poem from the array above
    const randomIndex = Math.floor(Math.random() * tamilPoems.length);
    const selectedPoem = tamilPoems[randomIndex];

    // Return the response with every key format your UI might look for
    return res.status(200).json({
        success: true,
        id: `poem_${Date.now()}`,
        kavithai: selectedPoem, // For JSFiddle string mapping
        poem: selectedPoem,     // Fallback for Sandbox interface
        text: selectedPoem      // Fallback
    });
}
