# 🏆 Bolão da Copa 2026

Aplicação web para gerenciar um bolão familiar da **Copa do Mundo FIFA 2026**, com palpites, ranking automático e sistema de pontuação especial para os jogos do Brasil.

🔗 **Demo:** [projeto-bolao-snowy.vercel.app](https://projeto-bolao-snowy.vercel.app)

## 📋 Sobre o projeto

O projetoBolão nasceu para resolver um problema clássico de família: organizar o bolão da Copa sem depender de planilhas soltas ou grupos de WhatsApp bagunçados. Cada participante registra seus palpites para os jogos, e o sistema calcula a pontuação e o ranking automaticamente, usando o **Google Sheets** como banco de dados via **Google Apps Script**.

## ✨ Funcionalidades

- 📝 **Palpites** — cada usuário registra o placar que acha que vai rolar em cada jogo
- 🏅 **Ranking automático** — classificação geral atualizada com base nos pontos de cada participante
- 🇧🇷 **Regras especiais para o Brasil** — jogos da Seleção valem mais pontos que os demais
- 👤 **Perfil do participante** — acompanhamento individual de desempenho
- 🛠️ **Painel administrativo** — gestão de resultados e configurações do bolão
- 📱 **PWA (Progressive Web App)** — instalável e com suporte offline via Service Worker
- 📊 **Tabela de grupos e classificação** — acompanhamento da fase de grupos em tempo real

## 🎯 Sistema de pontuação

| Tipo de jogo | Acerto do resultado | Acerto do placar exato |
|---|---|---|
| Jogos em geral | 3 pontos | 5 pontos |
| Jogos do Brasil | 6 pontos | 10 pontos |

## 🧱 Stack técnica

- **Front-end:** HTML5, CSS3 e JavaScript puro (vanilla JS, ES6+, sem frameworks)
- **Back-end/dados:** Google Sheets + Google Apps Script (`code.gs`)
- **Hospedagem:** [Vercel](https://vercel.com)
- **PWA:** Service Worker (`sw.js`) + `manifest.json`

## 📁 Estrutura do projeto

```
projetoBolao/
├── index.html        # Página principal (SPA)
├── app.js            # Lógica principal da aplicação
├── api.js            # Comunicação com o back-end (Google Sheets/Apps Script)
├── admin.js          # Painel administrativo
├── data.js           # Calendário oficial da Copa 2026 (horário de Brasília)
├── ranking.js         # Cálculo e exibição do ranking geral
├── standings.js       # Classificação da fase de grupos
├── table.js           # Renderização de tabelas
├── style.css          # Estilos da aplicação
├── sw.js              # Service Worker (suporte offline/PWA)
└── manifest.json       # Manifesto do PWA
```

## 🚀 Rodando localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/xouel/projetoBolao.git
   cd projetoBolao
   ```
2. Configure o back-end no Google Apps Script (planilha do Google Sheets + deploy do `code.gs` como Web App).
3. Atualize a URL da API em `api.js` apontando para o seu Web App do Apps Script.
4. Sirva os arquivos estáticos localmente, por exemplo com a extensão *Live Server* do VS Code ou:
   ```bash
   npx serve .
   ```
5. Acesse `http://localhost:3000` (ou a porta indicada pelo servidor).

## 🌐 Deploy

O projeto está hospedado na Vercel e pode ser publicado com um simples `vercel deploy`, já que se trata de uma aplicação estática (HTML/CSS/JS).

## 🗺️ Roadmap

Atualmente os resultados são inseridos manualmente na planilha.
PROXIMOS PASSOS:
- [ ] Atualização automática dos resultados via Google Apps Script Time-driven Triggers, consultando uma API externa de futebol (ESPN, TheSportsDB ou API-Football) a cada 2–4 horas
- [ ] Definição do schema final da planilha para os novos dados de resultado (placar final, gols por time etc.)

## 👤 Autor

Desenvolvido por [**Xouel**](https://github.com/xouel) — [@xoueljr](https://instagram.com/xoueljr)

## 📄 Licença

Este projeto ainda não possui uma licença definida.
