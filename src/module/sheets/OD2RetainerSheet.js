import { showDialog } from '../helpers';
import { AttackRoll, UnarmedAttackRoll, DamageRoll, KnockoutRoll, StatRoll, JPRoll, BARoll } from '../rolls';
import { updateRetainerActor } from '../api/characterImporter';

export default class OD2RetainerSheet extends foundry.appv1.sheets.ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: 'systems/olddragon2e/templates/sheets/retainer-sheet.hbs',
      classes: ['olddragon2e', 'sheet', 'retainer'],
      width: 820,
      height: 780,
      tabs: [{ navSelector: '.tabs', contentSelector: '.section', initial: 'attacks' }],
      submitOnClose: true,
    });
  }

  async getData() {
    const baseData = super.getData();

    let sheetData = {
      owner: this.actor.isOwner,
      editable: this.isEditable,
      actor: baseData.actor,
      system: baseData.actor.system,
      attack: baseData.actor.system.attack_items,
      weapon: baseData.actor.system.weapon_items,
      armor: baseData.actor.system.armor_items,
      shield: baseData.actor.system.shield_items,
      misc: baseData.actor.system.misc_items,
      container: baseData.actor.system.container_items,
      vehicle: baseData.actor.system.vehicle_items,
      config: CONFIG.olddragon2e,
    };

    return sheetData;
  }

  async _onDrop(event) {
    const data = JSON.parse(event.dataTransfer.getData('text/plain'));
    if (data.type === 'Folder') {
      event.preventDefault();
    } else if (data.type === 'Item') {
      this._onDropItem(event, data);
    }
  }

  async _onDropItem(event, data) {
    const item = await Item.implementation.fromDropData(data);

    if (item.type === 'race_ability') {
      ui.notifications.error('Habilidades de raça não podem ser vinculadas a ajudantes.');
      return;
    }

    if (item.type === 'class') {
      ui.notifications.error('Ajudantes não podem ter uma classe.');
      return;
    }

    if (item.type === 'class_ability') {
      ui.notifications.error('Habilidades de classe não podem ser vinculadas a ajudantes.');
      return;
    }

    if (item.type === 'spell') {
      ui.notifications.error('Ajudantes não podem usar magias.');
      return;
    }

    if (item.type === 'race') {
      if (this.actor.system.race !== null) {
        ui.notifications.error('Este ajudante já possui uma raça. Remova a raça atual antes de adicionar uma nova.');
        return;
      }
    }

    await super._onDropItem(event, data);

    if (item.type === 'race') {
      await this.actor.system.syncRaceAbilities();
    }
  }

  async activateListeners(html) {
    if (this.isEditable) {
      html.find('.item-create').click(this._onItemCreate.bind(this));
      html.find('.item-edit').click(this._onItemEdit.bind(this));
      html.find('.item-equip').click(this._onItemEquip.bind(this));
      html.find('.item-update-quantity').change(this._onItemUpdateQuantity.bind(this));
      html.find('.item-delete').click(this._onItemDelete.bind(this));
      html.find('.odo-sync').click(this._onOdoSync.bind(this));
      html.find('.become-adventurer-button').click(this._onBecomeAdventurer.bind(this));
    }

    // Owner-only Listeners
    if (this.actor.isOwner) {
      html.find('.attack-roll').click(this._onAttackRoll.bind(this));
      html.find('.unarmed-attack-roll').click(this._onUnarmedAttackRoll.bind(this));
      html.find('.damage-roll').click(this._onDamageRoll.bind(this));
      html.find('.knockout-roll').click(this._onKnockoutRoll.bind(this));
      html.find('.stat-roll').click(this._onStatRoll.bind(this));
      html.find('.jp-roll').click(this._onJPRoll.bind(this));
      html.find('.ba-roll').click(this._onBARoll.bind(this));
    }

    super.activateListeners(html);
  }

  async _onOdoSync(event) {
    event.preventDefault();

    const confirmed = await Dialog.confirm({
      title: game.i18n.localize('olddragon2e.sync_from_odo'),
      content: `<p>${game.i18n.localize('olddragon2e.sync_warning')}</p>`,
      yes: () => true,
      no: () => false,
    });

    if (confirmed) {
      await updateRetainerActor(this.actor);
    }
  }

  // Rolagem de ataque
  async _onAttackRoll(event) {
    event.preventDefault();
    let target = event.currentTarget;

    const ba = target.dataset.ba;
    const baBonus = target.dataset.baBonus === '';
    const itemID = event.currentTarget.closest('.attack').dataset.itemId;
    const item = this.actor.items.get(itemID);
    if (!item) return;

    const attackRoll = new AttackRoll(this.actor, item, ba, baBonus);

    await showDialog({
      title: `Rolar Ataque`,
      content: 'systems/olddragon2e/templates/dialog/characters/attack-roll-dialog.hbs',
      data: {
        formula: attackRoll.printFormula,
      },
      buttons: {
        roll: {
          icon: "<i class='fa-solid fa-dice-d20'></i>",
          label: 'Rolar',
          callback: async (html) => {
            let adjustment = html.find('#adjustment').val();
            const bonus = html.find('#bonus').val();
            const mode = html.find('#rollMode').val();

            await attackRoll.roll(bonus, adjustment);
            attackRoll.sendMessage(mode, adjustment);
          },
        },
      },
    });
  }

  // Rolagem de ataque desarmado
  async _onUnarmedAttackRoll(event) {
    event.preventDefault();

    const unarmedAttackRoll = new UnarmedAttackRoll(this.actor);

    await showDialog({
      title: `Rolar Ataque Desarmado`,
      content: 'systems/olddragon2e/templates/dialog/characters/unarmed-attack-roll-dialog.hbs',
      data: {
        formula: unarmedAttackRoll.printFormula,
      },
      buttons: {
        roll: {
          icon: "<i class='fa-solid fa-dice-d20'></i>",
          label: 'Rolar',
          callback: async (html) => {
            let adjustment = html.find('#adjustment').val();
            const bonus = html.find('#bonus').val();
            const mode = html.find('#rollMode').val();

            await unarmedAttackRoll.roll(bonus, adjustment);
            unarmedAttackRoll.sendMessage(mode, adjustment);
          },
        },
      },
    });
  }

  // Rolagem de dano
  async _onDamageRoll(event) {
    event.preventDefault();
    let target = event.currentTarget;

    const itemID = target.closest('.attack').dataset.itemId;
    const item = this.actor.items.get(itemID);
    if (!item) return;

    const damageRoll = new DamageRoll(this.actor, item);

    await showDialog({
      title: `Rolar Dano`,
      content: 'systems/olddragon2e/templates/dialog/characters/damage-roll-dialog.hbs',
      buttons: {
        roll: {
          icon: "<i class='fa-solid fa-dice-d20'></i>",
          label: 'Rolar',
          callback: async (html) => {
            const bonus = html.find('#bonus').val();
            const mode = html.find('#rollMode').val();
            const attackMode = html.find('#attack-mode').val();
            const critical = html.find('#critical').is(':checked');

            await damageRoll.roll(bonus, attackMode, critical);

            damageRoll.sendMessage(mode);
          },
        },
      },
      render: (html) => {
        const formulaEl = html.find('#formula');
        const attackModeEl = html.find('#attack-mode');

        const updateFormula = () => {
          const selectedAttackMode = attackModeEl.val();
          formulaEl.val(damageRoll.printFormula(selectedAttackMode));
        };

        formulaEl.val(damageRoll.printFormula());
        attackModeEl.val(damageRoll.itemAttackType);

        attackModeEl.change(() => {
          updateFormula();
        });

        updateFormula();
      },
    });
  }

  // Rolagem de chance de nocaute
  async _onKnockoutRoll(event) {
    event.preventDefault();

    const knockoutRoll = new KnockoutRoll(this.actor);

    await showDialog({
      title: `Chance de nocaute`,
      content: 'systems/olddragon2e/templates/dialog/characters/knockout-roll-dialog.hbs',
      data: {
        formula: knockoutRoll.printFormula,
      },
      buttons: {
        roll: {
          icon: "<i class='fa-solid fa-dice-d20'></i>",
          label: 'Rolar',
          callback: async (html) => {
            const bonus = html.find('#bonus').val();
            const mode = html.find('#rollMode').val();

            await knockoutRoll.roll(bonus);
            knockoutRoll.sendMessage(mode);
          },
        },
      },
    });
  }

  // Teste de Atributos
  async _onStatRoll(event) {
    event.preventDefault();
    let target = event.currentTarget;
    let statLabel = target.dataset.statLabel;
    const statName = target.dataset.stat;

    const statRoll = new StatRoll(this.actor, statLabel, statName);

    await showDialog({
      title: `Teste de ${statLabel}`,
      content: 'systems/olddragon2e/templates/dialog/characters/stat-roll-dialog.hbs',
      data: {
        formula: statRoll.formula(),
      },
      buttons: {
        roll: {
          icon: "<i class='fa-solid fa-dice-d20'></i>",
          label: 'Rolar',
          callback: async (html) => {
            let adjustment = html.find('#adjustment').val();
            const bonus = html.find('#bonus').val();
            const mode = html.find('#rollMode').val();
            await statRoll.roll(bonus);

            statRoll.sendMessage(mode, adjustment);
          },
        },
      },
    });
  }

  // Teste de JP | Jogada de Proteção
  async _onJPRoll(event) {
    event.preventDefault();
    let target = event.currentTarget;
    let jpLabel = target.dataset.jpLabel;
    const jpName = target.dataset.jp;

    const jpRoll = new JPRoll(this.actor, jpLabel, jpName);

    await showDialog({
      title: `Teste de ${jpLabel}`,
      content: 'systems/olddragon2e/templates/dialog/characters/jp-roll-dialog.hbs',
      data: {
        formula: jpRoll.formula(),
      },
      buttons: {
        roll: {
          icon: "<i class='fa-solid fa-dice-d20'></i>",
          label: 'Rolar',
          callback: async (html) => {
            let adjustment = html.find('#adjustment').val();
            const bonus = html.find('#bonus').val();
            const mode = html.find('#rollMode').val();
            await jpRoll.roll(bonus);

            jpRoll.sendMessage(mode, adjustment);
          },
        },
      },
    });
  }

  // Teste de BA | Base de Ataque
  async _onBARoll(event) {
    event.preventDefault();
    let target = event.currentTarget;

    const ba = target.dataset.ba;
    const baLabel = target.dataset.baLabel;

    const baRoll = new BARoll(this.actor, ba);

    await showDialog({
      title: `Teste de ${baLabel}`,
      content: 'systems/olddragon2e/templates/dialog/characters/ba-roll-dialog.hbs',
      data: {
        formula: baRoll.printFormula,
      },
      buttons: {
        roll: {
          icon: "<i class='fa-solid fa-dice-d20'></i>",
          label: 'Rolar',
          callback: async (html) => {
            let adjustment = html.find('#adjustment').val();
            const bonus = html.find('#bonus').val();
            const mode = html.find('#rollMode').val();

            await baRoll.roll(bonus, adjustment);
            baRoll.sendMessage(mode, adjustment);
          },
        },
      },
    });
  }

  // Criar item
  _onItemCreate(event) {
    event.preventDefault();
    let element = event.currentTarget;
    let itemType = element.dataset.type;
    let itemName = '';

    switch (itemType) {
      case 'weapon':
        itemName = 'Nova Arma';
        break;
      case 'armor':
        itemName = 'Nova Armadura';
        break;
      case 'shield':
        itemName = 'Novo Escudo';
        break;
      case 'misc':
        itemName = 'Novo Item';
        break;
      case 'container':
        itemName = 'Novo Recipiente/Vasilhame';
        break;
      case 'vehicle':
        itemName = 'Nova Montaria/Transporte';
        break;
    }

    let itemData = {
      name: itemName,
      type: itemType,
    };

    return this.actor.createEmbeddedDocuments('Item', [itemData]);
  }

  // Editar item
  _onItemEdit(event) {
    event.preventDefault();
    let element = event.currentTarget;
    let itemId = element.closest('.item').dataset.itemId;
    let item = this.actor.items.get(itemId);

    item.sheet.render(true);
  }

  // Equipar/Desequipar item
  async _onItemEquip(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest('.item').dataset.itemId;
    const item = this.actor.items.get(itemId);

    let updateObject = {
      'system.is_equipped': !item.system.is_equipped,
    };

    await item.update(updateObject);
  }

  // Alterar quantidade
  async _onItemUpdateQuantity(event) {
    event.preventDefault();
    let element = event.currentTarget;
    let itemId = element.closest('.item').dataset.itemId;
    let item = this.actor.items.get(itemId);
    let newQuantity = element.value;

    if (newQuantity <= 0) {
      newQuantity = 1;
    }

    const updateObject = {};
    updateObject[`system.quantity`] = newQuantity;

    await item.update(updateObject);
  }

  // Tornar Aventureiro
  async _onBecomeAdventurer(event) {
    event.preventDefault();
    const confirmed = await Dialog.confirm({
      title: 'Tornar Aventureiro',
      content:
        '<p class="text-center">Este ajudante está pronto para se tornar um aventureiro de 1º nível?<br>Será necessário vincular uma classe a ele.</p>',
      yes: () => true,
      no: () => false,
    });
    if (confirmed) {
      await this.becomeAdventurer();
    }
  }

  async becomeAdventurer() {
    const actor = this.actor;
    const system = actor.system;

    const itemsToCopy = [
      ...system.weapon_items,
      ...system.armor_items,
      ...system.shield_items,
      ...system.misc_items,
      ...system.container_items,
      ...system.vehicle_items,
    ].map((item) => item.toObject());

    if (system.race) {
      itemsToCopy.unshift(system.race.toObject());
    }

    const characterData = {
      name: actor.name,
      img: actor.img,
      type: 'character',
      system: {
        forca: system.forca,
        destreza: system.destreza,
        constituicao: system.constituicao,
        inteligencia: system.inteligencia,
        sabedoria: system.sabedoria,
        carisma: system.carisma,
        hp: { value: system.hp.value, max: system.hp.max },
        ac_extra: system.ac_extra,
        economy: {
          cp: system.economy.cp,
          sp: system.economy.sp,
          gp: system.economy.gp,
        },
        details: { notes: system.details.notes },
        current_xp: 0,
      },
    };

    const newActor = await Actor.create(characterData);

    if (itemsToCopy.length > 0) {
      await newActor.createEmbeddedDocuments('Item', itemsToCopy);
    }

    if (system.race) {
      await newActor.system.syncRaceAbilities();
    }

    newActor.sheet.render(true);
  }

  // Excluir item
  async _onItemDelete(event) {
    event.preventDefault();
    let element = event.currentTarget;
    let itemId = element.closest('.item').dataset.itemId;
    let itemName = this.actor.items.get(itemId).name;
    let itemType = this.actor.items.get(itemId).type;

    const standardTemplate = `
        <form>
            <div>
                <center>
                    Excluir <strong>${itemName}</strong>?
                </center>
            </div>
        </form>`;

    const raceTemplate = `
        <form>
            <div>
                <center>
                    Excluir a raça <strong>${itemName}</strong>?
                </center>
            </div>
        </form>`;

    const confirmationTemplate = itemType === 'race' ? raceTemplate : standardTemplate;

    await Dialog.confirm({
      title: game.i18n.localize('olddragon2e.delete'),
      content: confirmationTemplate,
      yes: async () => {
        await this.actor.deleteEmbeddedDocuments('Item', [itemId]);
        if (itemType === 'race') {
          const raceAbilityIds = this.actor.items.filter((item) => item.type === 'race_ability').map((item) => item.id);
          if (raceAbilityIds.length > 0) {
            await this.actor.deleteEmbeddedDocuments('Item', raceAbilityIds);
          }
        }
      },
      no: () => {},
    });
  }
}
