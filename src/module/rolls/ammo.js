const AMMO_FAMILY_FLAGS = ['arrow', 'bolt', 'bolt_small', 'stone'];

const sharesAmmoFamily = (weapon, ammoItem) =>
  AMMO_FAMILY_FLAGS.some((flag) => weapon.system[flag] === true && ammoItem.system[flag] === true);

/**
 * Resolves which equipped ammunition item (if any) a weapon should consume for an attack.
 *
 * @param {Actor} actor
 * @param {Item} weapon
 * @returns {{requiresAmmo: boolean, ammoItem: Item|null}}
 */
export const resolveAmmo = (actor, weapon) => {
  if (weapon.system.type === 'melee' || weapon.system.type === 'ammunition') {
    return { requiresAmmo: false, ammoItem: null };
  }

  const hasFamilyFlag = AMMO_FAMILY_FLAGS.some((flag) => weapon.system[flag] === true);

  if (weapon.system.type === 'throwing' && !hasFamilyFlag) {
    // Arremesso puro (ex.: adaga de arremesso) — a própria arma é a munição, consumida do seu próprio quantity.
    return { requiresAmmo: true, ammoItem: weapon };
  }

  const equippedAmmo = actor.system.equipped_ammunition ?? [];
  const ammoItem = equippedAmmo.find((ammo) => sharesAmmoFamily(weapon, ammo)) ?? null;

  return { requiresAmmo: true, ammoItem };
};
