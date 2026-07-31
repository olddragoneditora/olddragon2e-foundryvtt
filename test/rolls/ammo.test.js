import { resolveAmmo } from '../../src/module/rolls/ammo.js';

const makeWeapon = (overrides = {}) => ({
  name: 'Arma de Teste',
  system: {
    type: 'ranged',
    arrow: false,
    bolt: false,
    bolt_small: false,
    stone: false,
    quantity: 1,
    ...overrides,
  },
});

const makeAmmo = (overrides = {}) => ({
  system: {
    arrow: false,
    bolt: false,
    bolt_small: false,
    stone: false,
    quantity: 5,
    ...overrides,
  },
});

const makeActor = (equippedAmmunition = []) => ({
  system: { equipped_ammunition: equippedAmmunition },
});

describe('resolveAmmo', () => {
  it('does not require ammo for melee weapons', () => {
    const weapon = makeWeapon({ type: 'melee' });
    const result = resolveAmmo(makeActor(), weapon);

    expect(result).toEqual({ requiresAmmo: false, ammoItem: null });
  });

  it('does not require ammo for ammunition items themselves', () => {
    const weapon = makeWeapon({ type: 'ammunition', arrow: true });
    const result = resolveAmmo(makeActor(), weapon);

    expect(result).toEqual({ requiresAmmo: false, ammoItem: null });
  });

  it('treats a pure thrown weapon (no family flag) as its own ammunition', () => {
    const weapon = makeWeapon({ type: 'throwing' });
    const result = resolveAmmo(makeActor(), weapon);

    expect(result.requiresAmmo).toBe(true);
    expect(result.ammoItem).toBe(weapon);
  });

  it('resolves a matching equipped ammo item for a ranged weapon', () => {
    const weapon = makeWeapon({ type: 'ranged', arrow: true });
    const arrowAmmo = makeAmmo({ arrow: true });
    const boltAmmo = makeAmmo({ bolt: true });
    const actor = makeActor([boltAmmo, arrowAmmo]);

    const result = resolveAmmo(actor, weapon);

    expect(result.requiresAmmo).toBe(true);
    expect(result.ammoItem).toBe(arrowAmmo);
  });

  it('resolves a matching equipped ammo item for a sling (throwing + stone flag)', () => {
    const weapon = makeWeapon({ type: 'throwing', stone: true });
    const stoneAmmo = makeAmmo({ stone: true });
    const actor = makeActor([stoneAmmo]);

    const result = resolveAmmo(actor, weapon);

    expect(result.requiresAmmo).toBe(true);
    expect(result.ammoItem).toBe(stoneAmmo);
  });

  it('returns no ammo item when no equipped ammo shares a family flag', () => {
    const weapon = makeWeapon({ type: 'ranged', arrow: true });
    const boltAmmo = makeAmmo({ bolt: true });
    const actor = makeActor([boltAmmo]);

    const result = resolveAmmo(actor, weapon);

    expect(result.requiresAmmo).toBe(true);
    expect(result.ammoItem).toBeNull();
  });

  it('returns no ammo item when the actor has no equipped ammunition', () => {
    const weapon = makeWeapon({ type: 'ranged', arrow: true });

    const result = resolveAmmo(makeActor([]), weapon);

    expect(result.requiresAmmo).toBe(true);
    expect(result.ammoItem).toBeNull();
  });

  it('returns no ammo item when the weapon has no family flag set at all', () => {
    const weapon = makeWeapon({ type: 'ranged' });
    const arrowAmmo = makeAmmo({ arrow: true });

    const result = resolveAmmo(makeActor([arrowAmmo]), weapon);

    expect(result.requiresAmmo).toBe(true);
    expect(result.ammoItem).toBeNull();
  });
});
