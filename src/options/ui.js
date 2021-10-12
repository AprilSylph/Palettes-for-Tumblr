const toCamelCase = string => string.replace(/\s+\D/g, match => match.trim().toUpperCase()).trim();
const fromCamelCase = string => string.replace(/[A-Z]/g, match => ` ${match}`).replace(/^./, match => match.toUpperCase()).trim();

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
const paletteNameInput = document.getElementById('name');

const onPaletteSelected = async ({ currentTarget: { value } }) => {
  paletteForm.reset();

  if (value === '') {
    paletteNameInput.disabled = false;
    return;
  }

  paletteNameInput.disabled = true;
  paletteNameInput.value = document.querySelector(`option[value="${value}"]`).textContent;

  const { [value]: paletteData } = await browser.storage.local.get(value);
  for (const [propertyName, propertyValue] of Object.entries(paletteData)) {
    document.getElementById(propertyName).value = rgbToHex(propertyValue);
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
  delete storageValue.name;

  await browser.storage.local.set({ [storageKey]: storageValue });
  currentTarget.reset();
};

const renderPalettes = async () => {
  const storageObject = await browser.storage.local.get();
  const definedPalettes = Object.keys(storageObject).filter(key => key.startsWith('palette:'));
  definedPalettes.sort((a, b) => {
    const firstTimestamp = a.split(':')[2];
    const secondTimestamp = b.split(':')[2];
    return firstTimestamp - secondTimestamp;
  });

  paletteList.textContent = '';

  for (const paletteKey of definedPalettes) {
    const option = document.createElement('option');
    option.value = paletteKey;
    option.textContent = fromCamelCase(paletteKey.split(':')[1]);
    paletteList.append(option);
  }
};

paletteForm.reset();

paletteSelect.addEventListener('change', onPaletteSelected);
paletteForm.addEventListener('submit', onFormSubmitted);

browser.storage.onChanged.addListener(renderPalettes);
renderPalettes();
