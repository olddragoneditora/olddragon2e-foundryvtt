import { BaseRoll } from '../baseRoll';
import { calculateRollResult } from '../utils';
import { truncateString } from '../../helpers';

export class NaturalWeaponDamageRoll extends BaseRoll {
  constructor(actor, weaponName, damage) {
    super(actor, damage);
    this.weaponName = weaponName;
    this.damage = damage;
  }

  printFormula() {
    return this.damage;
  }

  formula(bonus, critical) {
    let f = critical ? `(${this.damage})*2` : this.damage;
    if (bonus) f += `+${bonus}`;
    return f;
  }

  formatMessage() {
    return `<div class='title'>${game.i18n.localize('olddragon2e.chat.damage_with')} <strong>${this.weaponName}</strong></div>`;
  }

  async roll(bonus, critical) {
    const rollResult = await calculateRollResult(this.formula(bonus, critical));
    this.roll_result = rollResult;
    return rollResult.total;
  }

  sendMessage(mode) {
    this.roll_result.toMessage(
      {
        flavor: this.formatMessage(),
        speaker: { alias: truncateString(this.characterName, 30) },
      },
      this.toMessageOptions(mode),
    );
  }
}
