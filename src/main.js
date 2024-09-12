const showChangePaletteButton = function () {
  const style = document.getElementById('palette-override');
  if (style) style.remove();
};

const paletteData = fetch(browser.runtime.getURL('/paletteData.json')).then(response => response.json());
const setCssVariable = ([property, value]) => document.documentElement.style.setProperty(`--${property}`, value);
const removeCssVariable = ([property]) => document.documentElement.style.removeProperty(`--${property}`);

let appliedPaletteEntries = [];

const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

const applyCurrentPalette = async function () {
  let {
    currentPalette = '',
    currentLightPalette = '',
    currentDarkPalette = ''
  } = await browser.storage.local.get(['currentPalette', 'currentLightPalette', 'currentDarkPalette']);

  if (currentPalette === 'prefers-color-scheme') {
    currentPalette = darkModeQuery.matches ? currentDarkPalette : currentLightPalette;
  }

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

  const { currentPalette, currentLightPalette, currentDarkPalette, fontFamily, customFontFamily, fontSize } = changes;

  if (currentPalette || currentLightPalette || currentDarkPalette || Object.keys(changes).some(key => key.startsWith('palette:'))) {
    applyCurrentPalette();
  }

  if (fontFamily || customFontFamily) applyFontFamily();
  if (fontSize) applyFontSize();
};

darkModeQuery.addEventListener('change', applyCurrentPalette);

applyCurrentPalette();
applyFontFamily();
applyFontSize();
browser.storage.onChanged.addListener(onStorageChanged);
