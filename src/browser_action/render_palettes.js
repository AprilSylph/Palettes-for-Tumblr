const getInstalledPalettes = async function () {
  const url = browser.runtime.getURL('/palettes.json');
  const file = await fetch(url);
  const data = await file.json();

  return data;
};

const writeSelected = async function ({ target: { value } }) {
  browser.storage.local.set({ currentPalette: value });
};

const renderPalettes = async function () {
  const paletteSelect = document.getElementById('palette');
  paletteSelect.addEventListener('input', writeSelected);

  const installedPalettes = await getInstalledPalettes();
  const { currentPalette } = await browser.storage.local.get('currentPalette');

  for (const [groupLabel, group] of Object.entries(installedPalettes)) {
    const optgroup = document.createElement('optgroup');
    optgroup.label = groupLabel;
    paletteSelect.append(optgroup);

    for (const [paletteName, paletteLabel] of Object.entries(group)) {
      const option = document.createElement('option');
      option.value = paletteName;
      option.textContent = paletteLabel;
      option.selected = paletteName === currentPalette;
      optgroup.append(option);
    }
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

renderPalettes();

document.getElementById('manage-palettes').addEventListener('click', () => browser.runtime.openOptionsPage());
