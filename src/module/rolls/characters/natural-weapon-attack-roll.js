import { AttackRoll } from './attack-roll';

export class NaturalWeaponAttackRoll extends AttackRoll {
  constructor(actor, weaponName) {
    super(actor, null, 'bac', false);
    this.weaponName = weaponName;
  }

  formatMessage(adjustment) {
    return `<div class='title'>${this.messageAdjustment(adjustment)} ${this.messageBa} ${game.i18n.localize('olddragon2e.chat.with')} <strong>${
      this.weaponName
    }</strong></div>`;
  }
}
