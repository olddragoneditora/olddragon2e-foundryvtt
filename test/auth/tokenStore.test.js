import { isTokenExpired, tokenExpiryFrom } from '../../src/module/auth/tokenStore.js';

describe('isTokenExpired', () => {
  it('is expired when the expiry is in the past', () => {
    expect(isTokenExpired(1_000, 2_000)).toBe(true);
  });

  it('is expired inside the 60s safety margin', () => {
    expect(isTokenExpired(100_000, 60_000)).toBe(true);
  });

  it('is valid well before the expiry', () => {
    expect(isTokenExpired(100_000, 10_000)).toBe(false);
  });

  it('treats a missing expiry as expired', () => {
    expect(isTokenExpired(0, 10_000)).toBe(true);
  });
});

describe('tokenExpiryFrom', () => {
  it('converts expires_in seconds into an absolute timestamp', () => {
    expect(tokenExpiryFrom(3_600, 1_000_000)).toBe(1_000_000 + 3_600_000);
  });
});
