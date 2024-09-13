import { exportList } from './modules/backup.js';
import { hexToRgb, rgbToHex } from './modules/color.js';
import { getTimestamp } from './modules/datetime.js';

const { getURL } = browser.runtime;
const getBuiltInPaletteList = fetch(getURL('/palettes.json')).then(response => response.json());
const getBuiltInPalettes = fetch(getURL('/paletteData.json')).then(response => response.json());

const toCamelCase = string => string
  .replace(/\W/g, ' ')
  .replace(/\s+\D/g, match => match.trim().toUpperCase())
  .replace(/\s+/g, '')
  .replace(/^[A-Z]/, match => match.toLowerCase())
  .trim();

const newSelect = document.getElementById('new');
const openSelect = document.getElementById('open');
const saveButton = document.getElementById('save');
const deleteButton = document.getElementById('delete');

const previewSection = document.getElementById('preview');
const livePreviewToggle = document.getElementById('live-preview-toggle');

window.disableLivePreview = () => { livePreviewToggle.checked = false; };
const disableLivePreviewInOtherTabs = () =>
  browser.extension.getViews()
    .filter(view => view !== window && view.disableLivePreview)
    .forEach(view => view.disableLivePreview());

const paletteForm = document.getElementById('palette-form');
const createdTime = paletteForm.querySelector('time');

const confirmDiscard = () => saveButton.disabled === true || window.confirm('Are you sure? Your unsaved changes will be lost.');

const buildPaletteTemplateOption = ([value, textContent]) => Object.assign(document.createElement('option'), {
  value,
  textContent
});

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
    paletteForm.reset();
    updatePreview();
  }
};

const onFormReset = () => {
  delete paletteForm.dataset.editing;
  createdTime.textContent = '';

  disableSaveButton();
  deleteButton.disabled = true;
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
  formEntries
    .filter(([property, value]) => value.startsWith('#'))
    .forEach(([property, value]) => previewSection.style.setProperty(`--${property}`, value));

  if (livePreviewToggle.checked) {
    disableLivePreviewInOtherTabs();
    const storageValue = Object.fromEntries(
      formEntries
        .filter(([property, value]) => value.startsWith('#'))
        .map(([key, value]) => [key, hexToRgb(value)])
    );
    browser.storage.local.set({ previewPalette: storageValue });
  } else {
    browser.storage.local.remove('previewPalette');
  }
};

livePreviewToggle.addEventListener('change', updatePreview);
window.addEventListener('pagehide', () => browser.storage.local.remove('previewPalette'));

disableLivePreviewInOtherTabs();
browser.storage.local.remove('previewPalette');

newSelect.addEventListener('change', createNewPalette);
openSelect.addEventListener('change', onPaletteSelected);
deleteButton.addEventListener('click', deleteCurrentPalette);
deleteButton.disabled = true;

getBuiltInPaletteList.then(builtInPaletteList => {
  const templates = document.getElementById('templates');
  templates.replaceChildren(...builtInPaletteList.flatMap(
    ([label, options]) => options.map(buildPaletteTemplateOption)
  ));
});

paletteForm.addEventListener('reset', onFormReset);
paletteForm.addEventListener('submit', onFormSubmitted);
paletteForm.addEventListener('input', updatePreview);
paletteForm.reset();

const highlightCheckboxes = [...document.querySelectorAll('.highlight-checkbox')];
const rainbow = ['#ff492f', '#ff8a00', '#e8d738', '#00cf35', '#00b8ff', '#7c5cff', '#ff62ce'];
let i = 0;
setInterval(() => {
  i++;
  const color = rainbow[i % rainbow.length];
  const selected = highlightCheckboxes.filter(checkbox => checkbox.checked);
  selected.forEach(checkbox => {
    checkbox.previousElementSibling.value = color;
  });
  if (selected.length) {
    updatePreview();
  }
}, 200);

highlightCheckboxes.forEach(checkbox =>
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      checkbox.dataset.stored = checkbox.previousElementSibling.value;
    } else {
      checkbox.previousElementSibling.value = checkbox.dataset.stored;
      updatePreview();
    }
  })
);

browser.storage.onChanged.addListener(renderPalettes);
renderPalettes();

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'manage-palettes-open') {
    sendResponse(true);
  }
});
