/**
 * Base color tokens from the Tumblr Design System, extracted from Redpop's sourcemaps.
 *
 * To (re-)obtain these variables:
 *
 * 1. Open https://www.tumblr.com/
 * 2. Open your devtools → Network tab → filter to JS
 * 3. Hit SHIFT+P to change palette
 * 4. Copy the URL of the fetched chunk
 *    (e.g. https://assets.tumblr.com/pop/js/modern/8030-9a9f18c5.js)
 * 5. Paste the URL into your address bar, but append ".map" before navigating to it
 *    (e.g. https://assets.tumblr.com/pop/js/modern/8030-9a9f18c5.js.map)
 * 6. Copy the source content which corresponds to
 *    "webpack://@tumblr/redpop/./src/utils/sass-variables/design-tokens.js"
 *
 * The variables will include other tokens like spacing and radii and be in commonJS format,
 * but can be transformed into ESM (as below) with the right search+replace operations.
 *
 * De-duplications and groupings are performed manually.
 */

export const colorNavy = 'rgba(0, 25, 53, 1)';
export const colorBlue = 'rgba(0, 184, 255, 1)';
export const colorPurple = 'rgba(124, 92, 255, 1)';
export const colorPink = 'rgba(255, 97, 206, 1)';
export const colorRed = 'rgba(255, 73, 48, 1)';
export const colorOrange = 'rgba(255, 138, 0, 1)';
export const colorYellow = 'rgba(232, 215, 58, 1)';
export const colorGreen = 'rgba(1, 207, 53, 1)';
export const colorBlack = 'rgba(0, 0, 0, 1)';
export const colorWhite = 'rgba(255, 255, 255, 1)';
export const colorTransparent = 'rgba(255, 255, 255, 0)';

export const colorNavy3 = 'rgba(251, 252, 252, 1)';
export const colorNavy5 = 'rgba(242, 244, 245, 1)';
export const colorNavy10 = 'rgba(229, 232, 235, 1)';
export const colorNavy15 = 'rgba(217, 221, 225, 1)';
export const colorNavy20 = 'rgba(204, 209, 215, 1)';
export const colorNavy30 = 'rgba(179, 186, 194, 1)';
export const colorNavy40 = 'rgba(153, 163, 174, 1)';
export const colorNavy50 = 'rgba(128, 140, 154, 1)';
export const colorNavy60 = 'rgba(102, 117, 134, 1)';
export const colorNavy70 = 'rgba(76, 94, 114, 1)';
export const colorNavy80 = 'rgba(51, 71, 93, 1)';
export const colorNavy85 = 'rgba(38, 59, 83, 1)';
export const colorNavy90 = 'rgba(26, 48, 73, 1)';
export const colorNavy95 = 'rgba(13, 36, 63, 1)';
export const colorNavy100 = colorNavy;

export const colorNavyTint3 = 'rgba(0, 25, 53, 0.03)';
export const colorNavyTint5 = 'rgba(0, 25, 53, 0.05)';
export const colorNavyTint10 = 'rgba(0, 25, 53, 0.1)';
export const colorNavyTint15 = 'rgba(0, 25, 53, 0.15)';
export const colorNavyTint20 = 'rgba(0, 25, 53, 0.2)';
export const colorNavyTint30 = 'rgba(0, 25, 53, 0.3)';
export const colorNavyTint40 = 'rgba(0, 25, 53, 0.4)';
export const colorNavyTint50 = 'rgba(0, 25, 53, 0.5)';
export const colorNavyTint60 = 'rgba(0, 25, 53, 0.6)';
export const colorNavyTint70 = 'rgba(0, 25, 53, 0.7)';
export const colorNavyTint80 = 'rgba(0, 25, 53, 0.8)';
export const colorNavyTint85 = 'rgba(0, 25, 53, 0.85)';
export const colorNavyTint90 = 'rgba(0, 25, 53, 0.9)';
export const colorNavyTint95 = 'rgba(0, 25, 53, 0.95)';

