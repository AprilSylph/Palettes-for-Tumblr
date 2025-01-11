const setNativePalette = async palette => {
  document.readyState === 'loading' &&
    await new Promise((resolve) =>
      document.addEventListener('readystatechange', resolve, { once: true })
    );

  const scriptWithNonce = [...document.scripts].find(script => script.getAttributeNames().includes('nonce'));
  if (scriptWithNonce) {
    const { nonce } = scriptWithNonce;
    const script = document.createElement('script');
    script.nonce = nonce;
    script.dataset.palette = palette;
    script.src = browser.runtime.getURL('/setNativePalette.js');
    document.documentElement.append(script);
    script.remove();
  }
};

const paletteData = fetch(browser.runtime.getURL('/paletteData.json')).then(response => response.json());
const setCssVariable = ([property, value]) => document.documentElement.style.setProperty(`--${property}`, value);
const removeCssVariable = ([property]) => document.documentElement.style.removeProperty(`--${property}`);

let appliedPaletteEntries = [];

const applyCurrentPalette = async function () {
  let { currentPalette = '' } = await browser.storage.local.get('currentPalette');

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

  if (currentPalette === 'nuclearWhite') {
    currentPalette = 'snowBright';
  }

  setNativePalette(currentPalette);

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
  document.documentElement.style.setProperty(
    '--font-family-modern',
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
