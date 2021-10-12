const fromCamelCase = string => string.replace(/[A-Z]/g, match => ` ${match}`).replace(/^./, match => match.toUpperCase());

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
  const definedPalettes = Object.keys(storageObject).filter(key => key.startsWith('palette:'));
  if (definedPalettes.length === 0) return;

  definedPalettes.sort((a, b) => {
    const firstTimestamp = a.split(':')[2];
    const secondTimestamp = b.split(':')[2];
    return firstTimestamp - secondTimestamp;
  });

  const optgroup = document.createElement('optgroup');
  optgroup.label = 'Custom';
  paletteSelect.append(optgroup);

  for (const paletteKey of definedPalettes) {
    const option = document.createElement('option');
    option.value = paletteKey;
    option.textContent = fromCamelCase(paletteKey.split(':')[1]);
    option.selected = paletteKey === currentPalette;
    optgroup.append(option);
  }
};

renderPalettes();
