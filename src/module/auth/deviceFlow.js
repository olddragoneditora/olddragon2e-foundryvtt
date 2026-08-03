import { buildOdoUrl, odoBaseUrl, userAgent } from '../api/odoClient.js';
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

// These OAuth endpoints take form-encoded bodies, not JSON, so this can't
// simply call odoFetch. It still goes through odoClient.js's buildOdoUrl/
// odoBaseUrl for the base URL and sends the same User-Agent, so it doesn't
// drift from the choke point — don't fold this back into odoFetch.
const postForm = async function (path, params) {
  return fetch(buildOdoUrl(path, odoBaseUrl()), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': userAgent(),
    },
    credentials: 'omit',
    body: form(params),
  });
};

// The server has no request-level rate limiter and can serve a static HTML
// error page (500/429) instead of JSON, so every /token response body must
// be parsed defensively.
const readJson = async function (response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const requestDeviceCode = async function () {
  const response = await postForm('/device-authorization', { client_id: CLIENT_ID, scope: SCOPE });
  if (!response.ok)
    throw new Error(game.i18n.format('olddragon2e.errors.odo_connection_start_failed', { status: response.status }));
  return response.json();
};

// The link we show uses the site's short `?c=` alias, which pre-fills the code
// without submitting it, so the person still confirms it matches the code shown
// here before authorizing — that check is what protects the device flow.
// Built from the server-provided verification_uri, never a hardcoded path.
export const prefilledVerificationUrl = function (device) {
  try {
    const url = new URL(device.verification_uri);
    url.searchParams.set('c', device.user_code);
    return url.toString();
  } catch {
    return device.verification_uri_complete ?? device.verification_uri ?? '';
  }
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
    const payload = await readJson(response);

    if (response.ok && payload) return payload;
    // A non-JSON body (a static error page during a deploy blip) is
    // transient: keep polling instead of aborting, the device code stays
    // valid for the rest of its expires_in window.
    if (!payload) continue;
    if (payload.error === 'authorization_pending') continue;
    if (payload.error === 'slow_down') {
      interval += 5_000;
      continue;
    }
    if (payload.error === 'access_denied')
      throw new Error(game.i18n.localize('olddragon2e.errors.odo_authorization_denied'));
    if (payload.error === 'expired_token') throw new Error(game.i18n.localize('olddragon2e.errors.odo_code_expired'));
    throw new Error(
      game.i18n.format('olddragon2e.errors.odo_authorization_failed', { error: payload.error ?? response.status }),
    );
  }

  throw new Error(game.i18n.localize('olddragon2e.errors.odo_code_expired'));
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
    // invalid_grant means revoked or a year elapsed: start over. Any other
    // failure (a transient 500/502/503, a static error page, ...) leaves
    // the stored tokens alone so the caller can retry instead of forcing
    // the whole device flow again.
    const payload = await readJson(response);
    if (payload?.error === 'invalid_grant') clearTokens();
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
