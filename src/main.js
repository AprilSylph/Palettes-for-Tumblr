const showChangePaletteButton = function () {
  const style = document.getElementById('palette-override');
  if (style) style.remove();
};

const paletteData = fetch(browser.runtime.getURL('/paletteData.json')).then(response => response.json());
const paletteSystemData = fetch(browser.runtime.getURL('/paletteSystemData.json')).then(response => response.json());
const setCssVariable = ([property, value]) => document.documentElement.style.setProperty(`--${property}`, value);
const removeCssVariable = ([property]) => document.documentElement.style.removeProperty(`--${property}`);

let appliedPaletteEntries = [];

const applyCurrentPalette = async function () {
  const { currentPalette = '' } = await browser.storage.local.get('currentPalette');

  if (!currentPalette) {
    showChangePaletteButton();
    appliedPaletteEntries.forEach(removeCssVariable);
    appliedPaletteEntries = [];
    return;
  }

  const paletteIsBuiltIn = currentPalette.startsWith('palette:') === false;
  const { [currentPalette]: rawCurrentPaletteData = {} } = paletteIsBuiltIn
    ? await paletteData
    : await browser.storage.local.get(currentPalette);

  const currentPaletteData = {
    ...rawCurrentPaletteData,
    'deprecated-accent': rawCurrentPaletteData.accent
  };
  delete currentPaletteData.accent;

  const currentPaletteSystemData = (await paletteSystemData)[currentPalette] || (await paletteSystemData).default;

  const currentPaletteKeys = Object.keys({ ...currentPaletteData, ...currentPaletteSystemData });
  const currentPaletteEntries = Object.entries({ ...currentPaletteData, ...currentPaletteSystemData });

  currentPaletteEntries.forEach(setCssVariable);
  appliedPaletteEntries
    .filter(([property]) => currentPaletteKeys.includes(property) === false)
    .forEach(removeCssVariable);

  appliedPaletteEntries = currentPaletteEntries;
};

const applyFontFamily = async function () {
  const { fontFamily = '' } = await browser.storage.local.get('fontFamily');
  const { customFontFamily = '' } = await browser.storage.local.get('customFontFamily');

  document.documentElement.style.setProperty(
    '--font-family',
    fontFamily === 'custom' ? customFontFamily : fontFamily
  );
};

const applyFontSize = async function () {
  const { fontSize = '' } = await browser.storage.local.get('fontSize');
  document.documentElement.style.setProperty('--base-font-size', fontSize);
};

const onStorageChanged = async function (changes, areaName) {
  if (areaName !== 'local') {
    return;
  }

  const { currentPalette, fontFamily, customFontFamily, fontSize } = changes;

  if (currentPalette || Object.keys(changes).some(key => key.startsWith('palette:'))) {
    applyCurrentPalette();
  }

  if (fontFamily || customFontFamily) applyFontFamily();
  if (fontSize) applyFontSize();
};

applyCurrentPalette();
applyFontFamily();
applyFontSize();
browser.storage.onChanged.addListener(onStorageChanged);
