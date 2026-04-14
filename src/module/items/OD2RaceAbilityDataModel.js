export class OD2RaceAbilityDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.StringField(),
      xp: new fields.NumberField({
        integer: true,
      }),
      jp: new fields.SchemaField({
        jpc: new fields.BooleanField({
          default: false,
        }),
        jpd: new fields.BooleanField({
          default: false,
        }),
        jps: new fields.BooleanField({
          default: false,
        }),
      }),
      bonus_damage: new fields.NumberField({ integer: true, initial: 0 }),
      bonus_damage_condition: new fields.StringField({ default: 'none' }),
      rogue_talent: new fields.StringField({
        default: 'none',
      }),
      rogue_talent_2: new fields.StringField({
        default: 'none',
      }),
      daily_uses: new fields.NumberField({ integer: true, initial: 0 }),
      natural_armor: new fields.NumberField({ integer: true, initial: 0 }),
      load_modifier: new fields.NumberField({ integer: true, initial: 0 }),
      max_load_override: new fields.NumberField({ integer: true, initial: 0 }),
      armor_weight_modifier: new fields.NumberField({ integer: true, initial: 0 }),
      natural_weapon: new fields.SchemaField({
        damage: new fields.StringField({ initial: '' }),
        damage_type: new fields.StringField({ initial: 'none' }),
        weapon_size: new fields.StringField({ initial: 'none' }),
      }),
    };
  }
}
