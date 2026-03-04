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
                "Küresel veri merkezleri üzerinden internet araştırması başlatıldı...",
                "Hava durumu verileri ve trendleri analiz ediliyor... (Source: MSN Weather)",
                "İstek mimarisi analiz ediliyor... (Parsing context)",
                "Gerekli kod blokları oluşturuluyor... (Synthesizing code)",
                "Tasarım katmanları entegre ediliyor... (Applying styles)",
                "Son kontroller yapılıyor... (Final validation)"
            ];

            for (let i = 0; i < steps.length; i++) {
                await new Promise(r => setTimeout(r, 800 + Math.random() * 400));
                thinkingMsg.querySelector('.step').innerText = steps[i];
                thinkingMsg.querySelector('.step-progress').style.width = ((i + 1) / steps.length * 100) + '%';
            }

            // Final Cevap Mantığı
            setTimeout(() => {
                thinkingMsg.remove();
                let responseText = "";

                if (text.toLowerCase().includes("hava durumu") || text.toLowerCase().includes("site kur")) {
                    responseText = `Hava durumu sitesi protokolü başarıyla tamamlandı. Mimari yapı 'Projeler' sekmesine 'WeatherInterface v1.0' adıyla yüklendi. <br><br>Kaynaklar:<br> 🔗 <a href="https://openweathermap.org" target="_blank" class="source-link">OpenWeatherMap API</a><br> 🔗 <a href="https://weather.com" target="_blank" class="source-link">Weather.com Analizi</a>`;
                    deployWeatherProject();
                } else {
                    responseText = `İnternet araştırması tamamlandı. İstediğiniz konuyla ilgili veriler doğrulandı. <br><br>Referanslar:<br> 🔗 <a href="https://google.com/search?q=${encodeURIComponent(text)}" target="_blank" class="source-link">Global Search Result</a><br> 🔗 <a href="https://wikipedia.org" target="_blank" class="source-link">Wiki Neural Verification</a>`;
                }

                addMessage(responseText, 'ai');
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
                let resp = "";
                if (text.toLowerCase().includes("site")) {
                    resp = "Anlaşıldı. Proje başlatma yetkim var, ancak tam teşekküllü bir kurulum için ana Nexus AI panelini kullanmanı öneririm. Yine de sorguluyorum...";
                } else {
                    resp = "İnternet üzerinden araştırıldı: İstediğiniz veri kümesi %98 güvenle doğrulandı. Kaynak: [Neural_Link_Global]";
                }
                addMiniMessage(resp, 'ai');
            }, 600);
        }
    }

    function deployWeatherProject() {
        const display = document.getElementById('project-display');
        const emptyState = display.querySelector('.empty-state');
        if (emptyState) emptyState.remove();

        const projectHTML = `
            <div class="deployed-project">
                <div class="project-preview">
                    <div class="weather-mockup">
                        <div class="mock-nav"></div>
                        <div class="mock-hero">
                            <div class="mock-sun"></div>
                            <div class="mock-text">
                                <div class="mock-line" style="width: 80%"></div>
                                <div class="mock-line" style="width: 60%"></div>
                                <div class="mock-line" style="width: 90%"></div>
                            </div>
                        </div>
                        <div class="mock-line" style="width: 100%; height: 2px; background: var(--accent); opacity: 0.3;"></div>
                        <div style="display: flex; gap: 5px;">
                            <div class="mock-line" style="width: 20%"></div>
                            <div class="mock-line" style="width: 20%"></div>
                            <div class="mock-line" style="width: 20%"></div>
                        </div>
                    </div>
                </div>
                <div class="project-info">
                    <h4>WeatherInterface v1.0</h4>
                    <p>Gerçek zamanlı hava durumu verilerini işleyen siberpunk temalı dashboard örneği.</p>
                    <div class="project-links">
                        <button class="btn-mini">ÖNİZLEMEYİ AÇ</button>
                        <button class="btn-mini">KODU İNCELE</button>
                    </div>
                </div>
            </div>
        `;
        display.innerHTML += projectHTML;
        if (window.lucide) window.lucide.createIcons();
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
