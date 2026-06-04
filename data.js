/**
 * DATA.JS - Tabela Oficial de Jogos da Fase de Grupos - Copa 2026
 * Todos os confrontos cruzados de forma automatizada (3 rodadas por grupo).
 */

const dataMatches = [
    // --- GRUPO A ---
    { IDJogo: "J-A1", TimeCasa: "México", TimeFora: "África do Sul", Grupo: "A", Fase: "Grupos" },
    { IDJogo: "J-A2", TimeCasa: "Coreia do Sul", TimeFora: "República Tcheca", Grupo: "A", Fase: "Grupos" },
    { IDJogo: "J-A3", TimeCasa: "México", TimeFora: "Coreia do Sul", Grupo: "A", Fase: "Grupos" },
    { IDJogo: "J-A4", TimeCasa: "África do Sul", TimeFora: "República Tcheca", Grupo: "A", Fase: "Grupos" },
    { IDJogo: "J-A5", TimeCasa: "República Tcheca", TimeFora: "México", Grupo: "A", Fase: "Grupos" },
    { IDJogo: "J-A6", TimeCasa: "África do Sul", TimeFora: "Coreia do Sul", Grupo: "A", Fase: "Grupos" },

    // --- GRUPO B ---
    { IDJogo: "J-B1", TimeCasa: "Canadá", TimeFora: "Bosnia", Grupo: "B", Fase: "Grupos" },
    { IDJogo: "J-B2", TimeCasa: "Catar", TimeFora: "Suíça", Grupo: "B", Fase: "Grupos" },
    { IDJogo: "J-B3", TimeCasa: "Canadá", TimeFora: "Catar", Grupo: "B", Fase: "Grupos" },
    { IDJogo: "J-B4", TimeCasa: "Bosnia", TimeFora: "Suíça", Grupo: "B", Fase: "Grupos" },
    { IDJogo: "J-B5", TimeCasa: "Suíça", TimeFora: "Canadá", Grupo: "B", Fase: "Grupos" },
    { IDJogo: "J-B6", TimeCasa: "Bosnia", TimeFora: "Catar", Grupo: "B", Fase: "Grupos" },

    // --- GRUPO C (Grupo do Brasil) ---
    { IDJogo: "J-C1", TimeCasa: "Brasil", TimeFora: "Marrocos", Grupo: "C", Fase: "Grupos" },
    { IDJogo: "J-C2", TimeCasa: "Haiti", TimeFora: "Escócia", Grupo: "C", Fase: "Grupos" },
    { IDJogo: "J-C3", TimeCasa: "Brasil", TimeFora: "Haiti", Grupo: "C", Fase: "Grupos" },
    { IDJogo: "J-C4", TimeCasa: "Marrocos", TimeFora: "Escócia", Grupo: "C", Fase: "Grupos" },
    { IDJogo: "J-C5", TimeCasa: "Escócia", TimeFora: "Brasil", Grupo: "C", Fase: "Grupos" },
    { IDJogo: "J-C6", TimeCasa: "Marrocos", TimeFora: "Haiti", Grupo: "C", Fase: "Grupos" },

    // --- GRUPO D ---
    { IDJogo: "J-D1", TimeCasa: "EUA", TimeFora: "Paraguai", Grupo: "D", Fase: "Grupos" },
    { IDJogo: "J-D2", TimeCasa: "Austrália", TimeFora: "Turquia", Grupo: "D", Fase: "Grupos" },
    { IDJogo: "J-D3", TimeCasa: "EUA", TimeFora: "Austrália", Grupo: "D", Fase: "Grupos" },
    { IDJogo: "J-D4", TimeCasa: "Paraguai", TimeFora: "Turquia", Grupo: "D", Fase: "Grupos" },
    { IDJogo: "J-D5", TimeCasa: "Turquia", TimeFora: "EUA", Grupo: "D", Fase: "Grupos" },
    { IDJogo: "J-D6", TimeCasa: "Paraguai", TimeFora: "Austrália", Grupo: "D", Fase: "Grupos" },

    // --- GRUPO E ---
    { IDJogo: "J-E1", TimeCasa: "Alemanha", TimeFora: "Curaçao", Grupo: "E", Fase: "Grupos" },
    { IDJogo: "J-E2", TimeCasa: "Costa do Marfim", TimeFora: "Equador", Grupo: "E", Fase: "Grupos" },
    { IDJogo: "J-E3", TimeCasa: "Alemanha", TimeFora: "Costa do Marfim", Grupo: "E", Fase: "Grupos" },
    { IDJogo: "J-E4", TimeCasa: "Curaçao", TimeFora: "Equador", Grupo: "E", Fase: "Grupos" },
    { IDJogo: "J-E5", TimeCasa: "Equador", TimeFora: "Alemanha", Grupo: "E", Fase: "Grupos" },
    { IDJogo: "J-E6", TimeCasa: "Curaçao", TimeFora: "Costa do Marfim", Grupo: "E", Fase: "Grupos" },

    // --- GRUPO F ---
    { IDJogo: "J-F1", TimeCasa: "Holanda", TimeFora: "Japão", Grupo: "F", Fase: "Grupos" },
    { IDJogo: "J-F2", TimeCasa: "Suécia", TimeFora: "Tunísia", Grupo: "F", Fase: "Grupos" },
    { IDJogo: "J-F3", TimeCasa: "Holanda", TimeFora: "Suécia", Grupo: "F", Fase: "Grupos" },
    { IDJogo: "J-F4", TimeCasa: "Japão", TimeFora: "Tunísia", Grupo: "F", Fase: "Grupos" },
    { IDJogo: "J-F5", TimeCasa: "Tunísia", TimeFora: "Holanda", Grupo: "F", Fase: "Grupos" },
    { IDJogo: "J-F6", TimeCasa: "Japão", TimeFora: "Suécia", Grupo: "F", Fase: "Grupos" },

    // --- GRUPO G ---
    { IDJogo: "J-G1", TimeCasa: "Bélgica", TimeFora: "Egito", Grupo: "G", Fase: "Grupos" },
    { IDJogo: "J-G2", TimeCasa: "Irã", TimeFora: "Nova Zelândia", Grupo: "G", Fase: "Grupos" },
    { IDJogo: "J-G3", TimeCasa: "Bélgica", TimeFora: "Irã", Grupo: "G", Fase: "Grupos" },
    { IDJogo: "J-G4", TimeCasa: "Egito", TimeFora: "Nova Zelândia", Grupo: "G", Fase: "Grupos" },
    { IDJogo: "J-G5", TimeCasa: "Nova Zelândia", TimeFora: "Bélgica", Grupo: "G", Fase: "Grupos" },
    { IDJogo: "J-G6", TimeCasa: "Egito", TimeFora: "Irã", Grupo: "G", Fase: "Grupos" },

    // --- GRUPO H ---
    { IDJogo: "J-H1", TimeCasa: "Espanha", TimeFora: "Cabo Verde", Grupo: "H", Fase: "Grupos" },
    { IDJogo: "J-H2", TimeCasa: "Arábia Saudita", TimeFora: "Uruguai", Grupo: "H", Fase: "Grupos" },
    { IDJogo: "J-H3", TimeCasa: "Espanha", TimeFora: "Arábia Saudita", Grupo: "H", Fase: "Grupos" },
    { IDJogo: "J-H4", TimeCasa: "Cabo Verde", TimeFora: "Uruguai", Grupo: "H", Fase: "Grupos" },
    { IDJogo: "J-H5", TimeCasa: "Uruguai", TimeFora: "Espanha", Grupo: "H", Fase: "Grupos" },
    { IDJogo: "J-H6", TimeCasa: "Cabo Verde", TimeFora: "Arábia Saudita", Grupo: "H", Fase: "Grupos" },

    // --- GRUPO I ---
    { IDJogo: "J-I1", TimeCasa: "França", TimeFora: "Senegal", Grupo: "I", Fase: "Grupos" },
    { IDJogo: "J-I2", TimeCasa: "Iraque", TimeFora: "Noruega", Grupo: "I", Fase: "Grupos" },
    { IDJogo: "J-I3", TimeCasa: "França", TimeFora: "Iraque", Grupo: "I", Fase: "Grupos" },
    { IDJogo: "J-I4", TimeCasa: "Senegal", TimeFora: "Noruega", Grupo: "I", Fase: "Grupos" },
    { IDJogo: "J-I5", TimeCasa: "Noruega", TimeFora: "França", Grupo: "I", Fase: "Grupos" },
    { IDJogo: "J-I6", TimeCasa: "Senegal", TimeFora: "Iraque", Grupo: "I", Fase: "Grupos" },

    // --- GRUPO J ---
    { IDJogo: "J-J1", TimeCasa: "Argentina", TimeFora: "Argélia", Grupo: "J", Fase: "Grupos" },
    { IDJogo: "J-J2", TimeCasa: "Áustria", TimeFora: "Jordânia", Grupo: "J", Fase: "Grupos" },
    { IDJogo: "J-J3", TimeCasa: "Argentina", TimeFora: "Áustria", Grupo: "J", Fase: "Grupos" },
    { IDJogo: "J-J4", TimeCasa: "Argélia", TimeFora: "Jordânia", Grupo: "J", Fase: "Grupos" },
    { IDJogo: "J-J5", TimeCasa: "Jordânia", TimeFora: "Argentina", Grupo: "J", Fase: "Grupos" },
    { IDJogo: "J-J6", TimeCasa: "Argélia", TimeFora: "Áustria", Grupo: "J", Fase: "Grupos" },

    // --- GRUPO K ---
    { IDJogo: "J-K1", TimeCasa: "Portugal", TimeFora: "RD Congo", Grupo: "K", Fase: "Grupos" },
    { IDJogo: "J-K2", TimeCasa: "Uzbequistão", TimeFora: "Colômbia", Grupo: "K", Fase: "Grupos" },
    { IDJogo: "J-K3", TimeCasa: "Portugal", TimeFora: "Uzbequistão", Grupo: "K", Fase: "Grupos" },
    { IDJogo: "J-K4", TimeCasa: "RD Congo", TimeFora: "Colômbia", Grupo: "K", Fase: "Grupos" },
    { IDJogo: "J-K5", TimeCasa: "Colômbia", TimeFora: "Portugal", Grupo: "K", Fase: "Grupos" },
    { IDJogo: "J-K6", TimeCasa: "RD Congo", TimeFora: "Uzbequistão", Grupo: "K", Fase: "Grupos" },

    // --- GRUPO L ---
    { IDJogo: "J-L1", TimeCasa: "Inglaterra", TimeFora: "Croácia", Grupo: "L", Fase: "Grupos" },
    { IDJogo: "J-L2", TimeCasa: "Gana", TimeFora: "Panamá", Grupo: "L", Fase: "Grupos" },
    { IDJogo: "J-L3", TimeCasa: "Inglaterra", TimeFora: "Gana", Grupo: "L", Fase: "Grupos" },
    { IDJogo: "J-L4", TimeCasa: "Croácia", TimeFora: "Panamá", Grupo: "L", Fase: "Grupos" },
    { IDJogo: "J-L5", TimeCasa: "Panamá", TimeFora: "Inglaterra", Grupo: "L", Fase: "Grupos" },
    { IDJogo: "J-L6", TimeCasa: "Croácia", TimeFora: "Gana", Grupo: "L", Fase: "Grupos" }
];

