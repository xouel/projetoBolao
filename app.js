/**
 * APP.JS - Controlador Central da UI e Sessão do Usuário
 * Código simples, modular e documentado para iniciantes.
 */

// Estado global da aplicação (dados em memória enquanto o app está aberto)
const appState = {
    currentUser: null,     // Armazena os dados do usuário logado
    selectedAvatar: "⚽",   // Avatar padrão pré-selecionado
    userGuesses: {},       // Armazena os palpites que o usuário já fez para não sumir da tela
    currentSubPhase: "R32" // Controla qual subfase do mata-mata está ativa
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
                
                // Mostra/Esconde os subfiltros do mata-mata no HTML
                const phase = e.currentTarget.getAttribute("data-phase");
                const playoffFilter = document.getElementById("subfilter-playoffs-container");
                
                if (playoffFilter) {
                    if (phase === "Mata-mata") {
                        playoffFilter.classList.remove("hidden");
                    } else {
                        playoffFilter.classList.add("hidden");
                    }
                }
                
                this.renderUserMatchesList();
            });
        });

        // Eventos para os botões de subfase do Mata-Mata (R32, R16, QF...)
        const subFilterBtns = document.querySelectorAll("#subfilter-playoffs-container .sub-filter-btn");
        subFilterBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                subFilterBtns.forEach(b => b.classList.remove("active"));
                e.currentTarget.classList.add("active");
                appState.currentSubPhase = e.currentTarget.getAttribute("data-subphase");
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
            appState.currentUser = JSON.parse(savedUser);
            this.updateHeaderAndUI();
            this.switchView("home"); 
        } else {
            this.switchView("login");
        }
    },

    // 4. Lógica de Seleção Visual do Avatar
    selectAvatar(e) {
        document.querySelectorAll(".avatar-option").forEach(opt => opt.classList.remove("active"));
        const clickedOption = e.currentTarget;
        clickedOption.classList.add("active");
        appState.selectedAvatar = clickedOption.getAttribute("data-avatar");
    },

    // 5. Processamento do Formulário de Login / Cadastro Automático
    async handleLogin(e) {
        e.preventDefault(); 
        
        const nicknameInput = document.getElementById("login-nickname");
        const nameInput = document.getElementById("login-fullname");
        const nameFieldGroup = document.getElementById("name-field-group");
        const loginMessage = document.getElementById("login-message");

        const nickname = nicknameInput.value.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");

        if (!nickname) {
            this.showLoginError("Por favor, insira um apelido válido.");
            return;
        }

        if (loginMessage) loginMessage.classList.add("hidden"); 

        try {
            const btn = document.getElementById("btn-login");
            btn.disabled = true;
            btn.innerText = "Verificando...";

            const userExists = await api.checkUserExists(nickname);

            if (userExists) {
                appState.currentUser = userExists;
                this.saveSessionAndLogin();
            } else {
                if (nameFieldGroup && nameFieldGroup.classList.contains("hidden")) {
                    nameFieldGroup.classList.remove("hidden");
                    if (nameInput) nameInput.required = true;
                    this.showModal("🏆 Primeiro Acesso!", `O apelido "@${nickname}" está disponível. Digite seu nome completo para criarmos o seu perfil no bolão!`, "✨");
                    
                    btn.disabled = false;
                    btn.innerHTML = `<span>Criar Minha Conta</span> <i class="fa-solid fa-user-plus"></i>`;
                } else {
                    const fullname = nameInput ? nameInput.value.trim() : "";
                    if (!fullname) {
                        this.showLoginError("Por favor, digite seu nome completo.");
                        btn.disabled = false;
                        return;
                    }

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
        // ✅ FIX: Garante que o avatar escolhido na tela de login é sempre persistido no objeto do usuário,
        // normalizando tudo para a chave "avatar" (minúscula) para evitar conflito de nomes.
        const avatarFinal = appState.currentUser.Avatar 
            || appState.currentUser.avatar 
            || appState.currentUser.selectedAvatar 
            || appState.selectedAvatar 
            || "⚽";
        
        appState.currentUser.avatar = avatarFinal;

        localStorage.setItem("bolao_user_2026", JSON.stringify(appState.currentUser));
        
        this.updateHeaderAndUI();
        this.showModal("⚡ Sucesso!", `Bem-vindo ao bolão da família, ${appState.currentUser.Nome || appState.currentUser.nome || 'Jogador'}!`, "⚽");
        this.switchView("home");
        
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
        const nickname = usr.Login || usr.login || usr.nickname || usr.username || "";
        const nomeReal = usr.Nome || usr.nome || usr.fullname || usr.name || "Jogador";
        const avatar = usr.Avatar || usr.avatar || usr.selectedAvatar || appState.selectedAvatar || "⚽";

        const mainHeader = document.getElementById("main-header");
        const bottomNav = document.getElementById("bottom-nav");
        
        if (mainHeader) mainHeader.classList.remove("hidden");
        if (bottomNav) bottomNav.classList.remove("hidden");

        const headerAvatar = document.getElementById("header-avatar");
        const headerUsername = document.getElementById("header-username");
        const headerPoints = document.getElementById("header-points");
        const firstFormatedName = nomeReal.split(" ")[0];

        if (headerAvatar) headerAvatar.innerText = avatar;
        if (headerUsername) headerUsername.innerText = firstFormatedName;
        if (headerPoints) headerPoints.innerText = `${usr.PontosTotais || usr.pontosTotais || 0} PTS`;

        const welcomeTitle = document.getElementById("welcome-title");
        const bannerEfficiency = document.getElementById("banner-efficiency");
        
        if (welcomeTitle) welcomeTitle.innerText = `Olá, ${firstFormatedName}! 👋`;
        if (bannerEfficiency) bannerEfficiency.innerText = `${usr.Aproveitamento || usr.aproveitamento || 0}% Aproveitamento`;
        
        const statPoints = document.getElementById("stat-user-points");
        const statExact = document.getElementById("stat-user-exact");

        if (statPoints) statPoints.innerText = usr.PontosTotais || usr.pontosTotais || 0;
        if (statExact) statExact.innerText = usr.Acertos || usr.acertos || 0;

        // ✅ FIX: Renderiza o perfil imediatamente com os dados já disponíveis
        this.renderProfileData();

        // Busca os palpites do usuário e atualiza o estado
        api.getUserGuesses(nickname).then(palpites => {
            if (palpites && Array.isArray(palpites)) {
                appState.userGuesses = {};
                palpites.forEach(p => {
                    appState.userGuesses[p.IDJogo || p.idJogo] = p;
                });
            }
        });
    },

    // 6.5 Renderiza os dados na tela de Perfil com mapeamento seguro (Maiúsculas/Minúsculas)
    renderProfileData() {
        if (!appState.currentUser) return;

        const usr = appState.currentUser;
        
        // ✅ FIX: Prioriza a chave "avatar" (minúscula) que foi normalizada no saveSessionAndLogin,
        // depois tenta as variações alternativas, e por último usa o avatar selecionado no estado global.
        const nomeReal  = usr.Nome || usr.nome || usr.fullname || usr.name || "Jogador";
        const nickname  = usr.Login || usr.login || usr.nickname || usr.username || "usuario";
        const avatar    = usr.Avatar || usr.avatar || usr.selectedAvatar || appState.selectedAvatar || "⚽";

        const profileAvatar   = document.getElementById("profile-avatar");
        const profileName     = document.getElementById("profile-fullname-display");
        const profileNickname = document.getElementById("profile-nickname-display");

        if (profileAvatar)   profileAvatar.innerText   = avatar;
        if (profileName)     profileName.innerText     = nomeReal;
        if (profileNickname) profileNickname.innerText = nickname.startsWith('@') ? nickname : `@${nickname}`;
    },

    // 7. Roteador Simples: Alterna visibilidade entre telas (SPA)
    switchView(viewId) {
        if (!appState.currentUser && viewId !== "login") {
            viewId = "login";
        }

        document.querySelectorAll(".view-section").forEach(section => {
            section.classList.add("hidden");
        });

        document.querySelectorAll(".nav-item").forEach(item => {
            item.classList.remove("active");
        });

        const targetSection = document.getElementById(`view-${viewId}`);
        if (targetSection) {
            targetSection.classList.remove("hidden");
        }

        const activeNavItem = document.querySelector(`.nav-item[data-target="${viewId}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add("active");
        }

        this.onViewOpen(viewId);
    },

    // Monitora qual tela abriu para disparar funções de desenho de outros arquivos
    onViewOpen(viewId) {
        console.log(`Tela carregada: ${viewId}`);
        
        if (viewId === "profile") {
            this.renderProfileData();
        }
        
        if (viewId === "guesses") {
            this.renderUserMatchesList();
        }

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

        if (viewId === "ranking") {
    app.renderRanking();
}
    },

    // 8. Renderiza os jogos filtrando corretamente por Fase e por Subfase do Mata-mata
    renderUserMatchesList() {
        const container = document.getElementById("container-jogos-palpites") || document.getElementById("user-matches-list");
        if (!container) return;

        container.innerHTML = "";

        const activeTabBtn = document.querySelector(".guess-tab-btn.active");
        const filtroFase = activeTabBtn ? activeTabBtn.getAttribute("data-phase") : "Grupos";

        // Filtragem inteligente cruzando a Fase principal com a Subfase selecionada
        const jogosFiltrados = dataMatches.filter(j => {
            const faseJogo = j.Fase || j.fase;
            if (filtroFase === "Grupos") {
                return faseJogo === "Grupos";
            } else {
                return faseJogo === appState.currentSubPhase;
            }
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

            const palpiteSalvo = appState.userGuesses[idJogo];
            const golCasaSalvo = palpiteSalvo ? (palpiteSalvo.GolCasa !== undefined ? palpiteSalvo.GolCasa : palpiteSalvo.golCasa) : "";
            const golForaSalvo = palpiteSalvo ? (palpiteSalvo.GolFora !== undefined ? palpiteSalvo.GolFora : palpiteSalvo.golFora) : "";

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

            const sucesso = await api.saveSingleGuess(idJogo, timeCasa, timeFora, valCasa, valFora, fase);

            if (sucesso) {
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
// 10. Busca e renderiza o ranking completo de todos os participantes
async renderRanking() {
    const container = document.getElementById("ranking-list-container");
    if (!container) return;

    container.innerHTML = `<p class="loading-placeholder">Buscando dados da nuvem...</p>`;

    try {
        const ranking = await api.getLeaderboard();

        if (!ranking || ranking.length === 0) {
            container.innerHTML = `<p class="loading-placeholder">Nenhum participante encontrado ainda.</p>`;
            return;
        }

        // Ordena por pontos (maior primeiro), com acertos como desempate
        const ordenado = ranking.sort((a, b) => {
            const ptA = parseInt(a.PontosTotais || a.pontosTotais || 0);
            const ptB = parseInt(b.PontosTotais || b.pontosTotais || 0);
            const acA = parseInt(a.Acertos || a.acertos || 0);
            const acB = parseInt(b.Acertos || b.acertos || 0);
            if (ptB !== ptA) return ptB - ptA;
            return acB - acA;
        });

        container.innerHTML = "";

        ordenado.forEach((user, index) => {
            const pos      = index + 1;
            const nome     = user.Nome || user.nome || user.fullname || "Jogador";
            const login    = user.Login || user.login || "";
            const avatar   = user.Avatar || user.avatar || "⚽";
            const pontos   = parseInt(user.PontosTotais || user.pontosTotais || 0);
            const acertos  = parseInt(user.Acertos || user.acertos || 0);

            // Medalha para os 3 primeiros
            const medalhas = ["🥇", "🥈", "🥉"];
            const posLabel = pos <= 3 ? medalhas[pos - 1] : `${pos}º`;

            // Destaca o usuário logado
            const isCurrentUser = login === (appState.currentUser?.Login || appState.currentUser?.login || "");
            const destaque = isCurrentUser ? " leaderboard-row--highlight" : "";

            const row = document.createElement("div");
            row.className = `leaderboard-row${destaque}`;
            row.innerHTML = `
                <span class="col-pos">${posLabel}</span>
                <span class="col-user">
                    <span class="user-avatar-mini">${avatar}</span>
                    <span class="user-name-rank">${nome}</span>
                </span>
                <span class="col-exact text-center">${acertos}</span>
                <span class="col-pts text-right"><strong>${pontos}</strong> pts</span>
            `;
            container.appendChild(row);
        });

        // Atualiza a posição do usuário logado na tela Home
        const currentLogin = appState.currentUser?.Login || appState.currentUser?.login || "";
        const myPos = ordenado.findIndex(u => (u.Login || u.login) === currentLogin) + 1;
        const statRank = document.getElementById("stat-user-rank");
        if (statRank && myPos > 0) statRank.innerText = `${myPos}º`;

    } catch (err) {
        console.error("Erro ao renderizar ranking:", err);
        container.innerHTML = `<p class="loading-placeholder">Erro ao carregar ranking. Tente novamente.</p>`;
    }
},
    // 10. Lógica de Desconexão (Sair da Conta)
    logout() {
        localStorage.removeItem("bolao_user_2026");
        appState.currentUser = null;
        appState.userGuesses = {};
        
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