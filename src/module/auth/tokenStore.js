const EXPIRY_MARGIN_MS = 60_000;

export const tokenExpiryFrom = function (expiresIn, now) {
  return now + expiresIn * 1000;
};

export const isTokenExpired = function (expiresAt, now) {
  if (!expiresAt) return true;
  return expiresAt - now <= EXPIRY_MARGIN_MS;
};

export const storeTokens = function (payload, now = Date.now()) {
  game.settings.set('olddragon2e', 'odoAccessToken', payload.access_token);
  // The refresh token rotates on every use; always overwrite it.
  game.settings.set('olddragon2e', 'odoRefreshToken', payload.refresh_token ?? '');
  game.settings.set('olddragon2e', 'odoExpiresAt', tokenExpiryFrom(payload.expires_in, now));
};

export const storeAccountHandler = function (handler) {
  game.settings.set('olddragon2e', 'odoAccountHandler', handler ?? '');
};

export const getStoredAccountHandler = function () {
  return game.settings.get('olddragon2e', 'odoAccountHandler');
};

export const clearTokens = function () {
  game.settings.set('olddragon2e', 'odoAccessToken', '');
  game.settings.set('olddragon2e', 'odoRefreshToken', '');
  game.settings.set('olddragon2e', 'odoExpiresAt', 0);
  game.settings.set('olddragon2e', 'odoAccountHandler', '');
};

export const getStoredAccessToken = function () {
  return game.settings.get('olddragon2e', 'odoAccessToken');
};

export const getStoredRefreshToken = function () {
  return game.settings.get('olddragon2e', 'odoRefreshToken');
};

export const isConnected = function () {
  return Boolean(getStoredRefreshToken());
};

export const isStoredTokenExpired = function (now = Date.now()) {
  return isTokenExpired(game.settings.get('olddragon2e', 'odoExpiresAt'), now);
};
