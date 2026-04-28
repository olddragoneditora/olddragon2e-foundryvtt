export class OD2RaceDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      flavor: new fields.StringField(),
      description: new fields.StringField(),
      movement: new fields.NumberField({
        required: true,
        integer: true,
        initial: 0,
      }),
      movement_swim: new fields.NumberField({
        integer: true,
        nullable: true,
        min: 0,
      }),
      movement_fly: new fields.NumberField({
        integer: true,
        initial: 0,
        min: 0,
      }),
      movement_notes: new fields.StringField(),
      infravision: new fields.NumberField({
        integer: true,
      }),
      infravision_notes: new fields.StringField(),
      alignment_tendency: new fields.StringField({
        initial: 'none',
      }),
      alignment_notes: new fields.StringField(),
      race_abilities: new fields.ArrayField(new fields.StringField(), {
        default: [],
      }),
    };
  }
}
