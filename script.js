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
            loginOverlay.style.opacity = '0';
            setTimeout(() => {
                loginOverlay.classList.add('hidden');
                appContainer.classList.remove('hidden');
                // Re-initialize Lucide for the newly visible content
                if (window.lucide) window.lucide.createIcons();
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

    // Tab Switching Logic
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');

            // Update Nav State
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Update Content State
            tabContents.forEach(tab => {
                tab.classList.add('hidden');
                if (tab.id === `tab-${targetTab}`) {
                    tab.classList.remove('hidden');
                    // Special case for chat scroll
                    if (targetTab === 'nexus') {
                        chatBox.scrollTop = chatBox.scrollHeight;
                    }
                }
            });

            if (window.lucide) window.lucide.createIcons();
        });
    });

    // Chat Simulation
    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.innerText = text;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function handleChat() {
        const text = chatInput.value.trim();
        if (text) {
            addMessage(text, 'user');
            chatInput.value = '';

            // Simulated AI processing
            setTimeout(() => {
                const aiResponses = [
                    "Neural katmanlar optimize ediliyor. İşlem başarılı.",
                    "Bellek haritası güncellendi. Yeni veri girişi algılandı.",
                    "Sistem stabilitesi %98 seviyesinde. Tüm modüller aktif.",
                    "Geliştirici modu: Aktif. Kod blokları analiz ediliyor.",
                    "Bağlantı protokolü güvenli. İşleme devam edebilirsiniz."
                ];
                const randomResp = aiResponses[Math.floor(Math.random() * aiResponses.length)];
                addMessage(randomResp, 'ai');
            }, 800);
        }
    }

    sendBtn.addEventListener('click', handleChat);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });

    // Dynamic Updates for Progress Charts
    setInterval(() => {
        const circle = document.querySelector('.circle-fill');
        if (circle) {
            const randomPercent = Math.floor(Math.random() * 10) + 80; // 80-90%
            circle.setAttribute('stroke-dasharray', `${randomPercent}, 100`);
            const percentageText = document.querySelector('.percentage');
            if (percentageText) percentageText.innerText = `${randomPercent}%`;
        }

        const mFills = document.querySelectorAll('.m-fill');
        mFills.forEach(fill => {
            const base = parseInt(fill.style.width);
            const variation = Math.floor(Math.random() * 4) - 2;
            fill.style.width = Math.min(100, Math.max(70, base + variation)) + '%';
        });
    }, 3000);
});
