/**
 * DATA.JS - Tabela Oficial de Jogos da Copa 2026
 * Datas e horários oficiais da FIFA (horário de Brasília).
 * Fonte: FIFA / Soccerway — ordenação cronológica real.
 */

const dataMatches = [

  // ========== 1ª RODADA ==========

  // 11 de junho
  { IDJogo: "J-A1", TimeCasa: "México",          TimeFora: "África do Sul",    Grupo: "A", Fase: "Grupos", Data: "2026-06-11", Hora: "16:00" },

  // 11 de junho (noite)
  { IDJogo: "J-A2", TimeCasa: "Coreia do Sul",   TimeFora: "República Tcheca", Grupo: "A", Fase: "Grupos", Data: "2026-06-11", Hora: "23:00" },

  // 12 de junho
  { IDJogo: "J-B1", TimeCasa: "Canadá",          TimeFora: "Bósnia",           Grupo: "B", Fase: "Grupos", Data: "2026-06-12", Hora: "16:00" },
  { IDJogo: "J-D1", TimeCasa: "EUA",             TimeFora: "Paraguai",         Grupo: "D", Fase: "Grupos", Data: "2026-06-12", Hora: "22:00" },

  // 13 de junho
  { IDJogo: "J-D2", TimeCasa: "Austrália",       TimeFora: "Turquia",          Grupo: "D", Fase: "Grupos", Data: "2026-06-13", Hora: "01:00" },
  { IDJogo: "J-B2", TimeCasa: "Catar",           TimeFora: "Suíça",            Grupo: "B", Fase: "Grupos", Data: "2026-06-13", Hora: "16:00" },
  { IDJogo: "J-C1", TimeCasa: "Brasil",          TimeFora: "Marrocos",         Grupo: "C", Fase: "Grupos", Data: "2026-06-13", Hora: "19:00" },
  { IDJogo: "J-C2", TimeCasa: "Haiti",           TimeFora: "Escócia",          Grupo: "C", Fase: "Grupos", Data: "2026-06-13", Hora: "22:00" },

  // 14 de junho
  { IDJogo: "J-E1", TimeCasa: "Alemanha",        TimeFora: "Curaçao",          Grupo: "E", Fase: "Grupos", Data: "2026-06-14", Hora: "14:00" },
  { IDJogo: "J-F1", TimeCasa: "Holanda",         TimeFora: "Japão",            Grupo: "F", Fase: "Grupos", Data: "2026-06-14", Hora: "17:00" },
  { IDJogo: "J-E2", TimeCasa: "Costa do Marfim", TimeFora: "Equador",          Grupo: "E", Fase: "Grupos", Data: "2026-06-14", Hora: "20:00" },
  { IDJogo: "J-F2", TimeCasa: "Suécia",          TimeFora: "Tunísia",          Grupo: "F", Fase: "Grupos", Data: "2026-06-14", Hora: "23:00" },

  // 15 de junho
  { IDJogo: "J-H1", TimeCasa: "Espanha",         TimeFora: "Cabo Verde",       Grupo: "H", Fase: "Grupos", Data: "2026-06-15", Hora: "13:00" },
  { IDJogo: "J-G1", TimeCasa: "Bélgica",         TimeFora: "Egito",            Grupo: "G", Fase: "Grupos", Data: "2026-06-15", Hora: "16:00" },
  { IDJogo: "J-H2", TimeCasa: "Arábia Saudita",  TimeFora: "Uruguai",          Grupo: "H", Fase: "Grupos", Data: "2026-06-15", Hora: "19:00" },
  { IDJogo: "J-G2", TimeCasa: "Irã",             TimeFora: "Nova Zelândia",    Grupo: "G", Fase: "Grupos", Data: "2026-06-15", Hora: "22:00" },

  // 16 de junho
  { IDJogo: "J-J1", TimeCasa: "Argentina",       TimeFora: "Argélia",          Grupo: "J", Fase: "Grupos", Data: "2026-06-16", Hora: "14:00" },
  { IDJogo: "J-I1", TimeCasa: "França",          TimeFora: "Senegal",          Grupo: "I", Fase: "Grupos", Data: "2026-06-16", Hora: "16:00" },
  { IDJogo: "J-I2", TimeCasa: "Iraque",          TimeFora: "Noruega",          Grupo: "I", Fase: "Grupos", Data: "2026-06-16", Hora: "19:00" },

  // 17 de junho
  { IDJogo: "J-J2", TimeCasa: "Áustria",         TimeFora: "Jordânia",         Grupo: "J", Fase: "Grupos", Data: "2026-06-17", Hora: "01:00" },
  { IDJogo: "J-K1", TimeCasa: "Portugal",        TimeFora: "RD Congo",         Grupo: "K", Fase: "Grupos", Data: "2026-06-17", Hora: "14:00" },
  { IDJogo: "J-L1", TimeCasa: "Inglaterra",      TimeFora: "Croácia",          Grupo: "L", Fase: "Grupos", Data: "2026-06-17", Hora: "17:00" },
  { IDJogo: "J-L2", TimeCasa: "Gana",            TimeFora: "Panamá",           Grupo: "L", Fase: "Grupos", Data: "2026-06-17", Hora: "20:00" },
  { IDJogo: "J-K2", TimeCasa: "Uzbequistão",     TimeFora: "Colômbia",         Grupo: "K", Fase: "Grupos", Data: "2026-06-17", Hora: "23:00" },

  // ========== 2ª RODADA ==========

  // 18 de junho
  { IDJogo: "J-A3", TimeCasa: "México",          TimeFora: "Coreia do Sul",    Grupo: "A", Fase: "Grupos", Data: "2026-06-18", Hora: "22:00" },
  { IDJogo: "J-A4", TimeCasa: "África do Sul",   TimeFora: "República Tcheca", Grupo: "A", Fase: "Grupos", Data: "2026-06-18", Hora: "13:00" },
  { IDJogo: "J-B3", TimeCasa: "Canadá",          TimeFora: "Catar",            Grupo: "B", Fase: "Grupos", Data: "2026-06-18", Hora: "19:00" },
  { IDJogo: "J-B4", TimeCasa: "Suíça",           TimeFora: "Bósnia",           Grupo: "B", Fase: "Grupos", Data: "2026-06-18", Hora: "16:00" },

  // 19 de junho
  { IDJogo: "J-D3", TimeCasa: "EUA",             TimeFora: "Austrália",        Grupo: "D", Fase: "Grupos", Data: "2026-06-19", Hora: "16:00" },
  { IDJogo: "J-D4", TimeCasa: "Paraguai",        TimeFora: "Turquia",          Grupo: "D", Fase: "Grupos", Data: "2026-06-19", Hora: "01:00" },
  { IDJogo: "J-C4", TimeCasa: "Escócia",         TimeFora: "Marrocos",         Grupo: "C", Fase: "Grupos", Data: "2026-06-19", Hora: "19:00" },
  { IDJogo: "J-C3", TimeCasa: "Brasil",          TimeFora: "Haiti",            Grupo: "C", Fase: "Grupos", Data: "2026-06-19", Hora: "22:00" },

  // 20 de junho
  { IDJogo: "J-F3", TimeCasa: "Holanda",         TimeFora: "Suécia",           Grupo: "F", Fase: "Grupos", Data: "2026-06-20", Hora: "14:00" },
  { IDJogo: "J-E3", TimeCasa: "Alemanha",        TimeFora: "Costa do Marfim",  Grupo: "E", Fase: "Grupos", Data: "2026-06-20", Hora: "17:00" },
  { IDJogo: "J-E4", TimeCasa: "Equador",         TimeFora: "Curaçao",          Grupo: "E", Fase: "Grupos", Data: "2026-06-20", Hora: "21:00" },

  // 21 de junho
  { IDJogo: "J-F4", TimeCasa: "Tunísia",         TimeFora: "Japão",            Grupo: "F", Fase: "Grupos", Data: "2026-06-21", Hora: "01:00" },
  { IDJogo: "J-H3", TimeCasa: "Espanha",         TimeFora: "Arábia Saudita",   Grupo: "H", Fase: "Grupos", Data: "2026-06-21", Hora: "13:00" },
  { IDJogo: "J-G3", TimeCasa: "Bélgica",         TimeFora: "Irã",              Grupo: "G", Fase: "Grupos", Data: "2026-06-21", Hora: "16:00" },
  { IDJogo: "J-H4", TimeCasa: "Uruguai",         TimeFora: "Cabo Verde",       Grupo: "H", Fase: "Grupos", Data: "2026-06-21", Hora: "19:00" },
  { IDJogo: "J-G4", TimeCasa: "Nova Zelândia",   TimeFora: "Egito",            Grupo: "G", Fase: "Grupos", Data: "2026-06-21", Hora: "22:00" },

  // 22 de junho
  { IDJogo: "J-J3", TimeCasa: "Argentina",       TimeFora: "Áustria",          Grupo: "J", Fase: "Grupos", Data: "2026-06-22", Hora: "14:00" },
  { IDJogo: "J-I3", TimeCasa: "França",          TimeFora: "Iraque",           Grupo: "I", Fase: "Grupos", Data: "2026-06-22", Hora: "18:00" },
  { IDJogo: "J-I4", TimeCasa: "Noruega",         TimeFora: "Senegal",          Grupo: "I", Fase: "Grupos", Data: "2026-06-22", Hora: "21:00" },

  // 23 de junho
  { IDJogo: "J-J4", TimeCasa: "Jordânia",        TimeFora: "Argélia",          Grupo: "J", Fase: "Grupos", Data: "2026-06-23", Hora: "00:00" },
  { IDJogo: "J-L3", TimeCasa: "Inglaterra",      TimeFora: "Gana",             Grupo: "L", Fase: "Grupos", Data: "2026-06-23", Hora: "17:00" },
  { IDJogo: "J-K3", TimeCasa: "Portugal",        TimeFora: "Uzbequistão",      Grupo: "K", Fase: "Grupos", Data: "2026-06-23", Hora: "14:00" },
  { IDJogo: "J-L4", TimeCasa: "Panamá",          TimeFora: "Croácia",          Grupo: "L", Fase: "Grupos", Data: "2026-06-23", Hora: "20:00" },
  { IDJogo: "J-K4", TimeCasa: "Colômbia",        TimeFora: "RD Congo",         Grupo: "K", Fase: "Grupos", Data: "2026-06-23", Hora: "23:00" },

  // ========== 3ª RODADA (simultâneos por grupo) ==========

  // 24 de junho
  { IDJogo: "J-B5", TimeCasa: "Suíça",           TimeFora: "Canadá",           Grupo: "B", Fase: "Grupos", Data: "2026-06-24", Hora: "16:00" },
  { IDJogo: "J-B6", TimeCasa: "Bósnia",          TimeFora: "Catar",            Grupo: "B", Fase: "Grupos", Data: "2026-06-24", Hora: "16:00" },
  { IDJogo: "J-C5", TimeCasa: "Escócia",         TimeFora: "Brasil",           Grupo: "C", Fase: "Grupos", Data: "2026-06-24", Hora: "19:00" },
  { IDJogo: "J-C6", TimeCasa: "Marrocos",        TimeFora: "Haiti",            Grupo: "C", Fase: "Grupos", Data: "2026-06-24", Hora: "19:00" },
  { IDJogo: "J-A5", TimeCasa: "República Tcheca",TimeFora: "México",           Grupo: "A", Fase: "Grupos", Data: "2026-06-24", Hora: "22:00" },
  { IDJogo: "J-A6", TimeCasa: "África do Sul",   TimeFora: "Coreia do Sul",    Grupo: "A", Fase: "Grupos", Data: "2026-06-24", Hora: "22:00" },

  // 25 de junho
  { IDJogo: "J-E5", TimeCasa: "Equador",         TimeFora: "Alemanha",         Grupo: "E", Fase: "Grupos", Data: "2026-06-25", Hora: "17:00" },
  { IDJogo: "J-E6", TimeCasa: "Curaçao",         TimeFora: "Costa do Marfim",  Grupo: "E", Fase: "Grupos", Data: "2026-06-25", Hora: "17:00" },
  { IDJogo: "J-F5", TimeCasa: "Japão",           TimeFora: "Suécia",           Grupo: "F", Fase: "Grupos", Data: "2026-06-25", Hora: "20:00" },
  { IDJogo: "J-F6", TimeCasa: "Tunísia",         TimeFora: "Holanda",          Grupo: "F", Fase: "Grupos", Data: "2026-06-25", Hora: "20:00" },
  { IDJogo: "J-D5", TimeCasa: "Turquia",         TimeFora: "EUA",              Grupo: "D", Fase: "Grupos", Data: "2026-06-25", Hora: "23:00" },
  { IDJogo: "J-D6", TimeCasa: "Paraguai",        TimeFora: "Austrália",        Grupo: "D", Fase: "Grupos", Data: "2026-06-25", Hora: "23:00" },

  // 26 de junho
  { IDJogo: "J-I5", TimeCasa: "Noruega",         TimeFora: "França",           Grupo: "I", Fase: "Grupos", Data: "2026-06-26", Hora: "16:00" },
  { IDJogo: "J-I6", TimeCasa: "Senegal",         TimeFora: "Iraque",           Grupo: "I", Fase: "Grupos", Data: "2026-06-26", Hora: "16:00" },
  { IDJogo: "J-H5", TimeCasa: "Cabo Verde",      TimeFora: "Arábia Saudita",   Grupo: "H", Fase: "Grupos", Data: "2026-06-26", Hora: "21:00" },
  { IDJogo: "J-H6", TimeCasa: "Uruguai",         TimeFora: "Espanha",          Grupo: "H", Fase: "Grupos", Data: "2026-06-26", Hora: "21:00" },

  // 27 de junho
  { IDJogo: "J-G5", TimeCasa: "Egito",           TimeFora: "Irã",              Grupo: "G", Fase: "Grupos", Data: "2026-06-27", Hora: "00:00" },
  { IDJogo: "J-G6", TimeCasa: "Nova Zelândia",   TimeFora: "Bélgica",          Grupo: "G", Fase: "Grupos", Data: "2026-06-27", Hora: "00:00" },
  { IDJogo: "J-L5", TimeCasa: "Panamá",          TimeFora: "Inglaterra",       Grupo: "L", Fase: "Grupos", Data: "2026-06-27", Hora: "18:00" },
  { IDJogo: "J-L6", TimeCasa: "Croácia",         TimeFora: "Gana",             Grupo: "L", Fase: "Grupos", Data: "2026-06-27", Hora: "18:00" },
  { IDJogo: "J-K5", TimeCasa: "Colômbia",        TimeFora: "Portugal",         Grupo: "K", Fase: "Grupos", Data: "2026-06-27", Hora: "20:30" },
  { IDJogo: "J-K6", TimeCasa: "RD Congo",        TimeFora: "Uzbequistão",      Grupo: "K", Fase: "Grupos", Data: "2026-06-27", Hora: "20:30" },
  { IDJogo: "J-J5", TimeCasa: "Argélia",         TimeFora: "Áustria",          Grupo: "J", Fase: "Grupos", Data: "2026-06-27", Hora: "23:00" },
  { IDJogo: "J-J6", TimeCasa: "Jordânia",        TimeFora: "Argentina",        Grupo: "J", Fase: "Grupos", Data: "2026-06-27", Hora: "23:00" },

];

