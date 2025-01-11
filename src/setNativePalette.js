try {
  const { palette } = document.currentScript.dataset;
  const styleElement = document.querySelector('#root > div > style');
  const reactKey = Object.keys(styleElement).find((key) => key.startsWith('__reactFiber'));
  let fiber = styleElement[reactKey];

  while (fiber) {
    const { filteredPaletteMap, temporaryTogglePalette, savePalette } = fiber.stateNode ?? {};
    if (
      Array.isArray(filteredPaletteMap) &&
      typeof temporaryTogglePalette === 'function' &&
      typeof savePalette === 'function'
    ) {
      const nativePalette = filteredPaletteMap.includes(palette) ? palette : filteredPaletteMap[0];
      temporaryTogglePalette(nativePalette);
      savePalette(nativePalette);
      break;
    } else {
      fiber = fiber.return;
    }
  }
} catch (e) {
  console.error('Error in Palettes for Tumblr native palette selection', e);
}