export const colorGray3 = 'rgba(247, 247, 247, 1)';
export const colorGray5 = 'rgba(242, 242, 242, 1)';
export const colorGray10 = 'rgba(229, 229, 229, 1)';
export const colorGray15 = 'rgba(217, 217, 217, 1)';
export const colorGray20 = 'rgba(204, 204, 204, 1)';
export const colorGray30 = 'rgba(179, 179, 179, 1)';
export const colorGray40 = 'rgba(153, 153, 153, 1)';
export const colorGray50 = 'rgba(128, 128, 128, 1)';
export const colorGray60 = 'rgba(102, 102, 102, 1)';
export const colorGray70 = 'rgba(76, 76, 76, 1)';
export const colorGray80 = 'rgba(51, 51, 51, 1)';
export const colorGray85 = 'rgba(38, 38, 38, 1)';
export const colorGray90 = 'rgba(26, 26, 26, 1)';
export const colorGray95 = 'rgba(13, 13, 13, 1)';
export const colorGray100 = colorBlack;

export const colorBlackTint3 = 'rgba(0, 0, 0, 0.03)';
export const colorBlackTint5 = 'rgba(0, 0, 0, 0.05)';
export const colorBlackTint10 = 'rgba(0, 0, 0, 0.1)';
export const colorBlackTint15 = 'rgba(0, 0, 0, 0.15)';
export const colorBlackTint20 = 'rgba(0, 0, 0, 0.2)';
export const colorBlackTint30 = 'rgba(0, 0, 0, 0.3)';
export const colorBlackTint40 = 'rgba(0, 0, 0, 0.4)';
export const colorBlackTint50 = 'rgba(0, 0, 0, 0.5)';
export const colorBlackTint60 = 'rgba(0, 0, 0, 0.6)';
export const colorBlackTint70 = 'rgba(0, 0, 0, 0.7)';
export const colorBlackTint80 = 'rgba(0, 0, 0, 0.8)';
export const colorBlackTint85 = 'rgba(0, 0, 0, 0.85)';
export const colorBlackTint90 = 'rgba(0, 0, 0, 0.9)';
export const colorBlackTint95 = 'rgba(0, 0, 0, 0.95)';

export const colorWhiteTint3 = 'rgba(255, 255, 255, 0.03)';
export const colorWhiteTint5 = 'rgba(255, 255, 255, 0.05)';
export const colorWhiteTint10 = 'rgba(255, 255, 255, 0.1)';
export const colorWhiteTint15 = 'rgba(255, 255, 255, 0.15)';
export const colorWhiteTint20 = 'rgba(255, 255, 255, 0.2)';
export const colorWhiteTint30 = 'rgba(255, 255, 255, 0.3)';
export const colorWhiteTint40 = 'rgba(255, 255, 255, 0.4)';
export const colorWhiteTint50 = 'rgba(255, 255, 255, 0.5)';
export const colorWhiteTint60 = 'rgba(255, 255, 255, 0.6)';
export const colorWhiteTint70 = 'rgba(255, 255, 255, 0.7)';
export const colorWhiteTint80 = 'rgba(255, 255, 255, 0.8)';
export const colorWhiteTint85 = 'rgba(255, 255, 255, 0.85)';
export const colorWhiteTint90 = 'rgba(255, 255, 255, 0.9)';
export const colorWhiteTint95 = 'rgba(255, 255, 255, 0.95)';

export const colorBlue5 = 'rgba(229, 248, 255, 1)';
export const colorBlue10 = 'rgba(204, 241, 255, 1)';
export const colorBlue20 = 'rgba(153, 227, 255, 1)';
export const colorBlue30 = 'rgba(102, 212, 255, 1)';
export const colorBlue40 = 'rgba(51, 198, 255, 1)';
export const colorBlue50 = colorBlue;
export const colorBlue60 = 'rgba(0, 147, 204, 1)';
export const colorBlue70 = 'rgba(0, 110, 153, 1)';
export const colorBlue80 = 'rgba(0, 74, 102, 1)';
export const colorBlue90 = 'rgba(0, 37, 51, 1)';
export const colorBlue95 = 'rgba(0, 18, 25, 1)';

