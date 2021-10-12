const writeFontSize = ({ currentTarget }) => currentTarget.checkValidity() && browser.storage.local.set({ fontSize: `${currentTarget.value}px` });

const renderFontSize = async function () {
  const { fontSize } = await browser.storage.local.get('fontSize');
  const fontSizeInput = document.getElementById('font-size');

  if (fontSize) fontSizeInput.value = parseInt(fontSize);
  fontSizeInput.addEventListener('input', writeFontSize);
};

renderFontSize();
