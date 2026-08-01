/**
 * Resolves which equipped ammunition item (if any) a weapon should consume for an attack.
 *
 * Ammo tracking is opt-in per weapon via `system.ammo_type` ('none' by default, matching every
 * real compendium item today — untracked weapons must keep attacking normally).
 *
 * @param {Actor} actor
 * @param {Item} weapon
 * @returns {{requiresAmmo: boolean, ammoItem: Item|null}}
 */
export const resolveAmmo = (actor, weapon) => {
  const ammoType = weapon.system.ammo_type ?? 'none';

  if (ammoType === 'none') {
    return { requiresAmmo: false, ammoItem: null };
  }

  if (ammoType === 'self') {
    return { requiresAmmo: true, ammoItem: weapon };
  }

  const equippedAmmo = actor.system.equipped_ammunition ?? [];
  const ammoItem = equippedAmmo.find((ammo) => ammo.system[ammoType] === true) ?? null;

  return { requiresAmmo: true, ammoItem };
};