// Mapeamento de Emojis/Bandeiras
const dataFlags = {
  "México":           "🇲🇽", "África do Sul":    "🇿🇦",
  "Coreia do Sul":    "🇰🇷", "República Tcheca": "🇨🇿",
  "Canadá":           "🇨🇦", "Bósnia":           "🇧🇦",
  "Catar":            "🇶🇦", "Suíça":            "🇨🇭",
  "Brasil":           "🇧🇷", "Marrocos":         "🇲🇦",
  "Haiti":            "🇭🇹", "Escócia":          "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "EUA":              "🇺🇸", "Paraguai":         "🇵🇾",
  "Austrália":        "🇦🇺", "Turquia":          "🇹🇷",
  "Alemanha":         "🇩🇪", "Curaçao":          "🇨🇼",
  "Costa do Marfim":  "🇨🇮", "Equador":          "🇪🇨",
  "Holanda":          "🇳🇱", "Japão":            "🇯🇵",
  "Suécia":           "🇸🇪", "Tunísia":          "🇹🇳",
  "Bélgica":          "🇧🇪", "Egito":            "🇪🇬",
  "Irã":              "🇮🇷", "Nova Zelândia":    "🇳🇿",
  "Espanha":          "🇪🇸", "Cabo Verde":       "🇨🇻",
  "Arábia Saudita":   "🇸🇦", "Uruguai":          "🇺🇾",
  "França":           "🇫🇷", "Senegal":          "🇸🇳",
  "Iraque":           "🇮🇶", "Noruega":          "🇳🇴",
  "Argentina":        "🇦🇷", "Argélia":          "🇩🇿",
  "Áustria":          "🇦🇹", "Jordânia":         "🇯🇴",
  "Portugal":         "🇵🇹", "RD Congo":         "🇨🇩",
  "Uzbequistão":      "🇺🇿", "Colômbia":         "🇨🇴",
  "Inglaterra":       "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Croácia":          "🇭🇷",
  "Gana":             "🇬🇭", "Panamá":           "🇵🇦"
};