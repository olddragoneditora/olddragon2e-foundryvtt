const DEFAULT_BASE_URL = 'https://olddragon.com.br';

export const buildOdoUrl = function (path, base) {
  return `${base.replace(/\/+$/, '')}${path}`;
};

export const isOdoUrl = function (url, base) {
  try {
    return new URL(url).host === new URL(base).host;
  } catch {
    return false;
  }
};

export const odoBaseUrl = function () {
  return game.settings.get('olddragon2e', 'odoBaseUrl').replace(/\/+$/, '') || DEFAULT_BASE_URL;
};

// Single choke point for every ODO request, so headers and the base URL cannot
// drift between call sites. Never sends credentials: the API answers with
// `Access-Control-Allow-Origin: *`, which browsers reject for credentialed
// requests. Always sends Accept: application/json, without which an auth
// failure comes back as a 302 to /authorize instead of a 401.
export const odoFetch = async function (path, { method = 'GET', body = null, token = null } = {}) {
  const headers = {
    Accept: 'application/json',
    'User-Agent': `olddragon2e/${game.system.version} (+https://olddragon.com.br)`,
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers['Content-Type'] = 'application/json';

  return fetch(buildOdoUrl(path, odoBaseUrl()), {
    method,
    headers,
    credentials: 'omit',
    body: body ? JSON.stringify(body) : undefined,
  });
};

export { DEFAULT_BASE_URL };