export const colorBlueTint5 = 'rgba(0, 184, 255, 0.05)';
export const colorBlueTint10 = 'rgba(0, 184, 255, 0.1)';
export const colorBlueTint20 = 'rgba(0, 184, 255, 0.2)';
export const colorBlueTint30 = 'rgba(0, 184, 255, 0.3)';
export const colorBlueTint40 = 'rgba(0, 184, 255, 0.4)';
export const colorBlueTint50 = 'rgba(0, 184, 255, 0.5)';
export const colorBlueTint60 = 'rgba(0, 184, 255, 0.6)';
export const colorBlueTint70 = 'rgba(0, 184, 255, 0.7)';
export const colorBlueTint80 = 'rgba(0, 184, 255, 0.8)';
export const colorBlueTint90 = 'rgba(0, 184, 255, 0.9)';
export const colorBlueTint95 = 'rgba(0, 184, 255, 0.95)';

export const colorPurple5 = 'rgba(242, 239, 255, 1)';
export const colorPurple10 = 'rgba(229, 222, 255, 1)';
export const colorPurple20 = 'rgba(203, 190, 255, 1)';
export const colorPurple30 = 'rgba(176, 157, 255, 1)';
export const colorPurple40 = 'rgba(150, 125, 255, 1)';
export const colorPurple50 = colorPurple;
export const colorPurple60 = 'rgba(99, 74, 204, 1)';
export const colorPurple70 = 'rgba(74, 55, 153, 1)';
export const colorPurple80 = 'rgba(50, 37, 102, 1)';
export const colorPurple90 = 'rgba(25, 18, 51, 1)';
export const colorPurple95 = 'rgba(12, 9, 25, 1)';

export const colorPurpleTint5 = 'rgba(124, 92, 255, 0.05)';
export const colorPurpleTint10 = 'rgba(124, 92, 255, 0.1)';
export const colorPurpleTint20 = 'rgba(124, 92, 255, 0.2)';
export const colorPurpleTint30 = 'rgba(124, 92, 255, 0.3)';
export const colorPurpleTint40 = 'rgba(124, 92, 255, 0.4)';
export const colorPurpleTint50 = 'rgba(124, 92, 255, 0.5)';
export const colorPurpleTint60 = 'rgba(124, 92, 255, 0.6)';
export const colorPurpleTint70 = 'rgba(124, 92, 255, 0.7)';
export const colorPurpleTint80 = 'rgba(124, 92, 255, 0.8)';
export const colorPurpleTint90 = 'rgba(124, 92, 255, 0.9)';
export const colorPurpleTint95 = 'rgba(124, 92, 255, 0.95)';

export const colorPink5 = 'rgba(255, 239, 250, 1)';
export const colorPink10 = 'rgba(255, 223, 245, 1)';
export const colorPink20 = 'rgba(255, 192, 235, 1)';
export const colorPink30 = 'rgba(255, 160, 226, 1)';
export const colorPink40 = 'rgba(255, 129, 216, 1)';
export const colorPink50 = colorPink;
export const colorPink60 = 'rgba(204, 78, 165, 1)';
export const colorPink70 = 'rgba(153, 58, 124, 1)';
export const colorPink80 = 'rgba(102, 39, 82, 1)';
export const colorPink90 = 'rgba(51, 19, 41, 1)';
export const colorPink95 = 'rgba(25, 10, 21, 1)';

