document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginOverlay = document.getElementById('login-overlay');
    const appContainer = document.getElementById('app-container');
    const accessKeyInput = document.getElementById('access-key');
    const loginBtn = document.getElementById('login-btn');
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const chatInput = document.getElementById('chat-input');
    const chatBox = document.getElementById('chat-box');
    const sendBtn = document.getElementById('send-btn');

    const ACCESS_KEY = '0000';

    // Login Logic
    function handleLogin() {
        if (accessKeyInput.value === ACCESS_KEY) {
            loginOverlay.classList.add('hidden');
            appContainer.classList.remove('hidden');
            // Play a startup sound simulation or animation if needed
            console.log("System Initialized...");
        } else {
            accessKeyInput.style.borderColor = '#ef4444';
            accessKeyInput.classList.add('shake');
            setTimeout(() => {
                accessKeyInput.classList.remove('shake');
                accessKeyInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }, 500);
            accessKeyInput.value = '';
        }
    }

    loginBtn.addEventListener('click', handleLogin);
    accessKeyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });

    // Tab Switching Logic
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');

            // Update Nav State
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Update Content State
            tabContents.forEach(tab => {
                tab.classList.remove('active');
                tab.classList.add('hidden');
                if (tab.id === `tab-${targetTab}`) {
                    tab.classList.add('active');
                    tab.classList.remove('hidden');
                }
            });
        });
    });

    // Simple Chat Simulation
    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.innerText = text;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function handleChat() {
        const text = chatInput.value.trim();
        if (text) {
            addMessage(text, 'user');
            chatInput.value = '';

            // AI Response logic
            setTimeout(() => {
                const aiResponses = [
                    "Anlaşıldı. Belleğe kaydediliyor...",
                    "Sistem metrikleri optimize ediliyor.",
                    "Kod yapısı analiz edildi. Hata bulunamadı.",
                    "Yeni bir projeye başlamak ister misiniz?",
                    "Sinir ağı durumu: Stabil."
                ];
                const randomResp = aiResponses[Math.floor(Math.random() * aiResponses.length)];
                addMessage(randomResp, 'ai');
            }, 600);
        }
    }

    sendBtn.addEventListener('click', handleChat);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });

    // Dynamic System Health Simulation
    setInterval(() => {
        const fills = document.querySelectorAll('.progress-box .fill, .status-bar .fill');
        fills.forEach(fill => {
            const currentWidth = parseInt(fill.style.width);
            const variation = Math.floor(Math.random() * 5) - 2; // -2 to +2
            let newWidth = currentWidth + variation;
            if (newWidth > 100) newWidth = 100;
            if (newWidth < 20) newWidth = 20;
            fill.style.width = `${newWidth}%`;
        });
    }, 3000);
});
