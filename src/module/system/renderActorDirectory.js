import { showCharacterImporter } from '../dialogs/characterImporter';
import { isConnected } from '../auth/tokenStore.js';

/**
 * @param {Application} app
 * @param {jQuery} html
 */
export const renderActorDirectory = (app, html) => {
  if (game.user.can('ACTOR_CREATE')) {
    // The label depends on whether the account is connected, so a stale button is
    // replaced rather than skipped: connecting or disconnecting re-renders this
    // directory precisely so the label can change.
    html.querySelector('.character-generator')?.remove();

    const section = document.createElement('header');
    section.classList.add('character-generator');
    section.classList.add('directory-header');

    const dirHeader = html.querySelector('.directory-header');
    dirHeader.parentNode.insertBefore(section, dirHeader);

    const connected = isConnected();

    const actions = document.createElement('div');
    actions.classList.add('header-actions', 'action-buttons', 'flexrow');

    const button = document.createElement('button');
    button.classList.add('import-character-button');

    const icon = document.createElement('i');
    icon.classList.add('fas', connected ? 'fa-file-import' : 'fa-link');
    button.append(icon);
    button.append(
      game.i18n.localize(
        connected ? 'olddragon2e.odo_import_actor_directory' : 'olddragon2e.odo_connect_actor_directory',
      ),
    );

    button.addEventListener('click', () => {
      showCharacterImporter();
    });

    actions.append(button);
    section.append(actions);
  }
};
