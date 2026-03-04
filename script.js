document.addEventListener('DOMContentLoaded', () => {
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
                if (tab.id === `tab-${targetTab}`) {
                    tab.classList.remove('hidden');
                }
            });

            if (window.lucide) window.lucide.createIcons();
        });
    });

    // AI Sohbet
    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg ${sender}`;
        msgDiv.innerText = text;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function handleChat() {
        const text = chatInput.value.trim();
        if (text) {
            addMessage(text, 'user');
            chatInput.value = '';

            setTimeout(() => {
                const aiResponses = [
                    "Anlaşıldı. Sinirsel ağlar üzerinden sorgulama yapılıyor.",
                    "Bellek haritası güncellendi. Yeni veri girişi onaylandı.",
                    "Sistem stabilitesi korunuyor. Tüm çekirdekler aktif.",
                    "İsteğiniz neural katmanda işleniyor...",
                    "Geri bildirim alındı. Protokol 7 devreye sokuldu."
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

    // Dinamik Grafik Çekirdeği
    setInterval(() => {
        // Beyin Kapasitesi (%82 civarı)
        const brainCircle = document.querySelector('.brain-cap .circle-fill');
        if (brainCircle) {
            const drift = Math.floor(Math.random() * 4) - 2;
            const current = 82 + drift;
            brainCircle.style.strokeDasharray = `${current}, 100`;
            document.querySelector('.brain-cap .percent').innerText = `${current}%`;
        }

        // Sinir Sistemi (%24 civarı)
        const neuralCircle = document.querySelector('.neural-sys .circle-fill');
        if (neuralCircle) {
            const drift = Math.floor(Math.random() * 6) - 3;
            const current = 24 + drift;
            neuralCircle.style.strokeDasharray = `${current}, 100`;
            document.querySelector('.neural-sys .percent').innerText = `${current}%`;
        }
    }, 4000);
});
