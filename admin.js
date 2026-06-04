/**
 * ADMIN.JS - Controlador das Funções do Painel Administrativo
 */

// Removido o const duplicado para resolver o erro de SyntaxError
// O SCRIPT_URL será herdado diretamente do seu arquivo api.js

const adminState = {
    isAuthed: false,
    jogosCarregados: []
};
// Vincula os eventos do painel administrativo assim que o script carrega
document.addEventListener("DOMContentLoaded", () => {
    admin.bindAdminEvents();
});

const admin = {
    
    bindAdminEvents() {
        // Botão de Autenticação do Admin
        const btnAuth = document.getElementById("btn-auth-admin");
        if (btnAuth) {
            btnAuth.addEventListener("click", () => this.handleAuthentication());
        }

        // Troca de abas internas no menu admin (Inserir Resultados vs Ações de Sistema)
        const tabs = document.querySelectorAll(".admin-tab-btn");
        tabs.forEach(tab => {
            tab.addEventListener("click", (e) => {
                document.querySelectorAll(".admin-tab-btn").forEach(b => b.classList.remove("active"));
                document.querySelectorAll(".admin-subview").forEach(v => v.classList.add("hidden"));
                
                const activeTab = e.currentTarget;
                activeTab.classList.add("active");
                
                const targetId = activeTab.getAttribute("data-admin-target");
                const targetView = document.getElementById(targetId);
                if (targetView) targetView.classList.remove("hidden");
            });
        });

        // Filtro de mudança de Fase na visualização do Admin
        const selectFase = document.getElementById("admin-phase-select");
        if (selectFase) {
            selectFase.addEventListener("change", () => this.renderAdminMatchesList());
        }

        // Botão Perigoso: Limpar Tudo
        const btnWipe = document.getElementById("btn-admin-wipe-all");
        if (btnWipe) {
            btnWipe.addEventListener("click", () => this.wipeSystemEntirely());
        }
    },

    // Executa a validação da senha do Admin no Google Sheets
    async handleAuthentication() {
        const passwordInput = document.getElementById("admin-password");
        const msgError = document.getElementById("admin-auth-message");
        if (!passwordInput) return;

        const senha = passwordInput.value.trim();
        if (!senha) return;

        try {
            if (msgError) msgError.classList.add("hidden");
            const btnAuth = document.getElementById("btn-auth-admin");
            if (btnAuth) btnAuth.innerText = "Acessando...";

            const url = `${SCRIPT_URL}?action=verificarAdmin&senha=${encodeURIComponent(senha)}`;
            const resposta = await fetch(url);
            const dados = await resposta.json();

            if (dados.success && dados.autorizado) {
                adminState.isAuthed = true;
                
                const authBox = document.getElementById("admin-auth-box");
                const dashboardArea = document.getElementById("admin-dashboard-area");
                
                if (authBox) authBox.classList.add("hidden");
                if (dashboardArea) dashboardArea.classList.remove("hidden");
                
                await this.fetchMatchesForAdmin();
            } else {
                if (msgError) {
                    msgError.innerText = "Senha incorreta! Tente novamente.";
                    msgError.classList.remove("hidden");
                }
                if (btnAuth) btnAuth.innerText = "Verificar Credenciais";
            }
        } catch (error) {
            console.error(error);
            if (msgError) {
                msgError.innerText = "Falha ao conectar na API do Google.";
                msgError.classList.remove("hidden");
            }
            const btnAuth = document.getElementById("btn-auth-admin");
            if (btnAuth) btnAuth.innerText = "Verificar Credenciais";
        }
    },

    // Puxa os jogos salvos no banco para a memória do Admin
    async fetchMatchesForAdmin() {
        try {
            const url = `${SCRIPT_URL}?action=getResultadosReais`;
            const resposta = await fetch(url);
            const dados = await resposta.json();

            if (dados.success) {
                adminState.jogosCarregados = dados.jogos;
                
                if (dados.jogos.length === 0 && typeof dataMatches !== "undefined") {
                    await this.seedInitialMatchesToDatabase();
                } else {
                    this.renderAdminMatchesList();
                }
            }
        } catch (err) {
            console.error("Erro ao puxar tabela administrativa:", err);
        }
    },

    // Força a inserção em lote de todos os jogos fixos da Copa na planilha se ela estiver vazia
    async seedInitialMatchesToDatabase() {
        try {
            if (typeof app !== "undefined") {
                app.showModal("Carga Inicial", "Alimentando o Google Sheets com os 72 jogos oficiais da Fase de Grupos. Aguarde...", "⚙️");
            }

            // Tradução Inteligente: Adapta o formato Maiúsculo do seu data.js para o padrão minúsculo exigido pela API
            const jogosFormatados = dataMatches.map(j => ({
                id: j.IDJogo || j.id,
                fase: j.Fase || j.fase,
                grupo: j.Grupo || j.grupo || "",
                timeCasa: j.TimeCasa || j.timeCasa,
                timeFora: j.TimeFora || j.timeFora
            }));
            
            const resposta = await fetch(SCRIPT_URL, {
                method: "POST",
                mode: "cors",
                redirect: "follow",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify({
                    action: "inicializarTabelaJogos",
                    jogos: jogosFormatados
                })
            });

            const dados = await resposta.json();
            if (dados.success) {
                if (typeof app !== "undefined") {
                    app.showModal("Sucesso", "Tabela de jogos gerada online com sucesso!", "✅");
                }
                this.fetchMatchesForAdmin();
            }
        } catch (e) {
            console.error("Erro na carga de inicialização:", e);
        }
    },

    // Renderiza os cards de partidas com caixas de texto para o admin digitar o placar real
    renderAdminMatchesList() {
        const container = document.getElementById("admin-matches-list");
        if (!container) return;

        const selectPhase = document.getElementById("admin-phase-select");
        const filtroFase = selectPhase ? selectPhase.value : "groups";
        
        container.innerHTML = "";

        const jogosFiltrados = adminState.jogosCarregados.filter(j => {
            if (filtroFase === "groups") return j.Fase === "Grupos";
            return j.Fase === filtroFase;
        });

        if (jogosFiltrados.length === 0) {
            container.innerHTML = `<p class="loading-placeholder">Nenhum jogo cadastrado para esta fase ainda.</p>`;
            return;
        }

        jogosFiltrados.forEach(jogo => {
            const card = document.createElement("div");
            const statusStyle = jogo.StatusJogo ? jogo.StatusJogo.toLowerCase() : "pendente";
            card.className = `match-card ${statusStyle}`;
            
            card.innerHTML = `
                <div class="match-info-header">
                    <span>CÓDIGO: ${jogo.IDJogo} • GRUPO ${jogo.Grupo || "N/A"}</span>
                    <span class="match-status-badge ${statusStyle}">${jogo.StatusJogo || "Pendente"}</span>
                </div>
                <div class="match-clash-container">
                    <div class="team-side">
                        <span class="team-name">${jogo.TimeCasa}</span>
                    </div>
                    <div class="score-inputs-core">
                        <input type="number" class="input-score" id="adm-casa-${jogo.IDJogo}" value="${jogo.GolCasaReal !== undefined ? jogo.GolCasaReal : ""}" min="0" placeholder="0">
                        <span class="score-divider">×</span>
                        <input type="number" class="input-score" id="adm-fora-${jogo.IDJogo}" value="${jogo.GolForaReal !== undefined ? jogo.GolForaReal : ""}" min="0" placeholder="0">
                    </div>
                    <div class="team-side">
                        <span class="team-name">${jogo.TimeFora}</span>
                    </div>
                </div>
                <div class="match-card-footer">
                    <button class="btn-save-guess" onclick="admin.saveOfficialResult('${jogo.IDJogo}')">
                        <i class="fa-solid fa-square-check"></i> Encerrar e Computar Pontos
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    },

    // Envia o placar definitivo/real digitado para a API processar
    async saveOfficialResult(idJogo) {
        const inputCasa = document.getElementById(`adm-casa-${idJogo}`);
        const inputFora = document.getElementById(`adm-fora-${idJogo}`);
        
        const golCasa = inputCasa ? inputCasa.value.trim() : "";
        const golFora = inputFora ? inputFora.value.trim() : "";

        if (golCasa === "" || golFora === "") {
            if (typeof app !== "undefined") {
                app.showModal("Atenção", "Por favor, digite o número de gols de ambas as equipes antes de encerrar.", "⚠️");
            }
            return;
        }

        try {
            if (typeof app !== "undefined") {
                app.showModal("Salvando", "Computando placar oficial e recalculando o ranking de toda a família...", "⏳");
            }

            const resposta = await fetch(SCRIPT_URL, {
                method: "POST",
                mode: "cors",
                redirect: "follow",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify({
                    action: "atualizarResultadoReal",
                    idJogo: idJogo,
                    golCasaReal: parseInt(golCasa),
                    golForaReal: parseInt(golFora)
                })
            });

            const dados = await resposta.json();
            if (dados.success) {
                if (typeof app !== "undefined") {
                    app.showModal("Excelente!", "Placar oficial gravado! As pontuações de todos os perfis já foram atualizadas.", "🎉");
                }
                this.fetchMatchesForAdmin();
                if (typeof app !== "undefined") app.checkSession();
            }
        } catch (err) {
            console.error(err);
            if (typeof app !== "undefined") {
                app.showModal("Erro", "Não foi possível salvar o placar oficial no servidor.", "❌");
            }
        }
    },

    // Função Crítica: Reseta o banco de dados online
    async wipeSystemEntirely() {
        const confirmacao = confirm("ATENÇÃO FAMÍLIA!\nVocê tem certeza absoluta de que deseja apagar TODOS os usuários cadastrados, TODOS os palpites dados e zerar o campeonato?");
        if (!confirmacao) return;

        try {
            if (typeof app !== "undefined") {
                app.showModal("Limpando", "Acessando o Google Sheets para apagar dados e redefinir o bolão...", "⚡");
            }

            const resposta = await fetch(SCRIPT_URL, {
                method: "POST",
                mode: "cors",
                redirect: "follow",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify({ action: "limparSistemaCompleto" })
            });

            const dados = await resposta.json();
            if (dados.success) {
                if (typeof app !== "undefined") {
                    app.showModal("Bolão Resetado", "O sistema foi limpo com sucesso! Os celulares de todos serão desconectados.", "🧼");
                }
                setTimeout(() => {
                    if (typeof app !== "undefined") app.logout();
                }, 1500);
            }
        } catch (e) {
            if (typeof app !== "undefined") {
                app.showModal("Erro", "Falha crítica de comunicação para reset de dados.", "❌");
            }
        }
    }
};