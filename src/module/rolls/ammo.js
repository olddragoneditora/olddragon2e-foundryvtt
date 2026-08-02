/**
 * Resolves which equipped ammunition item (if any) a weapon should consume for an attack.
 *
 * Ammo tracking is opt-in per weapon via `system.ammo_type` ('none' by default, matching every
 * real compendium item today — untracked weapons must keep attacking normally).
 *
 * @param {Actor} actor
 * @param {Item} weapon
 * @returns {{requiresAmmo: boolean, ammoItem: Item|null, ambiguous: boolean}}
 */
export const resolveAmmo = (actor, weapon) => {
  const ammoType = weapon.system.ammo_type ?? 'none';

  if (ammoType === 'none') {
    return { requiresAmmo: false, ammoItem: null, ambiguous: false };
  }

  if (ammoType === 'self') {
    return { requiresAmmo: true, ammoItem: weapon, ambiguous: false };
  }

  const equippedAmmo = actor.system.equipped_ammunition ?? [];
  const matches = equippedAmmo.filter((ammo) => ammo.system[ammoType] === true);

  if (matches.length > 1) {
    return { requiresAmmo: true, ammoItem: null, ambiguous: true };
  }

  return { requiresAmmo: true, ammoItem: matches[0] ?? null, ambiguous: false };
};
