await new Promise((resolve) =>
  document.readyState === 'loading'
    ? document.addEventListener('readystatechange', resolve, { once: true })
    : resolve()
);

export const fontWeightOverride = Object.assign(document.createElement('style'), {
  id: 'palettes-for-tumblr-override'
});

const getSelectorsFromUrl = async (url) => {
  const cssText = await fetch(url).then(response => response.text());
  const sheet = await new CSSStyleSheet().replace(cssText);

  const allCssStyleRules = [...sheet.cssRules]
    .filter((rule) => rule instanceof CSSStyleRule && rule.style)
    .map(({ selectorText, style }) => ({
      selectorText,
      rules: Object.fromEntries([...style].map((key) => [key, style.getPropertyValue(key)]))
    }));

  return allCssStyleRules
    .filter(
      ({ rules }) =>
        rules['font-family'] === 'var(--font-family-modern)' &&
        rules['font-weight'] === '350'
    )
    .map(({ selectorText }) => selectorText);
};

const cache = {};

const processLinkElements = async () => {
  [...document.head.querySelectorAll('link[rel="stylesheet"][href^="https://assets.tumblr.com/pop/"]')]
    .map(element => element.href)
    .forEach(url => {
      cache[url] ??= getSelectorsFromUrl(url);
    });

  const selectors = await Promise.all(Object.values(cache)).then(results => results.flat());
  fontWeightOverride.textContent = `
    ${selectors.join(', ')} {
      font-weight: normal;
    }
  `;
};

processLinkElements();
new MutationObserver(processLinkElements).observe(document.head, { childList: true });
