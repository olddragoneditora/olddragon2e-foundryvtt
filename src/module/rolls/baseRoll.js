export class BaseRoll {
  constructor(actor, dice) {
    this.dice = dice;
    this.actor = actor;
  }

  get characterName() {
    return this.actor.name;
  }

  get characterBac() {
    return this.actor.system.bac;
  }

  get characterBad() {
    return this.actor.system.bad;
  }

  rollMode(mode) {
    if (game.release.generation >= 14) {
      switch (mode) {
        case 'private':
          return 'gm';
        case 'blind':
          return 'blind';
        case 'self':
          return 'self';
        default:
          return 'public';
      }
    }
    switch (mode) {
      case 'private':
        return 'gmroll';
      case 'blind':
        return 'blindroll';
      case 'self':
        return 'selfroll';
      default:
        return 'roll';
    }
  }

  toMessageOptions(mode) {
    const value = this.rollMode(mode);
    return game.release.generation >= 14 ? { messageMode: value } : { rollMode: value };
  }
}
