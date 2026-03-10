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
    const historyList = document.querySelector('.memory-section .item-list');

    const ACCESS_KEY = '0000';

    // Giriş Kontrolü
    function handleLogin() {
        if (accessKeyInput.value === ACCESS_KEY) {
            loginOverlay.style.opacity = '0';
            setTimeout(() => {
                loginOverlay.classList.add('hidden');
                appContainer.classList.remove('hidden');
                loadHistory(); // Login sonrası geçmişi yükle
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

            if (targetTab === 'nexus') {
                chatBox.scrollTop = chatBox.scrollHeight;
            }

            if (window.lucide) window.lucide.createIcons();
        });
    });

    // AI Sohbet
    function addMessage(text, sender, container = chatBox) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg ${sender}`;

        // Markdown benzeri linkleri HTML'e çevir
        let formattedText = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" class="source-link">$1</a>');
        // URL'leri otomatik linkle
        formattedText = formattedText.replace(/(?<!href=")(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" class="source-link">$1</a>');

        msgDiv.innerHTML = formattedText;
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    }

    function processAIResponse(responseText, isMini = false) {
        const container = isMini ? miniChatBox : chatBox;

        // Project Data parsing
        const projectMatch = responseText.match(/\[PROJECT_DATA\]([\s\S]*?)\[\/PROJECT_DATA\]/);
        if (projectMatch) {
            const projectCode = projectMatch[1];
            responseText = responseText.replace(/\[PROJECT_DATA\][\s\S]*?\[\/PROJECT_DATA\]/, '<div class="deployment-notice"><i data-lucide="package-check"></i> <span>Sistem: Proje başarıyla oluşturuldu ve Projeler sekmesine eklendi.</span></div>');
            deployProject(projectCode);
        }

        addMessage(responseText, 'ai', container);
        loadHistory(); // Yanıt sonrası listeyi güncelle
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
                "İstek mimarisi analiz ediliyor... (Parsing context)",
                "Gerekli veri blokları oluşturuluyor... (Synthesizing data)",
                "Son kontroller yapılıyor... (Final validation)"
            ];

            // AI isteğini paralel başlat
            const aiPromise = fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            }).then(res => res.json());

            for (let i = 0; i < steps.length; i++) {
                await new Promise(r => setTimeout(r, 600 + Math.random() * 300));
                thinkingMsg.querySelector('.step').innerText = steps[i];
                thinkingMsg.querySelector('.step-progress').style.width = ((i + 1) / steps.length * 100) + '%';
            }

            try {
                const data = await aiPromise;
                thinkingMsg.remove();
                processAIResponse(data.response || "Üzgünüm, şu an yanıt oluşturamıyorum. Lütfen internet bağlantınızı veya API anahtarınızı kontrol edin.");
            } catch (error) {
                thinkingMsg.remove();
                addMessage("Sistem hatası: Sinirsel bağlantı kesildi.", "ai");
            }
        }
    }

    async function loadHistory() {
        try {
            const res = await fetch('/api/history');
            const history = await res.json();

            if (historyList) {
                historyList.innerHTML = '';
                // Sadece kullanıcı mesajlarını 'hafıza' olarak göster (son 5)
                const recentUserMsgs = history.filter(h => h.role === 'user').slice(-5).reverse();

                recentUserMsgs.forEach(msg => {
                    const item = document.createElement('div');
                    item.className = 'item';
                    item.innerHTML = `<i data-lucide="message-circle"></i> ${msg.content.substring(0, 20)}... <i data-lucide="chevron-right"></i>`;
                    historyList.appendChild(item);
                });

                if (window.lucide) window.lucide.createIcons();
            }
        } catch (e) {
            console.error("History load error", e);
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

    async function handleMiniChat() {
        const text = miniChatInput.value.trim();
        if (text) {
            addMessage(text, 'user', miniChatBox);
            miniChatInput.value = '';

            try {
                const res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text })
                });
                const data = await res.json();
                processAIResponse(data.response || "Bağlantı hatası.", true);
            } catch (e) {
                addMessage("Nexus bağlantısı başarısız.", 'ai', miniChatBox);
            }
        }
    }

    function deployProject(code) {
        const display = document.getElementById('project-display');
        const emptyState = display.querySelector('.empty-state');
        if (emptyState) emptyState.remove();

        const projectId = 'project-' + Date.now();
        const projectHTML = `
            <div class="deployed-project">
                <div class="project-preview">
                    <div class="code-preview-box">
                        <i data-lucide="code"></i>
                        <span>AI Tarafından Oluşturulan Modül</span>
                    </div>
                </div>
                <div class="project-info">
                    <h4>Proje ${projectId}</h4>
                    <p>Dinamik olarak sentezlenen ve yayına hazırlanan bileşen.</p>
                    <div class="project-links">
                        <button class="btn-mini preview-btn" data-id="${projectId}">ÖNİZLEME</button>
                        <button class="btn-mini code-btn" data-id="${projectId}">KODU AL</button>
                    </div>
                </div>
            </div>
        `;

        const projectElement = document.createElement('div');
        projectElement.innerHTML = projectHTML;
        const actualElement = projectElement.firstElementChild;
        display.appendChild(actualElement);

        actualElement.querySelector('.preview-btn').onclick = () => {
            const win = window.open("", "_blank");
            win.document.write(code);
            win.document.close();
        };

        actualElement.querySelector('.code-btn').onclick = () => {
            const blob = new Blob([code], {type: 'text/html'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `nexus-${projectId}.html`;
            a.click();
        };

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
