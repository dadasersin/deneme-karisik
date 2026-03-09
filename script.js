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
        msgDiv.innerHTML = text;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function handleChat() {
        const text = chatInput.value.trim();
        if (text) {
            addMessage(text, 'user');
            chatInput.value = '';

            const thinkingMsg = document.createElement('div');
            thinkingMsg.className = 'msg ai thinking';
            thinkingMsg.innerHTML = `<div class="status-steps">
                <span class="step active">Giriş algılandı...</span>
                <span class="step-progress"></span>
            </div>`;
            chatBox.appendChild(thinkingMsg);
            chatBox.scrollTop = chatBox.scrollHeight;

            const steps = [
                "Küresel ağlar üzerinden araştırma yapılıyor...",
                "Bulunan veriler analiz ediliyor...",
                "Kod mimarisi tasarlanıyor...",
                "Arayüz bileşenleri oluşturuluyor...",
                "Final validasyon ve derleme tamamlanıyor..."
            ];

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

                let resp = data.response || "Üzgünüm, şu an bağlantı kuramıyorum.";

                // Kaynak Linki Ekleme
                resp += `<br><br>Kaynaklar:<br> 🔗 <a href="https://google.com/search?q=${encodeURIComponent(text)}" target="_blank" class="source-link">Global Intelligence Search</a>`;

                addMessage(resp, 'ai');

                // Proje Algılama ve Dağıtım
                const projectCodeMatch = resp.match(/```html([\s\S]*?)```/);
                if (projectCodeMatch) {
                    const nameMatch = resp.match(/\[PROJECT_NAME:\s*(.*?)\]/);
                    const descMatch = resp.match(/\[PROJECT_DESC:\s*(.*?)\]/);

                    const pName = nameMatch ? nameMatch[1] : "Generated Project";
                    const pDesc = descMatch ? descMatch[1] : "AI tarafından oluşturulan dinamik bileşen.";
                    const pCode = projectCodeMatch[1];

                    deployCustomProject(pName, pDesc, pCode);
                }
            } catch (error) {
                thinkingMsg.remove();
                addMessage("Bağlantı hatası: Neural link koptu.", "ai");
            }
        }
    }

    function deployCustomProject(name, desc, html) {
        const display = document.getElementById('project-display');
        const emptyState = display.querySelector('.empty-state');
        if (emptyState) emptyState.remove();

        const pId = 'proj-' + Date.now();
        const projectHTML = `
            <div class="deployed-project">
                <div class="project-preview">
                    <div class="custom-mockup" style="background: #000; overflow: auto; height: 100%; color: #fff; font-size: 10px; padding: 10px;">
                        ${html}
                    </div>
                </div>
                <div class="project-info">
                    <h4>${name}</h4>
                    <p>${desc}</p>
                    <div class="project-links">
                        <button class="btn-mini" onclick="window.open().document.write(\`${html.replace(/'/g, "\\'")}\`)">TAM EKRAN</button>
                    </div>
                </div>
            </div>
        `;
        display.innerHTML += projectHTML;
        if (window.lucide) window.lucide.createIcons();

        // Bildirim
        addMessage(`'<strong>${name}</strong>' başarıyla oluşturuldu ve Projeler sekmesine eklendi.`, 'ai');
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
            const msgDiv = document.createElement('div');
            msgDiv.className = 'msg user';
            msgDiv.innerText = text;
            miniChatBox.appendChild(msgDiv);
            miniChatInput.value = '';

            try {
                const res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text })
                });
                const data = await res.json();
                const aiDiv = document.createElement('div');
                aiDiv.className = 'msg ai';
                aiDiv.innerHTML = data.response;
                miniChatBox.appendChild(aiDiv);
            } catch (e) {
                const errDiv = document.createElement('div');
                errDiv.className = 'msg ai';
                errDiv.innerText = "Bağlantı hatası.";
                miniChatBox.appendChild(errDiv);
            }
            miniChatBox.scrollTop = miniChatBox.scrollHeight;
        }
    }

    miniSendBtn.addEventListener('click', handleMiniChat);
    miniChatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleMiniChat();
    });

    // Dinamik Grafik Çekirdeği
    setInterval(() => {
        const brainCircle = document.querySelector('.brain-cap .circle-fill');
        if (brainCircle) {
            const current = 80 + Math.floor(Math.random() * 5);
            brainCircle.style.strokeDasharray = `${current}, 100`;
            document.querySelector('.brain-cap .percent').innerText = `${current}%`;
        }

        const neuralCircle = document.querySelector('.neural-sys .circle-fill');
        if (neuralCircle) {
            const current = 20 + Math.floor(Math.random() * 10);
            neuralCircle.style.strokeDasharray = `${current}, 100`;
            document.querySelector('.neural-sys .percent').innerText = `${current}%`;
        }
    }, 4000);
});