export const colorPinkTint5 = 'rgba(255, 97, 206, 0.05)';
export const colorPinkTint10 = 'rgba(255, 97, 206, 0.1)';
export const colorPinkTint20 = 'rgba(255, 97, 206, 0.2)';
export const colorPinkTint30 = 'rgba(255, 97, 206, 0.3)';
export const colorPinkTint40 = 'rgba(255, 97, 206, 0.4)';
export const colorPinkTint50 = 'rgba(255, 97, 206, 0.5)';
export const colorPinkTint60 = 'rgba(255, 97, 206, 0.6)';
export const colorPinkTint70 = 'rgba(255, 97, 206, 0.7)';
export const colorPinkTint80 = 'rgba(255, 97, 206, 0.8)';
export const colorPinkTint90 = 'rgba(255, 97, 206, 0.9)';
export const colorPinkTint95 = 'rgba(255, 97, 206, 0.95)';

export const colorRed5 = 'rgba(255, 237, 234, 1)';
export const colorRed10 = 'rgba(255, 219, 214, 1)';
export const colorRed20 = 'rgba(255, 182, 172, 1)';
export const colorRed30 = 'rgba(255, 146, 131, 1)';
export const colorRed40 = 'rgba(255, 109, 89, 1)';
export const colorRed50 = colorRed;
export const colorRed60 = 'rgba(204, 58, 38, 1)';
export const colorRed70 = 'rgba(153, 44, 29, 1)';
export const colorRed80 = 'rgba(102, 29, 19, 1)';
export const colorRed90 = 'rgba(51, 15, 10, 1)';
export const colorRed95 = 'rgba(25, 7, 5, 1)';

export const colorRedTint5 = 'rgba(255, 73, 48, 0.05)';
export const colorRedTint10 = 'rgba(255, 73, 48, 0.1)';
export const colorRedTint20 = 'rgba(255, 73, 48, 0.2)';
export const colorRedTint30 = 'rgba(255, 73, 48, 0.3)';
export const colorRedTint40 = 'rgba(255, 73, 48, 0.4)';
export const colorRedTint50 = 'rgba(255, 73, 48, 0.5)';
export const colorRedTint60 = 'rgba(255, 73, 48, 0.6)';
export const colorRedTint70 = 'rgba(255, 73, 48, 0.7)';
export const colorRedTint80 = 'rgba(255, 73, 48, 0.8)';
export const colorRedTint90 = 'rgba(255, 73, 48, 0.9)';
export const colorRedTint95 = 'rgba(255, 73, 48, 0.95)';

export const colorOrange5 = 'rgba(255, 243, 229, 1)';
export const colorOrange10 = 'rgba(255, 232, 204, 1)';
export const colorOrange20 = 'rgba(255, 208, 153, 1)';
export const colorOrange30 = 'rgba(255, 185, 102, 1)';
export const colorOrange40 = 'rgba(255, 161, 51, 1)';
export const colorOrange50 = colorOrange;
export const colorOrange60 = 'rgba(204, 110, 0, 1)';
export const colorOrange70 = 'rgba(153, 83, 0, 1)';
export const colorOrange80 = 'rgba(102, 55, 0, 1)';
export const colorOrange90 = 'rgba(51, 28, 0, 1)';
export const colorOrange95 = 'rgba(25, 14, 0, 1)';

export const colorOrangeTint5 = 'rgba(255, 138, 0, 0.05)';
export const colorOrangeTint10 = 'rgba(255, 138, 0, 0.1)';
export const colorOrangeTint20 = 'rgba(255, 138, 0, 0.2)';
export const colorOrangeTint30 = 'rgba(255, 138, 0, 0.3)';
export const colorOrangeTint40 = 'rgba(255, 138, 0, 0.4)';
export const colorOrangeTint50 = 'rgba(255, 138, 0, 0.5)';
export const colorOrangeTint60 = 'rgba(255, 138, 0, 0.6)';
export const colorOrangeTint70 = 'rgba(255, 138, 0, 0.7)';
export const colorOrangeTint80 = 'rgba(255, 138, 0, 0.8)';
export const colorOrangeTint90 = 'rgba(255, 138, 0, 0.9)';
export const colorOrangeTint95 = 'rgba(255, 138, 0, 0.95)';

