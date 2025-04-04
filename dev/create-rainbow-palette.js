import fs from 'node:fs';

const palettes = JSON.parse(fs.readFileSync('src/paletteData.json', 'utf8'));
const system = JSON.parse(fs.readFileSync('src/paletteSystemData.json', 'utf8'));

const randomInt = () => Math.floor(Math.random() * 256);

palettes.rainbow = palettes.trueBlue;
// palettes.rainbow = Object.fromEntries(
//   Object.keys(palettes.trueBlue).map((key) => [key, `${randomInt()}, ${randomInt()}, ${randomInt()}`])
// );

system.rainbow = Object.fromEntries(
  Object.keys(system.trueBlue).map((key) => [key, `rgba(${randomInt()}, ${randomInt()}, ${randomInt()}, 1)`])
);

fs.writeFileSync('src/paletteData.json', JSON.stringify(palettes, null, 2), { flag: 'w+' });
fs.writeFileSync('src/paletteSystemData.json', JSON.stringify(system, null, 2), { flag: 'w+' });
