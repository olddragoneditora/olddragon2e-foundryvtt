import { clearTokens } from './auth/tokenStore.js';

// System settings
export const registerSettings = function () {
  game.settings.register('olddragon2e', 'initiativeType', {
    name: game.i18n.localize('olddragon2e.settings.initiativeType.name'),
    hint: game.i18n.localize('olddragon2e.settings.initiativeType.hint'),
    scope: 'world',
    config: true,
    type: String,
    choices: {
      standard: game.i18n.localize('olddragon2e.settings.initiativeType.choices.standard'),
      individual: game.i18n.localize('olddragon2e.settings.initiativeType.choices.individual'),
    },
    default: 'standard',
    onChange: (value) => {
      // Update the initiative formula based on the choice
      if (value === 'individual') {
        CONFIG.Combat.initiative = {
          formula: '1d12',
          decimals: 0,
        };
      } else if (value === 'standard') {
        CONFIG.Combat.initiative = {
          formula: '1d20',
          decimals: 0,
        };

        // Initialize the custom initiative module
        if (game.olddragon2e && game.olddragon2e.InitiativeModule) {
          game.olddragon2e.InitiativeModule.initializeAttributeInitiative();
        }
      }
    },
  });

  // Hidden on purpose (config: false): points the ODO integration at a
  // development or staging server. Set it from the console:
  //   game.settings.set('olddragon2e', 'odoBaseUrl', 'http://olddragon.test:3027')
  game.settings.register('olddragon2e', 'odoBaseUrl', {
    scope: 'client',
    config: false,
    type: String,
    default: 'https://olddragon.com.br',
    onChange: () => {
      // Tokens belong to one environment; a production token is meaningless
      // against staging, so switching hosts signs the user out.
      clearTokens();
    },
  });

  game.settings.register('olddragon2e', 'odoAccessToken', {
    scope: 'client',
    config: false,
    type: String,
    default: '',
  });

  game.settings.register('olddragon2e', 'odoRefreshToken', {
    scope: 'client',
    config: false,
    type: String,
    default: '',
  });

  game.settings.register('olddragon2e', 'odoAccountHandler', {
    scope: 'client',
    config: false,
    type: String,
    default: '',
  });

  game.settings.register('olddragon2e', 'odoExpiresAt', {
    scope: 'client',
    config: false,
    type: Number,
    default: 0,
  });

  game.settings.register('olddragon2e', 'ammoTracking', {
    name: game.i18n.localize('olddragon2e.settings.ammoTracking.name'),
    hint: game.i18n.localize('olddragon2e.settings.ammoTracking.hint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
    onChange: (value) => {
      // onChange roda em TODO cliente conectado quando um setting de mundo muda (não só em
      // quem chamou .set()) — sem essa checagem, cada jogador conectado geraria seu próprio
      // aviso/mensagem duplicada.
      if (!game.user.isGM) return;

      // O módulo Forien's Ammo Swapper depende deste setting; não bloqueamos desligar,
      // só avisamos que o rastreamento vai parar de funcionar corretamente pra ele.
      if (value === false && game.modules.get('forien-ammo-swapper')?.active) {
        const message = game.i18n.localize('olddragon2e.settings.ammoTracking.disableWarning');
        ui.notifications.warn(message);
        ChatMessage.create({
          user: game.user.id,
          content: `<div class="title">${message}</div>`,
          whisper: [game.user.id],
        });
        return;
      }

      // Lembrete de que o rastreamento só afeta armas com um Tipo de Munição definido, e que
      // arma e munição precisam estar equipadas — tanto ao ativar manualmente quanto quando a
      // ativação automática (Hooks 'setup') dispara este onChange.
      if (value === true) {
        const message = game.i18n.localize('olddragon2e.settings.ammoTracking.equipReminder');
        ui.notifications.info(message);
        ChatMessage.create({
          user: game.user.id,
          content: `<div class="title">${message}</div>`,
          whisper: [game.user.id],
        });
      }
    },
  });
};

// Function to get the current initiative type
export const getInitiativeType = function () {
  return game.settings.get('olddragon2e', 'initiativeType');
};
