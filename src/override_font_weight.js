{
  const styleElement = Object.assign(document.createElement('style'), {
    id: 'palettes-for-tumblr-override'
  });
  document.getElementById('palettes-for-tumblr-override')?.remove();
  document.documentElement.append(styleElement);

  const processedUrls = new Set();
  const selectors = new Set();

  const processLinkElements = async () => {
    const linkElements = [...document.head.querySelectorAll('link[rel="stylesheet"][href^="https://assets.tumblr.com/pop/"]')]
      .filter(element => !processedUrls.has(element.href));
    linkElements.forEach(element => processedUrls.add(element.href));

    const temporaryElements = [];
    const crossOriginLinkElements = linkElements.map((element) => {
      if (['', 'anonymous', 'use-credentials'].includes(element.crossOrigin)) return element;

      const crossOriginElement = Object.assign(document.createElement('link'), {
        rel: 'stylesheet',
        href: element.href,
        crossOrigin: 'anonymous'
      });
      temporaryElements.push(crossOriginElement);
      document.head.append(crossOriginElement);
      return crossOriginElement;
    });

    const sheets = await Promise.all(crossOriginLinkElements.map(async (element) => {
      if (!element.sheet) await new Promise((resolve) => element.addEventListener('load', resolve));
      return element.sheet;
    }));
    temporaryElements.forEach(element => element.remove());

    const allCssStyleRules = sheets
      .flatMap((sheet) => [...sheet.cssRules])
      .filter((rule) => rule instanceof CSSStyleRule && rule.style)
      .map(({ selectorText, style }) => ({
        selectorText,
        rules: Object.fromEntries([...style].map((key) => [key, style.getPropertyValue(key)]))
      }));

    allCssStyleRules
      .filter(
        ({ selectorText, rules }) =>
          !selectors.has(selectorText) &&
          rules['font-family'] === 'var(--font-family-modern)' &&
          rules['font-weight'] === '350'
      )
      .forEach(({ selectorText }) => selectors.add(selectorText));

    styleElement.textContent = `
      body.override-font-weight :is(${[...selectors].join(', ')}) {
        font-weight: normal;
      }
    `;
  };

  processLinkElements();
  new MutationObserver(processLinkElements).observe(document.head, { childList: true });
}
