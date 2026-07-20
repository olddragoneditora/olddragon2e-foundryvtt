const EXPIRY_MARGIN_MS = 60_000;

export const tokenExpiryFrom = function (expiresIn, now) {
  return now + expiresIn * 1000;
};

export const isTokenExpired = function (expiresAt, now) {
  if (!expiresAt) return true;
  return expiresAt - now <= EXPIRY_MARGIN_MS;
};

// Pulls the `email` claim out of an id_token's payload segment, without any
// network call — the /userinfo endpoint isn't CORS-enabled for this module.
// Never throws: a missing, malformed, or non-JWT token just yields no name.
export const decodeIdTokenEmail = function (idToken) {
  if (typeof idToken !== 'string') return null;
  const parts = idToken.split('.');
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const claims = JSON.parse(atob(padded));
    return claims.email ?? null;
  } catch {
    return null;
  }
};

export const storeTokens = function (payload, now = Date.now()) {
  game.settings.set('olddragon2e', 'odoAccessToken', payload.access_token);
  // The refresh token rotates on every use; always overwrite it.
  game.settings.set('olddragon2e', 'odoRefreshToken', payload.refresh_token ?? '');
  game.settings.set('olddragon2e', 'odoExpiresAt', tokenExpiryFrom(payload.expires_in, now));
  game.settings.set('olddragon2e', 'odoAccountName', decodeIdTokenEmail(payload.id_token) ?? '');
};

export const clearTokens = function () {
  game.settings.set('olddragon2e', 'odoAccessToken', '');
  game.settings.set('olddragon2e', 'odoRefreshToken', '');
  game.settings.set('olddragon2e', 'odoExpiresAt', 0);
  game.settings.set('olddragon2e', 'odoAccountName', '');
};

export const getStoredAccessToken = function () {
  return game.settings.get('olddragon2e', 'odoAccessToken');
};

export const getStoredRefreshToken = function () {
  return game.settings.get('olddragon2e', 'odoRefreshToken');
};

export const getStoredAccountName = function () {
  return game.settings.get('olddragon2e', 'odoAccountName');
};

export const isConnected = function () {
  return Boolean(getStoredRefreshToken());
};

export const isStoredTokenExpired = function (now = Date.now()) {
  return isTokenExpired(game.settings.get('olddragon2e', 'odoExpiresAt'), now);
};
