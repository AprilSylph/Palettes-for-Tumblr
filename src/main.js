const paletteData = fetch(browser.runtime.getURL('/palette_data.json')).then(response => response.json());
const paletteSystemData = fetch(browser.runtime.getURL('/palette_system_data.json')).then(response => response.json());
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
    appliedPaletteEntries.forEach(removeCssVariable);
    appliedPaletteEntries = [];
    return;
  }

  const paletteIsBuiltIn = currentPalette.startsWith('palette:') === false;
  let { [currentPalette]: currentPaletteData = {} } = paletteIsBuiltIn
    ? await paletteData
    : await browser.storage.local.get(currentPalette);

  if (currentPaletteData.accent && !currentPaletteData['deprecated-accent']) {
    currentPaletteData = {
      ...currentPaletteData,
      'deprecated-accent': currentPaletteData.accent
    };
    delete currentPaletteData.accent;
  }

  const currentPaletteSystemData = (await paletteSystemData)[currentPalette] ?? {};

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
  document.documentElement.style.setProperty(
    '--font-family-modern',
    fontFamily === 'custom' ? customFontFamily : fontFamily
  );
  const { fontWeightOverride } = await import(browser.runtime.getURL('/override_font_weight.js'));
  document.getElementById('palettes-for-tumblr-override')?.remove();
  (fontFamily === 'custom' ? customFontFamily : fontFamily) &&
    document.documentElement.append(fontWeightOverride);
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
