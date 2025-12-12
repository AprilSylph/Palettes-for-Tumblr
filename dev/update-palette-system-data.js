#!/usr/bin/env node

import { launch } from 'puppeteer';
import fs from 'node:fs/promises';

try {
  const browser = await launch({ browser: 'firefox', headless: false });
  await new Promise(resolve => setTimeout(resolve, 5000));
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
    const { light, dark } = await styleElement.evaluate((el) => {
      const rootRuleStyle = [...el.sheet.cssRules].find((rule) => rule.selectorText === ':root').style;

      const darkModeRules = [...el.sheet.cssRules].find((rule) => rule.conditionText === '(prefers-color-scheme: dark)')?.cssRules;
      const darkModeRootRuleStyle = darkModeRules && [...darkModeRules].find((rule) => rule.selectorText === ':root').style;

      const processStyleRule = rootRuleStyle => {
        if (!rootRuleStyle) return;
        const keys = [...rootRuleStyle];
        const entries = keys
          .map((key) => [key, rootRuleStyle.getPropertyValue(key)])
          .filter(([key, value]) => key.startsWith('--') && /rgba\(\d/.test(value));
        return Object.fromEntries(entries.map(([key, value]) => [key.replace(/^--/, ''), value]));
      };

      return {
        light: processStyleRule(rootRuleStyle),
        dark: processStyleRule(darkModeRootRuleStyle),
      };
    });

    allData[key] = dark && key === 'darkMode' ? dark : light;

    await page.keyboard.down('Shift');
    await page.keyboard.press('KeyP');
    await page.keyboard.up('Shift');
  }

  await browser.close();

  await fs.writeFile('src/palette_system_data.json', JSON.stringify(allData, null, 2) + '\n', {
    encoding: 'utf8',
    flag: 'w+'
  });

  console.log(`wrote data for ${Object.keys(allData).length} palettes`);
} catch (e) {
  console.log(e);
}
