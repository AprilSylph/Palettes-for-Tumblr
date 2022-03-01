import { getDatestamp, isValidDate } from './datetime.js';

const loadFileInput = document.getElementById('load-file');

const selectAllButton = document.getElementById('select-all');
const selectNoneButton = document.getElementById('select-none');
const exportList = document.getElementById('export-list');
const saveFileButton = document.getElementById('save-file');

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

loadFileInput.addEventListener('change', loadFromFile);

selectAllButton.addEventListener('click', selectAllForExport);
selectNoneButton.addEventListener('click', selectNoneForExport);
exportList.addEventListener('change', updateSaveFileButton);
saveFileButton.addEventListener('click', saveToFile);
updateSaveFileButton();

export { exportList };
