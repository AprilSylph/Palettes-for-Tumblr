import fs from 'node:fs';

const optionsStyle = fs.readFileSync('src/options/ui.css', 'utf8');
const paletteSystemData = JSON.parse(fs.readFileSync('src/paletteSystemData.json', 'utf8'));

const seeminglyUnused = [
  'accent-fg-light',
  'accent-pressed',
  'chrome-mobile',
  'content-mobile-container',
  'color-panel-border',
  'color-fg-tertiary',
  'image-bg',
  'side-menu',
  'side-menu-shadow',
  'chrome-ui-fg-secondary',
  'chrome-ui-fg-tertiary',
  'chrome-ui-toggle',
  'chrome-education',
  'content-ui-fg-secondary',
  'content-ui-fg-tertiary',
  'color-ui-fg-secondary',
  'color-ui-fg-tertiary',
  'color-ui-toggle',
  'image-ui-fg-tertiary',
  'image-ui-toggle',
  'education-hover',
  'education-pressed',
  'education-tint-strong',
  'education-tint-heavy'
];

console.log(
  Object.keys(paletteSystemData.trueBlue)
    .filter((key) => !seeminglyUnused.includes(key))
    .filter((key) => !['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'].some(color => key.split('-').includes(color)))
    .filter((key) => !optionsStyle.includes(`--${key}`))
);
