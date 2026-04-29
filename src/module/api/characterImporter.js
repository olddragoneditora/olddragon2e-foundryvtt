const RACE_UUIDS = {
  anao: 'Compendium.olddragon2e.races.Item.d9seo5qPELZJetH6',
  elfo: 'Compendium.olddragon2e.races.Item.qZ5T7ZHQpGlmdfOq',
  gnomo: 'Compendium.olddragon2e.races.Item.GLAN1JCU7dTEVHmZ',
  halfling: 'Compendium.olddragon2e.races.Item.3VqpR0B3GFRHm9i7',
  humano: 'Compendium.olddragon2e.races.Item.LVAnPRB3y5OexOmz',
  'meio-elfo': 'Compendium.olddragon2e.races.Item.sdsNB4qd7pXkRBy9',
  // Raças de Legião
  grizzi: 'Compendium.olddragon2e-legiao.races.Item.1f25F4v2vMOSoZCp',
  'meio-elfo-kaduriano': 'Compendium.olddragon2e-legiao.races.Item.bchRiwagDwkAToHU',
  tenebrum: 'Compendium.olddragon2e-legiao.races.Item.Afas2pzK75wylg4r',
  // Raças do Guia de Raças
  atlante: 'Compendium.olddragon2e-racas.races.Item.2ZgnqWBxFihzPpZo',
  autokthon: 'Compendium.olddragon2e-racas.races.Item.dpT6s5hAIMTFTwKQ',
  bugbear: 'Compendium.olddragon2e-racas.races.Item.w4uEgGMY3OdlHxgk',
  cambion: 'Compendium.olddragon2e-racas.races.Item.PMECuRBiJabRab4O',
  centauro: 'Compendium.olddragon2e-racas.races.Item.6UlAnVK7ysIhKCvd',
  ceratopos: 'Compendium.olddragon2e-racas.races.Item.BZCqEkxVKFAmqe2y',
  ciclope: 'Compendium.olddragon2e-racas.races.Item.JGuLoU3pNWQlECNG',
  derro: 'Compendium.olddragon2e-racas.races.Item.g3Iw4z9ZlhZePn1N',
  drakold: 'Compendium.olddragon2e-racas.races.Item.cN0jWa7Bu6tFIxkH',
  duende: 'Compendium.olddragon2e-racas.races.Item.DVdGESO6gNuaL6MZ',
  duergar: 'Compendium.olddragon2e-racas.races.Item.0e2w3eNbq5X9Nzzy',
  'elfo-drow': 'Compendium.olddragon2e-racas.races.Item.gWdgiuRPp8T117wg',
  'fera-do-pantano': 'Compendium.olddragon2e-racas.races.Item.9HRRY0k6dQICU7i0',
  'fungo-pigmeu': 'Compendium.olddragon2e-racas.races.Item.xmulnel0RvqWwwsK',
  gnoll: 'Compendium.olddragon2e-racas.races.Item.2vwS5hIQ6GCFCXg2',
  goblin: 'Compendium.olddragon2e-racas.races.Item.EFefWgmQWX7p4qWD',
  hobgoblin: 'Compendium.olddragon2e-racas.races.Item.45XDu2sP4ZOCRLH2',
  'homem-lagarto': 'Compendium.olddragon2e-racas.races.Item.xBa68EbdDBXrg0Jm',
  'homem-lagarto-povo-camaleao': 'Compendium.olddragon2e-racas.races.Item.PhHv2tHfft3EImfb',
  'homem-lagarto-povo-gila': 'Compendium.olddragon2e-racas.races.Item.yU2ji6yP0j6FDl7C',
  'homem-lagarto-povo-lagartixa': 'Compendium.olddragon2e-racas.races.Item.Mc9yoinN1Xk9XfgE',
  'homem-lagarto-povo-lagarto-subterraneo': 'Compendium.olddragon2e-racas.races.Item.inq2kMiMUSmCz9Nr',
  'homem-lagarto-povo-lagarto-voador': 'Compendium.olddragon2e-racas.races.Item.KMzh57CBIoRwypBB',
  'homem-lagarto-povo-moloch': 'Compendium.olddragon2e-racas.races.Item.Q8vPH3vOksewuicw',
  howkar: 'Compendium.olddragon2e-racas.races.Item.LAULwpLKcWMH4mJK',
  kobold: 'Compendium.olddragon2e-racas.races.Item.ysSpjUHQqBX6wCA0',
  mantis: 'Compendium.olddragon2e-racas.races.Item.EHjWlXRakNdn1OXc',
  'meio-anao': 'Compendium.olddragon2e-racas.races.Item.7Iy6OoVcwGZRrEET',
  'meio-dragao': 'Compendium.olddragon2e-racas.races.Item.jv0RJOg0c0rljz9A',
  'meio-gigante': 'Compendium.olddragon2e-racas.races.Item.Elg4U55xBOKuGVIX',
  'meio-orc': 'Compendium.olddragon2e-racas.races.Item.e23XaoQHgSDqnJqr',
  minotauro: 'Compendium.olddragon2e-racas.races.Item.FLBgz4EG1CtLvtMQ',
  muskin: 'Compendium.olddragon2e-racas.races.Item.pZE0MyykzBX0uB4F',
  nefilim: 'Compendium.olddragon2e-racas.races.Item.jrEnAACLCvdufx8h',
  ogro: 'Compendium.olddragon2e-racas.races.Item.7kmnP2OIE8kNizA7',
  orc: 'Compendium.olddragon2e-racas.races.Item.zhNSMiBSsw9bHjgl',
  pixie: 'Compendium.olddragon2e-racas.races.Item.34p0PIsHqjE6D3DI',
  pteros: 'Compendium.olddragon2e-racas.races.Item.LED2AY0WIUKuqHH6',
  sahuagin: 'Compendium.olddragon2e-racas.races.Item.KHdHyP6SIZRcyjKa',
  satiro: 'Compendium.olddragon2e-racas.races.Item.taxNz4ZkJlwUKHKb',
  sibilante: 'Compendium.olddragon2e-racas.races.Item.XzdZlAbHku4mwDPS',
  teropodes: 'Compendium.olddragon2e-racas.races.Item.il6jvAPVLwv1DtxP',
  thoul: 'Compendium.olddragon2e-racas.races.Item.J4lAuTigET7tzIdl',
  treant: 'Compendium.olddragon2e-racas.races.Item.9x9wnU1I2AUoQE5r',
  troglodita: 'Compendium.olddragon2e-racas.races.Item.wrKtBeIgR1OoDLu4',
  varkos: 'Compendium.olddragon2e-racas.races.Item.4fwAIsiiTJEsdvcD',
};

