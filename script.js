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
    const memoryList = document.getElementById('memory-list');
    const skillsDisplay = document.getElementById('skills-display');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');

    const ACCESS_KEY = '0000';

    // Giriş Kontrolü
    function handleLogin() {
        if (accessKeyInput.value === ACCESS_KEY) {
            loginOverlay.style.opacity = '0';
            setTimeout(() => {
                loginOverlay.classList.add('hidden');
                appContainer.classList.remove('hidden');
                initApp();
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

    function initApp() {
        loadHistory();
        loadSkills();
        initTerminal();
        if (window.lucide) window.lucide.createIcons();
    }

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

            if (targetTab === 'terminal') {
                terminalInput.focus();
            }

            if (window.lucide) window.lucide.createIcons();
        });
    });

    // AI Sohbet
    function addMessage(text, sender, container = chatBox) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg ${sender}`;

        let formattedText = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" class="source-link">$1</a>');
        formattedText = formattedText.replace(/(?<!href=")(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" class="source-link">$1</a>');

        msgDiv.innerHTML = formattedText;
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
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
                "Anlaşıldı. Sinirsel ağlar üzerinden sorgulama yapılıyor...",
                "Beceriler (Skills) katmanı analiz ediliyor...",
                "Küresel veri merkezleri üzerinden araştırma başlatıldı...",
                "Gerekli veri blokları oluşturuluyor... (Synthesizing data)",
                "Son kontroller yapılıyor... (Final validation)"
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
                addTerminalLine(`[SYSTEM] Step ${i+1}: ${steps[i]}`, 'success');
            }

            try {
                const data = await aiPromise;
                thinkingMsg.remove();
                processAIResponse(data.response || "Üzgünüm, şu an yanıt oluşturamıyorum. Lütfen internet bağlantınızı veya API anahtarınızı kontrol edin.");
            } catch (error) {
                thinkingMsg.remove();
                addMessage("Sistem hatası: Sinirsel bağlantı kesildi.", "ai");
                addTerminalLine(`[ERROR] AI connection failed: ${error.message}`, 'error');
            }
        }
    }

    function processAIResponse(responseText) {
        const projectMatch = responseText.match(/\[PROJECT_DATA\]([\s\S]*?)\[\/PROJECT_DATA\]/);
        if (projectMatch) {
            const projectCode = projectMatch[1];
            responseText = responseText.replace(/\[PROJECT_DATA\][\s\S]*?\[\/PROJECT_DATA\]/, '<div class="deployment-notice"><i data-lucide="package-check"></i> <span>Sistem: Proje başarıyla oluşturuldu ve Projeler sekmesine eklendi.</span></div>');
            deployProject(projectCode);
            addTerminalLine("[SYSTEM] Project data detected and deployed to 'Projects' tab.", 'success');
        }

        addMessage(responseText, 'ai');
        loadHistory();
    }

    async function loadHistory() {
        try {
            const res = await fetch('/api/history');
            const history = await res.json();

            if (memoryList) {
                memoryList.innerHTML = '';
                const recentUserMsgs = history.filter(h => h.role === 'user').slice(-5).reverse();

                if (recentUserMsgs.length === 0) {
                    memoryList.innerHTML = '<div class="empty-memory">Veri bekleniyor...</div>';
                } else {
                    recentUserMsgs.forEach(msg => {
                        const item = document.createElement('div');
                        item.className = 'item';
                        item.innerHTML = `<i data-lucide="message-circle"></i> ${msg.content.substring(0, 30)}${msg.content.length > 30 ? '...' : ''} <i data-lucide="chevron-right"></i>`;
                        memoryList.appendChild(item);
                    });
                }
                if (window.lucide) window.lucide.createIcons();
            }
        } catch (e) {
            console.error("History load error", e);
        }
    }

    async function loadSkills() {
        try {
            const res = await fetch('/api/skills');
            const skills = await res.json();

            if (skillsDisplay) {
                skillsDisplay.innerHTML = '';
                                skills.forEach(skill => {
                    const card = document.createElement('div');
                    card.className = 'skill-card';
                    const badgeClass = skill.badge === 'ACTIVE' ? '' : 'standby';
                    card.innerHTML = `
                        <div class="skill-badge status-chip ${badgeClass}">${skill.badge}</div>
                        <div class="skill-icon"><i data-lucide="${skill.icon}"></i></div>
                        <h4>${skill.emoji} ${skill.name}</h4>
                        <p>${skill.description}</p>
                        <div style="display:flex; justify-content: space-between; align-items: center;">
                            <span class="status-pill">${skill.category}</span>
                            <button class="btn-mini">YÖNET</button>
                        </div>
                    `;
                    skillsDisplay.appendChild(card);
                });
                if (window.lucide) window.lucide.createIcons();
            }
        } catch (e) {
            console.error("Skills load error", e);
        }
    }

    // Terminal Mantığı
    function initTerminal() {
        addTerminalLine("[INFO] Neural Terminal v2.0 initialized.");
        addTerminalLine(`[INFO] Current user: YÖNETİCİ @ ${new Date().toLocaleTimeString()}`);

        terminalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const cmd = terminalInput.value.trim();
                if (cmd) {
                    addTerminalLine(`nexus@system:~$ ${cmd}`);
                    processCommand(cmd);
                    terminalInput.value = '';
                }
            }
        });
    }

    function addTerminalLine(text, type = '') {
        const line = document.createElement('div');
        line.className = `t-line ${type}`;
        line.innerText = text;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

                function processCommand(cmd) {
        const c = cmd.toLowerCase();
        if (c === 'clear') {
            terminalOutput.innerHTML = '';
        } else if (c === 'status') {
            addTerminalLine('--- NEXUS SYSTEM STATUS ---', 'success');
            addTerminalLine('CORE VERSION: 3.0.0-FLASH-PREVIEW');
            addTerminalLine('CONNECTION: SECURE_NEURAL_LINK');
            addTerminalLine('CPU LOAD: ' + (10 + Math.floor(Math.random() * 15)) + '%', 'success');
            addTerminalLine('MEMORY: ' + (2.4 + Math.random()).toFixed(2) + 'GB / 16GB');
            addTerminalLine('UPTIME: 14d 05h 22m');
        } else if (c === 'sysinfo') {
            addTerminalLine('OS: NexusOS v10.4.0');
            addTerminalLine('KERNEL: xnu-10002.41.9~6');
            addTerminalLine('HOST: NEXUS-TERMINAL-01');
            addTerminalLine('SKILLS_ENGINE: LOADED');
        } else if (c === 'help') {
            addTerminalLine('Available commands:');
            addTerminalLine('  status   - Show system health and load');
            addTerminalLine('  sysinfo  - Display detailed system information');
            addTerminalLine('  skills   - List all active and standby skills');
            addTerminalLine('  clear    - Clear terminal screen');
            addTerminalLine('  help     - Display this menu');
        } else if (c === 'skills') {
            addTerminalLine('Fetching skills report...', 'warning');
            fetch('/api/skills').then(r => r.json()).then(skills => {
                skills.forEach(s => {
                    const statusClass = s.badge === 'ACTIVE' ? 'success' : 'warning';
                    addTerminalLine('[' + s.badge + '] ' + s.name + ' - ' + s.status, statusClass);
                });
            });
        } else {
            addTerminalLine('[ERROR] Unknown command: ' + cmd, 'error');
            addTerminalLine("Type 'help' for available commands.");
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

    sendBtn.addEventListener('click', handleChat);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });

    // Mini Chat
    const floatingTrigger = document.getElementById('floating-bot-trigger');
    const miniChatWindow = document.getElementById('mini-chat-window');
    const closeMiniChat = document.getElementById('close-mini-chat');
    const miniChatInput = document.getElementById('mini-chat-input');
    const miniSendBtn = document.getElementById('mini-send-btn');
    const miniChatBox = document.getElementById('mini-chat-box');

    floatingTrigger.addEventListener('click', () => {
        miniChatWindow.classList.toggle('hidden');
        if (!miniChatWindow.classList.contains('hidden')) miniChatInput.focus();
        if (window.lucide) window.lucide.createIcons();
    });

    closeMiniChat.addEventListener('click', () => miniChatWindow.classList.add('hidden'));

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
                addMessage(data.response || "Bağlantı hatası.", 'ai', miniChatBox);
            } catch (e) {
                addMessage("Nexus bağlantısı başarısız.", 'ai', miniChatBox);
            }
        }
    }

    miniSendBtn.addEventListener('click', handleMiniChat);
    miniChatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleMiniChat();
    });

    // Graphs
    setInterval(() => {
        const brainCircle = document.querySelector('.brain-cap .circle-fill');
        if (brainCircle) {
            const current = 82 + (Math.floor(Math.random() * 4) - 2);
            brainCircle.style.strokeDasharray = `${current}, 100`;
            document.querySelector('.brain-cap .percent').innerText = `${current}%`;
        }
        const neuralCircle = document.querySelector('.neural-sys .circle-fill');
        if (neuralCircle) {
            const current = 24 + (Math.floor(Math.random() * 6) - 3);
            neuralCircle.style.strokeDasharray = `${current}, 100`;
            document.querySelector('.neural-sys .percent').innerText = `${current}%`;
        }
    }, 4000);
});
