require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;
const HISTORY_FILE = path.join(__dirname, 'chat_history.json');

// Mock Skills Data (Adapted from OpenClaw concept)
const skills = [
    {
        id: 'coding-assistant',
        name: 'Coding Assistant',
        description: 'Yüksek kaliteli kod üretimi ve hata ayıklama uzmanı.',
        icon: 'code',
        badge: 'ACTIVE'
    },
    {
        id: 'research-pro',
        name: 'Research Pro',
        description: 'Derinlemesine internet araştırması ve veri sentezi.',
        icon: 'search',
        badge: 'ACTIVE'
    },
    {
        id: 'system-architect',
        name: 'System Architect',
        description: 'Karmaşık sistem mimarileri ve optimizasyon.',
        icon: 'layers',
        badge: 'ACTIVE'
    },
    {
        id: 'security-guard',
        name: 'Security Guard',
        description: 'Güvenlik analizi ve açık tarama protokolleri.',
        icon: 'shield',
        badge: 'STANDBY'
    }
];

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "Sen Nexus AI, profesyonel bir araştırmacı ve geliştiricisin. Sana entegre edilmiş 'Coding Assistant', 'Research Pro' ve 'System Architect' gibi becerilere (skills) sahipsin. Kullanıcı ne sorarsa sorsun, bu becerilerini kullanarak internet üzerinde derinlemesine araştırma yapmalı ve en doğru yanıtı vermelisin. Yanıtlarında mutlaka ilgili kaynak linklerini paylaşmalısın. Eğer bir web sitesi veya uygulama hazırlaman istenirse, HTML/CSS/JS kodlarını [PROJECT_DATA]...[/PROJECT_DATA] etiketleri içerisine yerleştir.",
    tools: [
        {
            googleSearchRetrieval: {},
        },
    ],
});

app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

// AI Chat Endpoint
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    saveToHistory({ role: 'user', content: message, timestamp: new Date() });

    try {
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        saveToHistory({ role: 'ai', content: text, timestamp: new Date() });
        res.json({ response: text });
    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ error: 'Failed to generate response', details: error.message });
    }
});

// Skills Endpoint
app.get('/api/skills', (req, res) => {
    res.json(skills);
});

// History Endpoint
app.get('/api/history', (req, res) => {
    try {
        if (!fs.existsSync(HISTORY_FILE)) {
            return res.json([]);
        }
        const data = fs.readFileSync(HISTORY_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

function saveToHistory(entry) {
    try {
        let history = [];
        if (fs.existsSync(HISTORY_FILE)) {
            const data = fs.readFileSync(HISTORY_FILE, 'utf8');
            history = JSON.parse(data);
        }
        history.push(entry);
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
    } catch (error) {
        console.error('History Save Error:', error);
    }
}

// Google Sheets Export Endpoint
app.get('/export', async (req, res) => {
    try {
        const spreadsheetId = '1gTuwKDqDEy7kqWLizWR4Vs39UVwWdCxUwNguDoth6mM';
        const format = req.query.format || 'csv';
        const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=${format}`;

        const response = await axios.get(url);
        res.send(response.data);
    } catch (error) {
        console.error('Export Error:', error);
        res.status(500).send('Error fetching data from Google Sheets');
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
