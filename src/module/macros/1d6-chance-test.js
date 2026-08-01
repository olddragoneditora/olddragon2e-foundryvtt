Hooks.once('ready', async () => {
  // Apenas o GM executa a criação do macro "global"
  if (!game.user.isGM) return;

  const macroName = game.i18n.localize('olddragon2e.dialog.chance_test');
  // Procura um macro global pelo flag ou pelo nome (macros globais têm folder === null)
  let macro = game.macros.find((m) => (m.flags?.olddragon2e === true || m.name === macroName) && m.folder === null);

  if (!macro) {
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
      flags: { olddragon2e: true },
    });
  }
});