const CLASS_UUIDS = {
  academico: 'Compendium.olddragon2e.classes.Item.UbJdOGEnK1AHoHrh',
  'anao-aventureiro': 'Compendium.olddragon2e.classes.Item.Y46BnHjmf9v2sYYA',
  arqueiro: 'Compendium.olddragon2e.classes.Item.zVsnFVV3I7aOGLzK',
  assassino: 'Compendium.olddragon2e.classes.Item.qmcr4miRTUGaUZgr',
  barbaro: 'Compendium.olddragon2e.classes.Item.XyMxtlkHTVeuXict',
  bardo: 'Compendium.olddragon2e.classes.Item.zhBTrsrVCJuh0TIP',
  bruxo: 'Compendium.olddragon2e.classes.Item.RwWjaex47rIj9FwO',
  clerigo: 'Compendium.olddragon2e.classes.Item.cYfvA9p2XprFpamU',
  druida: 'Compendium.olddragon2e.classes.Item.tRhKnE5D6grdUwzL',
  'elfo-aventureiro': 'Compendium.olddragon2e.classes.Item.HufLva6gVWRi1l48',
  guerreiro: 'Compendium.olddragon2e.classes.Item.bkzh1k7B0ncxQfHR',
  'halfling-aventureiro': 'Compendium.olddragon2e.classes.Item.BMGOU1kveWlIJNx8',
  ilusionista: 'Compendium.olddragon2e.classes.Item.PBtvkfo69YBlKrGY',
  ladrao: 'Compendium.olddragon2e.classes.Item.o8cAybQI9lQp2MTd',
  mago: 'Compendium.olddragon2e.classes.Item.0VpxbklOWK0SaHMY',
  necromante: 'Compendium.olddragon2e.classes.Item.auquWM2cFz5Otr9z',
  paladino: 'Compendium.olddragon2e.classes.Item.UwfTTsIz4YlhQViE',
  proscrito: 'Compendium.olddragon2e.classes.Item.9cxLzlDnQQTEwuhD',
  ranger: 'Compendium.olddragon2e.classes.Item.fjNBciFT3punx7Ks',
  xama: 'Compendium.olddragon2e.classes.Item.mLrl21J2PMKmGLuh',
  // Classes de Legião
  'feiticeiro-clerigo': 'Compendium.olddragon2e-legiao.classes.Item.rViqghGwgybm5LHN',
  'feiticeiro-guerreiro': 'Compendium.olddragon2e-legiao.classes.Item.bRQgIXBLJa7gAlSm',
  'feiticeiro-ladrao': 'Compendium.olddragon2e-legiao.classes.Item.KofM93KX0N1Yglgw',
  legionario: 'Compendium.olddragon2e-legiao.classes.Item.AXvfz6DD6IM3JfjG',
};

