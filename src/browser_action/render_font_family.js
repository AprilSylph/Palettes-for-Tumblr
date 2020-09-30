const writeFontFamily = async function ({ target: { value } }) {
  browser.storage.local.set({ fontFamily: value });
};

const renderFontFamily = async function () {
  const { fontFamily = '' } = await browser.storage.local.get('fontFamily');
  const fontFamilySelect = document.getElementById('font-family');

  fontFamilySelect.addEventListener('input', writeFontFamily);

  [...fontFamilySelect.options].forEach(option => {
    option.selected = option.value === fontFamily;
  });
};

renderFontFamily();
