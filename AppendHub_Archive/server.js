const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// --- DETECTIVE WORK: LIST MODELS ---
async function listModels() {
    const apiKey = process.env.API_KEY;
    try {
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await resp.json();
        console.log("📋 YOUR KEY CAN USE THESE MODELS:");
        if (data.models) {
            data.models.forEach(m => console.log(`   - ${m.name.replace('models/', '')}`));
        } else {
            console.log("❌ Could not find any models. Check your API Key!");
        }
    } catch (e) {
        console.log("❌ Error checking models:", e.message);
    }
}
listModels();
// ------------------------------------

app.post('/api/tutor', async (req, res) => {
    try {
        const { query } = req.body;
        const apiKey = process.env.API_KEY;
        
        // We are trying the most basic 'gemini-pro' here
const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: query }] }] })
        });

        const data = await response.json();
        console.log("🤖 Gemini says:", JSON.stringify(data, null, 2));
        res.json(data);
    } catch (error) {
        console.error("💥 Server Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(3000, () => console.log('✅ Server is alive at http://localhost:3000'));