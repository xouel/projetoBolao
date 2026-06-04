/**
 * APP.JS - Controlador Central da UI e Sessão do Usuário
 * Código simples, modular e documentado para iniciantes.
 */

// Estado global da aplicação (dados em memória enquanto o app está aberto)
const appState = {
    currentUser: null,     // Armazena os dados do usuário logado
    selectedAvatar: "⚽",   // Avatar padrão pré-selecionado
    userGuesses: {}        // Armazena os palpites que o usuário já fez para não sumir da tela
};

// Executa automaticamente quando a página HTML termina de carregar
document.addEventListener("DOMContentLoaded", () => {
    app.init();
});

// Objeto principal que agrupa as funções do aplicativo
const app = {
    
    // 1. Inicialização do sistema
    init() {
        this.bindEvents();
        this.checkSession();
    },

    // 2. Mapeamento de cliques e interações (Event Listeners)
    bindEvents() {
        // Seleção de Avatar
        const avatarOptions = document.querySelectorAll(".avatar-option");
        avatarOptions.forEach(option => {
            option.addEventListener("click", (e) => this.selectAvatar(e));
        });

        // Envio do Formulário de Login
        const loginForm = document.getElementById("login-form");
        if (loginForm) {
            loginForm.addEventListener("submit", (e) => this.handleLogin(e));
        }

        // Cliques na Barra de Navegação Inferior (Menu Mobile)
        const navItems = document.querySelectorAll(".nav-item");
        navItems.forEach(item => {
            item.addEventListener("click", () => {
                const targetView = item.getAttribute("data-target");
                this.switchView(targetView);
            });
        });

        // Filtros de abas na tela de palpites (Fase de Grupos vs Mata-Mata)
        const guessTabs = document.querySelectorAll(".guess-tab-btn");
        guessTabs.forEach(tab => {
            tab.addEventListener("click", (e) => {
                guessTabs.forEach(b => b.classList.remove("active"));
                e.currentTarget.classList.add("active");
                this.renderUserMatchesList();
            });
        });

        // Botão de Logout (Sair da Conta)
        const btnLogout = document.getElementById("btn-logout");
        if (btnLogout) {
            btnLogout.addEventListener("click", () => this.logout());
        }

        // Fechar modal de alerta
        const btnCloseModal = document.getElementById("modal-close-btn");
        if (btnCloseModal) {
            btnCloseModal.addEventListener("click", () => this.hideModal());
        }
    },

    // 3. Verifica se o usuário já logou anteriormente (Persistência de Sessão)
    checkSession() {
        const savedUser = localStorage.getItem("bolao_user_2026");
        
        if (savedUser) {
            // Se encontrou no cache, carrega os dados e pula o login
            appState.currentUser = JSON.parse(savedUser);
            this.updateHeaderAndUI();
            this.switchView("home"); // Vai direto para a Home
        } else {
            // Se não tem sessão ativa, garante que está vendo a tela de login
            this.switchView("login");
        }
    },

    // 4. Lógica de Seleção Visual do Avatar
    selectAvatar(e) {
        // Remove a classe 'active' de todos os quadradinhos
        document.querySelectorAll(".avatar-option").forEach(opt => opt.classList.remove("active"));
        
        // Adiciona 'active' apenas no que foi clicado
        const clickedOption = e.currentTarget;
        clickedOption.classList.add("active");
        
        // Atualiza o avatar escolhido no estado global
        appState.selectedAvatar = clickedOption.getAttribute("data-avatar");
    },

    // 5. Processamento do Formulário de Login / Cadastro Automático
    async handleLogin(e) {
        e.preventDefault(); // Impede a página de recarregar
        
        const nicknameInput = document.getElementById("login-nickname");
        const nameInput = document.getElementById("login-fullname");
        const nameFieldGroup = document.getElementById("name-field-group");
        const loginMessage = document.getElementById("login-message");

        // Tratamento do nickname: remove espaços e coloca tudo em letras minúsculas
        const nickname = nicknameInput.value.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");

        if (!nickname) {
            this.showLoginError("Por favor, insira um apelido válido.");
            return;
        }

        if (loginMessage) loginMessage.classList.add("hidden"); // Limpa mensagens antigas

        try {
            // Bloqueia o botão para evitar cliques duplos informando o usuário
            const btn = document.getElementById("btn-login");
            btn.disabled = true;
            btn.innerText = "Verificando...";

            // Consulta nossa API externa para checar se este jogador já existe
            const userExists = await api.checkUserExists(nickname);

            if (userExists) {
                // CASO 1: USUÁRIO JÁ EXISTE -> Faz Login Direto
                appState.currentUser = userExists;
                this.saveSessionAndLogin();
            } else {
                // CASO 2: USUÁRIO NÃO EXISTE -> Modo Cadastro Automático
                if (nameFieldGroup && nameFieldGroup.classList.contains("hidden")) {
                    nameFieldGroup.classList.remove("hidden");
                    if (nameInput) nameInput.required = true;
                    this.showModal("🏆 Primeiro Acesso!", `O apelido "@${nickname}" está disponível. Digite seu nome completo para criarmos o seu perfil no bolão!`, "✨");
                    
                    btn.disabled = false;
                    btn.innerHTML = `<span>Criar Minha Conta</span> <i class="fa-solid fa-user-plus"></i>`;
                } else {
                    // Se o campo de nome já estava visível e preenchido, faz o registro
                    const fullname = nameInput ? nameInput.value.trim() : "";
                    if (!fullname) {
                        this.showLoginError("Por favor, digite seu nome completo.");
                        btn.disabled = false;
                        return;
                    }

                    // Envia para a API criar o novo usuário
                    const newUser = await api.registerNewUser(nickname, fullname, appState.selectedAvatar);
                    appState.currentUser = newUser;
                    this.saveSessionAndLogin();
                }
            }
        } catch (error) {
            console.error(error);
            this.showLoginError("Erro de conexão. Tente novamente.");
            const btn = document.getElementById("btn-login");
            if (btn) btn.disabled = false;
        }
    },

    // Auxiliar: Salva dados no dispositivo e muda de tela
    saveSessionAndLogin() {
        localStorage.setItem("bolao_user_2026", JSON.stringify(appState.currentUser));
        this.updateHeaderAndUI();
        this.showModal("⚡ Sucesso!", `Bem-vindo ao bolão da família, ${appState.currentUser.Nome || appState.currentUser.nome}!`, "⚽");
        this.switchView("home");
        
        // Restaura botão de login caso deslogue futuramente
        const btn = document.getElementById("btn-login");
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<span>Entrar no Bolão</span> <i class="fa-solid fa-arrow-right"></i>`;
        }
    },

    // Auxiliar: Exibe erro na caixa de login
    showLoginError(text) {
        const loginMessage = document.getElementById("login-message");
        if (loginMessage) {
            loginMessage.innerText = text;
            loginMessage.classList.remove("hidden");
        }
    },

    // 6. Atualiza elementos globais da interface com os dados do usuário logado
    updateHeaderAndUI() {
        if (!appState.currentUser) return;

        const usr = appState.currentUser;
        const nickname = usr.Login || usr.login || "";
        const nomeReal = usr.Nome || usr.nome || "Jogador";
        const avatar = usr.Avatar || usr.avatar || "⚽";

        // Ativa cabeçalho e menu de navegação inferior ocultados no login
        const mainHeader = document.getElementById("main-header");
        const bottomNav = document.getElementById("bottom-nav");
        
        if (mainHeader) mainHeader.classList.remove("hidden");
        if (bottomNav) bottomNav.classList.remove("hidden");

        // Atualiza elementos do Header
        const headerAvatar = document.getElementById("header-avatar");
        const headerUsername = document.getElementById("header-username");
        const headerPoints = document.getElementById("header-points");
        const firstFormatedName = nomeReal.split(" ")[0];

        if (headerAvatar) headerAvatar.innerText = avatar;
        if (headerUsername) headerUsername.innerText = firstFormatedName;
        if (headerPoints) headerPoints.innerText = `${usr.PontosTotais || usr.pontosTotais || 0} PTS`;

        // Atualiza textos da tela Home de Boas-Vindas
        const welcomeTitle = document.getElementById("welcome-title");
        const bannerEfficiency = document.getElementById("banner-efficiency");
        
        if (welcomeTitle) welcomeTitle.innerText = `Olá, ${firstFormatedName}! 👋`;
        if (bannerEfficiency) bannerEfficiency.innerText = `${usr.Aproveitamento || usr.aproveitamento || 0}% Aproveitamento`;
        
        // Atualiza caixas de estatísticas da Home
        const statPoints = document.getElementById("stat-user-points");
        const statExact = document.getElementById("stat-user-exact");

        if (statPoints) statPoints.innerText = usr.PontosTotais || usr.pontosTotais || 0;
        if (statExact) statExact.innerText = usr.Acertos || usr.acertos || 0;

        // Puxa em segundo plano os palpites antigos do usuário para preencher os inputs automaticamente
        api.getUserGuesses(nickname).then(palpites => {
            if (palpites && Array.isArray(palpites)) {
                appState.userGuesses = {};
                palpites.forEach(p => {
                    appState.userGuesses[p.IDJogo || p.idJogo] = p;
                });
            }
        });
    },

    // 7. Roteador Simples: Alterna visibilidade entre telas (SPA)
    switchView(viewId) {
        // Correção de segurança preventiva no topo da função
        if (!appState.currentUser && viewId !== "login") {
            viewId = "login";
        }

        // 1. Oculta todas as seções de view
        document.querySelectorAll(".view-section").forEach(section => {
            section.classList.add("hidden");
        });

        // 2. Remove o estado ativo de todos os botões do menu inferior
        document.querySelectorAll(".nav-item").forEach(item => {
            item.classList.remove("active");
        });

        // 3. Mostra a seção desejada
        const targetSection = document.getElementById(`view-${viewId}`);
        if (targetSection) {
            targetSection.classList.remove("hidden");
        }

        // 4. Destaca o botão correspondente no menu inferior
        const activeNavItem = document.querySelector(`.nav-item[data-target="${viewId}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add("active");
        }

        // Dispara ganchos específicos ao abrir telas
        this.onViewOpen(viewId);
    },

    // Monitora qual tela abriu para disparar funções de desenho de outros arquivos
    onViewOpen(viewId) {
        console.log(`Tela carregada: ${viewId}`);
        
        if (viewId === "profile") {
            if (typeof renderProfileData === "function") renderProfileData(); 
        }
        
        // Se abrir a tela de palpites, renderiza os jogos imediatamente
        if (viewId === "guesses") {
            this.renderUserMatchesList();
        }

        // Puxa e renderiza a classificação dinâmica dos grupos da FIFA
        if (viewId === "standings") {
            if (typeof standings !== "undefined" && typeof standings.fetchAndRender === "function") {
                standings.fetchAndRender();
            } else if (typeof computeAndRenderGroups === "function") {
                computeAndRenderGroups();
            }
        }

        if (viewId === "admin" && typeof adminState !== "undefined" && adminState.isAuthed) {
            if (typeof admin !== "undefined" && typeof admin.fetchMatchesForAdmin === "function") {
                admin.fetchMatchesForAdmin();
            }
        }

        // Sincronizado dinamicamente com o id do data-target="ranking" do seu HTML
        if (viewId === "ranking") {
            if (typeof leaderboard !== "undefined" && typeof leaderboard.fetchAndRender === "function") {
                leaderboard.fetchAndRender();
            } else if (typeof ranking !== "undefined" && typeof ranking.fetchAndRender === "function") {
                ranking.fetchAndRender();
            }
        }
    },

    // 8. FUNÇÃO EXCLUSIVA: Renderiza os jogos na tela de Palpites do Usuário
    renderUserMatchesList() {
        const container = document.getElementById("container-jogos-palpites") || document.getElementById("user-matches-list");
        if (!container) return;

        container.innerHTML = "";

        // Descobre qual aba de fase está ativa na tela (Grupos ou Mata-mata)
        const activeTabBtn = document.querySelector(".guess-tab-btn.active");
        const filtroFase = activeTabBtn ? activeTabBtn.getAttribute("data-phase") : "Grupos";

        // Filtra os jogos com base na aba clicada
        const jogosFiltrados = dataMatches.filter(j => {
            if (filtroFase === "Grupos") return j.Fase === "Grupos";
            return j.Fase !== "Grupos";
        });

        if (jogosFiltrados.length === 0) {
            container.innerHTML = `<p class="loading-placeholder">Nenhum jogo disponível nesta fase.</p>`;
            return;
        }

        jogosFiltrados.forEach(j => {
            const idJogo = j.IDJogo || j.id;
            const timeCasa = j.TimeCasa || j.timeCasa;
            const timeFora = j.TimeFora || j.timeFora;
            const grupo = j.Grupo || j.grupo || "";
            const fase = j.Fase || j.fase;

            // Busca se o usuário já salvou algum palpite anterior desse jogo
            const palpiteSalvo = appState.userGuesses[idJogo];
            const golCasaSalvo = palpiteSalvo ? (palpiteSalvo.GolCasa !== undefined ? palpiteSalvo.GolCasa : palpiteSalvo.golCasa) : "";
            const golForaSalvo = palpiteSalvo ? (palpiteSalvo.GolFora !== undefined ? palpiteSalvo.GolFora : palpiteSalvo.golFora) : "";

            // Coleta os emojis das bandeiras do dataFlags do seu arquivo data.js
            const flagCasa = (typeof dataFlags !== "undefined" && dataFlags[timeCasa]) ? dataFlags[timeCasa] : "⚽";
            const flagFora = (typeof dataFlags !== "undefined" && dataFlags[timeFora]) ? dataFlags[timeFora] : "⚽";

            const card = document.createElement("div");
            card.className = "match-card";
            card.innerHTML = `
                <div class="match-info-header">
                    <span>CÓDIGO: ${idJogo} ${grupo ? '• GRUPO ' + grupo : ''}</span>
                    <span class="match-phase-badge">${fase}</span>
                </div>
                <div class="match-clash-container">
                    <div class="team-side">
                        <span class="flag-emoji">${flagCasa}</span>
                        <span class="team-name">${timeCasa}</span>
                    </div>
                    <div class="score-inputs-core">
                        <input type="number" class="input-score" id="user-casa-${idJogo}" value="${golCasaSalvo}" min="0" placeholder="0">
                        <span class="score-divider">×</span>
                        <input type="number" class="input-score" id="user-fora-${idJogo}" value="${golForaSalvo}" min="0" placeholder="0">
                    </div>
                    <div class="team-side">
                        <span class="team-name">${timeFora}</span>
                        <span class="flag-emoji">${flagFora}</span>
                    </div>
                </div>
                <div class="match-card-footer">
                    <button class="btn-save-guess" onclick="app.salvarPalpite('${idJogo}', '${timeCasa}', '${timeFora}', '${fase}')">
                        <i class="fa-solid fa-floppy-disk"></i> Salvar Palpite
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    },

    // 9. FUNÇÃO EXCLUSIVA: Disparada ao clicar no botão "Salvar Palpite"
    async salvarPalpite(idJogo, timeCasa, timeFora, fase) {
        const inputCasa = document.getElementById(`user-casa-${idJogo}`);
        const inputFora = document.getElementById(`user-fora-${idJogo}`);

        if (!inputCasa || !inputFora) return;

        const valCasa = inputCasa.value.trim();
        const valFora = inputFora.value.trim();

        if (valCasa === "" || valFora === "") {
            this.showModal("Aviso", "Por favor, defina um placar completo antes de salvar.", "⚠️");
            return;
        }

        try {
            this.showModal("Gravando", "Enviando seu palpite para o banco de dados da família...", "⏳");

            // Envia diretamente para as regras de gravação do api.js
            const sucesso = await api.saveSingleGuess(idJogo, timeCasa, timeFora, valCasa, valFora, fase);

            if (sucesso) {
                // Guarda localmente na memória para não sumir da tela ao mudar de aba
                appState.userGuesses[idJogo] = {
                    IDJogo: idJogo,
                    GolCasa: parseInt(valCasa),
                    GolFora: parseInt(valFora)
                };
                this.showModal("Salvo!", "Seu palpite foi gravado com sucesso! Boa sorte!", "🎉");
            }
        } catch (err) {
            console.error(err);
            this.showModal("Erro", "Ocorreu uma falha ao tentar salvar o seu palpite online.", "❌");
        }
    },

    // 10. Lógica de Desconexão (Sair da Conta)
    logout() {
        localStorage.removeItem("bolao_user_2026");
        appState.currentUser = null;
        appState.userGuesses = {};
        
        // Oculta componentes de uso exclusivo interno
        const mainHeader = document.getElementById("main-header");
        const bottomNav = document.getElementById("bottom-nav");
        const nameFieldGroup = document.getElementById("name-field-group");
        const loginFullname = document.getElementById("login-fullname");
        const loginForm = document.getElementById("login-form");

        if (mainHeader) mainHeader.classList.add("hidden");
        if (bottomNav) bottomNav.classList.add("hidden");
        if (nameFieldGroup) nameFieldGroup.classList.add("hidden");
        if (loginFullname) loginFullname.required = false;
        if (loginForm) loginForm.reset();

        this.switchView("login");
    },

    // 11. Componente de Alerta/Modal Customizado Moderno
    showModal(title, text, icon = "ℹ️") {
        const modalIcon = document.getElementById("modal-icon");
        const modalTitle = document.getElementById("modal-title");
        const modalText = document.getElementById("modal-text");
        const appModal = document.getElementById("app-modal");

        if (modalIcon) modalIcon.innerText = icon;
        if (modalTitle) modalTitle.innerText = title;
        if (modalText) modalText.innerText = text;
        if (appModal) appModal.classList.remove("hidden");
    },

    hideModal() {
        const appModal = document.getElementById("app-modal");
        if (appModal) appModal.classList.add("hidden");
    }
};