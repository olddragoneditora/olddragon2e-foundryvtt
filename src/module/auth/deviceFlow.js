import {
  clearTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
  isStoredTokenExpired,
  storeTokens,
} from './tokenStore.js';

// One shared public client serves every user of the module, so nobody has to
// register an application. Created by `rails foundryvtt:oauth_app`.
const CLIENT_ID = 'olddragon2e-foundryvtt';
const SCOPE = 'openid content.read content.write offline_access';
const GRANT_DEVICE_CODE = 'urn:ietf:params:oauth:grant-type:device_code';

const form = function (params) {
  return new URLSearchParams(params).toString();
};

const postForm = async function (path, params) {
  return fetch(`${game.settings.get('olddragon2e', 'odoBaseUrl').replace(/\/+$/, '')}${path}`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    credentials: 'omit',
    body: form(params),
  });
};

export const requestDeviceCode = async function () {
  const response = await postForm('/device-authorization', { client_id: CLIENT_ID, scope: SCOPE });
  if (!response.ok) throw new Error(`Falha ao iniciar a conexão (${response.status}).`);
  return response.json();
};

// Polls until the user approves on the site. Honors the interval the server
// returns, backs off on slow_down, and gives up on expired_token/access_denied.
export const pollForToken = async function (deviceCode, intervalSeconds, expiresInSeconds) {
  let interval = intervalSeconds * 1000;
  const deadline = Date.now() + expiresInSeconds * 1000;

  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, interval));

    const response = await postForm('/token', {
      grant_type: GRANT_DEVICE_CODE,
      device_code: deviceCode,
      client_id: CLIENT_ID,
    });
    const payload = await response.json();

    if (response.ok) return payload;
    if (payload.error === 'authorization_pending') continue;
    if (payload.error === 'slow_down') {
      interval += 5_000;
      continue;
    }
    if (payload.error === 'access_denied') throw new Error('Autorização negada.');
    if (payload.error === 'expired_token') throw new Error('O código expirou. Tente novamente.');
    throw new Error(`Falha ao autorizar (${payload.error ?? response.status}).`);
  }

  throw new Error('O código expirou. Tente novamente.');
};

export const refreshAccessToken = async function () {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) return null;

  const response = await postForm('/token', {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: CLIENT_ID,
  });

  if (!response.ok) {
    // invalid_grant means revoked or a year elapsed: start over.
    clearTokens();
    return null;
  }

  const payload = await response.json();
  storeTokens(payload);
  return payload.access_token;
};

// Returns a usable access token, refreshing first when the stored one is stale.
export const getValidAccessToken = async function () {
  if (!getStoredRefreshToken()) return null;
  if (isStoredTokenExpired()) return refreshAccessToken();
  return getStoredAccessToken();
};

export const disconnect = function () {
  clearTokens();
};

export { CLIENT_ID, SCOPE };
