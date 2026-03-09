require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

// AI Chat Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();
        res.json({ response: text });
    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

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
