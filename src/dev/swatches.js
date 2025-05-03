import { getSemanticTokens } from '../get_semantic_tokens.js';
import { dom } from './dom.js';

const jsonFetch = (url) => fetch(browser.runtime.getURL(url)).then((response) => response.json());

const builtInPaletteList = await jsonFetch('/palettes.json');
const builtInPalettes = await jsonFetch('/palette_data.json');
const builtInPaletteSystem = await jsonFetch('/palette_system_data.json');

const containerElement = document.getElementById('container');

const paletteIds = builtInPaletteList.flatMap(([label, options]) => options);

const paletteKeys = [
  ...Object.keys(builtInPalettes.trueBlue).map((key) =>
    key === 'accent' ? 'deprecated-accent' : key
  ),
  ...Object.keys(builtInPaletteSystem.trueBlue)
];

for (const [id, label] of paletteIds) {
  const nativeColumn = dom('div', { class: 'column' });
  const previewColumn = dom('div', { class: 'column' });

  nativeColumn.append(
    dom('div', { class: 'swatch header' }, null, [`${label} (real)`]),
    ...paletteKeys.map((key) =>
      dom('div', { class: 'swatch', style: `background: var(--${key}, var(--error))` }, null, [key])
    )
  );
  previewColumn.append(
    dom('div', { class: 'swatch header' }, null, [label]),
    ...paletteKeys.map((key) =>
      dom('div', { class: 'swatch', style: `background: var(--${key}, var(--error))` }, null, [key])
    )
  );

  let currentPaletteData = builtInPalettes[id];
  if (currentPaletteData.accent && !currentPaletteData['deprecated-accent']) {
    currentPaletteData = {
      ...currentPaletteData,
      'deprecated-accent': currentPaletteData.accent
    };
    delete currentPaletteData.accent;
  }
  const currentPaletteSystemData = builtInPaletteSystem[id];

  Object.entries({ ...currentPaletteData, ...currentPaletteSystemData }).forEach(
    ([property, value]) =>
      value &&
      nativeColumn.style.setProperty(
        `--${property}`,
        value.startsWith('rgb') ? value : `rgba(${value})`
      )
  );

  Object.entries({ ...currentPaletteData, ...getSemanticTokens(currentPaletteData) }).forEach(
    ([property, value]) =>
      value &&
      previewColumn.style.setProperty(
        `--${property}`,
        value.startsWith('rgb') ? value : `rgba(${value})`
      )
  );

  containerElement.append(dom('div', { class: 'columns' }, null, [nativeColumn, previewColumn]));
}