export const importRetainerActor = async (json) => {
  const data = await _jsonToRetainerActorData(json);
  const actor = await Actor.create(data);

  if (data.system.race) {
    await actor.createEmbeddedDocuments('Item', [data.system.race]);
  }

  await _addRaceAndClassAbilities(actor, data.system.race, null);
  await _addInventoryItems(actor, json.inventory_items);

  return actor;
};

export const importActor = async (json) => {
  const data = await _jsonToActorData(json);
  const actor = await Actor.create(data);

  const itemsToAdd = [];
  if (data.system.race) {
    itemsToAdd.push(data.system.race);
  }
  if (data.system.class) {
    itemsToAdd.push(data.system.class);
  }
  if (itemsToAdd.length > 0) {
    await actor.createEmbeddedDocuments('Item', itemsToAdd);
  }

  await _addRaceAndClassAbilities(actor, data.system.race, data.system.class);

  const vcSelections = _extractVariableConstructionSelections(json, actor);
  if (vcSelections) {
    await actor.update({ 'system.variable_construction_selections': vcSelections });
  }

  await _addInventoryItems(actor, json.inventory_items);

  return actor;
};

const _jsonToActorData = async (json) => {
  const raceUUID = RACE_UUIDS[json.character_race?.id];
  const classUUID = CLASS_UUIDS[json.character_class?.id];

  const isLegiaoModuleAvailable = game.modules.get('olddragon2e-legiao')?.active;
  const isRacasModuleAvailable = game.modules.get('olddragon2e-racas')?.active;

  let raceItem = null;
  let classItem = null;

  const raceName = json.character_race?.name;
  const className = json.character_class?.name;

  if (raceUUID) {
    raceItem = await fromUuid(raceUUID).catch(() => null);
    if (!raceItem && raceUUID.startsWith('Compendium.olddragon2e-legiao') && !isLegiaoModuleAvailable) {
      ui.notifications.warn(`A Raça "${raceName}" é exclusiva do módulo premium "Legião - A Era da Desolação".`);
    } else if (!raceItem && raceUUID.startsWith('Compendium.olddragon2e-racas') && !isRacasModuleAvailable) {
      ui.notifications.warn(`A Raça "${raceName}" é exclusiva do módulo premium "Guia de Campanha: Raças".`);
    } else if (!raceItem) {
      ui.notifications.warn(`A Raça "${raceName}" não foi encontrada.`);
    }
  } else {
    ui.notifications.warn(`Raça "${raceName}" não encontrada.`);
  }

  if (classUUID) {
    classItem = await fromUuid(classUUID).catch(() => null);
    if (!classItem && classUUID.startsWith('Compendium.olddragon2e-legiao') && !isLegiaoModuleAvailable) {
      ui.notifications.warn(`A Classe "${className}" é exclusiva do módulo premium "Legião - A Era da Desolação".`);
    } else if (!classItem) {
      ui.notifications.warn(`A Classe "${className}" não foi encontrada.`);
    }
  } else {
    ui.notifications.warn(`Classe "${className}" não encontrada.`);
  }

  const actorData = {
    name: json.name,
    type: 'character',
    system: {
      odo_id: json.id,
      level: json.level,
      hp: {
        value: json.health_points,
        max: json.max_hp,
      },
      forca: json.forca,
      destreza: json.destreza,
      constituicao: json.constituicao,
      inteligencia: json.inteligencia,
      sabedoria: json.sabedoria,
      carisma: json.carisma,
      jp_race_bonus: _extractJpRaceBonus(json),
      current_xp: json.experience_points,
      economy: {
        cp: json.money_cp,
        sp: json.money_sp,
        gp: json.money_gp,
      },
      details: {
        alignment: json.alignment,
        languages: json.languages.join(', '),
        appearance: json.appearance,
        personality: json.personality,
        background: json.background,
      },
      race: raceItem ? raceItem.toObject() : null,
      class: classItem ? classItem.toObject() : null,
    },
  };

  if (json.picture) {
    actorData.img = await _downloadAndSaveImage(json.picture);
  }

  return actorData;
};

