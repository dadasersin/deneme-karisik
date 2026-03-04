const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Statik dosyaları servis et (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, './')));

// Tüm istekleri index.html'e yönlendir
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
