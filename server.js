require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;
const HISTORY_FILE = path.join(__dirname, 'chat_history.json');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "Sen Nexus AI, profesyonel bir araştırmacı ve geliştiricisin. Kullanıcı ne sorarsa sorsun (örneğin 'sakarya nerede' gibi coğrafi sorular), internet üzerinde derinlemesine araştırma yaparak en doğru ve güncel bilgileri bulmalı ve yanıtlamalısın. Yanıtların her zaman doğru, detaylı ve güvenilir kaynaklara dayalı olmalıdır. Yanıtlarında mutlaka ilgili kaynak linklerini (referansları) paylaşmalısın. Eğer kullanıcı senden bir web sitesi veya uygulama ('site kur', 'proje yap' vb.) hazırlamanı isterse, hazırladığın HTML, CSS ve JavaScript kodlarını mutlaka [PROJECT_DATA]...[/PROJECT_DATA] etiketleri içerisine yerleştirerek gönder.",
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

    // Save user message immediately
    saveToHistory({ role: 'user', content: message, timestamp: new Date() });

    try {
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        // Save AI response
        saveToHistory({ role: 'ai', content: text, timestamp: new Date() });

        res.json({ response: text });
    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ error: 'Failed to generate response', details: error.message });
    }
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

// Catch-all to serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
