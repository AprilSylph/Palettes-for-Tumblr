import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';

try {
  // const currentPaletteData = await fs.readFile('src/paletteData.json', 'utf8')
  //   .then((text) => JSON.parse(text))
  //   .catch(() => ({}));
  const currentPaletteData = {};
  let currentPaletteChanged = false;

  const browser = await puppeteer.launch({ browser: 'firefox', headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.tumblr.com/');

  await page.waitForSelector(':root:not(:has([data-rh]))');

  const allData = {};

  for (let i = 0; i < 12; i++) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const body = await page.waitForSelector('body');
    const keyClassName = await body.evaluate((el) => el.className);
    let key = keyClassName.replace('palette--', '');

    if (key === 'snowBright') key = 'nuclearWhite';

    const styleElement = await page.waitForSelector('#root style');
    const { primaryData, systemData } = await styleElement.evaluate((el) => {
      const rootRuleStyle = [...el.sheet.cssRules].find((rule) => rule.selectorText === ':root').style;

      const keys = [...rootRuleStyle];
      const entries = keys.map((key) => [key, rootRuleStyle.getPropertyValue(key)]);

      const primaryEntries = entries.filter(([key, value]) => key.startsWith('--') && /^\d+, \d+, \d+/.test(value));
      const primaryData = Object.fromEntries(primaryEntries.map(([key, value]) => [key.replace(/^--/, ''), value]));

      const systemEntries = entries.filter(([key, value]) => key.startsWith('--') && /rgba\(\d/.test(value));
      const systemData = Object.fromEntries(systemEntries.map(([key, value]) => [key.replace(/^--/, ''), value]));

      return { primaryData, systemData };
    });

    currentPaletteData[key] ??= {};
    for (const [colorUnmodified, rgb] of Object.entries(primaryData)) {
      const color = colorUnmodified === 'deprecated-accent' ? 'accent' : colorUnmodified;
      if (currentPaletteData[key][color] !== rgb) {
        currentPaletteChanged = true;
        currentPaletteData[key][color] = rgb;
      }
    }

    allData[key] = systemData;

    await page.keyboard.down('Shift');
    await page.keyboard.press('KeyP');
    await page.keyboard.up('Shift');
  }

  await browser.close();

  await fs.writeFile('src/paletteSystemData.json', JSON.stringify(allData, null, 2), {
    encoding: 'utf8',
    flag: 'w+'
  });

  if (currentPaletteChanged) {
    await fs.writeFile('src/paletteData.json', JSON.stringify(currentPaletteData, null, 2), {
      encoding: 'utf8',
      flag: 'w+'
    });
  }

  console.log(`wrote data for ${Object.keys(allData).length} palettes`);
} catch (e) {
  console.log(e);
}
