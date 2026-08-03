Hooks.once('ready', async () => {
  // Apenas o GM executa a criação do macro "global"
  if (!game.user.isGM) return;

  const macroName = game.i18n.localize('olddragon2e.dialog.chance_test');
  const legacyMacroName = 'Teste de Chance em 1d6';

  // Procura o macro global pela flag, que é estável independente do idioma ativo
  // (macros globais têm folder === null)
  let macro = game.macros.find((m) => m.getFlag('olddragon2e', 'chanceTest') === true && m.folder === null);

  // Remove macros legados criados antes da flag existir (nome fixo, sem flag)
  const legacyMacros = game.macros.filter(
    (m) =>
      !m.getFlag('olddragon2e', 'chanceTest') &&
      m.folder === null &&
      (m.name === legacyMacroName || m.name === macroName),
  );
  if (legacyMacros.length) {
    await Macro.deleteDocuments(legacyMacros.map((m) => m.id));
  }

  if (macro) {
    if (macro.name !== macroName) await macro.update({ name: macroName });
  } else {
    macro = await Macro.create({
      name: macroName,
      type: 'script',
      img: 'systems/olddragon2e/assets/icons/d6.svg',
      command: `
const options = [1, 2, 3, 4, 5, 6]
  .map((n) => \`<option value="\${n}">\${game.i18n.format('olddragon2e.dialog.chance_option', { n })}</option>\`)
  .join('');

const content = \`
<form>
  <div class="form-group">
    <label for="chance">\${game.i18n.localize('olddragon2e.dialog.chance_label')}</label>
    <select id="chance" name="chance">\${options}</select>
  </div>
</form>
\`;

new Dialog({
  title: game.i18n.localize('olddragon2e.dialog.chance_test'),
  content,
  buttons: {
    roll: {
      icon: '<i class="fas fa-dice"></i>',
      label: game.i18n.localize('olddragon2e.roll'),
      callback: async html => {
        const diff = parseInt(html.find('[name="chance"]').val());
        const roll = new Roll("1d6");
        await roll.evaluate();
        await roll.toMessage({
          roll,
          speaker: ChatMessage.getSpeaker(),
          flavor: \`<div class="title">\${game.i18n.format('olddragon2e.chat.chance_flavor', { n: diff })}</div>\` +
                  (roll.total <= diff
                    ? \`<p class="result"><strong class="success">\${game.i18n.localize('olddragon2e.chat.success')}</strong></p>\`
                    : \`<p class="result"><strong class="failure">\${game.i18n.localize('olddragon2e.chat.failure')}</strong></p>\`)
        });
      }
    },
    cancel: {
      icon: '<i class="fas fa-times"></i>',
      label: game.i18n.localize('olddragon2e.cancel')
    }
  },
  default: "roll"
}).render(true);
      `,
      ownership: { default: 1 }, // 1 = LIMITED
      flags: { olddragon2e: { chanceTest: true } },
    });
  }
});