// Mapeamento de Emojis/Bandeiras para deixar o painel bonito
const dataFlags = {
    "México": "🇲🇽", "África do Sul": "🇿🇦", "Coreia do Sul": "🇰🇷", "República Tcheca": "🇨🇿",
    "Canadá": "🇨🇦", "Bósnia": "🇧🇦", "Catar": "🇶🇦", "Suíça": "🇨🇭",
    "Brasil": "🇧🇷", "Marrocos": "🇲🇦", "Haiti": "🇭🇹", "Escócia": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    "EUA": "🇺🇸", "Paraguai": "🇵🇾", "Austrália": "🇦🇺", "Turquia": "🇹🇷",
    "Alemanha": "🇩🇪", "Curaçao": "🇨🇼", "Costa do Marfim": "🇨🇮", "Equador": "🇪🇨",
    "Holanda": "🇳🇱", "Japão": "🇯🇵", "Suécia": "🇸🇪", "Tunísia": "🇹🇳",
    "Bélgica": "🇧🇪", "Egito": "🇪🇬", "Irã": "🇮🇷", "Nova Zelândia": "🇳🇿",
    "Espanha": "🇪🇸", "Cabo Verde": "🇨🇻", "Arábia Saudita": "🇸🇦", "Uruguai": "🇺🇾",
    "França": "🇫🇷", "Senegal": "🇸🇳", "Iraque": "🏴", "Noruega": "🇳🇴",
    "Argentina": "🇦🇷", "Argélia": "🇩🇿", "Áustria": "🇦🇹", "Jordânia": "🇯🇴",
    "Portugal": "🇵🇹", "RD Congo": "🇨🇩", "Uzbequistão": "🇺🇿", "Colômbia": "🇨🇴",
    "Inglaterra": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Croácia": "🇭🇷", "Gana": "🇬🇭", "Panamá": "🇵🇦"
};