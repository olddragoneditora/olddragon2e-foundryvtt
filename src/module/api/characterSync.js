import { odoFetchAuthenticated } from './odoClient.js';

const FLAG_SCOPE = 'olddragon2e';
const FLAG_UPDATED_AT = 'odoUpdatedAt';

export const clampHealthPoints = function (value, max) {
  return Math.min(Math.max(Math.round(value), 0), max);
};

export const hasRemoteChanged = function (remoteUpdatedAt, lastSyncedAt) {
  if (!lastSyncedAt) return true;
  return new Date(remoteUpdatedAt).getTime() !== new Date(lastSyncedAt).getTime();
};

export const recordSyncedAt = async function (actor, updatedAt) {
  await actor.setFlag(FLAG_SCOPE, FLAG_UPDATED_AT, updatedAt);
};

export const lastSyncedAt = function (actor) {
  return actor.getFlag(FLAG_SCOPE, FLAG_UPDATED_AT) ?? null;
};

// Pushes the actor's current hit points to ODO. Fetches first so we can warn
// before overwriting play that happened on the site or at another table.
export const pushHealthPoints = async function (actor) {
  const odoId = actor.system.odo_id;
  if (!odoId) {
    ui.notifications.error(game.i18n.localize('olddragon2e.odo_not_linked'));
    return false;
  }

  const healthPoints = clampHealthPoints(actor.system.hp.value, actor.system.hp.max);

  const current = await odoFetchAuthenticated(`/personagens/${odoId}.json`);
  if (!current.ok) {
    ui.notifications.error(`${game.i18n.localize('olddragon2e.odo_push_failed')} (${current.status})`);
    return false;
  }
  const remote = await current.json();

  if (hasRemoteChanged(remote.updated_at, lastSyncedAt(actor))) {
    const confirmed = await Dialog.confirm({
      title: game.i18n.localize('olddragon2e.odo_conflict_title'),
      content: `<p>${game.i18n.format('olddragon2e.odo_conflict_body', {
        remote: remote.health_points,
        local: healthPoints,
      })}</p>`,
    });
    if (!confirmed) return false;
  }

  const response = await odoFetchAuthenticated(`/personagens/${odoId}.json`, {
    method: 'PATCH',
    body: { health_points: healthPoints },
  });

  if (response.status === 403) {
    ui.notifications.error(game.i18n.localize('olddragon2e.odo_push_forbidden'));
    return false;
  }
  if (!response.ok) {
    ui.notifications.error(`${game.i18n.localize('olddragon2e.odo_push_failed')} (${response.status})`);
    return false;
  }

  // The PATCH response has no body (the controller returns head :ok for
  // JSON), so we cannot read the new updated_at from it — this follow-up GET
  // is what lets us record the fresh timestamp.
  const confirmation = await odoFetchAuthenticated(`/personagens/${odoId}.json`);
  if (confirmation.ok) await recordSyncedAt(actor, (await confirmation.json()).updated_at);

  ui.notifications.info(game.i18n.format('olddragon2e.odo_push_ok', { hp: healthPoints }));
  return true;
};
