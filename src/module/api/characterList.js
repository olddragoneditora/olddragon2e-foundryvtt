import { odoFetchAuthenticated } from './odoClient.js';

// The API only serializes hit points, attributes, race and class once the
// character passes the class step, so anything missing them is still being
// created and cannot produce a usable actor.
export const normalizeCharacterRow = function (json) {
  const importable = Boolean(json.max_hp && json.character_class);

  return {
    id: json.id,
    name: json.name,
    level: json.level ?? 1,
    raceName: json.character_race?.name ?? '',
    className: json.character_class?.name ?? '',
    campaignName: json.campaign?.name ?? '',
    importable,
    reason: importable ? '' : 'incomplete',
  };
};

// Paginated at a fixed 21 per page server-side; `per_page` is ignored.
export const CHARACTERS_PAGE_SIZE = 21;

export const fetchCharacters = async function (page = 1) {
  const response = await odoFetchAuthenticated(`/personagens.json?page=${page}`);
  if (!response.ok)
    throw new Error(game.i18n.format('olddragon2e.errors.odo_list_characters_failed', { status: response.status }));

  const json = await response.json();
  return json.map(normalizeCharacterRow);
};

// Identifies which account the stored tokens belong to, so the connected state
// can name it. Returns null rather than throwing: not knowing the handler must
// never stop someone from using a connection that works.
export const fetchAccountHandler = async function () {
  try {
    const response = await odoFetchAuthenticated('/perfil.json');
    if (!response.ok) return null;
    const json = await response.json();
    return json.handler ?? null;
  } catch {
    return null;
  }
};
