import { BaseRoll } from '../baseRoll';
import { calculateRollResult } from '../utils';
import { truncateString } from '../../helpers';

export class TalentRoll extends BaseRoll {
  constructor(actor, talentLabel, talentScore) {
    super(actor, '1d6');

    this.talentLabel = talentLabel;
    this.talentScore = talentScore;
  }

  formula(bonus) {
    let formula = this.dice;

    if (bonus) {
      formula += `+${bonus}`;
    }

    return formula;
  }

  _success() {
    return this.roll_result.total <= this.talentScore;
  }

  formatMessage() {
    let result = '<strong class="failure">Falha</strong>';

    if (this._success()) {
      result = '<strong class="success">Sucesso!</strong>';
    }

    return `<div class='title'>Teste de <strong>${this.talentLabel}</strong> (${this.talentScore})</div><p class='result'>${result}</p>`;
  }

  async roll(bonus) {
    const rollResult = await calculateRollResult(this.formula(bonus));

    this.roll_result = rollResult;

    return rollResult.total;
  }

  sendMessage(mode) {
    const message = this.formatMessage();

    this.roll_result.toMessage(
      {
        flavor: message,
        speaker: {
          alias: truncateString(this.characterName, 30),
        },
      },
      { rollMode: this.rollMode(mode) },
    );
  }
}
