try {
  const { palette } = document.currentScript.dataset;
  const styleElement = document.querySelector('#root > div > style');
  const reactKey = Object.keys(styleElement).find((key) => key.startsWith('__reactFiber'));
  let fiber = styleElement[reactKey];

  while (fiber !== null) {
    const { filteredPaletteMap, temporaryTogglePalette, savePalette } =
      fiber.stateNode ?? {};
    if (
      Array.isArray(filteredPaletteMap) &&
      typeof temporaryTogglePalette === 'function' &&
      typeof savePalette === 'function'
    ) {
      if (filteredPaletteMap.includes(palette)) {
        temporaryTogglePalette(palette);
        savePalette(palette);
      }
      break;
    } else {
      fiber = fiber.return;
    }
  }
} catch {}