const _jsonToRetainerActorData = async (json) => {
  const raceUUID = RACE_UUIDS[json.character_race?.id];
  const isLegiaoModuleAvailable = game.modules.get('olddragon2e-legiao')?.active;
  const isRacasModuleAvailable = game.modules.get('olddragon2e-racas')?.active;
  let raceItem = null;
  const raceName = json.character_race?.name;

  if (raceUUID) {
    raceItem = await fromUuid(raceUUID).catch(() => null);
    if (!raceItem && raceUUID.startsWith('Compendium.olddragon2e-legiao') && !isLegiaoModuleAvailable) {
      ui.notifications.warn(`A Raça "${raceName}" é exclusiva do módulo premium "Legião - A Era da Desolação".`);
    } else if (!raceItem && raceUUID.startsWith('Compendium.olddragon2e-racas') && !isRacasModuleAvailable) {
      ui.notifications.warn(`A Raça "${raceName}" é exclusiva do módulo premium "Guia de Campanha: Raças".`);
    } else if (!raceItem) {
      ui.notifications.warn(`A Raça "${raceName}" não foi encontrada.`);
    }
  } else {
    ui.notifications.warn(`Raça "${raceName}" não encontrada.`);
  }

  const actorData = {
    name: json.name,
    type: 'retainer',
    system: {
      odo_id: json.id,
      level: json.level,
      hp: { value: json.health_points, max: json.max_hp },
      forca: json.forca,
      destreza: json.destreza,
      constituicao: json.constituicao,
      inteligencia: json.inteligencia,
      sabedoria: json.sabedoria,
      carisma: json.carisma,
      economy: { cp: json.money_cp, sp: json.money_sp, gp: json.money_gp },
      details: { notes: json.notes },
      profession: json.profession,
      heroic_action_used: json.heroic_action_used,
      url: json.url,
      race: raceItem ? raceItem.toObject() : null,
    },
  };

  if (json.picture) {
    actorData.img = await _downloadAndSaveImage(json.picture);
  }

  return actorData;
};

