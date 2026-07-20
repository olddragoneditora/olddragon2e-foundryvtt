import { clampHealthPoints, hasRemoteChanged } from '../../src/module/api/characterSync.js';

describe('clampHealthPoints', () => {
  it('keeps a value inside the range', () => {
    expect(clampHealthPoints(5, 12)).toBe(5);
  });

  it('never sends more than the maximum', () => {
    expect(clampHealthPoints(20, 12)).toBe(12);
  });

  it('never sends a negative value', () => {
    expect(clampHealthPoints(-3, 12)).toBe(0);
  });

  it('rounds a fractional value', () => {
    expect(clampHealthPoints(7.6, 12)).toBe(8);
  });
});

describe('hasRemoteChanged', () => {
  it('detects a newer remote timestamp', () => {
    expect(hasRemoteChanged('2026-07-19T18:00:00Z', '2026-07-19T17:00:00Z')).toBe(true);
  });

  it('accepts an unchanged timestamp', () => {
    expect(hasRemoteChanged('2026-07-19T17:00:00Z', '2026-07-19T17:00:00Z')).toBe(false);
  });

  it('treats a never-synced actor as changed so the user is asked', () => {
    expect(hasRemoteChanged('2026-07-19T17:00:00Z', null)).toBe(true);
  });
});
