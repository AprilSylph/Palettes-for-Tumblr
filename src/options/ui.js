const toCamelCase = string => string
  .replace(/\s+\D/g, match => match.trim().toUpperCase())
  .replace(/\s+/g, '')
  .replace(/^[A-Z]/, match => match.toLowerCase())
  .trim();

const hexToRgb = hex => [
  parseInt(hex.substr(1, 2), 16),
  parseInt(hex.substr(3, 2), 16),
  parseInt(hex.substr(5, 2), 16)
].join(',');

const rgbToHex = rgb => `#${rgb.split(',').map(rgbValue => {
  const rgbValueInt = parseInt(rgbValue);
  return rgbValueInt.toString(16).padStart(2, '0');
}).join('')}`;

const paletteSelect = document.getElementById('palette');
const paletteList = document.getElementById('palette-list');
const paletteForm = document.getElementById('palette-form');

const onPaletteSelected = async ({ currentTarget: { value } }) => {
  paletteForm.reset();

  if (value === '') return;

  const { [value]: paletteData } = await browser.storage.local.get(value);
  for (const [propertyName, propertyValue] of Object.entries(paletteData)) {
    paletteForm.elements[propertyName].value = propertyName === 'name'
      ? propertyValue
      : rgbToHex(propertyValue);
  }
};

const onFormSubmitted = async event => {
  event.preventDefault();

  const { currentTarget } = event;
  if (!currentTarget.reportValidity()) return;

  const paletteName = toCamelCase(currentTarget.elements.name.value);
  const storageKey = paletteSelect.value || `palette:${paletteName}:${Date.now()}`;

  const formData = new FormData(currentTarget);
  const formEntries = Array.from(formData.entries());

  const storageValue = Object.fromEntries(formEntries.map(([key, value]) => value.startsWith('#') ? [key, hexToRgb(value)] : [key, value]));

  await browser.storage.local.set({ [storageKey]: storageValue });
  currentTarget.reset();
};

const renderPalettes = async () => {
  const storageObject = await browser.storage.local.get();
  const definedPalettes = Object.entries(storageObject).filter(([key]) => key.startsWith('palette:'));

  definedPalettes.sort(([a], [b]) => {
    const firstTimestamp = a.split(':')[2];
    const secondTimestamp = b.split(':')[2];
    return firstTimestamp - secondTimestamp;
  });

  paletteList.replaceChildren(...definedPalettes.map(([paletteKey, { name }]) => {
    return Object.assign(document.createElement('option'), { value: paletteKey, textContent: name });
  }));

  onPaletteSelected({ currentTarget: paletteSelect });
};

paletteForm.reset();

paletteSelect.addEventListener('change', onPaletteSelected);
paletteForm.addEventListener('submit', onFormSubmitted);

browser.storage.onChanged.addListener(renderPalettes);
renderPalettes();
