/**
 * ============================================================
 *  GERADOR DE TESOUROS — OLD DRAGON 2
 * ============================================================
 * Macro para FoundryVTT (tipo "Script").
 * ============================================================
 */

(async () => {

  // ============================================================
  // UTILITÁRIOS DE DADOS
  // ============================================================

  async function rolar(formula) {
    const r = new Roll(String(formula));
    await r.evaluate();
    return r.total;
  }

  async function rollD100() {
    return await rolar("1d100");
  }

  async function rollD2d6() {
    return await rolar("2d6");
  }

  // Chance em 1d6. x = null/undefined => sempre presente (sem rolagem).
  async function chance(x) {
    if (x === null || x === undefined) return true;
    const r = await rolar("1d6");
    return r <= x;
  }

  // Procura numa tabela de faixas [{min,max,nome,...}] o item correspondente a um valor rolado.
  function porFaixa(tabela, valor) {
    return tabela.find(l => valor >= l.min && valor <= l.max) ?? tabela[tabela.length - 1];
  }

  function fmt(n) {
    return Number(n).toLocaleString("pt-BR");
  }

  // ============================================================
  // TABELA 9.8 — GEMAS
  // ============================================================
  const TABELA_GEMAS = [
    { min: 2, max: 3, nome: "Preciosa", valor: 500 },
    { min: 4, max: 5, nome: "Ornamental", valor: 50 },
    { min: 6, max: 9, nome: "Decorativa", valor: 10 },
    { min: 10, max: 11, nome: "Semipreciosa", valor: 100 },
    { min: 12, max: 12, nome: "Joia", valor: 1000 },
  ];

  async function gerarGema() {
    const base = porFaixa(TABELA_GEMAS, await rollD2d6());
    let valor = base.valor;
    const estados = [];
    if (await chance(2)) { valor = Math.round(valor * 0.75); estados.push("bruta -25%"); }
    if (await chance(1)) { valor = Math.round(valor * 0.5); estados.push("danificada -50%"); }
    return `${base.nome} (${fmt(valor)} PO)${estados.length ? ` [${estados.join(", ")}]` : ""}`;
  }

  // ============================================================
  // TABELA 9.6 — EQUIPAMENTOS
  // ============================================================
  const EQUIP_TIPO_POR_LINHA = { 2: "Raro", 3: "Raro", 4: "Incomum", 5: "Incomum", 6: "Comum", 7: "Comum", 8: "Comum", 9: "Comum", 10: "Incomum", 11: "Incomum", 12: "Raro" };
  const EQUIP_ITENS = {
    Comum: { 2: "Símbolo Divino", 3: "Saco de Dormir", 4: "Ração de Viagem (1d4)", 5: "Pederneira", 6: "Corda de Cânhamo (15m)", 7: "Tochas (1d4)", 8: "Mochila", 9: "Odre", 10: "Saco de Estopa", 11: "Traje de Exploração", 12: "Ferramenta de Ladrão" },
    Incomum: { 2: "Aljava (1d6 flechas)", 3: "Martelo", 4: "Óleo", 5: "Água Benta", 6: "Pá ou Picareta", 7: "Arpéu", 8: "Lamparina", 9: "Vela (1d4)", 10: "Cravos ou Ganchos (1d4)", 11: "Traje de Inverno", 12: "Lanterna Furta-Fogo" },
    Raro: { 2: "Porta Mapas", 3: "Pena e Tinta", 4: "Corrente", 5: "Algema", 6: "Giz", 7: "Caixa Pequena", 8: "Coberta de Inverno", 9: "Espelho", 10: "Cadeado", 11: "Traje Nobre", 12: "Rede" },
  };

  async function gerarEquipamento() {
    const tipo = EQUIP_TIPO_POR_LINHA[await rollD2d6()];
    const item = EQUIP_ITENS[tipo][await rollD2d6()];
    return `${item} (${tipo})`;
  }

  // ============================================================
  // TABELA 9.7 — OBJETOS DE VALOR
  // ============================================================
  function linhaObjValor(v) {
    if (v <= 3) return 0;
    if (v <= 5) return 1;
    if (v <= 7) return 2;
    if (v <= 9) return 3;
    if (v <= 11) return 4;
    return 5;
  }
  const OBJVALOR_TIPOS = ["Obras de Arte", "Utensílios", "Mercadoria", "Mercadoria", "Louças", "Joias"];
  const OBJVALOR_ITENS = {
    "Mercadoria": ["Peles de Animais Raros*", "Objetos de Marfim", "Sacas de Especiaria*", "Sacas de Incenso*", "Tecidos Nobres*", "Metros de Fina Seda*"],
    "Louças": ["Objetos de Vidro Soprado", "Copos de Vidro e com Prata", "Baixelas de Louça", "Baixelas de Porcelana com Ouro", "Vaso de Porcelana", "Cálices de Vidro com Pedraria"],
    "Utensílios": ["Religiosos de Cobre", "Talheres de Prata", "Candelabros de Prata", "Cutelaria Fina", "Cálices de Ouro", "Religiosos de Ouro"],
    "Obras de Arte": ["Móveis com Marchetaria*", "Tapeçaria Fina*", "Livro Raro", "Escultura*", "Tela Pintada*", "Estatueta em Bronze*"],
    "Joias": ["Cordão de Prata", "Brincos de Pérola", "Bracelete de Prata", "Pingente de Pedraria", "Camafeu de Ouro", "Tiara com Pedraria"],
  };

  async function gerarObjetoDeValor() {
    const tipo = OBJVALOR_TIPOS[linhaObjValor(await rollD2d6())];
    const item = OBJVALOR_ITENS[tipo][linhaObjValor(await rollD2d6())];
    const valor = await rolar("2d6*100");
    return `${item} (${tipo}, ${fmt(valor)} PO)${item.endsWith("*") ? "" : ""}`;
  }

  // ============================================================
  // TABELA 8.2 — SELETOR DE ITEM MÁGICO
  // ============================================================
  const TABELA_TIPO_ITEM = {
    qualquer: [
      { min: 1, max: 20, nome: "espada" }, { min: 21, max: 30, nome: "arma" },
      { min: 31, max: 40, nome: "armadura" }, { min: 41, max: 65, nome: "pocao" },
      { min: 66, max: 85, nome: "pergaminho" }, { min: 86, max: 90, nome: "anel" },
      { min: 91, max: 95, nome: "haste" }, { min: 96, max: 100, nome: "geral" },
    ],
    naoArma: [
      { min: 1, max: 14, nome: "armadura" }, { min: 15, max: 50, nome: "pocao" },
      { min: 51, max: 85, nome: "pergaminho" }, { min: 86, max: 90, nome: "anel" },
      { min: 91, max: 95, nome: "haste" }, { min: 96, max: 100, nome: "geral" },
    ],
    arma: [
      { min: 1, max: 65, nome: "espada" }, { min: 66, max: 100, nome: "arma" },
    ],
  };

  async function gerarItemMagico(coluna = "qualquer") {
    const tipo = porFaixa(TABELA_TIPO_ITEM[coluna], await rollD100()).nome;
    return await gerarItemMagicoPorTipo(tipo);
  }

  async function gerarItemMagicoPorTipo(tipo) {
    switch (tipo) {
      case "espada": return await gerarEspadaMagica();
      case "arma": return await gerarArmaMagica();
      case "armadura": return await gerarArmaduraMagica();
      case "pocao": return await gerarPocao();
      case "pergaminho": return await gerarPergaminho();
      case "anel": return await gerarAnel();
      case "haste": return await gerarHasteMagica();
      case "geral": return await gerarItemGeral();
      default: return "Item mágico desconhecido";
    }
  }

  // ============================================================
  // TABELA 8.3 e 8.4 — ESPADAS MÁGICAS
  // ============================================================
  const ESPADA_TIPO = [
    { min: 1, max: 79, nome: "Espada Longa" }, { min: 80, max: 89, nome: "Espada Curta" },
    { min: 90, max: 94, nome: "Cimitarra" }, { min: 95, max: 99, nome: "Espada Bastarda" },
    { min: 100, max: 100, nome: "Montante" },
  ];
  const ESPADA_BONUS = [
    { min: 1, max: 3, valor: -2, maldicao: true }, { min: 4, max: 10, valor: -1, maldicao: true },
    { min: 11, max: 64, valor: 1 }, { min: 65, max: 84, valor: 2 },
    { min: 85, max: 94, valor: 3, extra: 5 }, { min: 95, max: 99, valor: 4, extra: 10 },
    { min: 100, max: 100, valor: 5, extra: 20 },
  ];
  const ESPADA_TALENTO = [
    { min: 1, max: 59, nome: "Nenhum" }, { min: 60, max: 62, nome: "Matadora de Licantropos" },
    { min: 63, max: 65, nome: "Matadora de Orcs" }, { min: 66, max: 68, nome: "Matadora de Mortos-vivos" },
    { min: 69, max: 71, nome: "Matadora de Usuários de Magia" }, { min: 72, max: 74, nome: "Matadora de Gigantes" },
    { min: 75, max: 77, nome: "Matadora de Regeneradores" }, { min: 78, max: 79, nome: "Matadora de Dragões" },
    { min: 80, max: 81, nome: "Matadora de Extraplanares" }, { min: 82, max: 83, nome: "Defensora" },
    { min: 84, max: 85, nome: "da Cura" }, { min: 86, max: 87, nome: "de Drenar Energia" },
    { min: 88, max: 89, nome: "da Luz" }, { min: 90, max: 91, nome: "Flamejante" },
    { min: 92, max: 93, nome: "Gélida" }, { min: 94, max: 95, nome: "da Respiração" },
    { min: 96, max: 97, nome: "da Velocidade" }, { min: 98, max: 99, nome: "Vorpal" },
    { min: 100, max: 100, nome: "Inteligente" },
  ];
  const ESPADA_INT_TABELA = {
    7: { com: "Empatia", idiomas: null, deteccao: 1, maiores: 0 },
    8: { com: "Empatia", idiomas: null, deteccao: 2, maiores: 0 },
    9: { com: "Empatia", idiomas: null, deteccao: 3, maiores: 0 },
    10: { com: "Fala", idiomas: "1d3", deteccao: 3, maiores: 0 },
    11: { com: "Fala", idiomas: "1d4", deteccao: 3, maiores: 0 },
    12: { com: "Fala", idiomas: "1d6", deteccao: 3, maiores: 1 },
  };
  const PODERES_DETECCAO = ["Detectar Alinhamento", "Detectar Armadilhas", "Detectar Desníveis", "Detectar Gemas", "Detectar Invisibilidade", "Detectar Magia", "Detectar Metal", "Detectar Portas Secretas"];
  const PODERES_MAIORES = ["Clariaudiência", "Clarividência", "Regenerar", "Dano Extra (x3, 1d10 rodadas)", "Ilusão", "Levitação", "Percepção Extrassensorial", "Telecinesia", "Telepatia", "Teleporte", "Visão de Raio X", "Voo"];

  async function gerarEspadaMagica() {
    const tipo = porFaixa(ESPADA_TIPO, await rollD100()).nome;
    const bonus = porFaixa(ESPADA_BONUS, await rollD100());
    const bonusTxt = bonus.maldicao ? `${bonus.valor} (Amaldiçoada — Caótica)` : `+${bonus.valor}${bonus.extra ? ` (+${bonus.extra}% no talento)` : ""}`;
    let talentoRoll = Math.min(100, (await rollD100()) + (bonus.extra ?? 0));
    let talento = porFaixa(ESPADA_TALENTO, talentoRoll).nome;

    let extras = "";
    if (talento === "Inteligente") {
      const int = (await rolar("1d6")) + 6;
      const tab = ESPADA_INT_TABELA[int];
      const partes = [`INT ${int}`, `Comunicação: ${tab.com}`];
      if (tab.idiomas) partes.push(`Idiomas: ${await rolar(tab.idiomas)}`);
      const det = [];
      for (let i = 0; i < tab.deteccao; i++) det.push(PODERES_DETECCAO[(await rolar("1d8")) - 1]);
      if (det.length) partes.push(`Detecção: ${det.join(", ")}`);
      const mai = [];
      for (let i = 0; i < tab.maiores; i++) mai.push(PODERES_MAIORES[(await rolar("1d12")) - 1]);
      if (mai.length) partes.push(`Poder Maior: ${mai.join(", ")}`);
      const talento2 = porFaixa(ESPADA_TALENTO, await rollD100()).nome;
      if (talento2 !== "Nenhum" && talento2 !== "Inteligente") partes.push(`Também é: ${talento2}`);
      extras = ` | Inteligente (${partes.join("; ")})`;
    } else if (talento !== "Nenhum") {
      extras = ` | Talento: ${talento}`;
    }
    return `Espada Mágica — ${tipo}, ${bonusTxt}${extras}`;
  }

  // ============================================================
  // TABELA 8.5 — ARMAS MÁGICAS (não-espadas)
  // ============================================================
  const ARMA_TIPO = [
    { min: 1, max: 3, nome: "Flecha de Guerra (2d6+6 unidades)" }, { min: 4, max: 4, nome: "Arco Curto" },
    { min: 5, max: 5, nome: "Arco Longo" }, { min: 6, max: 6, nome: "Besta de Mão" },
    { min: 7, max: 7, nome: "Besta" }, { min: 8, max: 9, nome: "Funda (2d10+4 unidades de munição)" },
    { min: 10, max: 19, nome: "Adaga" }, { min: 20, max: 21, nome: "Alabarda" },
    { min: 22, max: 23, nome: "Azagaia" }, { min: 24, max: 25, nome: "Bordão/Cajado" },
    { min: 26, max: 30, nome: "Lança" }, { min: 31, max: 40, nome: "Lança Longa" },
    { min: 41, max: 50, nome: "Maça" }, { min: 51, max: 60, nome: "Machado" },
    { min: 61, max: 65, nome: "Machado de Arremesso" }, { min: 66, max: 80, nome: "Machado de Batalha" },
    { min: 81, max: 85, nome: "Mangual" }, { min: 86, max: 95, nome: "Martelo de Batalha" },
    { min: 96, max: 98, nome: "Pique" }, { min: 99, max: 100, nome: "Porrete/Clava" },
  ];
  const ARMA_BONUS = [
    { min: 1, max: 3, valor: -2, maldicao: true }, { min: 4, max: 10, valor: -1, maldicao: true },
    { min: 11, max: 74, valor: 1 }, { min: 75, max: 94, valor: 2 }, { min: 95, max: 100, valor: 3, extra: 5 },
  ];
  const GRUPO_TALENTO_POR_ARMA = {
    "Adaga": "adaga",
    "Alabarda": "pique", "Pique": "pique", "Lança Longa": "pique",
    "Azagaia": "lanca", "Lança": "lanca",
    "Bordão/Cajado": "bordao", "Porrete/Clava": "bordao",
    "Maça": "maca", "Mangual": "maca", "Martelo de Batalha": "maca",
    "Machado": "machado", "Machado de Arremesso": "machado", "Machado de Batalha": "machado",
    "Flecha de Guerra (2d6+6 unidades)": "projetil", "Arco Curto": "projetil", "Arco Longo": "projetil",
    "Besta de Mão": "projetil", "Besta": "projetil", "Funda (2d10+4 unidades de munição)": "projetil",
  };
  const GRUPOS_TALENTO = {
    adaga: { dado: 4, opcoes: ["Prata (eficaz contra licantropos e mortos-vivos especiais)", "Retorno (volta à mão se arremessada e não atingir)", "Crítica (acerto crítico com 19-20)", "Flamejante (+1d4 de dano de fogo)"] },
    pique: { dado: 3, opcoes: ["Desarme (JPC ou solta a arma)", "Defensora (bônus também na CA)", "Vigilante (detecta um tipo de inimigo/raça em 18m)"] },
    lanca: { dado: 3, opcoes: ["Retorno (volta à mão se arremessada e não atingir)", "Desarme (JPC ou solta a arma)", "Defensora (bônus também na CA)"] },
    bordao: { dado: 3, opcoes: ["Defensora (bônus também na CA)", "Curadora (cura 1d8+4 PV/dia ao tocar)", "Desarme (JPC ou solta a arma)"] },
    maca: { dado: 4, opcoes: ["Retorno (volta à mão se arremessada e não atingir)", "Explosão (+1d6 dano em área de 1d4m)", "Voo (1x/dia: 36m/turno por 3 turnos)", "Desarme (JPC ou solta a arma)"] },
    machado: { dado: 4, opcoes: ["Crítica (acerto crítico com 19-20)", "Velocidade (1x/dia: mov. dobrado, +2 CA, ataque extra)", "Arremesso (ganha alcance 3/6/9)", "Matador (bônus +1 vs. 1-Orcs/2-Mortos-vivos/3-Gigantes/4-Usuários de Magia, role 1d4)"] },
    projetil: { dado: 4, opcoes: ["Atordoamento (JPC ou atordoado 1d6 rodadas)", "Desarme (JPC ou solta a arma)", "Penetrante (ignora cobertura/proteção)", "Explosão (+1d6 dano em área de 1d4m)"] },
  };

  async function gerarArmaMagica() {
    const tipo = porFaixa(ARMA_TIPO, await rollD100()).nome;
    const bonus = porFaixa(ARMA_BONUS, await rollD100());
    const bonusTxt = bonus.maldicao ? `${bonus.valor} (Amaldiçoada — Caótica)` : `+${bonus.valor}`;
    let extras = "";
    if ((await rollD100()) >= 91) {
      const grupo = GRUPOS_TALENTO[GRUPO_TALENTO_POR_ARMA[tipo]];
      if (grupo) {
        const escolha = await rolar(`1d${grupo.dado}`);
        extras = ` | Talento Especial: ${grupo.opcoes[escolha - 1]}`;
      }
    }
    return `Arma Mágica — ${tipo}, ${bonusTxt}${extras}`;
  }

  // ============================================================
  // TABELA 8.6 — ARMADURAS MÁGICAS
  // ============================================================
  const ARMADURA_TIPO = [
    { min: 1, max: 40, nome: "Escudo" }, { min: 41, max: 45, nome: "Armadura Acolchoada" },
    { min: 46, max: 50, nome: "Armadura de Couro" }, { min: 51, max: 55, nome: "Armadura de Couro Batido" },
    { min: 56, max: 85, nome: "Cota de Malha" }, { min: 86, max: 95, nome: "Armadura de Placas" },
    { min: 96, max: 100, nome: "Armadura Completa" },
  ];
  const ARMADURA_BONUS = [
    { min: 1, max: 3, valor: -2, maldicao: true }, { min: 4, max: 10, valor: -1, maldicao: true },
    { min: 11, max: 74, valor: 1 }, { min: 75, max: 94, valor: 2 }, { min: 95, max: 100, valor: 3, extra: 5 },
  ];
  const ARMADURA_TALENTO = [
    { min: 1, max: 93, nome: "Nenhum" }, { min: 94, max: 94, nome: "Absorção" },
    { min: 95, max: 95, nome: "Velocidade" }, { min: 96, max: 96, nome: "Curadora" },
    { min: 97, max: 97, nome: "Retribuição" }, { min: 98, max: 98, nome: "Invisibilidade" },
    { min: 99, max: 99, nome: "Reflexão" }, { min: 100, max: 100, nome: "Contra Projéteis" },
  ];

  async function gerarArmaduraMagica() {
    const tipo = porFaixa(ARMADURA_TIPO, await rollD100()).nome;
    const bonus = porFaixa(ARMADURA_BONUS, await rollD100());
    const bonusTxt = bonus.maldicao ? `${bonus.valor} (Amaldiçoada — Caótica)` : `+${bonus.valor}`;
    const talento = porFaixa(ARMADURA_TALENTO, await rollD100()).nome;
    return `Armadura/Escudo Mágico — ${tipo}, ${bonusTxt}${talento !== "Nenhum" ? ` | Talento: ${talento}` : ""}`;
  }

  // ============================================================
  // TABELA 8.7 — POÇÕES
  // ============================================================
  const POCOES = [
    { min: 1, max: 5, nome: "Amaldiçoada (Caótica)" }, { min: 6, max: 15, nome: "Placebo (Caótica)" },
    { min: 16, max: 50, nome: "Cura (1d8 PV)" }, { min: 51, max: 64, nome: "Controle" },
    { min: 65, max: 66, nome: "Diminuição" }, { min: 67, max: 68, nome: "Forma Gasosa" },
    { min: 69, max: 70, nome: "Força Gigante" }, { min: 71, max: 72, nome: "Crescimento" },
    { min: 73, max: 74, nome: "Invisibilidade" }, { min: 75, max: 76, nome: "Veneno" },
    { min: 77, max: 78, nome: "Antídoto" }, { min: 79, max: 80, nome: "Defesa" },
    { min: 81, max: 82, nome: "Metamorfose" }, { min: 83, max: 84, nome: "Velocidade" },
    { min: 85, max: 86, nome: "Clarividência" }, { min: 87, max: 88, nome: "Percepção Extrassensorial" },
    { min: 89, max: 90, nome: "Resistência ao Fogo" }, { min: 91, max: 92, nome: "Voo" },
    { min: 93, max: 94, nome: "Heroísmo" }, { min: 95, max: 96, nome: "Respirar na Água" },
    { min: 97, max: 98, nome: "Sorte" }, { min: 99, max: 100, nome: "Salto" },
  ];

  async function gerarPocao() {
    const base = porFaixa(POCOES, await rollD100());
    let nome = base.nome;
    if (nome === "Controle") {
      const s = await rolar("1d6");
      nome = `Controle de ${s <= 3 ? "Animais" : s <= 5 ? "Plantas" : "Humanos"}`;
    } else if (nome === "Heroísmo") {
      const classe = ["Clérigo", "Guerreiro", "Ladrão", "Mago"][(await rolar("1d4")) - 1];
      nome = `Heroísmo (nível de ${classe})`;
    }
    return `Poção de ${nome}`;
  }

  // ============================================================
  // TABELA 8.8 — PERGAMINHOS
  // ============================================================
  const PERGAMINHOS = [
    { min: 1, max: 15, nome: "Amaldiçoado (Caótico)" }, { min: 16, max: 30, nome: "Arcano (1 círculo)" },
    { min: 31, max: 40, nome: "Arcano (3 círculos)" }, { min: 41, max: 45, nome: "Arcano (4 círculos)" },
    { min: 46, max: 48, nome: "Arcano (7 círculos)" }, { min: 49, max: 50, nome: "Arcano (9 círculos)" },
    { min: 51, max: 60, nome: "Divino (1 círculo)" }, { min: 61, max: 63, nome: "Divino (3 círculos)" },
    { min: 64, max: 65, nome: "Divino (7 círculos)" }, { min: 66, max: 67, nome: "Proteção ao Caos" },
    { min: 68, max: 69, nome: "Proteção à Ordem" }, { min: 70, max: 71, nome: "Proteção à Magia" },
    { min: 72, max: 73, nome: "Proteção a Mortos-vivos" }, { min: 74, max: 74, nome: "Proteção a Licantropos" },
    { min: 75, max: 75, nome: "Proteção a Elementais" }, { min: 76, max: 78, nome: "Mapa do Tesouro (tipo A)" },
    { min: 79, max: 81, nome: "Mapa do Tesouro (tipo B)" }, { min: 82, max: 84, nome: "Mapa do Tesouro (tipo C)" },
    { min: 85, max: 87, nome: "Mapa do Tesouro (tipo D)" }, { min: 88, max: 90, nome: "Mapa do Tesouro (tipo E)" },
    { min: 91, max: 93, nome: "Mapa do Tesouro (tipo F)" }, { min: 94, max: 96, nome: "Mapa do Tesouro (tipo G)" },
    { min: 97, max: 99, nome: "Mapa do Tesouro (tipo H)" }, { min: 100, max: 100, nome: "Mapa do Tesouro (tipo M)" },
  ];

  async function gerarPergaminho() {
    return `Pergaminho de ${porFaixa(PERGAMINHOS, await rollD100()).nome}`;
  }

  // ============================================================
  // TABELA 8.9 — ANÉIS
  // ============================================================
  const ANEIS = [
    { min: 1, max: 15, nome: "Amaldiçoado (Caótico)" }, { min: 16, max: 45, nome: "Proteção +1" },
    { min: 46, max: 65, nome: "Proteção +2" }, { min: 66, max: 68, nome: "Proteção +3" },
    { min: 69, max: 69, nome: "Proteção +4" }, { min: 70, max: 71, nome: "Controle de Animais" },
    { min: 72, max: 73, nome: "Controle de Humanos" }, { min: 74, max: 75, nome: "Controle de Plantas" },
    { min: 76, max: 77, nome: "Regeneração" }, { min: 78, max: 79, nome: "Invisibilidade" },
    { min: 80, max: 81, nome: "Resistência ao Fogo" }, { min: 82, max: 83, nome: "Telecinesia" },
    { min: 84, max: 85, nome: "Andar sobre as Águas" }, { min: 86, max: 87, nome: "Refletir Magias" },
    { min: 88, max: 89, nome: "Armazenar Magias" }, { min: 90, max: 91, nome: "Anti-Ilusão" },
    { min: 92, max: 93, nome: "Verdade" }, { min: 94, max: 95, nome: "Ouro de Tolo" },
    { min: 96, max: 97, nome: "Santidade" }, { min: 98, max: 99, nome: "Visão de Raio X" },
    { min: 100, max: 100, nome: "Desejo" },
  ];

  async function gerarAnel() {
    return `Anel de/da ${porFaixa(ANEIS, await rollD100()).nome}`;
  }

  // ============================================================
  // TABELA 8.10 — HASTES MÁGICAS
  // ============================================================
  const HASTES = [
    { min: 1, max: 15, nome: "Amaldiçoada", tipo: null },
    { min: 16, max: 22, nome: "Varinha de Detecção de Inimigos", tipo: "varinha" },
    { min: 23, max: 30, nome: "Varinha de Detecção de Magia", tipo: "varinha" },
    { min: 31, max: 37, nome: "Varinha de Detecção de Armadilhas", tipo: "varinha" },
    { min: 38, max: 44, nome: "Varinha de Paralisação", tipo: "varinha" },
    { min: 45, max: 51, nome: "Varinha de Bolas de Fogo", tipo: "varinha" },
    { min: 52, max: 58, nome: "Varinha do Medo", tipo: "varinha" },
    { min: 59, max: 65, nome: "Varinha do Congelamento", tipo: "varinha" },
    { min: 66, max: 72, nome: "Varinha da Ilusão", tipo: "varinha" },
    { min: 73, max: 79, nome: "Varinha do Relâmpago", tipo: "varinha" },
    { min: 80, max: 86, nome: "Varinha da Transformação", tipo: "varinha" },
    { min: 87, max: 88, nome: "Cajado da Cura", tipo: "cajado" },
    { min: 89, max: 90, nome: "Cajado de Ataque", tipo: "cajado" },
    { min: 91, max: 92, nome: "Cajado da Serpente", tipo: "cajado" },
    { min: 93, max: 94, nome: "Cajado da Anulação", tipo: "cajado" },
    { min: 95, max: 96, nome: "Cajado do Controle", tipo: "cajado" },
    { min: 97, max: 97, nome: "Bastão do Governante", tipo: "bastao" },
    { min: 98, max: 98, nome: "Bastão do Bloqueio", tipo: "bastao" },
    { min: 99, max: 99, nome: "Bastão do Armamento", tipo: "bastao" },
    { min: 100, max: 100, nome: "Bastão do Cancelamento", tipo: "bastao" },
  ];

  async function gerarHasteMagica() {
    let roll = await rollD100();
    let base = porFaixa(HASTES, roll);
    let amaldicoada = false;
    if (base.nome === "Amaldiçoada") {
      amaldicoada = true;
      do { roll = await rollD100(); base = porFaixa(HASTES, roll); } while (roll <= 15);
    }
    let cargas = "";
    if (base.tipo === "varinha") cargas = ` (${await rolar("2d10")} cargas)`;
    else if (base.tipo === "cajado") cargas = ` (${await rolar("3d10")} cargas)`;
    return `Haste Mágica — ${base.nome}${cargas}${amaldicoada ? " [amaldiçoada — identidade oculta até o uso]" : ""}`;
  }

  // ============================================================
  // TABELA 8.11 — ITENS MÁGICOS GERAIS
  // ============================================================
  const GERAIS = [
    { min: 1, max: 4, nome: "Livro dos Grandes Feitos" }, { min: 5, max: 8, nome: "Bestiário: o Livro dos Monstros" },
    { min: 9, max: 12, nome: "Grande Livro da Conjuração" }, { min: 13, max: 16, nome: "Medalhão da PES" },
    { min: 17, max: 20, nome: "Camafeu do Aprisionamento" }, { min: 21, max: 24, nome: "Manto do Deslocamento" },
    { min: 25, max: 28, nome: "Manto Élfico" }, { min: 29, max: 32, nome: "Bota da Levitação" },
    { min: 33, max: 36, nome: "Botas Élficas" }, { min: 37, max: 40, nome: "Manoplas da Força do Ogro" },
    { min: 41, max: 44, nome: "Elmo da Mudança de Alinhamento (Caótico)" }, { min: 45, max: 48, nome: "Cinto da Força do Gigante" },
    { min: 49, max: 52, nome: "Elmo da Telepatia" }, { min: 53, max: 56, nome: "Tambores do Pânico (Caótico)" },
    { min: 57, max: 60, nome: "Trombeta da Destruição (Caótico)" }, { min: 61, max: 64, nome: "Sacola Devoradora (Caótico)" },
    { min: 65, max: 68, nome: "Sacola Guardiã" }, { min: 69, max: 72, nome: "Buraco Portátil" },
    { min: 73, max: 76, nome: "Corda da Escalada" }, { min: 77, max: 80, nome: "Vassoura de Voo" },
    { min: 81, max: 84, nome: "Bola de Cristal" }, { min: 85, max: 88, nome: "Baralho das Maravilhas (Caótico)" },
    { min: 89, max: 92, nome: "Baralho da Navegação Planar" }, { min: 93, max: 96, nome: "Garrafa do Gênio" },
    { min: 97, max: 100, nome: "Tapete Voador" },
  ];

  async function gerarItemGeral() {
    return `Item Mágico Geral — ${porFaixa(GERAIS, await rollD100()).nome}`;
  }

  // ============================================================
  // TABELA 9.5 — TESOUROS DE COVIL (A-O) e INDIVIDUAIS (P-V)
  // ch = chance em 1d6 (null = sempre presente); f = fórmula de dado
  // ============================================================
  const COVIL = {
    A: { rapido: "12.000 PO", po: { ch: 2, f: "2d6*1000" }, pp: { ch: 2, f: "1d6*1000" }, pc: { ch: 1, f: "1d6*1000" }, gemas: { ch: 3, f: "6d6" }, valores: { ch: 3, f: "6d6" }, magicos: { ch: 2, itens: [{ qtd: 3, coluna: "qualquer" }] } },
    B: { rapido: "1.400 PO", po: { ch: 1, f: "1d3*1000" }, pp: { ch: 1, f: "1d6*1000" }, pc: { ch: 3, f: "1d8*1000" }, gemas: { ch: 1, f: "1d6" }, valores: { ch: 1, f: "1d6" }, magicos: { ch: 1, itens: [{ qtd: 1, coluna: "arma" }] } },
    C: { rapido: "650 PO", pp: { ch: 2, f: "1d4*1000" }, pc: { ch: 2, f: "1d12*1000" }, gemas: { ch: 1, f: "1d4" }, valores: { ch: 1, f: "1d4" }, magicos: { ch: null, itens: [{ qtd: 2, coluna: "qualquer" }] } },
    D: { rapido: "3.400 PO", po: { ch: 3, f: "1d6*1000" }, pp: { ch: 1, f: "1d12*1000" }, pc: { ch: 1, f: "1d8*1000" }, gemas: { ch: 2, f: "1d8" }, valores: { ch: 2, f: "1d8" }, magicos: { ch: 1, itens: [{ qtd: 2, coluna: "qualquer" }, { qtd: 1, tipo: "pocao" }] } },
    E: { rapido: "1.800 PO", po: { ch: 1, f: "1d8*1000" }, pp: { ch: 2, f: "1d12*1000" }, pc: { ch: 1, f: "1d10*1000" }, gemas: { ch: 1, f: "1d10" }, valores: { ch: 1, f: "1d10" }, magicos: { ch: 1, itens: [{ qtd: 3, coluna: "qualquer" }, { qtd: 1, tipo: "pergaminho" }] } },
    F: { rapido: "4.000 PO", po: { ch: 2, f: "1d12*1000" }, pp: { ch: 1, f: "2d10*1000" }, gemas: { ch: 1, f: "2d12" }, valores: { ch: 1, f: "1d12" }, magicos: { ch: 2, itens: [{ qtd: 3, coluna: "naoArma" }, { qtd: 1, tipo: "pocao" }, { qtd: 1, tipo: "pergaminho" }] } },
    G: { rapido: "14.000 PO", po: { ch: 3, f: "10d4*1000" }, gemas: { ch: 1, f: "3d6" }, valores: { ch: 1, f: "1d10" }, magicos: { ch: 2, itens: [{ qtd: 4, coluna: "qualquer" }, { qtd: 1, tipo: "pergaminho" }] } },
    H: { rapido: "27.000 PO", po: { ch: 3, f: "10d6*1000" }, pp: { ch: 3, f: "1d10*1000" }, pc: { ch: 1, f: "3d8*1000" }, gemas: { ch: 3, f: "1d10" }, valores: { ch: 3, f: "10d4" }, magicos: { ch: 1, itens: [{ qtd: 4, coluna: "qualquer" }, { qtd: 1, tipo: "pocao" }, { qtd: 1, tipo: "pergaminho" }] } },
    I: { rapido: "2.800 PO", gemas: { ch: 3, f: "2d6" }, valores: { ch: 3, f: "2d6" }, magicos: { ch: 1, itens: [{ qtd: 1, coluna: "qualquer" }] } },
    J: { rapido: "25 PO", pp: { ch: 1, f: "1d3*1000" }, pc: { ch: 1, f: "1d4*1000" } },
    K: { rapido: "15 PO", pp: { ch: 1, f: "1d2*1000" } },
    L: { rapido: "200 PO", gemas: { ch: 3, f: "1d4" } },
    M: { rapido: "40.000 PO", po: { ch: 5, f: "8d10*1000" }, pp: { ch: 3, f: "10d6*1000" }, gemas: { ch: 3, f: "5d4" }, valores: { ch: 2, f: "2d6" } },
    N: { rapido: "—", magicos: { ch: 2, itens: [{ formula: "2d4", tipo: "pocao" }] } },
    O: { rapido: "—", magicos: { ch: 3, itens: [{ formula: "1d4", tipo: "pocao" }] } },
  };

  const INDIVIDUAL = {
    P: { rapido: "1 PP", pc: { ch: null, f: "3d8" } },
    Q: { rapido: "1 PO", pp: { ch: null, f: "3d6" } },
    R: { rapido: "3 PO", po: { ch: null, f: "1d6" }, equip: { ch: 2, f: "1" } },
    S: { rapido: "5 PO", po: { ch: null, f: "2d4" }, equip: { ch: 2, f: "1" } },
    T: { rapido: "17 PO", po: { ch: null, f: "1d6*5" }, equip: { ch: 2, f: "2" } },
    U: { rapido: "90 PO", po: { ch: 1, f: "1d10" }, pp: { ch: 1, f: "1d10" }, pc: { ch: 1, f: "1d10" }, equip: { ch: 1, f: "1d4" }, valores: { ch: 1, f: "1" }, magicos: { ch: 1, itens: [{ qtd: 1, coluna: "qualquer" }] } },
    V: { rapido: "175 PO", po: { ch: 2, f: "1d10" }, pp: { ch: 2, f: "1d10" }, equip: { ch: 1, f: "1d6" }, valores: { ch: 1, f: "1d4" }, magicos: { ch: 2, itens: [{ qtd: 1, coluna: "qualquer" }] } },
  };

  // ============================================================
  // GERADOR PRINCIPAL DE TESOURO
  // ============================================================
  async function gerarTesouro(tipoLetra) {
    const covil = "ABCDEFGHIJKLMNO".includes(tipoLetra);
    const cfg = covil ? COVIL[tipoLetra] : INDIVIDUAL[tipoLetra];
    const itens = [];

    async function addMoeda(nome, campo) {
      const c = cfg[campo];
      if (!c) return;
      if (await chance(c.ch)) {
        const qtd = await rolar(c.f);
        itens.push(`<b>${nome}:</b> ${fmt(qtd)}`);
      }
    }
    await addMoeda("Peças de Ouro (PO)", "po");
    await addMoeda("Peças de Prata (PP)", "pp");
    await addMoeda("Peças de Cobre (PC)", "pc");

    if (cfg.gemas && await chance(cfg.gemas.ch)) {
      const n = await rolar(cfg.gemas.f);
      const lista = [];
      for (let i = 0; i < n; i++) lista.push(await gerarGema());
      itens.push(`<b>Gemas (${n}):</b><br>&nbsp;&nbsp;• ${lista.join("<br>&nbsp;&nbsp;• ")}`);
    }

    if (cfg.valores && await chance(cfg.valores.ch)) {
      const n = await rolar(cfg.valores.f);
      const lista = [];
      for (let i = 0; i < n; i++) lista.push(await gerarObjetoDeValor());
      itens.push(`<b>Objetos de Valor (${n}):</b><br>&nbsp;&nbsp;• ${lista.join("<br>&nbsp;&nbsp;• ")}`);
    }

    if (cfg.equip && await chance(cfg.equip.ch)) {
      const n = await rolar(cfg.equip.f);
      const lista = [];
      for (let i = 0; i < n; i++) lista.push(await gerarEquipamento());
      itens.push(`<b>Equipamentos (${n}):</b><br>&nbsp;&nbsp;• ${lista.join("<br>&nbsp;&nbsp;• ")}`);
    }

    if (cfg.magicos && await chance(cfg.magicos.ch)) {
      const lista = [];
      for (const spec of cfg.magicos.itens) {
        const n = spec.formula ? await rolar(spec.formula) : spec.qtd;
        for (let i = 0; i < n; i++) {
          const item = spec.tipo ? await gerarItemMagicoPorTipo(spec.tipo) : await gerarItemMagico(spec.coluna);
          lista.push(item);
        }
      }
      itens.push(`<b>Itens Mágicos (${lista.length}):</b><br>&nbsp;&nbsp;• ${lista.join("<br>&nbsp;&nbsp;• ")}`);
    }

    if (itens.length === 0) itens.push("<i>Nenhum tesouro encontrado! (todas as jogadas de chance falharam)</i>");

    return { tipo: tipoLetra, covil, itens };
  }

  // ============================================================
  // MENSAGEM DE CHAT
  // ============================================================
  async function postarResultado(resultado) {
    const titulo = resultado.covil
      ? `Tesouro de Covil — Tipo ${resultado.tipo}`
      : `Tesouro Individual/Carregado — Tipo ${resultado.tipo}`;
    const rapidoObj = resultado.covil ? COVIL[resultado.tipo] : INDIVIDUAL[resultado.tipo];

    const content = `
      <div class="od2-tesouro" style="border:1px solid #782e22; border-radius:6px; padding:8px;">
        <h2 style="margin:0 0 4px 0; border-bottom:2px solid #782e22;">🎲 ${titulo}</h2>
        <p style="margin:0 0 8px 0; font-size:11px; color:#666;"><i>Tesouro Rápido de referência: ${rapidoObj.rapido}</i></p>
        <div style="line-height:1.6;">
          ${resultado.itens.map(i => `<div style="margin-bottom:6px;">${i}</div>`).join("")}
        </div>
      </div>`;

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker(),
      content,
    });
  }

  // ============================================================
  // DIÁLOGO DE SELEÇÃO
  // ============================================================
  function mostrarDialogo() {
    const tiposCovil = Object.keys(COVIL);
    const tiposIndividuais = Object.keys(INDIVIDUAL);
    const opt = (t, obj) => `<option value="${t}">${t} — Tesouro Rápido: ${obj.rapido}</option>`;

    const content = `
      <form>
        <div class="form-group">
          <label><b>Tipo de Tesouro Encontrado</b></label>
          <select id="tipo-tesouro" style="width:100%; margin-top:4px;">
            <optgroup label="Tesouros de Covil (A-O)">
              ${tiposCovil.map(t => opt(t, COVIL[t])).join("")}
            </optgroup>
            <optgroup label="Tesouros Individuais / Carregados (P-V)">
              ${tiposIndividuais.map(t => opt(t, INDIVIDUAL[t])).join("")}
            </optgroup>
          </select>
        </div>
        <p style="font-size:11px; color:#666; margin-top:8px;">
          A-O: tesouros de covil (encontrados só ao descobrir o esconderijo dos monstros).<br>
          P-V: tesouros individuais/carregados (cada monstro carrega o seu).
        </p>
      </form>`;

    new Dialog({
      title: "Gerador de Tesouros — Old Dragon 2",
      content,
      buttons: {
        gerar: {
          icon: '<i class="fas fa-dice-d20"></i>',
          label: "Gerar Tesouro",
          callback: async (html) => {
            const tipo = html.find("#tipo-tesouro").val();
            const resultado = await gerarTesouro(tipo);
            await postarResultado(resultado);
          },
        },
        cancelar: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancelar",
        },
      },
      default: "gerar",
    }).render(true);
  }

  mostrarDialogo();

})();