const _downloadAndSaveImage = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch image from URL: ${url}`);
  }

  const blob = await response.blob();
  const fileName = url.split('/').pop(); // Extrai a parte final da URL
  const file = new File([blob], `${fileName}.webp`, { type: blob.type });

  const worldName = game.world.id;
  const folderPath = `worlds/${worldName}/assets/character-picture`;
  const filePath = `${folderPath}/${fileName}.webp`;

  try {
    await foundry.applications.apps.FilePicker.implementation.browse('data', folderPath);
  } catch (e) {
    if (e.message.includes('does not exist or is not accessible')) {
      const parts = folderPath.split('/');
      for (let i = 1; i <= parts.length; i++) {
        const subPath = parts.slice(0, i).join('/');
        try {
          await foundry.applications.apps.FilePicker.implementation.createDirectory('data', subPath);
        } catch (err) {
          if (!err.message.includes('EEXIST')) {
            throw err;
          }
        }
      }
    } else {
      throw e;
    }
  }

  await foundry.applications.apps.FilePicker.implementation.upload('data', folderPath, file, { bucket: null });

  return filePath;
};

const _addRaceAndClassAbilities = async (actor, raceItem, classItem) => {
  const itemsToAdd = [];

  if (raceItem && raceItem.system.race_abilities) {
    const raceAbilities = await _getItemsFromUUIDs(raceItem.system.race_abilities);
    itemsToAdd.push(...raceAbilities);
  }

  if (classItem && classItem.system.class_abilities) {
    const classAbilities = await _getItemsFromUUIDs(classItem.system.class_abilities);
    itemsToAdd.push(...classAbilities);
  }

  if (itemsToAdd.length > 0) {
    await actor.createEmbeddedDocuments('Item', itemsToAdd);
  }
};

const _getItemsFromUUIDs = async (uuids) => {
  const items = [];
  for (const uuid of uuids) {
    const item = await fromUuid(uuid);
    if (item) items.push(item.toObject());
  }
  return items;
};

const JP_KEYS = ['jpd', 'jpc', 'jps'];

/**
 * Extracts the JP race bonus from the new race_mechanic_selections structure.
 * @param {Object} json - Character JSON from Old Dragon Online
 * @returns {string} The selection_key value ('jpd', 'jpc', 'jps') or empty string
 */
const _extractJpRaceBonus = (json) => {
  if (!json.race_mechanic_selections || json.race_mechanic_selections.length === 0) return '';

  const jpSelection = json.race_mechanic_selections.find((s) => JP_KEYS.includes(s.selection_key));

  return jpSelection ? jpSelection.selection_key : '';
};

/**
 * Extracts variable-construction selections from race_mechanic_selections and maps them to Foundry item IDs.
 * @param {Object} json - Character JSON from Old Dragon Online
 * @param {Actor} actor - The Foundry actor (must already have race_ability items embedded)
 * @returns {Object|null} The variable_construction_selections object, or null if none found
 */
const _extractVariableConstructionSelections = (json, actor) => {
  if (!json.race_mechanic_selections || json.race_mechanic_selections.length === 0) return null;

  const vcSelections = json.race_mechanic_selections.filter((s) => !JP_KEYS.includes(s.selection_key));
  if (vcSelections.length === 0) return null;

  // Group by character_race_ability_id, preserving order (order = choice-index)
  const grouped = {};
  for (const sel of vcSelections) {
    const id = sel.character_race_ability_id;
    if (!grouped[id]) grouped[id] = { ability_name: sel.ability_name, selections: [] };
    grouped[id].selections.push(sel);
  }

  // Match each group to its Foundry item by name and build the selections object
  const result = {};
  for (const { ability_name, selections } of Object.values(grouped)) {
    const item = actor.items.find((i) => i.type === 'race_ability' && i.name === ability_name);
    if (!item) continue;
    result[item.id] = selections.map((sel) => ({
      key: sel.selection_key,
      custom_name: sel.custom_name ?? '',
      custom_description: sel.custom_description ?? '',
    }));
  }

  return Object.keys(result).length > 0 ? result : null;
};

const _convertCost = (costInPC) => {
  if (costInPC >= 100) {
    return `${Math.floor(costInPC / 100)} PO`;
  } else if (costInPC >= 10) {
    return `${Math.floor(costInPC / 10)} PP`;
  } else {
    return `${costInPC} PC`;
  }
};

const _determineWeaponType = (item) => {
  if (item.throw_range) {
    return 'throwing';
  } else if (item.shoot_range) {
    return 'ranged';
  } else if (item.arrow || item.bolt || item.bolt_small) {
    return 'ammunition';
  } else {
    return 'melee';
  }
};

const _addInventoryItems = async (actor, inventoryItems) => {
  const itemsToAdd = inventoryItems.map((item) => {
    const isEquipped = item.name === 'Mochila' && item.concept === 'container' ? true : item.equipped;

    const itemData = {
      name: item.name,
      type: item.concept,
      system: {
        is_equipped: isEquipped,
        description: item.description,
        quantity: item.quantity,
        cost: _convertCost(item.cost),
        weight_in_load: item.weight_in_load,
        weight_in_grams: item.weight_in_grams,
        magic_item: item.magic_item,
        damage_type: item.damage_type,
        damage: item.damage,
        bonus_damage: item.bonus_damage,
        bonus_ba: item.bonus_ba,
        bonus_ca: item.bonus_ca,
        shoot_range: item.shoot_range,
        throw_range: item.throw_range,
        arrow: item.arrow,
        bolt: item.bolt,
        bolt_small: item.bolt_small,
        polearm: item.polearm,
        two_handed: item.two_handed,
        versatile: item.versatile,
        increases_load_by: item.increases_load_by,
      },
    };

    if (item.concept === 'weapon') {
      itemData.system.type = _determineWeaponType(item);
    }

    return itemData;
  });

  if (itemsToAdd.length > 0) {
    await actor.createEmbeddedDocuments('Item', itemsToAdd);
  }
};

/**
 * Removes all inventory items from an actor, preserving spells.
 * @param {Actor} actor - The Foundry actor
 */
const _removeInventoryItems = async (actor) => {
  const INVENTORY_TYPES = ['weapon', 'armor', 'shield', 'misc', 'container', 'vehicle'];

  const itemsToRemove = actor.items.filter((item) => INVENTORY_TYPES.includes(item.type));

  const itemIds = itemsToRemove.map((item) => item.id);

  if (itemIds.length > 0) {
    await actor.deleteEmbeddedDocuments('Item', itemIds);
  }
};

/**
 * Fetches retainer data from Old Dragon Online API and updates an existing retainer actor.
 * @param {Actor} actor - The Foundry retainer actor to update
 * @returns {Promise<Actor>} The updated actor
 */
export const updateRetainerActor = async (actor) => {
  const odoId = actor.system.odo_id;
  if (!odoId) {
    ui.notifications.error('Este ajudante não possui um ID do Old Dragon Online.');
    return actor;
  }

  const apiUrl = `https://olddragon.com.br/ajudantes/${odoId}.json`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados: ${response.status}`);
    }

    const json = await response.json();

    const updateData = {
      name: json.name,
      'system.level': json.level,
      'system.hp.value': json.health_points,
      'system.hp.max': json.max_hp,
      'system.forca': json.forca,
      'system.destreza': json.destreza,
      'system.constituicao': json.constituicao,
      'system.inteligencia': json.inteligencia,
      'system.sabedoria': json.sabedoria,
      'system.carisma': json.carisma,
      'system.economy.cp': json.money_cp,
      'system.economy.sp': json.money_sp,
      'system.economy.gp': json.money_gp,
      'system.profession': json.profession,
      'system.heroic_action_used': json.heroic_action_used,
      'system.url': json.url,
      'system.details.notes': json.notes,
    };

    if (json.picture) {
      const newImg = await _downloadAndSaveImage(json.picture);
      updateData.img = newImg;
    }

    await actor.update(updateData);

    await _removeInventoryItems(actor);
    await _addInventoryItems(actor, json.inventory_items);

    ui.notifications.info(`Ajudante "${json.name}" atualizado com sucesso!`);
    return actor;
  } catch (error) {
    ui.notifications.error(`Erro ao atualizar ajudante: ${error.message}`);
    console.error('Error updating retainer actor from ODO:', error);
    return actor;
  }
};

