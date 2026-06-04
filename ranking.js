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

            // Destaca o usuário logado para ele se achar rápido na lista
            const currentUser = JSON.parse(localStorage.getItem("bolao_user_2026"));
            if (currentUser && currentUser.Login === user.Login) {
                rowClass += " rank-me";
            }

            // Constrói a linha em HTML
            const row = document.createElement("div");
            row.className = rowClass;
            row.innerHTML = `
                <div class="rank-pos">${medal}</div>
                <div class="rank-avatar">${user.Avatar}</div>
                <div class="rank-info">
                    <span class="rank-name">${user.Nome.split(" ")[0]}</span>
                    <span class="rank-exacts">${user.Acertos} placares exatos</span>
                </div>
                <div class="rank-score">
                    <strong>${user.PontosTotais}</strong> PTS
                </div>
            `;
            container.appendChild(row);
        });
    },

    // Procura na lista quem tem mais pontos nos jogos do Brasil
    renderBrazilExpert(rankingData, specialCard) {
        if (!specialCard) return;

        // Encontra o maior valor de "PontosBrasil"
        let maxBRPoints = -1;
        let expertUser = null;

        rankingData.forEach(user => {
            if (user.PontosBrasil > maxBRPoints) {
                maxBRPoints = user.PontosBrasil;
                expertUser = user;
            }
        });

        // Se ninguém tem ponto do Brasil ainda, oculta o card
        if (!expertUser || maxBRPoints === 0) {
            specialCard.classList.add("hidden");
            return;
        }

        specialCard.classList.remove("hidden");
        specialCard.innerHTML = `
            <div class="expert-badge">🇧🇷 Especialista da Seleção</div>
            <div class="expert-content">
                <span class="expert-avatar">${expertUser.Avatar}</span>
                <div class="expert-details">
                    <span class="expert-name">${expertUser.Nome}</span>
                    <span class="expert-pts">${maxBRPoints} Pontos nos jogos do Brasil!</span>
                </div>
            </div>
        `;
    }
};