import { getDatestamp, getTimestamp, isValidDate } from './modules/datetime.js';

const { getURL } = browser.runtime;
const getBuiltInPaletteList = fetch(getURL('/palettes.json')).then(response => response.json());
const getBuiltInPalettes = fetch(getURL('/paletteData.json')).then(response => response.json());

const toCamelCase = string => string
  .replace(/\W/g, ' ')
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

const newSelect = document.getElementById('new');
const openSelect = document.getElementById('open');
const saveButton = document.getElementById('save');
const deleteButton = document.getElementById('delete');

const previewSection = document.getElementById('preview');

const loadFileButton = document.getElementById('load-file');
const loadFileInput = loadFileButton.nextElementSibling;

const selectAllButton = document.getElementById('select-all');
const selectNoneButton = document.getElementById('select-none');
const exportList = document.getElementById('export-list');
const saveFileButton = document.getElementById('save-file');

const paletteForm = document.getElementById('palette-form');
const createdTime = paletteForm.querySelector('time');

const confirmDiscard = () => saveButton.disabled === true || window.confirm('Are you sure? Your unsaved changes will be lost.');

const buildPaletteOption = ([paletteKey, { name }]) => Object.assign(document.createElement('option'), {
  value: paletteKey,
  title: `Created ${getTimestamp(paletteKey)}`,
  textContent: name
});

const populateForm = ({ paletteKey, paletteData }) => {
  if (paletteKey) {
    paletteForm.dataset.editing = paletteKey;
    createdTime.textContent = getTimestamp(paletteKey);
    deleteButton.disabled = false;
  } else {
    delete paletteForm.dataset.editing;
    createdTime.textContent = '';
    deleteButton.disabled = true;
  }

  for (const [propertyName, propertyValue] of Object.entries(paletteData)) {
    paletteForm.elements[propertyName].value = propertyName === 'name'
      ? propertyValue
      : rgbToHex(propertyValue);
  }

  updatePreview();
};

const createNewPalette = async ({ currentTarget: { options, value } }) => {
  options[0].selected = true;
  if (!confirmDiscard()) return;
  paletteForm.reset();

  const { [value]: paletteData } = await getBuiltInPalettes;
  populateForm({ paletteData });
};

const onPaletteSelected = async ({ currentTarget: { options, value: paletteKey } }) => {
  options[0].selected = true;
  if (!confirmDiscard()) return;
  paletteForm.reset();

  const { [paletteKey]: paletteData } = await browser.storage.local.get(paletteKey);
  populateForm({ paletteKey, paletteData });
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

  const { [storageKey]: { name } } = await browser.storage.local.get(storageKey);
  if (window.confirm(`Delete the "${name}" palette? This cannot be undone!`)) {
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
    ...definedPalettes.map(buildPaletteOption)
  );

  exportList.replaceChildren(...definedPalettes.map(buildPaletteOption));
};

const updatePreview = () => {
  const formData = new FormData(paletteForm);
  const formEntries = Array.from(formData.entries());
  formEntries.forEach(([property, value]) => previewSection.style.setProperty(`--${property}`, value));
};

const loadFromFile = async ({ currentTarget }) => {
  try {
    const { files } = currentTarget;
    if (files.length === 0) return;

    const [importedPalettes] = files;

    if (importedPalettes.type !== 'application/json') {
      throw new Error('Invalid file type selected.');
    }

    const paletteString = await importedPalettes.text();
    const paletteData = JSON.parse(paletteString);

    const paletteEntries = Object.entries(paletteData);
    const validPaletteEntries = paletteEntries.filter(([paletteKey]) => {
      const keyParts = paletteKey.split(':');
      if (keyParts.length !== 3) return false;

      const [type, name, timestamp] = keyParts;
      return type === 'palette' && /\s/.test(name) === false && isValidDate(parseInt(timestamp));
    });

    if (validPaletteEntries.length === 0) throw new Error('No palettes found in file.');

    await browser.storage.local.set(Object.fromEntries(validPaletteEntries));
    window.alert(`Successfully imported ${validPaletteEntries.length} palettes!`);
  } catch (exception) {
    window.alert(exception.toString());
  } finally {
    currentTarget.value = currentTarget.defaultValue;
  }
};

const selectAllForExport = () => {
  [...exportList.options].forEach(option => { option.selected = true; });
  exportList.focus();
  updateSaveFileButton();
};

const selectNoneForExport = () => {
  [...exportList.options].forEach(option => { option.selected = false; });
  exportList.focus();
  updateSaveFileButton();
};

const updateSaveFileButton = () => {
  saveFileButton.disabled = [...exportList.options].every(({ selected }) => selected === false);
};

const saveToFile = async () => {
  const isFullBackup = [...exportList.options].every(({ selected }) => selected === true);

  const storageKeys = [...exportList.options]
    .filter(({ selected }) => selected === true)
    .map(({ value }) => value);

  if (storageKeys.length === 0) return;

  const paletteData = await browser.storage.local.get(storageKeys);
  const paletteString = JSON.stringify(paletteData, null, 2);
  const paletteBlob = new Blob([paletteString], { type: 'application/json' });

  const href = URL.createObjectURL(paletteBlob);
  const download = isFullBackup
    ? `Palettes Backup @ ${getDatestamp()}`
    : storageKeys.length === 1
      ? storageKeys[0].split(':')[1]
      : window.prompt('Enter a name for this palette collection:');

  if (download === null) return;

  const anchor = Object.assign(document.createElement('a'), { href, download: `${download}.json` });
  anchor.click();
  URL.revokeObjectURL(href);
};

newSelect.addEventListener('change', createNewPalette);
openSelect.addEventListener('change', onPaletteSelected);
deleteButton.addEventListener('click', deleteCurrentPalette);
deleteButton.disabled = true;

getBuiltInPaletteList.then(builtInPaletteList => {
  const optgroup = Object.assign(document.createElement('optgroup'), { label: 'From template:' });
  optgroup.append(...builtInPaletteList.flatMap(([label, options]) => {
    return options.map(([value, textContent]) => Object.assign(document.createElement('option'), {
      value,
      textContent
    }));
  }));
  newSelect.append(optgroup);
});

loadFileButton.addEventListener('click', () => loadFileInput.click());
loadFileInput.addEventListener('change', loadFromFile);

selectAllButton.addEventListener('click', selectAllForExport);
selectNoneButton.addEventListener('click', selectNoneForExport);
exportList.addEventListener('change', updateSaveFileButton);
saveFileButton.addEventListener('click', saveToFile);
updateSaveFileButton();

paletteForm.addEventListener('reset', disableSaveButton);
paletteForm.addEventListener('submit', onFormSubmitted);
paletteForm.addEventListener('input', updatePreview);
paletteForm.reset();

browser.storage.onChanged.addListener(renderPalettes);
renderPalettes();
