/**
 * STANDINGS.JS - Cálculo e Renderização da Classificação dos Grupos
 */
const standings = {
    
    fetchAndRender() {
        const container = document.getElementById("tabelas-grupos-container");
        if (!container) return;

        // Mensagem de carregamento/processamento
        container.innerHTML = `<div style="text-align: center; padding: 20px; color: var(--text-muted);">
            <i class="fa-solid fa-spinner fa-spin"></i> Calculando classificações em tempo real...
        </div>`;

        // 1. Objeto temporário para acumular as estatísticas de cada time
        const tabelaGeral = {};

        // Verificação de segurança caso dataMatches ainda não tenha sido carregado
        if (typeof dataMatches === "undefined" || !Array.isArray(dataMatches)) {
            container.innerHTML = `<p style="text-align:center; padding:20px;">Nenhum dado de jogo encontrado.</p>`;
            return;
        }

        // 2. Processa cada jogo mapeado no seu banco de dados
        dataMatches.forEach(jogo => {
            // Pegamos as propriedades tratando variações de maiúsculas/minúsculas comuns em APIs
            const fase = jogo.Fase || jogo.fase;
            const grupo = jogo.Grupo || jogo.grupo;
            const timeCasa = jogo.TimeCasa || jogo.timeCasa;
            const timeFora = jogo.TimeFora || jogo.timeFora;
            
            // IMPORTANTE: Altere 'GolCasaRes' e 'GolForaRes' para os nomes exatos das colunas do seu banco (ex: gol_casa_oficial, etc)
            const gCasaRaw = jogo.GolCasaRes !== undefined ? jogo.GolCasaRes : jogo.golCasaRes;
            const gForaRaw = jogo.GolForaRes !== undefined ? jogo.GolForaRes : jogo.golForaRes;

            // Só processa jogos da Fase de Grupos que possuem resultado definido (não nulo/vazio)
            if (fase === "Grupos" && grupo && gCasaRaw !== undefined && gCasaRaw !== null && gCasaRaw !== "" && gForaRaw !== undefined && gForaRaw !== null && gForaRaw !== "") {
                
                const gCasa = parseInt(gCasaRaw);
                const gFora = parseInt(gForaRaw);

                // Inicializa os times no objeto acumulador se eles ainda não existirem
                if (!tabelaGeral[timeCasa]) tabelaGeral[timeCasa] = { nome: timeCasa, grupo: grupo, pts: 0, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, sg: 0 };
                if (!tabelaGeral[timeFora]) tabelaGeral[timeFora] = { nome: timeFora, grupo: grupo, pts: 0, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, sg: 0 };

                // Atualiza contagem de jogos e gols pró/contra
                tabelaGeral[timeCasa].j++;
                tabelaGeral[timeFora].j++;
                tabelaGeral[timeCasa].gp += gCasa;
                tabelaGeral[timeCasa].gc += gFora;
                tabelaGeral[timeFora].gp += gFora;
                tabelaGeral[timeFora].gc += gCasa;

                // Distribui os pontos de Vitória/Empate/Derrota (Critério base)
                if (gCasa > gFora) {
                    tabelaGeral[timeCasa].pts += 3;
                    tabelaGeral[timeCasa].v++; // +1 Vitória para o dono da casa (Critério de Desempate 2)
                    tabelaGeral[timeFora].d++;
                } else if (gCasa < gFora) {
                    tabelaGeral[timeFora].pts += 3;
                    tabelaGeral[timeFora].v++; // +1 Vitória para o visitante (Critério de Desempate 2)
                    tabelaGeral[timeCasa].d++;
                } else {
                    tabelaGeral[timeCasa].pts += 1;
                    tabelaGeral[timeFora].pts += 1;
                    tabelaGeral[timeCasa].e++;
                    tabelaGeral[timeFora].e++;
                }

                // Atualiza o Saldo de Gols (Critério de Desempate 3)
                tabelaGeral[timeCasa].sg = tabelaGeral[timeCasa].gp - tabelaGeral[timeCasa].gc;
                tabelaGeral[timeFora].sg = tabelaGeral[timeFora].gp - tabelaGeral[timeFora].gc;
            } else if (fase === "Grupos" && grupo) {
                // Se o jogo ainda não aconteceu, garante que o time apareça na tabela com 0 pontos
                if (!tabelaGeral[timeCasa]) tabelaGeral[timeCasa] = { nome: timeCasa, grupo: grupo, pts: 0, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, sg: 0 };
                if (!tabelaGeral[timeFora]) tabelaGeral[timeFora] = { nome: timeFora, grupo: grupo, pts: 0, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, sg: 0 };
            }
        });

        // 3. Separa e organiza as seleções por Letra de Grupo
        const gruposOrganizados = {};
        Object.values(tabelaGeral).forEach(time => {
            if (!gruposOrganizados[time.grupo]) gruposOrganizados[time.grupo] = [];
            gruposOrganizados[time.grupo].push(time);
        });

        // Limpa o estado visual para reinserir as tabelas prontas
        container.innerHTML = "";

        // 4. Cria a estrutura HTML de cada Grupo na Tela
        Object.keys(gruposOrganizados).sort().forEach(letraGrupo => {
            
            // Regra Oficial FIFA: Ordena por Pontos descrescente, Vitórias descrescente e Saldo de Gols descrescente
            const timesOrdenados = gruposOrganizados[letraGrupo].sort((a, b) => {
                return b.pts - a.pts || b.v - a.v || b.sg - a.sg || b.gp - a.gp;
            });

            const grupoCard = document.createElement("div");
            grupoCard.className = "grupo-tabela-card"; // Alinhado aos padrões modernos de CSS
            grupoCard.style.marginBottom = "24px";
            
            let tabelaHTML = `
                <div class="grupo-header" style="background: var(--bg-card, #1e293b); padding: 12px; border-radius: 8px 8px 0 0; border-bottom: 2px solid var(--primary, #3b82f6);">
                    <strong style="color: #fff; font-size: 1rem;">GRUPO ${letraGrupo}</strong>
                </div>
                <div style="overflow-x: auto; background: var(--bg-card, #1e293b); border-radius: 0 0 8px 8px; padding: 8px;">
                    <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 0.85rem;">
                        <thead>
                            <tr style="color: var(--text-muted, #94a3b8); border-bottom: 1px solid #334155;">
                                <th style="padding: 8px 4px; width: 40px;">Pos</th>
                                <th style="padding: 8px 4px; text-align: left;">Seleção</th>
                                <th style="padding: 8px 4px; width: 35px; color: #fff;">P</th>
                                <th style="padding: 8px 4px; width: 35px;">J</th>
                                <th style="padding: 8px 4px; width: 35px;">V</th>
                                <th style="padding: 8px 4px; width: 35px;">SG</th>
                                <th style="padding: 8px 4px; width: 35px;">GP</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            timesOrdenados.forEach((time, index) => {
                // Recupera a bandeira configurada no dataFlags (se houver)
                const flag = (typeof dataFlags !== "undefined" && dataFlags[time.nome]) ? dataFlags[time.nome] : "⚽";
                
                // Estilização sutil para o G-2 (Zona de classificação para o mata-mata)
                const trStyle = index < 2 ? "background: rgba(59, 130, 246, 0.05); border-left: 3px solid #10b981;" : "border-left: 3px solid transparent;";

                tabelaHTML += `
                    <tr style="${trStyle} border-bottom: 1px solid #1e293b; color: #e2e8f0;">
                        <td style="padding: 10px 4px; font-weight: bold; color: ${index < 2 ? '#10b981' : 'inherit'};">${index + 1}º</td>
                        <td style="padding: 10px 4px; text-align: left; font-weight: 500;">
                            <span style="margin-right: 6px;">${flag}</span>${time.nome}
                        </td>
                        <td style="padding: 10px 4px; font-weight: bold; color: #fff;">${time.pts}</td>
                        <td style="padding: 10px 4px;">${time.j}</td>
                        <td style="padding: 10px 4px;">${time.v}</td>
                        <td style="padding: 10px 4px; color: ${time.sg > 0 ? '#10b981' : time.sg < 0 ? '#ef4444' : 'inherit'}">${time.sg > 0 ? '+' + time.sg : time.sg}</td>
                        <td style="padding: 10px 4px; color: var(--text-muted);">${time.gp}</td>
                    </tr>
                `;
            });

            tabelaHTML += `</tbody></table></div>`;
            grupoCard.innerHTML = tabelaHTML;
            container.appendChild(grupoCard);
        });
    }
};