/**
 * Fetches character data from Old Dragon Online API and updates an existing actor.
 * @param {Actor} actor - The Foundry actor to update
 * @returns {Promise<Actor>} The updated actor
 */
export const updateActor = async (actor) => {
  const odoId = actor.system.odo_id;
  if (!odoId) {
    ui.notifications.error('Este personagem não possui um ID do Old Dragon Online.');
    return actor;
  }

  const apiUrl = `https://olddragon.com.br/personagens/${odoId}.json`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados: ${response.status}`);
    }

    const json = await response.json();

    // Update basic character data
    const updateData = {
      name: json.name,
      'system.level': json.level,
      'system.hp.value': json.health_points,
      'system.hp.max': json.max_hp,
      'system.forca': json.forca,
      'system.destreza': json.destreza,
      'system.constituicao': json.constituicao,
      'system.inteligencia': json.inteligencia,
      'system.sabedoria': json.sabedoria,
      'system.carisma': json.carisma,
      'system.jp_race_bonus': _extractJpRaceBonus(json),
      'system.current_xp': json.experience_points,
      'system.economy.cp': json.money_cp,
      'system.economy.sp': json.money_sp,
      'system.economy.gp': json.money_gp,
      'system.details.alignment': json.alignment,
      'system.details.languages': json.languages.join(', '),
      'system.details.appearance': json.appearance,
      'system.details.personality': json.personality,
      'system.details.background': json.background,
    };

    // Update picture if changed
    if (json.picture) {
      const newImg = await _downloadAndSaveImage(json.picture);
      updateData.img = newImg;
    }

    const vcSelections = _extractVariableConstructionSelections(json, actor);
    if (vcSelections) {
      updateData['system.variable_construction_selections'] = vcSelections;
    }

    await actor.update(updateData);

    // Sync inventory items
    await _removeInventoryItems(actor);
    await _addInventoryItems(actor, json.inventory_items);

    ui.notifications.info(`Personagem "${json.name}" atualizado com sucesso!`);
    return actor;
  } catch (error) {
    ui.notifications.error(`Erro ao atualizar personagem: ${error.message}`);
    console.error('Error updating actor from ODO:', error);
    return actor;
  }
};
