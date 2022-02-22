const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'medium'
});

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

const newButton = document.getElementById('new');
const openSelect = document.getElementById('open');
const saveButton = document.getElementById('save');
const deleteButton = document.getElementById('delete');

const paletteForm = document.getElementById('palette-form');
const createdTime = paletteForm.querySelector('time');

const previewSection = document.getElementById('preview');

const confirmDiscard = () => saveButton.disabled === true || window.confirm('Are you sure? Your unsaved changes will be lost.');

const getTimestamp = paletteKey => {
  const timestamp = parseInt(paletteKey.split(':')[2]);
  const creationDate = new Date(timestamp);
  return dateTimeFormat.format(creationDate);
};

const createNewPalette = () => {
  if (!confirmDiscard()) return;

  deleteButton.disabled = true;
  delete paletteForm.dataset.editing;
  createdTime.textContent = '';
  paletteForm.reset();

  updatePreview();
};

const onPaletteSelected = async ({ currentTarget: { options, value } }) => {
  options[0].selected = true;
  if (!confirmDiscard()) return;

  deleteButton.disabled = false;
  paletteForm.dataset.editing = value;
  paletteForm.reset();

  const { [value]: paletteData } = await browser.storage.local.get(value);
  for (const [propertyName, propertyValue] of Object.entries(paletteData)) {
    paletteForm.elements[propertyName].value = propertyName === 'name'
      ? propertyValue
      : rgbToHex(propertyValue);
  }

  createdTime.textContent = getTimestamp(value);
  updatePreview();
};

const disableSaveButton = () => {
  if (saveButton.disabled === true) return;

  saveButton.disabled = true;
  paletteForm.addEventListener(
    'change',
    () => { saveButton.disabled = false; },
    { once: true }
  );
};

const deleteCurrentPalette = async () => {
  const storageKey = paletteForm.dataset.editing;
  if (!storageKey) return;

  if (window.confirm('Delete this palette? This cannot be undone!')) {
    await browser.storage.local.remove(storageKey);
    saveButton.disabled = true;
    createNewPalette();
  }
};

const onFormSubmitted = async event => {
  event.preventDefault();

  const { currentTarget } = event;
  if (!currentTarget.reportValidity()) return;

  const paletteName = toCamelCase(currentTarget.elements.name.value);
  const storageKey = currentTarget.dataset.editing || `palette:${paletteName}:${Date.now()}`;

  const formData = new FormData(currentTarget);
  const formEntries = Array.from(formData.entries());

  const storageValue = Object.fromEntries(formEntries.map(([key, value]) => value.startsWith('#') ? [key, hexToRgb(value)] : [key, value]));

  await browser.storage.local.set({ [storageKey]: storageValue });
  disableSaveButton();

  if (!currentTarget.dataset.editing) {
    deleteButton.disabled = false;
    currentTarget.dataset.editing = storageKey;
    createdTime.textContent = getTimestamp(storageKey);
  }
};

const renderPalettes = async () => {
  const storageObject = await browser.storage.local.get();
  const definedPalettes = Object.entries(storageObject).filter(([key]) => key.startsWith('palette:'));

  definedPalettes.sort(([a], [b]) => {
    const firstTimestamp = a.split(':')[2];
    const secondTimestamp = b.split(':')[2];
    return firstTimestamp - secondTimestamp;
  });

  openSelect.replaceChildren(
    Object.assign(document.createElement('option'), { disabled: true, selected: true, textContent: 'Open...' }),
    ...definedPalettes.map(([paletteKey, { name }]) => {
      return Object.assign(document.createElement('option'), { value: paletteKey, textContent: name });
    })
  );
};

const updatePreview = () => {
  const formData = new FormData(paletteForm);
  const formEntries = Array.from(formData.entries());
  formEntries.forEach(([property, value]) => previewSection.style.setProperty(`--${property}`, value));
};

newButton.addEventListener('click', createNewPalette);
openSelect.addEventListener('change', onPaletteSelected);
deleteButton.addEventListener('click', deleteCurrentPalette);
deleteButton.disabled = true;

paletteForm.addEventListener('reset', disableSaveButton);
paletteForm.addEventListener('submit', onFormSubmitted);
paletteForm.addEventListener('input', updatePreview);
paletteForm.reset();

browser.storage.onChanged.addListener(renderPalettes);
renderPalettes();
