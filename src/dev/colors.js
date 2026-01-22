import { div, style } from './dom.js';

const load = (url) => fetch(browser.runtime.getURL(url));

const builtInPaletteList = await load('/palettes.json').then((response) => response.json());
const builtInPalettes = await load('/palette_data.json').then((response) => response.json());
const builtInPaletteSystem = await load('/palette_system_data.json').then((response) => response.json());
const staticCss = await load('/static.css').then((response) => response.text());

document.head.append(style({}, [staticCss.replaceAll(/^:root/gm, '.column')]));

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
    div({ class: 'swatch', style: `background: rgba(var(--${key}))` }, [key])
  ),
  ...paletteSystemKeys.map((key) =>
    div({ class: 'swatch', style: `background: var(--${key}, var(--error))` }, [key])
  )
];

containerElement.replaceChildren(...paletteData.map(({ id, name, builtIn }) => {
  const nativeColumn = div({ class: 'column' }, [
    div({ class: 'swatch header' }, [name]),
    ...createSwatches()
  ]);
  const previewColumn = div({ class: 'column' }, [
    div({ class: 'swatch header' }, [builtIn ? '(simulated)' : name]),
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

  return div({ class: 'columns' }, builtIn ? [nativeColumn, previewColumn] : [previewColumn]);
}));
