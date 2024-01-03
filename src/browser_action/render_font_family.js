const fontFamilySelect = document.getElementById('font-family');
const customFontFamilyInput = document.getElementById('font-family-custom');

const writeFontFamily = async function ({ target: { value } }) {
  fontFamilySelect.dataset.value = value;
  browser.storage.local.set({ fontFamily: value });
};

const writeCustomFontFamily = async function ({ target: { value } }) {
  browser.storage.local.set({ customFontFamily: value });
};

const renderFontFamily = async function () {
  const { fontFamily = '' } = await browser.storage.local.get('fontFamily');
  const { customFontFamily = '' } = await browser.storage.local.get('customFontFamily');

  fontFamilySelect.addEventListener('input', writeFontFamily);
  customFontFamilyInput.addEventListener('input', writeCustomFontFamily);

  [...fontFamilySelect.options].forEach(option => {
    option.selected = option.value === fontFamily;
  });
  fontFamilySelect.dataset.value = fontFamily;

  customFontFamilyInput.value = customFontFamily;
};

renderFontFamily();
