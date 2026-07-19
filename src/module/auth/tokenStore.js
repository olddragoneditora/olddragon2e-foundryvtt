// Minimal for now: settings.js needs clearTokens to react to an odoBaseUrl
// change. The rest of the token lifecycle (storing, reading, refreshing) is
// built out in a later step.
export const clearTokens = function () {
  game.settings.set('olddragon2e', 'odoAccessToken', '');
  game.settings.set('olddragon2e', 'odoRefreshToken', '');
  game.settings.set('olddragon2e', 'odoExpiresAt', 0);
};
