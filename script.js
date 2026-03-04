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

    async function handleChat() {
        const text = chatInput.value.trim();
        if (text) {
            addMessage(text, 'user');
            chatInput.value = '';

            // İşlem aşamaları simülasyonu
            const thinkingMsg = document.createElement('div');
            thinkingMsg.className = 'msg ai thinking';
            thinkingMsg.innerHTML = `<div class="status-steps">
                <span class="step active">Giriş algılandı...</span>
                <span class="step-progress"></span>
            </div>`;
            chatBox.appendChild(thinkingMsg);
            chatBox.scrollTop = chatBox.scrollHeight;

            const steps = [
                "Anlaşıldı. Sinirsel ağlar üzerinden sorgulama yapılıyor...",
                "İstek mimarisi analiz ediliyor... (Parsing context)",
                "Gerekli kod blokları oluşturuluyor... (Synthesizing code)",
                "Tasarım katmanları entegre ediliyor... (Applying styles)",
                "Son kontroller yapılıyor... (Final validation)"
            ];

            for (let i = 0; i < steps.length; i++) {
                await new Promise(r => setTimeout(r, 1000 + Math.random() * 500));
                thinkingMsg.querySelector('.step').innerText = steps[i];
                thinkingMsg.querySelector('.step-progress').style.width = ((i + 1) / steps.length * 100) + '%';
            }

            // Final Cevap
            setTimeout(() => {
                thinkingMsg.remove();
                const aiResponses = [
                    "Hava durumu sitesi protokolü hazırlandı. Temel HTML/CSS iskeleti oluşturuldu ve sinirsel ağlara yüklendi.",
                    "İsteğiniz üzerine tüm modüller optimize edildi. Sistem stabilitesi %99.8.",
                    "Yeni bir web arayüzü kuruldu. Dosya gezgininden kontrol edebilirsiniz.",
                    "Neural katmanlar başarıyla eşleşti. Veri akışı başlıyor.",
                    "İşlem tamamlandı. Girdiğiniz parametrelere uygun bir yapı inşa edildi."
                ];
                const randomResp = aiResponses[Math.floor(Math.random() * aiResponses.length)];
                addMessage(randomResp, 'ai');
            }, 500);
        }
    }

    sendBtn.addEventListener('click', handleChat);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });

    // Yüzen Bot (Nexus Mini) Mantığı
    const floatingTrigger = document.getElementById('floating-bot-trigger');
    const miniChatWindow = document.getElementById('mini-chat-window');
    const closeMiniChat = document.getElementById('close-mini-chat');
    const miniChatInput = document.getElementById('mini-chat-input');
    const miniSendBtn = document.getElementById('mini-send-btn');
    const miniChatBox = document.getElementById('mini-chat-box');

    floatingTrigger.addEventListener('click', () => {
        miniChatWindow.classList.toggle('hidden');
        if (!miniChatWindow.classList.contains('hidden')) {
            miniChatInput.focus();
        }
        if (window.lucide) window.lucide.createIcons();
    });

    closeMiniChat.addEventListener('click', () => {
        miniChatWindow.classList.add('hidden');
    });

    function addMiniMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg ${sender}`;
        msgDiv.innerText = text;
        miniChatBox.appendChild(msgDiv);
        miniChatBox.scrollTop = miniChatBox.scrollHeight;
    }

    function handleMiniChat() {
        const text = miniChatInput.value.trim();
        if (text) {
            addMiniMessage(text, 'user');
            miniChatInput.value = '';

            setTimeout(() => {
                const responses = [
                    "Sistem her an yanınızda. Ne yapmamı istersiniz?",
                    "Sinirsel arayüz her zaman aktif. Dinliyorum.",
                    "Dosyalarınızı kontrol ettim, her şey yolunda görünüyor.",
                    "Anlaşıldı. Bu konu hakkında detaylı bir rapor hazırlayabilirim.",
                    "Siberpunk evrenine hoş geldiniz. Size nasıl rehberlik edebilirim?"
                ];
                const resp = responses[Math.floor(Math.random() * responses.length)];
                addMiniMessage(resp, 'ai');
            }, 600);
        }
    }

    miniSendBtn.addEventListener('click', handleMiniChat);
    miniChatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleMiniChat();
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
