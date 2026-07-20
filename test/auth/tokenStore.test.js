import { decodeIdTokenEmail, isTokenExpired, tokenExpiryFrom } from '../../src/module/auth/tokenStore.js';

const base64url = function (str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const fakeIdToken = function (payload) {
  return `${base64url(JSON.stringify({ alg: 'none', typ: 'JWT' }))}.${base64url(JSON.stringify(payload))}.signature`;
};

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

describe('decodeIdTokenEmail', () => {
  it('extracts the email claim from a well-formed id_token', () => {
    const token = fakeIdToken({ sub: 'abc123', email: 'jogador@example.com' });
    expect(decodeIdTokenEmail(token)).toBe('jogador@example.com');
  });

  it('returns null when the payload has no email claim', () => {
    const token = fakeIdToken({ sub: 'abc123' });
    expect(decodeIdTokenEmail(token)).toBeNull();
  });

  it('returns null for a missing token', () => {
    expect(decodeIdTokenEmail(undefined)).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(decodeIdTokenEmail('')).toBeNull();
  });

  it('returns null for a string that is not a JWT', () => {
    expect(decodeIdTokenEmail('not.a.jwt')).toBeNull();
  });

  it('returns null when the payload segment is not valid base64', () => {
    expect(decodeIdTokenEmail('header.!!!.signature')).toBeNull();
  });

  it('returns null when the payload decodes to non-JSON', () => {
    const notJson = base64url('not-json');
    expect(decodeIdTokenEmail(`header.${notJson}.signature`)).toBeNull();
  });
});
