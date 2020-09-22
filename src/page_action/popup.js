const getInstalledPalettes = async function () {
  const url = browser.runtime.getURL('/src/palettes.json');
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
    paletteSelect.appendChild(optgroup);

    for (const [paletteName, paletteLabel] of Object.entries(group)) {
      const option = document.createElement('option');
      option.value = paletteName;
      option.textContent = paletteLabel;
      option.selected = paletteName === currentPalette;
      optgroup.appendChild(option);
    }
  }
};

renderPalettes();
