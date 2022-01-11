const hideChangePaletteButton = function () {
  if (document.getElementById('palette-override') !== null) {
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

const applyCurrentPalette = async function () {
  const { currentPalette = '' } = await browser.storage.local.get('currentPalette');
  const previousPalette = document.getElementById('palettes-for-tumblr');

  if (!currentPalette) {
    showChangePaletteButton();
    if (previousPalette) previousPalette.remove();
    return;
  }

  hideChangePaletteButton();

  const paletteIsBuiltIn = currentPalette.startsWith('palette:') === false;
  const { [currentPalette]: currentPaletteData = {} } = paletteIsBuiltIn
    ? {}
    : await browser.storage.local.get(currentPalette);

  const stylesheet = paletteIsBuiltIn
    ? Object.assign(document.createElement('link'), {
      id: 'palettes-for-tumblr',
      rel: 'stylesheet',
      href: browser.runtime.getURL(`/stylesheets/${currentPalette}.css`)
    })
    : Object.assign(document.createElement('style'), {
      id: 'palettes-for-tumblr',
      textContent: `:root { ${Object.entries(currentPaletteData).map(([property, value]) => `--${property}: ${value};`).join(' ')} }`
    });

  if (previousPalette) {
    previousPalette.replaceWith(stylesheet);
  } else {
    document.documentElement.append(stylesheet);
  }
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

if ([...document.scripts].some(({ src }) => src.match('/pop/'))) {
  applyCurrentPalette();
  applyFontFamily();
  applyFontSize();
  browser.storage.onChanged.addListener(onStorageChanged);
}
