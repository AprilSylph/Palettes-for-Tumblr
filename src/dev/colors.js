import { dom } from './dom.js';

const load = (url) => fetch(browser.runtime.getURL(url));

const builtInPaletteList = await load('/palettes.json').then((response) => response.json());
const builtInPalettes = await load('/palette_data.json').then((response) => response.json());
const builtInPaletteSystem = await load('/palette_system_data.json').then((response) => response.json());
const staticCss = await load('/static.css').then((response) => response.text());

document.head.append(dom('style', null, null, staticCss.replaceAll(/^:root/gm, '.column')));

const storageObject = await browser.storage.local.get();

const containerElement = document.getElementById('container');

const paletteData = [
  ...builtInPaletteList
    .flatMap(([label, options]) => options)
    .map(([id, name]) => ({ id, name, builtIn: true })),
  ...Object.entries(storageObject)
    .filter(([key]) => key.startsWith('palette:'))
    .map(([id, { name }]) => ({ id, name, builtIn: false }))
];

const paletteKeys = Object.keys(builtInPalettes.trueBlue).map((key) =>
  key === 'accent' ? 'deprecated-accent' : key
);
const paletteSystemKeys = Object.keys(builtInPaletteSystem.trueBlue);

const createSwatches = () => [
  ...paletteKeys.map((key) =>
    dom('div', { class: 'swatch', style: `background: rgba(var(--${key}))` }, null, [key])
  ),
  ...paletteSystemKeys.map((key) =>
    dom('div', { class: 'swatch', style: `background: var(--${key}, var(--error))` }, null, [key])
  )
];

containerElement.replaceChildren(...paletteData.map(({ id, name, builtIn }) => {
  const nativeColumn = dom('div', { class: 'column' }, null, [
    dom('div', { class: 'swatch header' }, null, [name]),
    ...createSwatches()
  ]);
  const previewColumn = dom('div', { class: 'column' }, null, [
    dom('div', { class: 'swatch header' }, null, [builtIn ? '(simulated)' : name]),
    ...createSwatches()
  ]);

  let currentPaletteData = builtInPalettes[id] ?? storageObject[id];
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
      value && nativeColumn.style.setProperty(`--${property}`, value)
  );
  Object.entries(currentPaletteData).forEach(
    ([property, value]) =>
      value && previewColumn.style.setProperty(`--${property}`, value)
  );

  return dom('div', { class: 'columns' }, null, builtIn ? [nativeColumn, previewColumn] : [previewColumn]);
}));
