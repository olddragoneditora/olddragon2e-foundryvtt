import { resolveAmmo } from '../../src/module/rolls/ammo.js';

const makeWeapon = (overrides = {}) => ({
  name: 'Arma de Teste',
  system: {
    ammo_type: 'none',
    quantity: 1,
    ...overrides,
  },
});

const makeAmmo = (overrides = {}) => ({
  system: {
    arrow: false,
    bolt: false,
    bolt_small: false,
    quantity: 5,
    ...overrides,
  },
});

const makeActor = (equippedAmmunition = []) => ({
  system: { equipped_ammunition: equippedAmmunition },
});

describe('resolveAmmo', () => {
  it('does not require ammo when ammo_type is "none" (every real compendium item today)', () => {
    const weapon = makeWeapon({ ammo_type: 'none' });
    const result = resolveAmmo(makeActor(), weapon);

    expect(result).toEqual({ requiresAmmo: false, ammoItem: null, ambiguous: false });
  });

  it('does not require ammo when ammo_type is missing entirely (fail-open for un-migrated items)', () => {
    const weapon = makeWeapon();
    delete weapon.system.ammo_type;
    const result = resolveAmmo(makeActor(), weapon);

    expect(result).toEqual({ requiresAmmo: false, ammoItem: null, ambiguous: false });
  });

  it('treats ammo_type "self" as its own ammunition', () => {
    const weapon = makeWeapon({ ammo_type: 'self' });
    const result = resolveAmmo(makeActor(), weapon);

    expect(result.requiresAmmo).toBe(true);
    expect(result.ammoItem).toBe(weapon);
  });

  it('resolves a matching equipped ammo item for ammo_type "arrow"', () => {
    const weapon = makeWeapon({ ammo_type: 'arrow' });
    const arrowAmmo = makeAmmo({ arrow: true });
    const boltAmmo = makeAmmo({ bolt: true });
    const actor = makeActor([boltAmmo, arrowAmmo]);

    const result = resolveAmmo(actor, weapon);

    expect(result.requiresAmmo).toBe(true);
    expect(result.ammoItem).toBe(arrowAmmo);
    expect(result.ambiguous).toBe(false);
  });

  it('returns ambiguous when more than one equipped ammo matches the ammo_type', () => {
    const weapon = makeWeapon({ ammo_type: 'arrow' });
    const huntingArrow = makeAmmo({ arrow: true });
    const warArrow = makeAmmo({ arrow: true });
    const actor = makeActor([huntingArrow, warArrow]);

    const result = resolveAmmo(actor, weapon);

    expect(result).toEqual({ requiresAmmo: true, ammoItem: null, ambiguous: true });
  });

  it('does not match ammo_type "bolt" against bolt_small ammunition', () => {
    const weapon = makeWeapon({ ammo_type: 'bolt' });
    const boltSmallAmmo = makeAmmo({ bolt_small: true });
    const actor = makeActor([boltSmallAmmo]);

    const result = resolveAmmo(actor, weapon);

    expect(result.requiresAmmo).toBe(true);
    expect(result.ammoItem).toBeNull();
  });

  it('returns no ammo item when no equipped ammo matches the ammo_type', () => {
    const weapon = makeWeapon({ ammo_type: 'arrow' });
    const boltAmmo = makeAmmo({ bolt: true });
    const actor = makeActor([boltAmmo]);

    const result = resolveAmmo(actor, weapon);

    expect(result.requiresAmmo).toBe(true);
    expect(result.ammoItem).toBeNull();
  });

  it('returns no ammo item when the actor has no equipped ammunition', () => {
    const weapon = makeWeapon({ ammo_type: 'arrow' });

    const result = resolveAmmo(makeActor([]), weapon);

    expect(result.requiresAmmo).toBe(true);
    expect(result.ammoItem).toBeNull();
  });
});