export const colorYellow5 = 'rgba(253, 251, 235, 1)';
export const colorYellow10 = 'rgba(250, 247, 216, 1)';
export const colorYellow20 = 'rgba(246, 239, 176, 1)';
export const colorYellow30 = 'rgba(241, 231, 137, 1)';
export const colorYellow40 = 'rgba(237, 223, 97, 1)';
export const colorYellow50 = colorYellow;
export const colorYellow60 = 'rgba(186, 172, 46, 1)';
export const colorYellow70 = 'rgba(139, 129, 35, 1)';
export const colorYellow80 = 'rgba(93, 86, 23, 1)';
export const colorYellow90 = 'rgba(46, 43, 12, 1)';
export const colorYellow95 = 'rgba(23, 21, 6, 1)';

export const colorYellowTint5 = 'rgba(232, 215, 58, 0.05)';
export const colorYellowTint10 = 'rgba(232, 215, 58, 0.1)';
export const colorYellowTint20 = 'rgba(232, 215, 58, 0.2)';
export const colorYellowTint30 = 'rgba(232, 215, 58, 0.3)';
export const colorYellowTint40 = 'rgba(232, 215, 58, 0.4)';
export const colorYellowTint50 = 'rgba(232, 215, 58, 0.5)';
export const colorYellowTint60 = 'rgba(232, 215, 58, 0.6)';
export const colorYellowTint70 = 'rgba(232, 215, 58, 0.7)';
export const colorYellowTint80 = 'rgba(232, 215, 58, 0.8)';
export const colorYellowTint90 = 'rgba(232, 215, 58, 0.9)';
export const colorYellowTint95 = 'rgba(232, 215, 58, 0.95)';

export const colorGreen5 = 'rgba(230, 250, 235, 1)';
export const colorGreen10 = 'rgba(204, 245, 215, 1)';
export const colorGreen20 = 'rgba(153, 236, 174, 1)';
export const colorGreen30 = 'rgba(103, 226, 134, 1)';
export const colorGreen40 = 'rgba(52, 217, 93, 1)';
export const colorGreen50 = colorGreen;
export const colorGreen60 = 'rgba(1, 166, 42, 1)';
export const colorGreen70 = 'rgba(1, 124, 32, 1)';
export const colorGreen80 = 'rgba(0, 83, 21, 1)';
export const colorGreen90 = 'rgba(0, 41, 11, 1)';
export const colorGreen95 = 'rgba(0, 21, 5, 1)';

export const colorGreenTint5 = 'rgba(1, 207, 53, 0.05)';
export const colorGreenTint10 = 'rgba(1, 207, 53, 0.1)';
export const colorGreenTint20 = 'rgba(1, 207, 53, 0.2)';
export const colorGreenTint30 = 'rgba(1, 207, 53, 0.3)';
export const colorGreenTint40 = 'rgba(1, 207, 53, 0.4)';
export const colorGreenTint50 = 'rgba(1, 207, 53, 0.5)';
export const colorGreenTint60 = 'rgba(1, 207, 53, 0.6)';
export const colorGreenTint70 = 'rgba(1, 207, 53, 0.7)';
export const colorGreenTint80 = 'rgba(1, 207, 53, 0.8)';
export const colorGreenTint90 = 'rgba(1, 207, 53, 0.9)';
export const colorGreenTint95 = 'rgba(1, 207, 53, 0.95)';

export const colorRainbow0 = colorBlue;
export const colorRainbow1 = colorGreen;
export const colorRainbow2 = 'rgba(116, 211, 56, 1)';
export const colorRainbow3 = colorYellow;
export const colorRainbow4 = colorOrange;
export const colorRainbow5 = 'rgba(255, 105, 24, 1)';
export const colorRainbow6 = colorRed;
export const colorRainbow7 = 'rgba(255, 85, 127, 1)';
export const colorRainbow8 = colorPink;
export const colorRainbow9 = 'rgba(190, 95, 230, 1)';
export const colorRainbow10 = colorPurple;
