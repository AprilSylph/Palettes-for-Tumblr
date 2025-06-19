import Color from './lib/color.min.js';
import { getCustomTokens } from './get_custom_tokens.js';

// semi-arbitrary breakpoint in between cement accent and goth rave accent
const isDark = color => new Color(color).oklch[0] < 0.57;

export const getSemanticTokens = (colors) => {
  const customTokens = getCustomTokens(colors);
  const staticTokens = getCustomTokens({
    black: '0, 0, 0',
    white: '255, 255, 255',
    gray: '128, 128, 128',

    red: '255, 73, 48',
    green: '0, 207, 53',
    purple: '124, 92, 255'
  });

  return {
    chrome: customTokens.colorNavy,
    'chrome-panel': customTokens.colorNavy95,
    'chrome-panel-border': customTokens.colorWhiteOnDarkTint5,
    'chrome-tint': customTokens.colorWhiteOnDarkTint5,
    'chrome-tint-strong': customTokens.colorWhiteOnDarkTint10,
    'chrome-tint-heavy': customTokens.colorWhiteOnDarkTint15,
    'chrome-mobile': customTokens.colorNavy, // seems completely unused?

    // over top-menu (use: button in community setting header)
    'chrome-fg': customTokens.colorWhiteOnDark,
    'chrome-fg-secondary': customTokens.colorWhiteOnDarkTint60,
    'chrome-fg-tertiary': customTokens.colorWhiteOnDarkTint40,

    // use: unread count
    accent: customTokens.colorAccent,
    'accent-fg': isDark(customTokens.colorAccent) ? staticTokens.colorWhite : staticTokens.colorBlack,
    'accent-fg-light': staticTokens.colorWhite,
    'accent-hover': customTokens.colorAccent40,
    'accent-pressed': customTokens.colorAccent30,
    'accent-tint': customTokens.colorAccentTint10,
    'accent-tint-strong': customTokens.colorAccentTint20,
    'accent-tint-heavy': customTokens.colorAccentTint30,

    'content-panel': customTokens.colorWhite,
    'content-panel-border': customTokens.colorTransparent,

    // over content-panel/modal (use: search options form element outline, community button outline)
    'content-tint': isDark(customTokens.colorWhite) ? staticTokens.colorWhiteTint5 : staticTokens.colorBlackTint5,
    'content-tint-strong': isDark(customTokens.colorWhite) ? staticTokens.colorWhiteTint10 : staticTokens.colorBlackTint10,
    'content-tint-heavy': isDark(customTokens.colorWhite) ? staticTokens.colorWhiteTint15 : staticTokens.colorBlackTint15,
    'content-mobile-container': customTokens.colorNavy3, // seems completely unused?

    'content-fg': customTokens.colorBlack,
    'content-fg-secondary': customTokens.colorBlackTint60,
    'content-fg-tertiary': customTokens.colorBlackTint40,

    'color-panel-border': customTokens.colorTransparent,
    'color-tint': staticTokens.colorBlackTint10,
    'color-tint-strong': staticTokens.colorBlackTint15,
    'color-tint-heavy': staticTokens.colorBlackTint20,

    // over e.g. brand-purple (use: "create your own community" on tagged page)
    'color-fg': staticTokens.colorBlack,
    'color-fg-secondary': staticTokens.colorBlackTint80,
    'color-fg-tertiary': staticTokens.colorBlackTint60,
    'color-fg-light': staticTokens.colorWhite,
    'color-fg-light-secondary': staticTokens.colorWhiteTint80,
    'color-fg-light-tertiary': staticTokens.colorWhiteTint60,

    'image-bg': staticTokens.colorBlack,
    'image-panel-border': customTokens.colorWhiteTint10,
    'image-tint': staticTokens.colorBlackTint40,
    'image-tint-strong': staticTokens.colorBlackTint50,
    'image-tint-heavy': staticTokens.colorBlackTint60,
    'image-fg': staticTokens.colorWhite,
    'image-fg-secondary': staticTokens.colorWhiteTint80,
    'image-fg-tertiary': staticTokens.colorWhiteTint60,

    'side-menu': customTokens.colorNavy,
    'side-menu-shadow': customTokens.colorWhiteTint10,
    'top-menu': customTokens.colorNavy,
    'top-menu-shadow': customTokens.colorWhiteTint10,

    // use: search mode options modal
    modal: customTokens.colorWhite,
    'modal-border': isDark(customTokens.colorWhite) ? staticTokens.colorWhiteTint10 : staticTokens.colorBlackTint10, // should look similar to content-tint-heavy

    // over content-panel (use: post footer control tooltips)
    'tool-tip': isDark(customTokens.colorWhite) ? staticTokens.colorWhite : staticTokens.colorBlack,
    'tool-tip-text': isDark(customTokens.colorWhite) ? staticTokens.colorBlack : staticTokens.colorWhite,

    // use: settings page change password backdrop
    'overlay-tint': customTokens.colorNavyTint20,
    'overlay-tint-strong': customTokens.colorNavyTint60,
    'overlay-tint-heavy': customTokens.colorNavyTint80,

    'unread-tint': customTokens.colorAccentTint10,
    'unread-tint-hover': customTokens.colorAccentTint20,
    'badge-text': staticTokens.colorBlack,
    'badge-icon': staticTokens.colorWhite,

    'chrome-ui': customTokens.colorAccent,
    'chrome-ui-hover': customTokens.colorAccent40,
    'chrome-ui-pressed': customTokens.colorAccent30,
    'chrome-ui-focus': customTokens.colorAccent,
    'chrome-ui-fg': isDark(customTokens.colorAccent) ? staticTokens.colorWhite : staticTokens.colorBlack,
    'chrome-ui-fg-secondary': isDark(customTokens.colorAccent) ? staticTokens.colorWhiteTint80 : staticTokens.colorBlackTint80,
    'chrome-ui-fg-tertiary': isDark(customTokens.colorAccent) ? staticTokens.colorWhiteTint60 : staticTokens.colorBlackTint60,
    'chrome-ui-toggle': staticTokens.colorWhite,

    // can't find these but they're probably over navy
    'chrome-danger': isDark(customTokens.colorNavy) ? staticTokens.colorRed30 : staticTokens.colorRed70,
    'chrome-success': isDark(customTokens.colorNavy) ? staticTokens.colorGreen30 : staticTokens.colorGreen70,
    'chrome-education': isDark(customTokens.colorNavy) ? staticTokens.colorPurple30 : staticTokens.colorPurple70,
    'chrome-blue': isDark(customTokens.colorNavy) ? customTokens.colorBlue30 : customTokens.colorBlue70,
    'chrome-purple': isDark(customTokens.colorNavy) ? customTokens.colorPurple30 : customTokens.colorPurple70,
    'chrome-pink': isDark(customTokens.colorNavy) ? customTokens.colorPink30 : customTokens.colorPink70,
    'chrome-red': isDark(customTokens.colorNavy) ? customTokens.colorRed30 : customTokens.colorRed70,
    'chrome-orange': isDark(customTokens.colorNavy) ? customTokens.colorOrange30 : customTokens.colorOrange70,
    'chrome-yellow': isDark(customTokens.colorNavy) ? customTokens.colorYellow30 : customTokens.colorYellow70,
    'chrome-green': isDark(customTokens.colorNavy) ? customTokens.colorGreen30 : customTokens.colorGreen70,

    // over content-panel (use: post button on drafts)
    'content-ui': customTokens.colorAccent,
    'content-ui-hover': customTokens.colorAccent40,
    'content-ui-pressed': customTokens.colorAccent30,
    'content-ui-focus': customTokens.colorAccent,

    // unknown use
    'content-ui-fg': customTokens.colorWhite,
    'content-ui-fg-secondary': customTokens.colorNavy40,
    'content-ui-fg-tertiary': customTokens.colorNavy60,
    'content-ui-toggle': staticTokens.colorWhite,

    // over content-panel
    'content-danger': isDark(customTokens.colorWhite) ? staticTokens.colorRed30 : staticTokens.colorRed70,
    'content-success': isDark(customTokens.colorWhite) ? staticTokens.colorGreen30 : staticTokens.colorGreen70,
    'content-education': isDark(customTokens.colorWhite) ? staticTokens.colorPurple30 : staticTokens.colorPurple70, // use: community moderate post modal info
    'content-blue': isDark(customTokens.colorWhite) ? customTokens.colorBlue30 : customTokens.colorBlue70,
    'content-purple': isDark(customTokens.colorWhite) ? customTokens.colorPurple30 : customTokens.colorPurple70,
    'content-pink': isDark(customTokens.colorWhite) ? customTokens.colorPink30 : customTokens.colorPink70,
    'content-red': isDark(customTokens.colorWhite) ? customTokens.colorRed30 : customTokens.colorRed70,
    'content-orange': isDark(customTokens.colorWhite) ? customTokens.colorOrange30 : customTokens.colorOrange70,
    'content-yellow': isDark(customTokens.colorWhite) ? customTokens.colorYellow30 : customTokens.colorYellow70,
    'content-green': isDark(customTokens.colorWhite) ? customTokens.colorGreen30 : customTokens.colorGreen70,

    // over e.g. brand-purple (use: "create your own community" on tagged page)
    'color-ui': staticTokens.colorBlack,
    'color-ui-hover': staticTokens.colorBlackTint90,
    'color-ui-pressed': staticTokens.colorBlackTint80,
    'color-ui-focus': staticTokens.colorBlack,
    'color-ui-fg': staticTokens.colorWhite,
    'color-ui-fg-secondary': staticTokens.colorGray40,
    'color-ui-fg-tertiary': staticTokens.colorGray60,
    'color-ui-toggle': staticTokens.colorWhite,

    // use: community invite button
    'image-ui': staticTokens.colorWhite,
    'image-ui-hover': staticTokens.colorWhiteTint90,
    'image-ui-pressed': staticTokens.colorWhiteTint80,
    'image-ui-accent': staticTokens.colorWhite,

    // use: boop modal? I don't know.
    'image-ui-fg': staticTokens.colorBlack,
    'image-ui-fg-secondary': staticTokens.colorGray60,
    'image-ui-fg-tertiary': staticTokens.colorGray40,
    'image-ui-toggle': staticTokens.colorWhite,

    // over content-panel/modal (use: community moderate post modal confirm)
    danger: staticTokens.colorRed,
    'danger-hover': isDark(customTokens.colorWhite) ? staticTokens.colorRed40 : staticTokens.colorRed60,
    'danger-pressed': isDark(customTokens.colorWhite) ? staticTokens.colorRed30 : staticTokens.colorRed70,
    'danger-tint': staticTokens.colorRedTint10,
    'danger-tint-strong': staticTokens.colorRedTint20,
    'danger-tint-heavy': staticTokens.colorRedTint30,
    success: staticTokens.colorGreen,
    'success-hover': staticTokens.colorGreen40,
    'success-pressed': staticTokens.colorGreen30,
    'success-tint': staticTokens.colorGreenTint10,
    'success-tint-strong': staticTokens.colorGreenTint20,
    'success-tint-heavy': staticTokens.colorGreenTint30,
    education: staticTokens.colorPurple,
    'education-hover': staticTokens.colorPurple40,
    'education-pressed': staticTokens.colorPurple30,
    'education-tint': staticTokens.colorPurpleTint10,
    'education-tint-strong': staticTokens.colorPurpleTint20,
    'education-tint-heavy': staticTokens.colorPurpleTint30,

    'brand-blue': customTokens.colorBlue,
    'brand-blue-hover': customTokens.colorBlue40,
    'brand-blue-pressed': customTokens.colorBlue30,
    'brand-blue-tint': customTokens.colorBlueTint10,
    'brand-blue-tint-strong': customTokens.colorBlueTint20,
    'brand-blue-tint-heavy': customTokens.colorBlueTint30,
    'brand-purple': customTokens.colorPurple,
    'brand-purple-hover': customTokens.colorPurple40,
    'brand-purple-pressed': customTokens.colorPurple30,
    'brand-purple-tint': customTokens.colorPurpleTint10,
    'brand-purple-tint-strong': customTokens.colorPurpleTint20,
    'brand-purple-tint-heavy': customTokens.colorPurpleTint30,
    'brand-pink': customTokens.colorPink,
    'brand-pink-hover': customTokens.colorPink40,
    'brand-pink-pressed': customTokens.colorPink30,
    'brand-pink-tint': customTokens.colorPinkTint10,
    'brand-pink-tint-strong': customTokens.colorPinkTint20,
    'brand-pink-tint-heavy': customTokens.colorPinkTint30,
    'brand-red': customTokens.colorRed,
    'brand-red-hover': customTokens.colorRed40,
    'brand-red-pressed': customTokens.colorRed30,
    'brand-red-tint': customTokens.colorRedTint10,
    'brand-red-tint-strong': customTokens.colorRedTint20,
    'brand-red-tint-heavy': customTokens.colorRedTint30,
    'brand-orange': customTokens.colorOrange,
    'brand-orange-hover': customTokens.colorOrange40,
    'brand-orange-pressed': customTokens.colorOrange30,
    'brand-orange-tint': customTokens.colorOrangeTint10,
    'brand-orange-tint-strong': customTokens.colorOrangeTint20,
    'brand-orange-tint-heavy': customTokens.colorOrangeTint30,
    'brand-yellow': customTokens.colorYellow,
    'brand-yellow-hover': customTokens.colorYellow40,
    'brand-yellow-pressed': customTokens.colorYellow30,
    'brand-yellow-tint': customTokens.colorYellowTint10,
    'brand-yellow-tint-strong': customTokens.colorYellowTint20,
    'brand-yellow-tint-heavy': customTokens.colorYellowTint30,
    'brand-green': customTokens.colorGreen,
    'brand-green-hover': customTokens.colorGreen40,
    'brand-green-pressed': customTokens.colorGreen30,
    'brand-green-tint': customTokens.colorGreenTint10,
    'brand-green-tint-strong': customTokens.colorGreenTint20,
    'brand-green-tint-heavy': customTokens.colorGreenTint30
  };
};
