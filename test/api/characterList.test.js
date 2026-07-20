import { normalizeCharacterRow } from '../../src/module/api/characterList.js';

describe('normalizeCharacterRow', () => {
  const complete = {
    id: 'abc',
    name: 'Eledriel',
    level: 2,
    max_hp: 12,
    character_race: { name: 'Elfo' },
    character_class: { name: 'Mago' },
    campaign: { name: 'Valansia' },
  };

  it('maps a complete character', () => {
    const row = normalizeCharacterRow(complete);

    expect(row.id).toBe('abc');
    expect(row.name).toBe('Eledriel');
    expect(row.level).toBe(2);
    expect(row.raceName).toBe('Elfo');
    expect(row.className).toBe('Mago');
    expect(row.campaignName).toBe('Valansia');
    expect(row.importable).toBe(true);
    expect(row.reason).toBe('');
  });

  it('marks a character still in creation as not importable', () => {
    // The API omits max_hp, race and class until the character passes the
    // class step, so importing one would produce a broken actor.
    const row = normalizeCharacterRow({ id: 'xyz', name: 'Sem classe', level: 1 });

    expect(row.importable).toBe(false);
    expect(row.reason).toBe('incomplete');
  });

  it('marks a character that has passed the race step but not the class step as not importable', () => {
    // On the real server, character_race is set before max_hp and
    // character_class. If importable used `||` instead of `&&`, this
    // intermediate shape would wrongly pass as importable.
    const row = normalizeCharacterRow({
      id: 'def',
      name: 'Meio-Elfo sem classe',
      level: 1,
      character_race: { name: 'Meio-Elfo' },
    });

    expect(row.importable).toBe(false);
    expect(row.reason).toBe('incomplete');
  });

  it('tolerates a character without a campaign', () => {
    const row = normalizeCharacterRow({ ...complete, campaign: null });

    expect(row.campaignName).toBe('');
    expect(row.importable).toBe(true);
  });
});
