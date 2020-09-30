const writeFontSize = async function ({ target: { value } }) {
  browser.storage.local.set({ fontSize: value });
};

const renderFontSize = async function () {
  const { fontSize = '' } = await browser.storage.local.get('fontSize');
  const fontSizeSelect = document.getElementById('font-size');

  fontSizeSelect.addEventListener('input', writeFontSize);

  [...fontSizeSelect.options].forEach(option => {
    option.selected = option.value === fontSize;
  });
};

renderFontSize();
