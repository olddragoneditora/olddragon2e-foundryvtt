import { importActor, importRetainerActor } from '../api/characterImporter';
import { CHARACTERS_PAGE_SIZE, fetchCharacters } from '../api/characterList.js';
import { buildOdoUrl, isOdoUrl, odoBaseUrl } from '../api/odoClient.js';
import { requestDeviceCode, pollForToken, disconnect, prefilledVerificationUrl } from '../auth/deviceFlow.js';
import { isConnected, storeTokens } from '../auth/tokenStore.js';

class CharacterImporterDialog extends Application {
  constructor(options = {}) {
    super(options);
    this._hasMore = false;
  }

  /** @override */
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.id = 'character-importer-dialog';
    options.title = 'Importar Ajudante ou Personagem do ODO';
    options.template = 'systems/olddragon2e/templates/dialog/character-importer-dialog.hbs';
    options.width = 420;
    options.height = 'auto';
    return options;
  }

  /** @override */
  async getData() {
    if (isConnected() && this._characters === undefined) {
      this._page = 1;
      const page = await this._loadPage(1);
      this._characters = page;
      this._hasMore = page.length === CHARACTERS_PAGE_SIZE;
    }
    if (!isConnected()) {
      this._characters = undefined;
      this._hasMore = false;
    }

    return {
      odoBaseUrl: odoBaseUrl(),
      connected: isConnected(),
      characters: this._characters ?? [],
      // A further page exists only if the last fetch came back completely full.
      hasMore: this._hasMore,
    };
  }

  async _loadPage(page) {
    try {
      return await fetchCharacters(page);
    } catch (error) {
      ui.notifications.error(error.message);
      return [];
    }
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find('.cancel-button').on('click', this._onCancel.bind(this));
    html.find('.character-importer-button').on('click', this._onCharacterImporter.bind(this));
    html.find('.odo-connect-button').on('click', this._onConnect.bind(this));
    html.find('.odo-disconnect-button').on('click', this._onDisconnect.bind(this));
    html.find('.odo-character:not(.disabled)').on('click', this._onPickCharacter.bind(this));
    html.find('.odo-load-more').on('click', this._onLoadMore.bind(this));
  }

  async _onCancel(event) {
    event.preventDefault();
    await this.close();
  }

  async _onConnect(event) {
    event.preventDefault();
    const button = document.querySelector('.odo-connect-button');
    button.disabled = true;

    let waiting;
    let tokens;
    try {
      const device = await requestDeviceCode();
      const instructions = `
        <p>${game.i18n.localize('olddragon2e.odo_device_instructions')}</p>
        <p class="odo-user-code"><strong>${device.user_code}</strong></p>
        <p class="odo-device-link">
          <a href="${prefilledVerificationUrl(device)}" target="_blank" rel="noopener">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>${game.i18n.localize('olddragon2e.odo_open_authorization')}
          </a>
        </p>
        <p class="odo-device-manual">
          ${game.i18n.localize('olddragon2e.odo_device_manual')}
          <span class="odo-device-url">${device.verification_uri}</span>
        </p>
        <p>${game.i18n.localize('olddragon2e.odo_waiting_authorization')}</p>`;
      waiting = new Dialog({
        title: game.i18n.localize('olddragon2e.odo_connect'),
        content: instructions,
        buttons: {},
      });
      waiting.render(true);

      tokens = await pollForToken(device.device_code, device.interval, device.expires_in);
      storeTokens(tokens);
    } catch (error) {
      ui.notifications.error(`${game.i18n.localize('olddragon2e.odo_connect_failed')}: ${error.message}`);
    } finally {
      if (waiting) {
        try {
          await waiting.close();
        } catch (closeError) {
          console.error(closeError);
        }
      }
      button.disabled = false;
    }

    if (tokens) this.render(true);
  }

  async _onDisconnect(event) {
    event.preventDefault();
    const button = document.querySelector('.odo-disconnect-button');
    button.disabled = true;

    try {
      disconnect();
      this.render(true);
    } finally {
      button.disabled = false;
    }
  }

  async _onLoadMore(event) {
    event.preventDefault();
    this._page += 1;
    const page = await this._loadPage(this._page);
    if (page.length > 0) this._characters = [...this._characters, ...page];
    this._hasMore = page.length === CHARACTERS_PAGE_SIZE;
    this.render(true);
  }

  async _onPickCharacter(event) {
    event.preventDefault();
    if (this._importingCharacter) return;
    this._importingCharacter = true;

    try {
      const characterId = event.currentTarget.dataset.characterId;
      const json = await this._retrieveJson(buildOdoUrl(`/personagens/${characterId}.json`, odoBaseUrl()));
      if (json === '') return;

      const actor = await importActor(json);
      actor.sheet.render(true);
      await this.close();
    } catch (err) {
      console.error(err);
      ui.notifications.error(`Error importing character. Check console for error log.`);
    } finally {
      this._importingCharacter = false;
    }
  }

  async _onCharacterImporter(event) {
    event.preventDefault();
    const button = document.querySelector('.character-importer-button');
    button.disabled = true;

    const url = document.querySelector('#character-importer-url-text').value;
    const actorType = this._detectActorType(url);

    if (actorType === null) {
      ui.notifications.error('URL não reconhecida. Informe uma URL de personagem ou ajudante do Old Dragon Online.');
      button.disabled = false;
      return;
    }

    try {
      const parsedURL = this._parseURL(url);
      const json = await this._retrieveJson(parsedURL);

      console.debug('olddragon2e | _onCharacterImporter', json);
      if (json === '') return;

      const actor = actorType === 'retainer' ? await importRetainerActor(json) : await importActor(json);
      actor.sheet.render(true);

      await this.close();
    } catch (err) {
      console.error(err);
      ui.notifications.error(`Error importing character. Check console for error log.`);
    } finally {
      button.disabled = false;
    }
  }

  _parseURL(url) {
    // check if URL ends with .json. if not, append it
    if (!url.endsWith('.json')) {
      url += '.json';
    }

    return url;
  }

  _detectActorType(url) {
    if (!isOdoUrl(url, odoBaseUrl())) return null;
    const { pathname } = new URL(url);
    if (pathname.startsWith('/ajudantes/')) return 'retainer';
    if (pathname.startsWith('/personagens/')) return 'character';
    return null;
  }

  async _retrieveJson(url) {
    try {
      console.debug('olddragon2e | Retrieving JSON from URL: ', url);

      const response = await fetch(url);

      if (!response.ok) {
        ui.notifications.error(`Error making external request. Check console for error log.`);
        return '';
      }

      return response.json();
    } catch (error) {
      console.error(error);
      ui.notifications.error(`Error making external request. Check console for error log.`);
      return '';
    }
  }
}

export const showCharacterImporter = () => {
  const characterImporterDialog = new CharacterImporterDialog();
  characterImporterDialog.render(true);
};
