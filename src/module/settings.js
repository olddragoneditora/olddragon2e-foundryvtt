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

  game.settings.register('olddragon2e', 'odoExpiresAt', {
    scope: 'client',
    config: false,
    type: Number,
    default: 0,
  });
};

// Function to get the current initiative type
export const getInitiativeType = function () {
  return game.settings.get('olddragon2e', 'initiativeType');
};
