const getInstalledPalettes = async function () {
  const url = browser.runtime.getURL('/palettes.json');
  const file = await fetch(url);
  const data = await file.json();

  return data;
};

const renderPalettes = async function (id, storageKey) {
  const paletteSelect = document.getElementById(id);
  paletteSelect.addEventListener('input', ({ target: { value } }) => {
    paletteSelect.dataset.value = value;
    browser.storage.local.set({ [storageKey]: value });
  });

  const installedPalettes = await getInstalledPalettes();
  const { [storageKey]: currentPalette = '' } = await browser.storage.local.get(storageKey);

  paletteSelect.dataset.value = currentPalette;
  if (id === 'palette') {
    paletteSelect.append(Object.assign(document.createElement('option'), {
      value: 'prefers-color-scheme',
      textContent: 'Automatic Light/Dark Mode',
      selected: currentPalette === 'prefers-color-scheme'
    }));
  }

  for (const [label, options] of installedPalettes) {
    const optgroup = Object.assign(document.createElement('optgroup'), { label });
    optgroup.append(...options.map(([value, textContent]) => Object.assign(document.createElement('option'), {
      value,
      textContent,
      selected: value === currentPalette
    })));
    paletteSelect.append(optgroup);
  }

  const storageObject = await browser.storage.local.get();
  const definedPalettes = Object.entries(storageObject).filter(([key]) => key.startsWith('palette:'));
  if (definedPalettes.length === 0) return;

  const optgroup = document.createElement('optgroup');
  optgroup.label = 'Custom';
  paletteSelect.append(optgroup);

  definedPalettes.sort(([a], [b]) => {
    const firstTimestamp = a.split(':')[2];
    const secondTimestamp = b.split(':')[2];
    return firstTimestamp - secondTimestamp;
  });

  optgroup.append(...definedPalettes.map(([paletteKey, { name }]) => {
    return Object.assign(document.createElement('option'), {
      value: paletteKey,
      textContent: name,
      selected: paletteKey === currentPalette
    });
  }));
};

renderPalettes('palette', 'currentPalette');
renderPalettes('palette-light', 'currentLightPalette');
renderPalettes('palette-dark', 'currentDarkPalette');

document.getElementById('manage-palettes').addEventListener('click', () => browser.runtime.openOptionsPage());
