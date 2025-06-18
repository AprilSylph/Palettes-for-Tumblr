import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';

try {
  const browser = await puppeteer.launch({ browser: 'firefox', headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.tumblr.com/');

  await page.waitForSelector(':root:not(:has([data-rh]))');

  await Promise.all(
    page.frames().map(async (frame) => {
      const privacyAgreeButton = await frame.$('.cmp__dialog-footer button.cmp-components-button.white-space-normal.is-primary');
      privacyAgreeButton?.click();
    })
  );
  await page.waitForSelector(':root:not(:has(#cmp-app-container iframe))');

  const allData = await fs.readFile('src/palette_system_data.json').then(JSON.parse).catch(() => ({}));

  for (let i = 0; i < 12; i++) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const body = await page.waitForSelector('body');
    const keyClassName = await body.evaluate((el) => el.className);
    let key = keyClassName.replace('palette--', '');

    if (key === 'snowBright') key = 'nuclearWhite';

    const styleElement = await page.waitForSelector('#root style');
    const data = await styleElement.evaluate((el) => {
      const rootRuleStyle = [...el.sheet.cssRules].find((rule) => rule.selectorText === ':root').style;

      const keys = [...rootRuleStyle];
      const entries = keys
        .map((key) => [key, rootRuleStyle.getPropertyValue(key)])
        .filter(([key, value]) => key.startsWith('--') && /rgba\(\d/.test(value));
      return Object.fromEntries(entries.map(([key, value]) => [key.replace(/^--/, ''), value]));
    });

    allData[key] = data;

    await page.keyboard.down('Shift');
    await page.keyboard.press('KeyP');
    await page.keyboard.up('Shift');
  }

  await browser.close();

  await fs.writeFile('src/palette_system_data.json', JSON.stringify(allData, null, 2), {
    encoding: 'utf8',
    flag: 'w+'
  });

  console.log(`wrote data for ${Object.keys(allData).length} palettes`);
} catch (e) {
  console.log(e);
}
