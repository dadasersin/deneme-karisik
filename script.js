document.addEventListener('DOMContentLoaded', () => {
    // DOM Elementleri
    const loginOverlay = document.getElementById('login-overlay');
    const appContainer = document.getElementById('app-container');
    const loginBtn = document.getElementById('login-btn');
    const accessKeyInput = document.getElementById('access-key');
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const chatInput = document.getElementById('chat-input');
    const chatBox = document.getElementById('chat-box');
    const sendBtn = document.getElementById('send-btn');

    const ACCESS_KEY = '0000';

    // Giriş Kontrolü
    function handleLogin() {
        if (accessKeyInput.value === ACCESS_KEY) {
            loginOverlay.style.opacity = '0';
            setTimeout(() => {
                loginOverlay.classList.add('hidden');
                appContainer.classList.remove('hidden');
            }, 500);
        } else {
            accessKeyInput.style.borderColor = '#ef4444';
            setTimeout(() => {
                accessKeyInput.style.borderColor = 'rgba(16, 185, 129, 0.2)';
            }, 500);
            accessKeyInput.value = '';
        }
    }

    loginBtn.addEventListener('click', handleLogin);
    accessKeyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });

    // Sekme Yönetimi
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            tabContents.forEach(tab => {
                tab.classList.add('hidden');
                if (tab.id === `tab-${targetTab}`) tab.classList.remove('hidden');
            });
            if (window.lucide) window.lucide.createIcons();
        });
    });

    // AI Sohbet Fonksiyonu
    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg ${sender}`;
        msgDiv.innerHTML = text; // HTML desteği için innerHTML
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function handleChat() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatInput.value = '';

        // Google Sheets Komutu Kontrolü
        if (text.toLowerCase().includes("hesapla") || text.toLowerCase().includes("tablo")) {
            fetchSheetData();
            return;
        }

        // Düşünme Simülasyonu
        const thinkingMsg = document.createElement('div');
        thinkingMsg.className = 'msg ai thinking';
        thinkingMsg.innerHTML = `<div class="status-steps">
            <span class="step active">Sinirsel ağlara bağlanılıyor...</span>
            <span class="step-progress"></span>
        </div>`;
        chatBox.appendChild(thinkingMsg);
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            const data = await response.json();
            thinkingMsg.remove();
            addMessage(data.response, 'ai');
        } catch (err) {
            thinkingMsg.remove();
            addMessage("Hata: Sinirsel bağlantı koptu. API anahtarınızı kontrol edin.", "ai");
        }
    }

    async function fetchSheetData() {
        addMessage("Google Sheets verileri analiz ediliyor...", "ai");
        try {
            const response = await fetch('/api/sheet-data');
            const data = await response.json();
            if (data.success) {
                addMessage(`Analiz Tamamlandı:<br>- Toplam Satır: ${data.rowCount}<br>- Hesaplanan Değer: ${data.total}<br>${data.message}`, "ai");
            } else {
                addMessage("Hata: " + data.error, "ai");
            }
        } catch (err) {
            addMessage("Sunucuyla iletişim kurulamadı.", "ai");
        }
    }

    sendBtn.addEventListener('click', handleChat);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });

    // Dinamik Grafik Çekirdeği
    setInterval(() => {
        const brainCircle = document.querySelector('.brain-cap .circle-fill');
        if (brainCircle) {
            const current = 82 + Math.floor(Math.random() * 4) - 2;
            brainCircle.style.strokeDasharray = `${current}, 100`;
            document.querySelector('.brain-cap .percent').innerText = `${current}%`;
        }
    }, 4000);
});
