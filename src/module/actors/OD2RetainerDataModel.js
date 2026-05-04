import { calculateAttributeModifier } from '../helpers/modifiers.js';

const getItemsOfActorOfType = (actor, filterType, filterFn = null) =>
  actor.items.filter(({ type }) => type === filterType).filter(filterFn || (() => true));

export class OD2RetainerDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      odo_id: new fields.StringField(),
      level: new fields.NumberField({
        required: true,
        initial: 0,
        integer: true,
      }),
      hp: new fields.SchemaField({
        value: new fields.NumberField({
          required: true,
          initial: 1,
          integer: true,
        }),
        max: new fields.NumberField({
          required: true,
          initial: 1,
          integer: true,
        }),
      }),
      forca: new fields.NumberField({
        required: true,
        initial: 0,
        integer: true,
      }),
      destreza: new fields.NumberField({
        required: true,
        initial: 0,
        integer: true,
      }),
      constituicao: new fields.NumberField({
        required: true,
        initial: 0,
        integer: true,
      }),
      inteligencia: new fields.NumberField({
        required: true,
        initial: 0,
        integer: true,
      }),
      sabedoria: new fields.NumberField({
        required: true,
        initial: 0,
        integer: true,
      }),
      carisma: new fields.NumberField({
        required: true,
        initial: 0,
        integer: true,
      }),
      ac_extra: new fields.NumberField({
        required: true,
        initial: 0,
        integer: true,
      }),
      economy: new fields.SchemaField({
        cp: new fields.NumberField({
          required: true,
          initial: 0,
          integer: true,
        }),
        sp: new fields.NumberField({
          required: true,
          initial: 0,
          integer: true,
        }),
        gp: new fields.NumberField({
          required: true,
          initial: 0,
          integer: true,
        }),
        count: new fields.NumberField({
          required: true,
          initial: 0,
          integer: true,
        }),
        load: new fields.NumberField({
          required: true,
          initial: 0,
          integer: true,
        }),
      }),
      details: new fields.SchemaField({
        notes: new fields.StringField(),
      }),
      profession: new fields.StringField(),
      heroic_action_used: new fields.BooleanField({
        initial: false,
      }),
      campanha_url: new fields.StringField(),
      url: new fields.StringField(),
    };
  }

  get ac_base() {
    return 10;
  }

  get ac_total() {
    const base = this.ac_base;
    const magic_weapon = this.ac_extra;

    const shield_ac = this.ac_shield;
    const armor_ac = this.ac_armor;

    const mod = this.mod_destreza;

    return base + mod + magic_weapon + shield_ac + armor_ac;
  }

  get ac_shield() {
    const equipped_shields = this.shield_items.filter(({ system }) => system.is_equipped);

    const shield_ac = equipped_shields.reduce((acc, { system }) => acc + system.bonus_ca, 0);

    return shield_ac;
  }

  get ac_armor() {
    const equipped_armor = this.armor_items.filter(({ system }) => system.is_equipped);

    const armor_ac = equipped_armor.reduce((acc, { system }) => acc + system.bonus_ca, 0);

    return armor_ac;
  }

  get ba() {
    return 0;
  }

  get bac() {
    return this.mod_forca;
  }

  get bad() {
    return this.mod_destreza;
  }

  get mod_forca() {
    return calculateAttributeModifier(this.forca);
  }

  get mod_destreza() {
    return calculateAttributeModifier(this.destreza);
  }

  get mod_constituicao() {
    return calculateAttributeModifier(this.constituicao);
  }

  get mod_inteligencia() {
    return calculateAttributeModifier(this.inteligencia);
  }

  get mod_sabedoria() {
    return calculateAttributeModifier(this.sabedoria);
  }

  get mod_carisma() {
    return calculateAttributeModifier(this.carisma);
  }

  get jpd_total() {
    return 4;
  }

  get jpc_total() {
    return 4;
  }

  get jps_total() {
    return 4;
  }

  get hp_max_suggested() {
    return Math.max(1, 4 + this.mod_constituicao);
  }

  get current_movement() {
    if (this.race == null) {
      return 0;
    }

    return this.race.system.movement;
  }

  get movement_run() {
    return Math.floor(this.current_movement * 2);
  }

  get movement_climb() {
    if (this.current_movement <= 0) {
      return 0;
    }
    return Math.max(0, Math.floor(this.current_movement - 2));
  }

  get movement_swim() {
    return Math.floor(this.current_movement / 2);
  }

  get movement_fly() {
    if (this.race == null) {
      return 0;
    }
    return this.race.system.movement_fly ?? 0;
  }

  get load_max() {
    let maxLoadValue = this._findHighestValue(this.forca, this.constituicao);

    const equipped_containers = getItemsOfActorOfType(this.parent, 'container', ({ system }) => system.is_equipped);

    for (const item of equipped_containers) {
      maxLoadValue += item.system.increases_load_by || 0;
    }

    return maxLoadValue;
  }

  get load_current() {
    return Math.floor(this._inventoryItemsLoad() + this._economyCoinLoad());
  }

  _inventoryItemsLoad() {
    let currentLoadValue = 0;
    const itemTypes = ['weapon', 'armor', 'shield', 'misc', 'container'];

    for (const type of itemTypes) {
      const items = getItemsOfActorOfType(this.parent, type);

      for (const item of items) {
        currentLoadValue += item.system.total_weight;
      }
    }

    return Math.floor(currentLoadValue);
  }

  _economyCoinSum() {
    return this.economy.cp + this.economy.sp + this.economy.gp;
  }

  _economyCoinLoad() {
    return this._economyCoinSum() / 100;
  }

  _findHighestValue(value1, value2) {
    if (value1 > value2) {
      return value1;
    } else {
      return value2;
    }
  }

  get equipped_items() {
    return this.parent.items.filter(({ system }) => system.is_equipped);
  }

  get attack_items() {
    return getItemsOfActorOfType(this.parent, 'weapon', ({ system }) => system.is_equipped).sort(
      (a, b) => (a.sort || 0) - (b.sort || 0),
    );
  }

  get weapon_items() {
    return getItemsOfActorOfType(this.parent, 'weapon').sort((a, b) => (a.sort || 0) - (b.sort || 0));
  }

  get armor_items() {
    return getItemsOfActorOfType(this.parent, 'armor').sort((a, b) => (a.sort || 0) - (b.sort || 0));
  }

  get shield_items() {
    return getItemsOfActorOfType(this.parent, 'shield').sort((a, b) => (a.sort || 0) - (b.sort || 0));
  }

  get misc_items() {
    return getItemsOfActorOfType(this.parent, 'misc').sort((a, b) => (a.sort || 0) - (b.sort || 0));
  }

  get container_items() {
    return getItemsOfActorOfType(this.parent, 'container').sort((a, b) => (a.sort || 0) - (b.sort || 0));
  }

  get vehicle_items() {
    return getItemsOfActorOfType(this.parent, 'vehicle').sort((a, b) => (a.sort || 0) - (b.sort || 0));
  }

  get race() {
    const raceItems = getItemsOfActorOfType(this.parent, 'race');

    if (raceItems && raceItems.length) {
      return raceItems[0];
    }

    return null;
  }

  get race_abilities() {
    return getItemsOfActorOfType(this.parent, 'race_ability');
  }

  async getItemsFromUUIDs(uuids) {
    const items = [];
    for (const uuid of uuids) {
      const item = await fromUuid(uuid);
      if (item) items.push(item);
    }
    return items;
  }

  async syncRaceAbilities() {
    const race = this.race;
    if (!race) return [];

    const raceAbilitiesUUIDs = race.system.race_abilities || [];
    const raceAbilities = await this.getItemsFromUUIDs(raceAbilitiesUUIDs);
    const existingAbilityNames = this.race_abilities.map((a) => a.name);

    for (const raceAbility of raceAbilities) {
      if (existingAbilityNames.includes(raceAbility.name)) continue;
      await this.parent.createEmbeddedDocuments('Item', [raceAbility]);
    }

    return raceAbilities;
  }
}
