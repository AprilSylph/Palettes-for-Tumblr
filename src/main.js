const paletteData = fetch(browser.runtime.getURL('/paletteData.json')).then(response => response.json());
const setCssVariable = ([property, value]) => document.documentElement.style.setProperty(`--${property}`, value);
const removeCssVariable = ([property]) => document.documentElement.style.removeProperty(`--${property}`);

let appliedPaletteEntries = [];

let currentPalette;
let previewPalette;

const applyCurrentPalette = async function () {
  ({ currentPalette = '', previewPalette } = await browser.storage.local.get());

  if (previewPalette) {
    currentPalette = 'previewPalette';
  }

  if (!currentPalette) {
    appliedPaletteEntries.forEach(removeCssVariable);
    appliedPaletteEntries = [];
    return;
  }

  const paletteIsBuiltIn = currentPalette.startsWith('palette:') === false && currentPalette !== 'previewPalette';
  const { [currentPalette]: rawCurrentPaletteData = {} } = paletteIsBuiltIn
    ? await paletteData
    : await browser.storage.local.get(currentPalette);

  const currentPaletteData = {
    ...rawCurrentPaletteData,
    'deprecated-accent': rawCurrentPaletteData.accent
  };
  delete currentPaletteData.accent;

  const currentPaletteKeys = Object.keys(currentPaletteData);
  const currentPaletteEntries = Object.entries(currentPaletteData);

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

  const { currentPalette, previewPalette, fontFamily, customFontFamily, fontSize } = changes;

  if (currentPalette || previewPalette || Object.keys(changes).some(key => key.startsWith('palette:'))) {
    applyCurrentPalette();
  }

  if (fontFamily || customFontFamily) applyFontFamily();
  if (fontSize) applyFontSize();
};

applyCurrentPalette();
applyFontFamily();
applyFontSize();
browser.storage.onChanged.addListener(onStorageChanged);

const checkManagePalettesOpen = () => browser.runtime.sendMessage('manage-palettes-open').catch(() => false);

setInterval(async () => {
  if (currentPalette === 'previewPalette' && await checkManagePalettesOpen() !== true) {
    await browser.storage.local.remove('previewPalette');
    applyCurrentPalette();
  }
}, 1000);
