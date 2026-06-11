/**
 * STANDINGS.JS - Cálculo e Renderização da Classificação dos Grupos
 * CORRIGIDO: Busca resultados reais do Google Sheets em vez de usar dataMatches local.
 */
const standings = {

    async fetchAndRender() {
        const container = document.getElementById("tabelas-grupos-container");
        if (!container) return;

        container.innerHTML = `<div style="text-align: center; padding: 20px; color: var(--text-muted);">
            <i class="fa-solid fa-spinner fa-spin"></i> Calculando classificações em tempo real...
        </div>`;

        try {
            // ✅ FIX 1: Busca os jogos COM resultados reais do Google Sheets
            const url = `${SCRIPT_URL}?action=getResultadosReais`;
            const resposta = await fetch(url, { method: "GET", mode: "cors", redirect: "follow" });
            const dados = await resposta.json();

            // Se a planilha estiver vazia ou der erro, cai no fallback local
            const jogosOnline = (dados.success && Array.isArray(dados.jogos) && dados.jogos.length > 0)
                ? dados.jogos
                : null;

            // Fallback: usa dataMatches local se não tiver dados online ainda
            const fonteDados = jogosOnline || (typeof dataMatches !== "undefined" ? dataMatches : []);

            if (fonteDados.length === 0) {
                container.innerHTML = `<p style="text-align:center; padding:20px;">Nenhum dado de jogo encontrado.</p>`;
                return;
            }

            this.computeAndRender(fonteDados, container);

        } catch (err) {
            console.error("Erro ao buscar standings:", err);
            // Em caso de falha na rede, usa os dados locais
            if (typeof dataMatches !== "undefined") {
                this.computeAndRender(dataMatches, container);
            } else {
                container.innerHTML = `<p style="text-align:center; padding:20px; color: #ef4444;">Erro ao carregar classificação.</p>`;
            }
        }
    },

    computeAndRender(jogos, container) {
        const tabelaGeral = {};

        jogos.forEach(jogo => {
            const fase      = jogo.Fase      || jogo.fase;
            const grupo     = jogo.Grupo     || jogo.grupo;
            const timeCasa  = jogo.TimeCasa  || jogo.timeCasa;
            const timeFora  = jogo.TimeFora  || jogo.timeFora;

            // ✅ FIX 2: Lê GolCasaReal/GolForaReal (nome correto do banco),
            // com fallback para GolCasaRes/GolForaRes por compatibilidade
            const gCasaRaw = jogo.GolCasaReal !== undefined ? jogo.GolCasaReal
                           : jogo.GolForaReal !== undefined ? jogo.GolCasaReal
                           : jogo.GolCasaRes  !== undefined ? jogo.GolCasaRes
                           : jogo.golCasaReal !== undefined ? jogo.golCasaReal
                           : jogo.golCasaRes;

            const gForaRaw = jogo.GolForaReal !== undefined ? jogo.GolForaReal
                           : jogo.GolForaRes  !== undefined ? jogo.GolForaRes
                           : jogo.golForaReal !== undefined ? jogo.golForaReal
                           : jogo.golForaRes;

            if (!fase || fase !== "Grupos" || !grupo || !timeCasa || !timeFora) return;

            // Garante que o time aparece na tabela mesmo sem resultado ainda
            if (!tabelaGeral[timeCasa]) tabelaGeral[timeCasa] = { nome: timeCasa, grupo, pts: 0, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, sg: 0 };
            if (!tabelaGeral[timeFora]) tabelaGeral[timeFora] = { nome: timeFora, grupo, pts: 0, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, sg: 0 };

            // Só computa resultado se o placar estiver preenchido
            const temResultado = gCasaRaw !== undefined && gCasaRaw !== null && gCasaRaw !== ""
                              && gForaRaw !== undefined && gForaRaw !== null && gForaRaw !== "";
            if (!temResultado) return;

            const gCasa = parseInt(gCasaRaw);
            const gFora = parseInt(gForaRaw);
            if (isNaN(gCasa) || isNaN(gFora)) return;

            tabelaGeral[timeCasa].j++;
            tabelaGeral[timeFora].j++;
            tabelaGeral[timeCasa].gp += gCasa;
            tabelaGeral[timeCasa].gc += gFora;
            tabelaGeral[timeFora].gp += gFora;
            tabelaGeral[timeFora].gc += gCasa;

            if (gCasa > gFora) {
                tabelaGeral[timeCasa].pts += 3; tabelaGeral[timeCasa].v++;
                tabelaGeral[timeFora].d++;
            } else if (gCasa < gFora) {
                tabelaGeral[timeFora].pts += 3; tabelaGeral[timeFora].v++;
                tabelaGeral[timeCasa].d++;
            } else {
                tabelaGeral[timeCasa].pts += 1; tabelaGeral[timeCasa].e++;
                tabelaGeral[timeFora].pts += 1; tabelaGeral[timeFora].e++;
            }

            tabelaGeral[timeCasa].sg = tabelaGeral[timeCasa].gp - tabelaGeral[timeCasa].gc;
            tabelaGeral[timeFora].sg = tabelaGeral[timeFora].gp - tabelaGeral[timeFora].gc;
        });

        // Agrupa por letra de grupo
        const gruposOrganizados = {};
        Object.values(tabelaGeral).forEach(time => {
            if (!gruposOrganizados[time.grupo]) gruposOrganizados[time.grupo] = [];
            gruposOrganizados[time.grupo].push(time);
        });

        container.innerHTML = "";

        Object.keys(gruposOrganizados).sort().forEach(letraGrupo => {
            const timesOrdenados = gruposOrganizados[letraGrupo].sort((a, b) =>
                b.pts - a.pts || b.v - a.v || b.sg - a.sg || b.gp - a.gp
            );

            const grupoCard = document.createElement("div");
            grupoCard.className = "grupo-tabela-card";
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
                const flag = (typeof dataFlags !== "undefined" && dataFlags[time.nome]) ? dataFlags[time.nome] : "⚽";
                const trStyle = index < 2
                    ? "background: rgba(59, 130, 246, 0.05); border-left: 3px solid #10b981;"
                    : "border-left: 3px solid transparent;";

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