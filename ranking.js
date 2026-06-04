/**
 * RANKING.JS - Constrói o Painel de Classificação
 */

const leaderboard = {

    // Chama a API e desenha a tela de Ranking
    async fetchAndRender() {
        const container = document.getElementById("ranking-list-container");
        const specialCard = document.getElementById("special-expert-card"); // Card do Especialista Brasil
        
        if (!container) return;

        // Coloca mensagem de carregamento
        container.innerHTML = `<p class="loading-placeholder"><i class="fa-solid fa-spinner fa-spin"></i> Atualizando placar...</p>`;

        try {
            // Puxa os dados atualizados lá do Google Sheets (do nosso api.js)
            const rankingData = await api.getLeaderboard();

            if (!rankingData || rankingData.length === 0) {
                container.innerHTML = `<p class="loading-placeholder">Nenhum familiar cadastrado no ranking ainda.</p>`;
                return;
            }

            container.innerHTML = ""; // Limpa a tela
            this.renderList(rankingData, container);
            this.renderBrazilExpert(rankingData, specialCard);

        } catch (error) {
            console.error("Erro ao montar ranking:", error);
            container.innerHTML = `<p class="loading-placeholder">Erro ao carregar o ranking. Tente novamente.</p>`;
        }
    },

    // Desenha os usuários na tela com base na posição
    renderList(rankingData, container) {
        rankingData.forEach((user, index) => {
            const position = index + 1;
            let medal = "";
            let rowClass = "ranking-row";

            // Define visual especial para o Top 3
            if (position === 1) { medal = "🥇"; rowClass += " rank-first"; }
            else if (position === 2) { medal = "🥈"; rowClass += " rank-second"; }
            else if (position === 3) { medal = "🥉"; rowClass += " rank-third"; }
            else { medal = `<span class="rank-number">${position}º</span>`; }

            // CORREÇÃO CRÍTICA: Mapeamento seguro de propriedades (Maiúsculas vs Minúsculas)
            const nomeUser = user.Nome || user.nome || user.fullname || user.name || "Participante";
            const avatarUser = user.Avatar || user.avatar || "⚽";
            const loginUser = user.Login || user.login || user.nickname || "";
            const acertosUser = user.Acertos !== undefined ? user.Acertos : (user.acertos || 0);
            const pontosUser = user.PontosTotais !== undefined ? user.PontosTotais : (user.pontosTotais || user.pontos || 0);

            // Destaca o usuário logado para ele se achar rápido na lista
            const currentUser = JSON.parse(localStorage.getItem("bolao_user_2026"));
            if (currentUser) {
                const myLogin = currentUser.Login || currentUser.login || currentUser.nickname || "";
                if (myLogin && myLogin.toLowerCase() === loginUser.toLowerCase()) {
                    rowClass += " rank-me";
                }
            }

            // Pega o primeiro nome com segurança para exibição fluida
            const primeiroNome = nomeUser.trim().split(" ")[0];

            // Constrói a linha em HTML
            const row = document.createElement("div");
            row.className = rowClass;
            row.innerHTML = `
                <div class="rank-pos">${medal}</div>
                <div class="rank-avatar">${avatarUser}</div>
                <div class="rank-info">
                    <span class="rank-name">${primeiroNome}</span>
                    <span class="rank-exacts">${acertosUser} placares exatos</span>
                </div>
                <div class="rank-score">
                    <strong>${pontosUser}</strong> PTS
                </div>
            `;
            container.appendChild(row);
        });
    },

    // Procura na lista quem tem mais pontos nos jogos do Brasil
    renderBrazilExpert(rankingData, specialCard) {
        if (!specialCard) return;

        let maxBRPoints = -1;
        let expertUser = null;

        rankingData.forEach(user => {
            // Suporta letras maiúsculas ou minúsculas para a métrica do Brasil
            const pontosBR = user.PontosBrasil !== undefined ? user.PontosBrasil : (user.pontosBrasil || 0);
            
            if (pontosBR > maxBRPoints) {
                maxBRPoints = pontosBR;
                expertUser = user;
            }
        });

        // Se ninguém tem ponto do Brasil ainda ou a lista está zerada, esconde o card numa boa
        if (!expertUser || maxBRPoints <= 0) {
            specialCard.classList.add("hidden");
            return;
        }

        const nomeExpert = expertUser.Nome || expertUser.nome || expertUser.fullname || "Participante";
        const avatarExpert = expertUser.Avatar || expertUser.avatar || "⚽";

        specialCard.classList.remove("hidden");
        specialCard.innerHTML = `
            <div class="expert-badge">🇧🇷 Especialista da Seleção</div>
            <div class="expert-content">
                <span class="expert-avatar">${avatarExpert}</span>
                <div class="expert-details">
                    <span class="expert-name">${nomeExpert}</span>
                    <span class="expert-pts">${maxBRPoints} Pontos nos jogos do Brasil!</span>
                </div>
            </div>
        `;
    }
};