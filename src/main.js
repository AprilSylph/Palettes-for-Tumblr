const hideChangePaletteButton = function () {
  const toRunInPageContext = function () {
    const changePaletteLabel = window.tumblr.languageData.translations['Change Palette'] || 'Change Palette';
    const textContent = `button[aria-label="${changePaletteLabel}"] { display: none !important; }`;
    const style = Object.assign(document.createElement('style'), { textContent });
    document.documentElement.appendChild(style);
  };

  const scriptWithNonce = [...document.scripts].find(script => script.getAttributeNames().includes('nonce'));
  const nonce = scriptWithNonce.nonce || scriptWithNonce.getAttribute('nonce');

  const injectable = `(${toRunInPageContext.toString()})()`;
  const script = Object.assign(document.createElement('script'), { nonce, textContent: injectable });
  document.documentElement.appendChild(script);
  document.documentElement.removeChild(script);
};

const getProvidedPalettes = async function () {
  const url = browser.runtime.getURL('/src/palettes.json');
  const file = await fetch(url);
  const data = await file.json();

  return data;
};

const applyCurrentPalette = async function () {
  const { currentPalette } = await browser.storage.local.get('currentPalette');
  const tumblrSelectedPalette = getComputedStyle(document.documentElement).getPropertyValue('--palette').trim();

  if (!currentPalette) {
    browser.storage.local.set({ currentPalette: tumblrSelectedPalette });
    return;
  }

  const providedPalettes = await getProvidedPalettes();
  const providedPalettesList = [];

  for (const group of Object.values(providedPalettes)) {
    providedPalettesList.push(...Object.keys(group));
  }

  if (providedPalettesList.includes(currentPalette)) {
    const stylesheet = Object.assign(document.createElement('link'), {
      id: 'palettes-for-tumblr',
      rel: 'stylesheet',
      href: browser.runtime.getURL(`/src/stylesheets/${currentPalette}.css`),
    });

    document.documentElement.appendChild(stylesheet);
  }
};

const onStorageChanged = async function (changes, areaName) {
  if (areaName !== 'local') {
    return;
  }

  const { currentPalette } = changes;

  if (currentPalette) {
    const previousAppliedPalette = document.getElementById('palettes-for-tumblr');
    await applyCurrentPalette();

    if (previousAppliedPalette !== null) {
      previousAppliedPalette.parentNode.removeChild(previousAppliedPalette);
    }
  }
};

if ([...document.scripts].some(({ src }) => src.match('/pop/'))) {
  hideChangePaletteButton();
  applyCurrentPalette();
  browser.storage.onChanged.addListener(onStorageChanged);
}
