const hideChangePaletteButton = function () {
  if (document.getElementById('pft-hide-change-palette') !== null) {
    return;
  }

  const toRunInPageContext = function () {
    const changePaletteLabel = window.tumblr.languageData.translations['Change Palette'] || 'Change Palette';
    const textContent = `button[aria-label="${changePaletteLabel}"] { display: none !important; }`;
    const style = Object.assign(document.createElement('style'), { textContent, id: 'pft-hide-change-palette' });
    document.documentElement.appendChild(style);
  };

  const scriptWithNonce = [...document.scripts].find(script => script.getAttributeNames().includes('nonce'));
  const nonce = scriptWithNonce.nonce || scriptWithNonce.getAttribute('nonce');

  const injectable = `(${toRunInPageContext.toString()})()`;
  const script = Object.assign(document.createElement('script'), { nonce, textContent: injectable });
  document.documentElement.appendChild(script);
  document.documentElement.removeChild(script);
};

const showChangePaletteButton = function () {
  const style = document.getElementById('pft-hide-change-palette');
  if (style && style.parentNode) {
    style.parentNode.removeChild(style);
  }
};

const getProvidedPalettes = async function () {
  const url = browser.runtime.getURL('/palettes.json');
  const file = await fetch(url);
  const data = await file.json();

  return data;
};

const applyCurrentPalette = async function () {
  const { currentPalette = '' } = await browser.storage.local.get('currentPalette');

  if (!currentPalette) {
    showChangePaletteButton();
    return;
  }

  hideChangePaletteButton();

  const providedPalettes = await getProvidedPalettes();
  const providedPalettesList = [];

  for (const group of Object.values(providedPalettes)) {
    providedPalettesList.push(...Object.keys(group));
  }

  if (providedPalettesList.includes(currentPalette)) {
    const stylesheet = Object.assign(document.createElement('link'), {
      id: 'palettes-for-tumblr',
      rel: 'stylesheet',
      href: browser.runtime.getURL(`/stylesheets/${currentPalette}.css`),
    });

    document.documentElement.appendChild(stylesheet);
  }
};

const applyFontFamily = async function () {
  const { fontFamily } = await browser.storage.local.get('fontFamily');

  if (!fontFamily) {
    return;
  }

  const style = Object.assign(document.createElement('style'), {
    id: 'pft-font-family',
    textContent: `:root { --font-family: ${fontFamily} !important; }`,
  });

  document.documentElement.appendChild(style);
};

const applyFontSize = async function () {
  const { fontSize } = await browser.storage.local.get('fontSize');

  if (!fontSize) {
    return;
  }

  const style = Object.assign(document.createElement('style'), {
    id: 'pft-font-size',
    textContent: `:root { --base-font-size: ${fontSize} !important; }`,
  });

  document.documentElement.appendChild(style);
};

const onStorageChanged = async function (changes, areaName) {
  if (areaName !== 'local') {
    return;
  }

  const { currentPalette, fontFamily, fontSize } = changes;

  if (currentPalette) {
    const previousAppliedPalette = document.getElementById('palettes-for-tumblr');
    await applyCurrentPalette();

    if (previousAppliedPalette !== null) {
      previousAppliedPalette.parentNode.removeChild(previousAppliedPalette);
    }
  }

  if (fontFamily) {
    const previousAppliedFontFamily = document.getElementById('pft-font-family');
    await applyFontFamily();

    if (previousAppliedFontFamily !== null) {
      previousAppliedFontFamily.parentNode.removeChild(previousAppliedFontFamily);
    }
  }

  if (fontSize) {
    const previousAppliedFontSize = document.getElementById('pft-font-size');
    await applyFontSize();

    if (previousAppliedFontSize !== null) {
      previousAppliedFontSize.parentNode.removeChild(previousAppliedFontSize);
    }
  }
};

if ([...document.scripts].some(({ src }) => src.match('/pop/'))) {
  applyCurrentPalette();
  applyFontFamily();
  applyFontSize();
  browser.storage.onChanged.addListener(onStorageChanged);
}
