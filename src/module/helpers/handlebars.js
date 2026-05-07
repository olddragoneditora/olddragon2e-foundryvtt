export function registerHandlebarsHelper() {
  // Stringify for Handlebars
  Handlebars.registerHelper('toJSON', function (obj) {
    return JSON.stringify(obj, null, 2);
  });

  // Times helper for Handlebars
  Handlebars.registerHelper('times', function (n, content) {
    let result = '';
    for (let i = 0; i < n; ++i) {
      content.data.index = i + 1;
      result += content.fn(i);
    }

    return result;
  });

  // Truncate helper for Handlebars
  Handlebars.registerHelper('truncate', function (str, len) {
    if (str && str.length > len) {
      var new_str = str.substr(0, len + 1);

      while (new_str.length) {
        var ch = new_str.substr(-1);
        new_str = new_str.substr(0, -1);

        if (ch == ' ') {
          break;
        }
      }

      if (new_str == '') {
        new_str = str.substr(0, len);
      }

      return new Handlebars.SafeString(new_str + '...');
    }
    return str;
  });

  // Compare operator helper for Handlebars
  Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
      case '==':
        return v1 == v2 ? options.fn(this) : options.inverse(this);
      case '===':
        return v1 === v2 ? options.fn(this) : options.inverse(this);
      case '!=':
        return v1 != v2 ? options.fn(this) : options.inverse(this);
      case '!==':
        return v1 !== v2 ? options.fn(this) : options.inverse(this);
      case '<':
        return v1 < v2 ? options.fn(this) : options.inverse(this);
      case '<=':
        return v1 <= v2 ? options.fn(this) : options.inverse(this);
      case '>':
        return v1 > v2 ? options.fn(this) : options.inverse(this);
      case '>=':
        return v1 >= v2 ? options.fn(this) : options.inverse(this);
      case '&&':
        return v1 && v2 ? options.fn(this) : options.inverse(this);
      case '||':
        return v1 || v2 ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  });

  // Checks if v1 is true and v2 is equal to v3
  Handlebars.registerHelper('ifCondAndEqual', function (v1, v2, v3, options) {
    if (v1 && v2 >= v3) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper('hasDailyUses', function (dailyUses, options) {
    for (let key in dailyUses) {
      if (dailyUses[key] > 0) {
        return options.fn(this);
      }
    }
    return options.inverse(this);
  });

  Handlebars.registerHelper(
    'generateClassAbilityDailyUses',
    function (dailyUses, currentLevel, dailyUsesState, abilityId) {
      let result = '';
      const maxUses = dailyUses[currentLevel] || 0;
      for (let i = 0; i < maxUses; i++) {
        const checked = dailyUsesState && dailyUsesState[i + 1] ? 'checked' : '';
        const title = checked ? 'Recuperar' : 'Usar';
        result += `<input type="checkbox"
        class="class-ability-use-checkbox"
        name="daily_use_${currentLevel}_${i + 1}"
        data-ability-id="${abilityId}"
        data-use-index="${i + 1}"
        title="${title}"
        ${checked} />`;
      }
      return new Handlebars.SafeString(result);
    },
  );

  Handlebars.registerHelper('generateRaceAbilityDailyUses', function (dailyUses, dailyUsesState, abilityId) {
    let result = '';
    for (let i = 0; i < dailyUses; i++) {
      const checked = dailyUsesState && dailyUsesState[i + 1] ? 'checked' : '';
      const title = checked ? 'Recuperar' : 'Usar';
      result += `<input type="checkbox"
      class="race-ability-use-checkbox"
      name="race_daily_use_${i + 1}"
      data-ability-id="${abilityId}"
      data-use-index="${i + 1}"
      title="${title}"
      ${checked} />`;
    }
    return new Handlebars.SafeString(result);
  });
}

// Print a + or a - in front of numbers
Handlebars.registerHelper('signed_number', function (number, zero = '+0') {
  if (number === '0') {
    return zero;
  } else if (number < 0) {
    return number.toString();
  } else {
    return `+${number}`;
  }
});

Handlebars.registerHelper('range', function (from, to) {
  let result = [];
  for (let i = from; i <= to; i++) result.push(i);
  return result;
});

Handlebars.registerHelper('and', function (a, b) {
  return a && b;
});

Handlebars.registerHelper('lookup', function (obj, field) {
  return obj && obj[field];
});

Handlebars.registerHelper('toString', function (value) {
  return value != null ? value.toString() : '';
});

Handlebars.registerHelper('toNumber', function (value) {
  return Number(value);
});
Handlebars.registerHelper('gte', function (a, b) {
  return Number(a) >= Number(b);
});
Handlebars.registerHelper('lte', function (a, b) {
  return Number(a) <= Number(b);
});
Handlebars.registerHelper('ne', function (a, b) {
  return a !== b;
});

Handlebars.registerHelper('raceBonusDamage', function (actor, weapon) {
  if (!actor?.raceBonusDamage) return 0;
  return actor.raceBonusDamage(weapon);
});

Handlebars.registerHelper('generateVariableConstructionSelectors', function (ability, selections) {
  const choicesCount = ability.system.variable_construction?.choices_count || 0;
  const availableOptions = ability.system.variable_construction?.available_options || [];
  const abilitySelections = selections?.[ability._id] || [];

  if (choicesCount <= 0) return '';

  const ordinals = ['1ª', '2ª', '3ª', '4ª', '5ª', '6ª', '7ª', '8ª', '9ª', '10ª'];
  const selectOptionLabel = game.i18n.localize('olddragon2e.select_option');
  const customLabel = game.i18n.localize('olddragon2e.custom');
  const choiceLabel = game.i18n.localize('olddragon2e.choice');
  const namePlaceholder = game.i18n.localize('olddragon2e.name');
  const descriptionPlaceholder = game.i18n.localize('olddragon2e.description');

  let result = '';

  for (let i = 0; i < choicesCount; i++) {
    const currentSelection = abilitySelections[i] || {};
    const selectedKey = currentSelection.key || '';
    const customName = currentSelection.custom_name || '';
    const customDescription = currentSelection.custom_description || '';
    const ordinal = ordinals[i] || `${i + 1}ª`;

    let optionsHtml = `<option value="">${selectOptionLabel}</option>`;
    for (const opt of availableOptions) {
      const isSelected = selectedKey === opt.key ? 'selected' : '';
      const escapedName = Handlebars.escapeExpression(opt.name);
      const escapedKey = Handlebars.escapeExpression(opt.key);
      optionsHtml += `<option value="${escapedKey}" ${isSelected}>${escapedName}</option>`;
    }
    const isCustomSelected = selectedKey === 'custom' ? 'selected' : '';
    optionsHtml += `<option value="custom" ${isCustomSelected}>${customLabel}</option>`;

    const selectedOption = availableOptions.find((o) => o.key === selectedKey);
    const descriptionHtml =
      selectedKey && selectedKey !== 'custom' && selectedOption?.description
        ? `<p class="choice-description">${Handlebars.escapeExpression(selectedOption.description)}</p>`
        : '';

    const customHide = selectedKey !== 'custom' ? 'style="display:none"' : '';
    const escapedCustomName = Handlebars.escapeExpression(customName);
    const escapedCustomDescription = Handlebars.escapeExpression(customDescription);

    result += `
      <div class="choice-row">
        <div class="choice-header">
          <label class="font-bold">${ordinal} ${choiceLabel}</label>
          <select class="variable-construction-select"
                  data-ability-id="${ability._id}"
                  data-choice-index="${i}">
            ${optionsHtml}
          </select>
        </div>
        ${descriptionHtml}
        <div class="custom-fields" ${customHide}>
          <input type="text"
                 class="variable-construction-custom-name"
                 data-ability-id="${ability._id}"
                 data-choice-index="${i}"
                 value="${escapedCustomName}"
                 placeholder="${namePlaceholder}">
          <textarea class="variable-construction-custom-description"
                    data-ability-id="${ability._id}"
                    data-choice-index="${i}"
                    placeholder="${descriptionPlaceholder}">${escapedCustomDescription}</textarea>
        </div>
      </div>
    `;
  }

  return new Handlebars.SafeString(`<div class="variable-construction-selectors">${result}</div>`);
});
