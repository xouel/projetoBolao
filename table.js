/**
 * TABLES.JS - Processamento da Classificação e Chaveamento de Mata-Mata
 */

const tournamentCore = {
    // 1. Processa todos os jogos e gera as tabelas dos grupos estruturadas
    computeGroupsClassification(jogosReais) {
        const grupos = {};

        // Inicializa a estrutura de dados de cada seleção
        jogosReais.forEach(j => {
            if (j.Fase !== "Grupos") return;
            if (!grupos[j.Grupo]) grupos[j.Grupo] = {};
            
            [j.TimeCasa, j.TimeFora].forEach(t => {
                if (!grupos[j.Grupo][t]) {
                    grupos[j.Grupo][t] = { nome: t, J: 0, V: 0, E: 0, D: 0, GP: 0, GC: 0, SG: 0, PTS: 0 };
                }
            });
        });

        // Computa gols, pontos e estatísticas dos jogos ENCERRADOS
        jogosReais.forEach(j => {
            if (j.Fase !== "Grupos" || j.StatusJogo !== "ENCERRADO") return;

            const tCasa = grupos[j.Grupo][j.TimeCasa];
            const tFora = grupos[j.Grupo][j.TimeFora];
            const gCasa = parseInt(j.GolCasaReal);
            const gFora = parseInt(j.GolForaReal);

            tCasa.J++; tFora.J++;
            tCasa.GP += gCasa; tCasa.GC += gFora;
            tFora.GP += gFora; tFora.GC += gCasa;

            if (gCasa > gFora) {
                tCasa.V++; tCasa.PTS += 3; tFora.D++;
            } else if (gCasa < gFora) {
                tFora.V++; tFora.PTS += 3; tCasa.D++;
            } else {
                tCasa.E++; tCasa.PTS += 1;
                tFora.E++; tFora.PTS += 1;
            }
            tCasa.SG = tCasa.GP - tCasa.GC;
            tFora.SG = tFora.GP - tFora.GC;
        });

        // Ordena cada grupo seguindo estritamente as regras de desempate pedidas
        const gruposOrdenados = {};
        for (const g in grupos) {
            gruposOrdenados[g] = Object.values(grupos[g]).sort((a, b) => {
                if (b.PTS !== a.PTS) return b.PTS - a.PTS;   // 1º Critério: Pontos
                if (b.SG !== a.SG) return b.SG - a.SG;       // 2º Critério: Saldo
                if (b.GP !== a.GP) return b.GP - a.GP;       // 3º Critério: Gols Pró
                return b.V - a.V;                             // 4º Critério: Vitórias
            });
        }
        return gruposOrdenados;
    },

    // 2. Extrai os 8 melhores 3º colocados gerais de todos os 12 grupos
    getBestThirdPlacers(classificationGroups) {
        let todosTerceiros = [];
        for (const g in classificationGroups) {
            if (classificationGroups[g][2]) {
                todosTerceiros.push({ ...classificationGroups[g][2], grupo: g });
            }
        }
        // Ordena a repescagem dos terceiros
        return todosTerceiros.sort((a, b) => {
            if (b.PTS !== a.PTS) return b.PTS - a.PTS;
            if (b.SG !== a.SG) return b.SG - a.SG;
            if (b.GP !== a.GP) return b.GP - a.GP;
            return b.V - a.V;
        }).slice(0, 8); // Retorna os 8 felizardos que avançam
    },

    // 3. Monta a árvore de mata-mata dinamicamente ligando os classificados reais
    buildPlayoffs(jogosReais) {
        const grupos = this.computeGroupsClassification(jogosReais);
        const melhoresTerceiros = this.getBestThirdPlacers(grupos);
        
        // Função auxiliar para verificar se um 3º de determinado grupo passou na repescagem
        const p3 = (gOpts) => {
            const achado = melhoresTerceiros.find(t => gOpts.includes(t.grupo));
            return achado ? achado.nome : `3º ${gOpts.join("/")}`;
        };

        // Atalhos para capturar os campeões (1º) e vices (2º) reais dos grupos
        const p1 = (g) => grupos[g] && grupos[g][0] ? grupos[g][0].nome : `1º ${g}`;
        const p2 = (g) => grupos[g] && grupos[g][1] ? grupos[g][1].nome : `2º ${g}`;

        // Estruturação matemática exata do chaveamento pedido
        const chaveamentoR32 = [
            { id: "R32-1", tC: p1("A"), tF: p3(["C", "D", "E"]) },
            { id: "R32-2", tC: p2("A"), tF: p2("B") },
            { id: "R32-3", tC: p1("B"), tF: p3(["A", "F", "G"]) },
            { id: "R32-4", tC: p1("C"), tF: p2("F") },
            { id: "R32-5", tC: p2("C"), tF: p2("E") },
            { id: "R32-6", tC: p1("D"), tF: p3(["B", "E", "F"]) },
            { id: "R32-7", tC: p2("D"), tF: p2("G") },
            { id: "R32-8", tC: p1("E"), tF: p3(["C", "G", "H"]) },
            { id: "R32-9", tC: p1("F"), tF: p3(["D", "H", "I"]) },
            { id: "R32-10", tC: p1("G"), tF: p2("H") },
            { id: "R32-11", tC: p2("G"), tF: p2("I") },
            { id: "J-R32-12", tC: p1("H"), tF: p3(["F", "I", "J"]) },
            { id: "R32-13", tC: p1("I"), tF: p2("J") },
            { id: "R32-14", tC: p2("H"), tF: p2("K") },
            { id: "R32-15", tC: p1("J"), tF: p3(["G", "K", "L"]) },
            { id: "R32-16", tC: p1("K"), tF: p2("L") }
        ];

        return chaveamentoR32;
    },

    // 4. Renderizador do HTML da tabela bonita com Emojis
    renderClassificationUI(jogosReais) {
        const container = document.getElementById("groups-board-container");
        if (!container) return;
        container.innerHTML = "";

        const grupos = this.computeGroupsClassification(jogosReais);

        for (const g in grupos) {
            const boxGrupo = document.createElement("div");
            boxGrupo.className = "group-table-wrapper";
            
            let tabelaHTML = `
                <h3 class="group-table-title">GRUPO ${g}</h3>
                <table class="modern-football-table">
                    <thead>
                        <tr>
                            <th>Seleção</th>
                            <th>J</th>
                            <th>V</th>
                            <th>E</th>
                            <th>D</th>
                            <th>SG</th>
                            <th>PTS</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            grupos[g].forEach((team) => {
                const flag = dataFlags[team.nome] || "🏳️";
                tabelaHTML += `
                    <tr>
                        <td class="team-cell-name"><span>${flag}</span> ${team.nome}</td>
                        <td>${team.J}</td>
                        <td>${team.V}</td>
                        <td>${team.E}</td>
                        <td>${team.D}</td>
                        <td>${team.SG}</td>
                        <td class="pts-bold">${team.PTS}</td>
                    </tr>
                `;
            });

            tabelaHTML += `</tbody></table>`;
            boxGrupo.innerHTML = tabelaHTML;
            container.appendChild(boxGrupo);
        }
    }
};