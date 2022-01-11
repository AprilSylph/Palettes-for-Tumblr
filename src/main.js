const delayToDocumentIdle = delayedFunction => {
  document.readyState === 'complete'
    ? delayedFunction()
    : window.addEventListener('load', delayedFunction);
};

const hideChangePaletteButton = function () {
  if (document.getElementById('palette-override') !== null) {
    return;
  }

  if ([...document.scripts].some(({ src }) => src.includes('/pop/')) === false) {
    return;
  }

  const toRunInPageContext = function () {
    const changePaletteLabel = window.tumblr.languageData.translations['Change Palette'] || 'Change Palette';
    const textContent = `button[aria-label="${changePaletteLabel}"] { display: none !important; }`;
    const style = Object.assign(document.createElement('style'), { textContent, id: 'palette-override' });
    document.head.append(style);
  };

  const scriptWithNonce = [...document.scripts].find(script => script.getAttributeNames().includes('nonce'));
  const nonce = scriptWithNonce.nonce || scriptWithNonce.getAttribute('nonce');

  const injectable = `(${toRunInPageContext.toString()})()`;
  const script = Object.assign(document.createElement('script'), { nonce, textContent: injectable });
  document.documentElement.append(script);
  script.remove();
};

const showChangePaletteButton = function () {
  const style = document.getElementById('palette-override');
  if (style) style.remove();
};

const paletteData = fetch(browser.runtime.getURL('/paletteData.json')).then(response => response.json());
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

  delayToDocumentIdle(hideChangePaletteButton);

  const paletteIsBuiltIn = currentPalette.startsWith('palette:') === false;
  const { [currentPalette]: currentPaletteData = {} } = paletteIsBuiltIn
    ? await paletteData
    : await browser.storage.local.get(currentPalette);

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
  document.documentElement.style.setProperty('--font-family', fontFamily);
};

const applyFontSize = async function () {
  const { fontSize = '' } = await browser.storage.local.get('fontSize');
  document.documentElement.style.setProperty('--base-font-size', fontSize);
};

const onStorageChanged = async function (changes, areaName) {
  if (areaName !== 'local') {
    return;
  }

  const { currentPalette, fontFamily, fontSize } = changes;

  if (currentPalette || Object.keys(changes).some(key => key.startsWith('palette:'))) {
    applyCurrentPalette();
  }

  if (fontFamily) applyFontFamily();
  if (fontSize) applyFontSize();
};

applyCurrentPalette();
applyFontFamily();
applyFontSize();
browser.storage.onChanged.addListener(onStorageChanged);
