/**
 * API.JS - Módulo de Integração Direta com o Banco de Dados Online (Google Sheets)
 * Conecta o frontend com a API criada no Google Apps Script.
 */

// URL Oficial do seu Web App (Gerada em 2026)
var SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzMujtMMwsugRaOeKbcVU2EYy5IvkUZTDVYOnubnhSLsdPz7E1eWDou3sE-l36viGec/exec";

const api = {
    
    // 1. Procura se o nickname do familiar já existe online (CORRIGIDO: adicionado redirecionamento seguro)
    async checkUserExists(nickname) {
        try {
            const urlCompleta = `${SCRIPT_URL}?action=checkUser&login=${encodeURIComponent(nickname)}`;
            const resposta = await fetch(urlCompleta, {
                method: "GET",
                mode: "cors",
                redirect: "follow"
            });
            const dados = await resposta.json();
            
            if (dados.error) throw new Error(dados.error);
            return dados.user; // Retorna o objeto do usuário ou nulo
        } catch (error) {
            console.error("Erro ao buscar usuário no Google Sheets:", error);
            throw error;
        }
    },

    // 2. Registra um novo familiar inserindo uma linha na aba USUARIOS
    async registerNewUser(nickname, fullname, avatar) {
        try {
            const payload = {
                action: "registerUser",
                login: nickname,
                nome: fullname,
                avatar: avatar
            };

            const resposta = await fetch(SCRIPT_URL, {
                method: "POST",
                mode: "cors",
                redirect: "follow",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8" 
                },
                body: JSON.stringify(payload)
            });

            const dados = await resposta.json();
            if (dados.error) throw new Error(dados.error);
            return dados.user; // Retorna o usuário criado completo com ID
        } catch (error) {
            console.error("Erro ao cadastrar usuário no Google Sheets:", error);
            throw error;
        }
    },

    // 3. Salva ou atualiza um palpite individual dado em um jogo
    async saveSingleGuess(idJogo, timeCasa, timeFora, golCasa, golFora, fase) {
        try {
            const usuarioLogado = JSON.parse(localStorage.getItem("bolao_user_2026"));
            if (!usuarioLogado) throw new Error("Usuário não identificado.");

            const gCasa = isNaN(parseInt(golCasa)) ? 0 : parseInt(golCasa);
            const gFora = isNaN(parseInt(golFora)) ? 0 : parseInt(golFora);

            const payload = {
                action: "saveGuess",
                login: usuarioLogado.Login || usuarioLogado.login,
                idJogo: idJogo,
                timeCasa: timeCasa,
                timeFora: timeFora,
                golCasa: gCasa,
                golFora: gFora,
                fase: fase
            };

            const resposta = await fetch(SCRIPT_URL, {
                method: "POST",
                mode: "cors",
                redirect: "follow",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify(payload)
            });

            const dados = await resposta.json();
            if (dados.error) throw new Error(dados.error);
            return dados.success;
        } catch (error) {
            console.error("Erro ao salvar palpite no Google Sheets:", error);
            throw error;
        }
    },

    // 4. Busca todos os palpites que o usuário logado já fez anteriormente (CORRIGIDO: adicionado redirecionamento seguro)
    async getUserGuesses(nickname) {
        try {
            const urlCompleta = `${SCRIPT_URL}?action=getPalpites&usuario=${encodeURIComponent(nickname)}`;
            const resposta = await fetch(urlCompleta, {
                method: "GET",
                mode: "cors",
                redirect: "follow"
            });
            const dados = await resposta.json();
            
            if (dados.error) throw new Error(dados.error);
            return dados.palpites;
        } catch (error) {
            console.error("Erro ao resgatar palpites salvos:", error);
            return [];
        }
    },

    // 5. Puxa a lista ordenada de pontuação para o painel de Líderes (CORRIGIDO CRÍTICO: destrava o carregamento do ranking)
    async getLeaderboard() {
        try {
            const urlCompleta = `${SCRIPT_URL}?action=getRanking`;
            const resposta = await fetch(urlCompleta, {
                method: "GET",
                mode: "cors",
                redirect: "follow" // Isso impede o travamento eterno gerado pelo redirecionamento do Google Script
            });
            const dados = await resposta.json();
            
            if (dados.error) throw new Error(dados.error);
            return dados.ranking;
        } catch (error) {
            console.error("Erro ao obter ranking geral:", error);
            return [];
        }
    }
};