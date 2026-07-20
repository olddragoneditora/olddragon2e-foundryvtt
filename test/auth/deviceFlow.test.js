import { pollForToken, prefilledVerificationUrl, refreshAccessToken } from '../../src/module/auth/deviceFlow.js';

// The server has no request-level rate limiter and can serve a static HTML
// error page instead of JSON, so a couple of the fixtures below deliberately
// have a `json()` that rejects, the same way a real Response would on `<html>…`.
const jsonResponse = function (body, { ok = true, status = 200 } = {}) {
  return { ok, status, json: async () => body };
};

const brokenResponse = function (status = 500) {
  return {
    ok: false,
    status,
    json: async () => {
      throw new SyntaxError('Unexpected token < in JSON');
    },
  };
};

const stubGame = function (overrides = {}) {
  const store = {
    odoBaseUrl: 'https://olddragon.com.br',
    odoAccessToken: '',
    odoRefreshToken: 'stored-refresh-token',
    odoExpiresAt: 0,
    ...overrides,
  };
  const set = vi.fn((_scope, key, value) => {
    store[key] = value;
  });
  vi.stubGlobal('game', {
    settings: {
      get: vi.fn((_scope, key) => store[key]),
      set,
    },
    system: { version: '2.4.0' },
  });
  return { store, set };
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('refreshAccessToken', () => {
  it('clears the stored tokens when the refresh is rejected as invalid_grant', async () => {
    const { set } = stubGame();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ error: 'invalid_grant' }, { ok: false, status: 400 })),
    );

    const token = await refreshAccessToken();

    expect(token).toBeNull();
    expect(set).toHaveBeenCalledWith('olddragon2e', 'odoAccessToken', '');
    expect(set).toHaveBeenCalledWith('olddragon2e', 'odoRefreshToken', '');
    expect(set).toHaveBeenCalledWith('olddragon2e', 'odoExpiresAt', 0);
  });

  it('keeps the stored tokens on a transient 500 with an HTML body', async () => {
    const { set } = stubGame();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(brokenResponse(500)));

    const token = await refreshAccessToken();

    expect(token).toBeNull();
    expect(set).not.toHaveBeenCalled();
  });

  it('persists the newly rotated refresh token on a successful refresh', async () => {
    const { store } = stubGame();
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          jsonResponse({ access_token: 'new-access', refresh_token: 'new-refresh', expires_in: 3600 }),
        ),
    );

    const token = await refreshAccessToken();

    expect(token).toBe('new-access');
    expect(store.odoRefreshToken).toBe('new-refresh');
  });
});

describe('pollForToken', () => {
  it('continues polling past a non-JSON error body instead of throwing', async () => {
    stubGame();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(brokenResponse(502))
      .mockResolvedValueOnce(jsonResponse({ access_token: 'a', refresh_token: 'r', expires_in: 3600 }));
    vi.stubGlobal('fetch', fetchMock);

    const payload = await pollForToken('device-code', 0, 5);

    expect(payload.access_token).toBe('a');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('still terminates on access_denied', async () => {
    stubGame();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ error: 'access_denied' }, { ok: false, status: 400 })),
    );

    await expect(pollForToken('device-code', 0, 5)).rejects.toThrow('Autorização negada.');
  });
});

describe('prefilledVerificationUrl', () => {
  it('adds the short c param to the server-provided verification uri', () => {
    const url = prefilledVerificationUrl({
      verification_uri: 'https://olddragon.com.br/dispositivo',
      user_code: 'ABCDEFG',
    });

    expect(url).toBe('https://olddragon.com.br/dispositivo?c=ABCDEFG');
  });

  it('uses the host the server returned rather than a hardcoded one', () => {
    const url = prefilledVerificationUrl({
      verification_uri: 'http://olddragon.test:3023/dispositivo',
      user_code: 'ABCDEFG',
    });

    expect(url).toBe('http://olddragon.test:3023/dispositivo?c=ABCDEFG');
  });

  it('does not duplicate an existing query string', () => {
    const url = prefilledVerificationUrl({
      verification_uri: 'https://olddragon.com.br/dispositivo?ref=vtt',
      user_code: 'ABCDEFG',
    });

    expect(url).toBe('https://olddragon.com.br/dispositivo?ref=vtt&c=ABCDEFG');
  });

  it('falls back to the complete uri when the verification uri is unusable', () => {
    const url = prefilledVerificationUrl({
      verification_uri: 'nonsense',
      verification_uri_complete: 'https://olddragon.com.br/dispositivo?user_code=ABCDEFG',
      user_code: 'ABCDEFG',
    });

    expect(url).toBe('https://olddragon.com.br/dispositivo?user_code=ABCDEFG');
  });

  it('never throws when the server sends nothing usable', () => {
    expect(prefilledVerificationUrl({})).toBe('');
  });
});
