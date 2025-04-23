import { system } from '../adaptivePaletteSystem.js';

const builtInPaletteList = await fetch(browser.runtime.getURL('/palettes.json')).then((response) => response.json());
const builtInPalettes = {
  ...await fetch(browser.runtime.getURL('/paletteData.json')).then((response) => response.json()),
  ...await fetch(browser.runtime.getURL('/dev/paletteDataOverrides.json')).then((response) => response.json())
};
const builtInPaletteSystem = {
  ...await fetch(browser.runtime.getURL('/paletteSystemData.json')).then((response) => response.json()),
  ...await fetch(browser.runtime.getURL('/dev/paletteSystemDataOverrides.json')).then((response) => response.json())
};

const previewElement = document.getElementById('preview');

const optionsUiDocument = new DOMParser().parseFromString(
  await fetch(browser.runtime.getURL('/options/ui.html')).then((result) => result.text()),
  'text/html'
);

const paletteIds = builtInPaletteList.flatMap(([label, options]) => options);

for (const [id, label] of paletteIds) {
  const previewSection = optionsUiDocument.getElementById('preview').cloneNode(true);
  previewSection.removeAttribute('id');

  previewSection.querySelector('h1').textContent = label;

  let currentPaletteData = builtInPalettes[id];
  if (currentPaletteData.accent && !currentPaletteData['deprecated-accent']) {
    currentPaletteData = {
      ...currentPaletteData,
      'deprecated-accent': currentPaletteData.accent
    };
    delete currentPaletteData.accent;
  }
  const currentPaletteSystemData = builtInPaletteSystem[id];

  Object.entries({ ...currentPaletteData, ...currentPaletteSystemData })
    .forEach(([property, value]) => previewSection.style.setProperty(`--${property}`, value));

  previewElement.append(previewSection);

  const systemPreviewSection = optionsUiDocument.getElementById('preview').cloneNode(true);
  systemPreviewSection.removeAttribute('id');
  systemPreviewSection.classList.add('system-preview');

  systemPreviewSection.querySelector('h1').textContent = label;

  Object.entries(currentPaletteData)
    .forEach(([property, value]) => systemPreviewSection.style.setProperty(`--${property}`, value));

  previewElement.append(systemPreviewSection);
}

const systemStyleElement = Object.assign(document.createElement('style'), { textContent: system('.system-preview') });
document.documentElement.append(systemStyleElement);
