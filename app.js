/**
 * APP.JS - Controlador Central da UI e Sessão do Usuário
 */

const appState = {
    currentUser: null,
    selectedAvatar: "⚽",
    userGuesses: {},
    currentSubPhase: "R32"
};

document.addEventListener("DOMContentLoaded", () => {
    app.init();
});

const app = {

    // 1. Inicialização
    init() {
        this.bindEvents();
        this.checkSession();
    },

    // 2. Event Listeners
    bindEvents() {
        const avatarOptions = document.querySelectorAll(".avatar-option");
        avatarOptions.forEach(option => {
            option.addEventListener("click", (e) => this.selectAvatar(e));
        });

        const loginForm = document.getElementById("login-form");
        if (loginForm) {
            loginForm.addEventListener("submit", (e) => this.handleLogin(e));
        }

        const navItems = document.querySelectorAll(".nav-item");
        navItems.forEach(item => {
            item.addEventListener("click", () => {
                const targetView = item.getAttribute("data-target");
                this.switchView(targetView);
            });
        });

        const guessTabs = document.querySelectorAll(".guess-tab-btn");
        guessTabs.forEach(tab => {
            tab.addEventListener("click", (e) => {
                guessTabs.forEach(b => b.classList.remove("active"));
                e.currentTarget.classList.add("active");

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

        const subFilterBtns = document.querySelectorAll("#subfilter-playoffs-container .sub-filter-btn");
        subFilterBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                subFilterBtns.forEach(b => b.classList.remove("active"));
                e.currentTarget.classList.add("active");
                appState.currentSubPhase = e.currentTarget.getAttribute("data-subphase");
                this.renderUserMatchesList();
            });
        });

        const btnLogout = document.getElementById("btn-logout");
        if (btnLogout) {
            btnLogout.addEventListener("click", () => this.logout());
        }

        const btnCloseModal = document.getElementById("modal-close-btn");
        if (btnCloseModal) {
            btnCloseModal.addEventListener("click", () => this.hideModal());
        }
    },

    // 3. Verificação de Sessão
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

    // 4. Seleção de Avatar
    selectAvatar(e) {
        document.querySelectorAll(".avatar-option").forEach(opt => opt.classList.remove("active"));
        const clickedOption = e.currentTarget;
        clickedOption.classList.add("active");
        appState.selectedAvatar = clickedOption.getAttribute("data-avatar");
    },

    // 5. Login / Cadastro
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

    // Auxiliar: Salva sessão e redireciona
    saveSessionAndLogin() {
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

    // Auxiliar: Erro de login
    showLoginError(text) {
        const loginMessage = document.getElementById("login-message");
        if (loginMessage) {
            loginMessage.innerText = text;
            loginMessage.classList.remove("hidden");
        }
    },

    // 6. Atualiza header e UI com dados do usuário
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

        const headerAvatar   = document.getElementById("header-avatar");
        const headerUsername = document.getElementById("header-username");
        const headerPoints   = document.getElementById("header-points");
        const firstFormatedName = nomeReal.split(" ")[0];

        if (headerAvatar)   headerAvatar.innerText   = avatar;
        if (headerUsername) headerUsername.innerText = firstFormatedName;
        if (headerPoints)   headerPoints.innerText   = `${usr.PontosTotais || usr.pontosTotais || 0} PTS`;

        const welcomeTitle    = document.getElementById("welcome-title");
        const bannerEfficiency = document.getElementById("banner-efficiency");

        if (welcomeTitle)     welcomeTitle.innerText     = `Olá, ${firstFormatedName}! 👋`;
        if (bannerEfficiency) bannerEfficiency.innerText = `${usr.Aproveitamento || usr.aproveitamento || 0}% Aproveitamento`;

        const statPoints = document.getElementById("stat-user-points");
        const statExact  = document.getElementById("stat-user-exact");

        if (statPoints) statPoints.innerText = usr.PontosTotais || usr.pontosTotais || 0;
        if (statExact)  statExact.innerText  = usr.Acertos || usr.acertos || 0;

        this.renderProfileData();

        api.getUserGuesses(nickname).then(palpites => {
            if (palpites && Array.isArray(palpites)) {
                appState.userGuesses = {};
                palpites.forEach(p => {
                    appState.userGuesses[p.IDJogo || p.idJogo] = p;
                });
            }
        });
    },

    // 6.5 Renderiza tela de Perfil
    renderProfileData() {
        if (!appState.currentUser) return;

        const usr = appState.currentUser;
        const nomeReal  = usr.Nome  || usr.nome  || usr.fullname || usr.name     || "Jogador";
        const nickname  = usr.Login || usr.login || usr.nickname || usr.username || "usuario";
        const avatar    = usr.Avatar || usr.avatar || usr.selectedAvatar || appState.selectedAvatar || "⚽";

        const profileAvatar   = document.getElementById("profile-avatar");
        const profileName     = document.getElementById("profile-fullname-display");
        const profileNickname = document.getElementById("profile-nickname-display");

        if (profileAvatar)   profileAvatar.innerText   = avatar;
        if (profileName)     profileName.innerText     = nomeReal;
        if (profileNickname) profileNickname.innerText = nickname.startsWith('@') ? nickname : `@${nickname}`;

        // Métricas do perfil
        const usr2 = appState.currentUser;
        const metricPts    = document.getElementById("profile-metric-total-pts");
        const metricExact  = document.getElementById("profile-metric-exact");
        const metricOutcome = document.getElementById("profile-metric-outcome");
        const metricBr     = document.getElementById("profile-metric-br-pts");

        if (metricPts)     metricPts.innerText     = usr2.PontosTotais   || usr2.pontosTotais   || 0;
        if (metricExact)   metricExact.innerText   = usr2.Acertos        || usr2.acertos        || 0;
        if (metricOutcome) metricOutcome.innerText = usr2.AcertosVencedor || usr2.acertosVencedor || 0;
        if (metricBr)      metricBr.innerText      = usr2.PontosBrasil   || usr2.pontosBrasil   || 0;
    },

    // 7. Roteador de telas
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
        if (targetSection) targetSection.classList.remove("hidden");

        const activeNavItem = document.querySelector(`.nav-item[data-target="${viewId}"]`);
        if (activeNavItem) activeNavItem.classList.add("active");

        this.onViewOpen(viewId);
    },

    // Dispara ações ao abrir cada tela
    onViewOpen(viewId) {
        console.log(`Tela carregada: ${viewId}`);

        // ✅ FIX: Home agora busca posição e mini-ranking da API
        if (viewId === "home") {
            this.updateHomeRank();
        }

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
            this.renderRanking();
        }
    },

    // ✅ NOVO: Busca posição do usuário e popula mini-ranking da Home
    async updateHomeRank() {
        try {
            const ranking = await api.getLeaderboard();
            if (!ranking || ranking.length === 0) return;

            const ordenado = ranking.sort((a, b) => {
                const ptA = parseInt(a.PontosTotais || 0);
                const ptB = parseInt(b.PontosTotais || 0);
                const acA = parseInt(a.Acertos || 0);
                const acB = parseInt(b.Acertos || 0);
                if (ptB !== ptA) return ptB - ptA;
                return acB - acA;
            });

            const currentLogin = (appState.currentUser?.Login || appState.currentUser?.login || "").toLowerCase();

            // Atualiza posição no bloco de stats
            const myPos = ordenado.findIndex(u =>
                (u.Login || u.login || "").toLowerCase() === currentLogin
            ) + 1;

            const statRank = document.getElementById("stat-user-rank");
            if (statRank && myPos > 0) statRank.innerText = `${myPos}º`;

            // Popula mini-ranking dos líderes
            const quickRankingContainer = document.getElementById("home-quick-ranking");
            if (!quickRankingContainer) return;

            quickRankingContainer.innerHTML = "";
            const top5 = ordenado.slice(0, 5);
            const medalhas = ["🥇", "🥈", "🥉"];

            top5.forEach((user, index) => {
                const nome     = user.Nome || user.nome || "Jogador";
                const avatar   = user.Avatar || user.avatar || "⚽";
                const pontos   = parseInt(user.PontosTotais || 0);
                const acertos  = parseInt(user.Acertos || 0);
                const posLabel = index < 3 ? medalhas[index] : `${index + 1}º`;
                const isMe     = (user.Login || user.login || "").toLowerCase() === currentLogin;

                const row = document.createElement("div");
                row.className = `quick-rank-row${isMe ? " quick-rank-row--highlight" : ""}`;
                row.innerHTML = `
                    <span class="qr-pos">${posLabel}</span>
                    <span class="qr-avatar">${avatar}</span>
                    <span class="qr-name">${nome.split(" ")[0]}</span>
                    <span class="qr-pts"><strong>${pontos}</strong> pts · ${acertos} exatos</span>
                `;
                quickRankingContainer.appendChild(row);
            });

        } catch (err) {
            console.error("Erro ao atualizar home rank:", err);
        }
    },

    // 8. Renderiza lista de jogos para palpites
    renderUserMatchesList() {
        const container = document.getElementById("container-jogos-palpites") || document.getElementById("user-matches-list");
        if (!container) return;

        container.innerHTML = "";

        const activeTabBtn = document.querySelector(".guess-tab-btn.active");
        const filtroFase = activeTabBtn ? activeTabBtn.getAttribute("data-phase") : "Grupos";

        const jogosFiltrados = dataMatches.filter(j => {
            const faseJogo = j.Fase || j.fase;
            if (filtroFase === "Grupos") {
                return faseJogo === "Grupos";
            } else {
                return faseJogo === appState.currentSubPhase;
            }
        });

        // ✅ Ordena por data e hora cronologicamente
        jogosFiltrados.sort((a, b) => {
            const dtA = new Date(`${a.Data}T${a.Hora}:00`);
            const dtB = new Date(`${b.Data}T${b.Hora}:00`);
            return dtA - dtB;
        });

        if (jogosFiltrados.length === 0) {
            container.innerHTML = `<p class="loading-placeholder">Nenhum jogo disponível nesta fase.</p>`;
            return;
        }

        const JOGOS_BRASIL = ["J-C1", "J-C3", "J-C5"];

        jogosFiltrados.forEach(j => {
            const idJogo   = j.IDJogo || j.id;
            const timeCasa = j.TimeCasa || j.timeCasa;
            const timeFora = j.TimeFora || j.timeFora;
            const grupo    = j.Grupo || j.grupo || "";
            const fase     = j.Fase  || j.fase;
            const ehBrasil = JOGOS_BRASIL.indexOf(idJogo) !== -1;

            // ✅ Formata data para exibição (ex: "13/06 • 19:00")
            const dataExibicao = j.Data
                ? new Date(`${j.Data}T${j.Hora}:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) + " • " + j.Hora
                : "";

            const palpiteSalvo  = appState.userGuesses[idJogo];
            const golCasaSalvo  = palpiteSalvo ? (palpiteSalvo.GolCasa !== undefined ? palpiteSalvo.GolCasa : palpiteSalvo.golCasa) : "";
            const golForaSalvo  = palpiteSalvo ? (palpiteSalvo.GolFora !== undefined ? palpiteSalvo.GolFora : palpiteSalvo.golFora) : "";

            const flagCasa = (typeof dataFlags !== "undefined" && dataFlags[timeCasa]) ? dataFlags[timeCasa] : "⚽";
            const flagFora = (typeof dataFlags !== "undefined" && dataFlags[timeFora]) ? dataFlags[timeFora] : "⚽";

            const card = document.createElement("div");
            card.className = `match-card${ehBrasil ? " match-card--brasil" : ""}`;
            card.innerHTML = `
                <div class="match-info-header">
                    <span>${dataExibicao}${grupo ? ' • GRUPO ' + grupo : ''}</span>
                    <span class="match-phase-badge${ehBrasil ? " brasil-badge" : ""}">${ehBrasil ? "🇧🇷 BRASIL" : fase}</span>
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

    // 9. Salvar palpite
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

    // 10. Ranking completo
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

            const ordenado = ranking.sort((a, b) => {
                const ptA = parseInt(a.PontosTotais || 0);
                const ptB = parseInt(b.PontosTotais || 0);
                const acA = parseInt(a.Acertos || 0);
                const acB = parseInt(b.Acertos || 0);
                if (ptB !== ptA) return ptB - ptA;
                return acB - acA;
            });

            container.innerHTML = "";

            const currentLogin = (appState.currentUser?.Login || appState.currentUser?.login || "").toLowerCase();

            ordenado.forEach((user, index) => {
                const pos      = index + 1;
                const nome     = user.Nome  || user.nome  || "Jogador";
                const login    = (user.Login || user.login || "").toLowerCase();
                const avatar   = user.Avatar || user.avatar || "⚽";
                const pontos   = parseInt(user.PontosTotais || 0);
                const acertos  = parseInt(user.Acertos || 0);

                const medalhas = ["🥇", "🥈", "🥉"];
                const posLabel = pos <= 3 ? medalhas[pos - 1] : `${pos}º`;
                const isMe     = login === currentLogin;

                const row = document.createElement("div");
                row.className = `leaderboard-row${isMe ? " leaderboard-row--highlight" : ""}`;
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

            // Atualiza posição na Home também
            const myPos = ordenado.findIndex(u =>
                (u.Login || u.login || "").toLowerCase() === currentLogin
            ) + 1;
            const statRank = document.getElementById("stat-user-rank");
            if (statRank && myPos > 0) statRank.innerText = `${myPos}º`;

        } catch (err) {
            console.error("Erro ao renderizar ranking:", err);
            container.innerHTML = `<p class="loading-placeholder">Erro ao carregar ranking. Tente novamente.</p>`;
        }
    },

    // 11. Logout
    logout() {
        localStorage.removeItem("bolao_user_2026");
        appState.currentUser = null;
        appState.userGuesses = {};

        const mainHeader   = document.getElementById("main-header");
        const bottomNav    = document.getElementById("bottom-nav");
        const nameFieldGroup = document.getElementById("name-field-group");
        const loginFullname  = document.getElementById("login-fullname");
        const loginForm      = document.getElementById("login-form");

        if (mainHeader)    mainHeader.classList.add("hidden");
        if (bottomNav)     bottomNav.classList.add("hidden");
        if (nameFieldGroup) nameFieldGroup.classList.add("hidden");
        if (loginFullname)  loginFullname.required = false;
        if (loginForm)      loginForm.reset();

        this.switchView("login");
    },

    // 12. Modal
    showModal(title, text, icon = "ℹ️") {
        const modalIcon  = document.getElementById("modal-icon");
        const modalTitle = document.getElementById("modal-title");
        const modalText  = document.getElementById("modal-text");
        const appModal   = document.getElementById("app-modal");

        if (modalIcon)  modalIcon.innerText  = icon;
        if (modalTitle) modalTitle.innerText = title;
        if (modalText)  modalText.innerText  = text;
        if (appModal)   appModal.classList.remove("hidden");
    },

    hideModal() {
        const appModal = document.getElementById("app-modal");
        if (appModal) appModal.classList.add("hidden");
    }
};