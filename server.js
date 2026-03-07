const express = require('express');
const path = require('path');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Gemini API Yapılandırması
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AI_KEY_NOT_SET");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(express.static(path.join(__dirname, './')));

// Google Sheets Veri Çekme Endpoint'i
app.get('/api/sheet-data', async (req, res) => {
    try {
        const SHEET_ID = '1gTuwKDqDEy7kqWLizWR4Vs39UVwWdCxUwNguDoth6mM';
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
        const response = await axios.get(url);

        const rows = response.data.split('\n').map(row => row.split(','));
        let total = 0;
        let rowCount = 0;

        for(let i = 1; i < rows.length; i++) {
            if (rows[i][0]) {
                const val = parseFloat(rows[i][0].replace(/[^0-9.-]+/g,""));
                if(!isNaN(val)) total += val;
                rowCount++;
            }
        }

        res.json({
            success: true,
            total: total.toFixed(2),
            rowCount: rowCount,
            message: "Nexus AI: Veriler Google Sheets üzerinden başarıyla senkronize edildi."
        });
    } catch (error) {
        res.status(500).json({ success: false, error: "Veri çekilemedi. Paylaşım ayarlarını kontrol edin." });
    }
});

// Gerçek AI Sohbet Endpoint'i (Gemini)
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        return res.json({ response: "Sistem: GEMINI_API_KEY eksik. Lütfen Render panelinden API anahtarını ekleyin." });
    }

    try {
        const prompt = `Sen siberpunk temalı bir yapay zeka asistanısın (Adın Nexus AI).
        Kullanıcının şu sorusunu kısa, öz ve teknolojik bir üslupla cevapla: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ response: response.text() });
    } catch (error) {
        console.error("AI Error:", error.message);
        res.status(500).json({ response: "Sistem hatası: Sinirsel ağlara bağlanılamadı." });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
