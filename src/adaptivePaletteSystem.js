const supported = CSS.supports('color', 'color-mix(in srgb, white, black)');

const toKebab = (string) => string.replaceAll(/(?<!^)(?=[A-Z])/g, '-').toLowerCase();

const color = (name, amount) => {
  const baseColor = `rgba(var(--${toKebab(name)}), 1)`;

  if (typeof amount === 'number') {
    if (name === 'Navy') {
      return `color-mix(in srgb, ${baseColor}, white ${100 - amount}%)`;
    } else {
      return amount > 50
        ? `color-mix(in srgb, ${baseColor}, black ${amount * 2 - 100}%)`
        : `color-mix(in srgb, ${baseColor}, white ${100 - amount * 2}%)`;
    }
  } else {
    return baseColor;
  }
};

const colorTint = (name, num) => {
  return `rgba(var(--${toKebab(name)}), ${num / 100})`;
};

/**
 * generated from True Blue source with:
 * t\(\)\.color([A-Z][a-z]+)([A-Z][a-z]+)?(\d+)?
 * color$2('$1', $3)
 */
export const oldBlueSystem = supported
  ? {
      chrome: color('Navy'),
      'chrome-panel': color('Navy', 95),
      'chrome-panel-border': colorTint('White', 5),
      'chrome-tint': colorTint('White', 5),
      'chrome-tint-strong': colorTint('White', 10),
      'chrome-tint-heavy': colorTint('White', 15),
      'chrome-mobile': color('Navy'),
      'chrome-fg': color('White'),
      'chrome-fg-secondary': color('Navy', 40),
      'chrome-fg-tertiary': color('Navy', 60),
      accent: color('DeprecatedAccent'), // manual fix
      'accent-fg': color('Black'),
      'accent-fg-light': color('White'),
      'accent-hover': color('DeprecatedAccent', 40), // manual fix
      'accent-pressed': color('DeprecatedAccent', 30), // manual fix
      'accent-tint': colorTint('DeprecatedAccent', 10), // manual fix
      'accent-tint-strong': colorTint('DeprecatedAccent', 20), // manual fix
      'accent-tint-heavy': colorTint('DeprecatedAccent', 30), // manual fix
      'content-panel': color('White'),
      'content-panel-border': color('Transparent'),
      'content-tint': colorTint('Navy', 5),
      'content-tint-strong': colorTint('Navy', 10),
      'content-tint-heavy': colorTint('Navy', 15),
      'content-mobile-container': color('Navy', 3),
      'content-fg': color('Black'),
      'content-fg-secondary': color('Navy', 60),
      'content-fg-tertiary': color('Navy', 40),
      'color-panel-border': color('Transparent'),
      'color-tint': colorTint('Black', 10),
      'color-tint-strong': colorTint('Black', 15),
      'color-tint-heavy': colorTint('Black', 20),
      'color-fg': color('Black'),
      'color-fg-secondary': colorTint('Black', 80),
      'color-fg-tertiary': colorTint('Black', 60),
      'color-fg-light': color('White'),
      'color-fg-light-secondary': colorTint('White', 80),
      'color-fg-light-tertiary': colorTint('White', 60),
      'image-bg': color('Black'),
      'image-panel-border': colorTint('White', 10),
      'image-tint': colorTint('Black', 40),
      'image-tint-strong': colorTint('Black', 50),
      'image-tint-heavy': colorTint('Black', 60),
      'image-fg': color('White'),
      'image-fg-secondary': colorTint('White', 80),
      'image-fg-tertiary': colorTint('White', 60),
      'side-menu': color('Navy'),
      'side-menu-shadow': colorTint('White', 10),
      'top-menu': color('Navy'),
      'top-menu-shadow': colorTint('White', 10),
      modal: color('White'),
      'modal-border': colorTint('Navy', 10),
      'tool-tip': color('Black'),
      'tool-tip-text': color('White'),
      'overlay-tint': colorTint('Navy', 20),
      'overlay-tint-strong': colorTint('Navy', 60),
      'overlay-tint-heavy': colorTint('Navy', 80),
      'unread-tint': colorTint('DeprecatedAccent', 10), // manual fix
      'unread-tint-hover': colorTint('DeprecatedAccent', 20), // manual fix
      'badge-icon': color('White'),
      'badge-text': color('Black'),
      'chrome-ui': color('DeprecatedAccent'), // manual fix
      'chrome-ui-hover': color('DeprecatedAccent', 40), // manual fix
      'chrome-ui-pressed': color('DeprecatedAccent', 30), // manual fix
      'chrome-ui-focus': color('DeprecatedAccent'), // manual fix
      'chrome-ui-fg': color('Black'),
      'chrome-ui-fg-secondary': colorTint('Black', 80),
      'chrome-ui-fg-tertiary': colorTint('Black', 60),
      'chrome-ui-toggle': color('White'),
      'chrome-danger': color('Red', 30),
      'chrome-success': color('Green', 30),
      'chrome-education': color('Purple', 30),
      'chrome-blue': color('Blue', 30),
      'chrome-purple': color('Purple', 30),
      'chrome-pink': color('Pink', 30),
      'chrome-red': color('Red', 30),
      'chrome-orange': color('Orange', 30),
      'chrome-yellow': color('Yellow', 30),
      'chrome-green': color('Green', 30),
      'content-ui': color('Navy'),
      'content-ui-hover': color('Navy', 90),
      'content-ui-pressed': color('Navy', 80),
      'content-ui-focus': color('DeprecatedAccent'), // manual fix
      'content-ui-fg': color('White'),
      'content-ui-fg-secondary': color('Navy', 40),
      'content-ui-fg-tertiary': color('Navy', 60),
      'content-ui-toggle': color('White'),
      'content-danger': color('Red', 70),
      'content-success': color('Green', 70),
      'content-education': color('Purple', 70),
      'content-blue': color('Blue', 70),
      'content-purple': color('Purple', 70),
      'content-pink': color('Pink', 70),
      'content-red': color('Red', 70),
      'content-orange': color('Orange', 70),
      'content-yellow': color('Yellow', 70),
      'content-green': color('Green', 70),
      'color-ui': color('Black'),
      'color-ui-hover': colorTint('Black', 90),
      'color-ui-pressed': colorTint('Black', 80),
      'color-ui-focus': color('Black'),
      'color-ui-fg': color('White'),
      'color-ui-fg-secondary': color('Gray', 40),
      'color-ui-fg-tertiary': color('Gray', 60),
      'color-ui-toggle': color('White'),
      'image-ui': color('White'),
      'image-ui-hover': colorTint('White', 90),
      'image-ui-pressed': colorTint('White', 80),
      'image-ui-accent': color('White'),
      'image-ui-fg': color('Black'),
      'image-ui-fg-secondary': color('Navy', 60),
      'image-ui-fg-tertiary': color('Navy', 40),
      'image-ui-toggle': color('White'),
      danger: color('Red'),
      'danger-hover': color('Red', 60),
      'danger-pressed': color('Red', 70),
      'danger-tint': colorTint('Red', 10),
      'danger-tint-strong': colorTint('Red', 20),
      'danger-tint-heavy': colorTint('Red', 30),
      success: color('Green'),
      'success-hover': color('Green', 40),
      'success-pressed': color('Green', 30),
      'success-tint': colorTint('Green', 10),
      'success-tint-strong': colorTint('Green', 20),
      'success-tint-heavy': colorTint('Green', 30),
      education: color('Purple'),
      'education-hover': color('Purple', 40),
      'education-pressed': color('Purple', 30),
      'education-tint': colorTint('Purple', 10),
      'education-tint-strong': colorTint('Purple', 20),
      'education-tint-heavy': colorTint('Purple', 30),
      'brand-blue': color('Blue'),
      'brand-blue-hover': color('Blue', 40),
      'brand-blue-pressed': color('Blue', 30),
      'brand-blue-tint': colorTint('Blue', 10),
      'brand-blue-tint-strong': colorTint('Blue', 20),
      'brand-blue-tint-heavy': colorTint('Blue', 30),
      'brand-purple': color('Purple'),
      'brand-purple-hover': color('Purple', 40),
      'brand-purple-pressed': color('Purple', 30),
      'brand-purple-tint': colorTint('Purple', 10),
      'brand-purple-tint-strong': colorTint('Purple', 20),
      'brand-purple-tint-heavy': colorTint('Purple', 30),
      'brand-pink': color('Pink'),
      'brand-pink-hover': color('Pink', 40),
      'brand-pink-pressed': color('Pink', 30),
      'brand-pink-tint': colorTint('Pink', 10),
      'brand-pink-tint-strong': colorTint('Pink', 20),
      'brand-pink-tint-heavy': colorTint('Pink', 30),
      'brand-red': color('Red'),
      'brand-red-hover': color('Red', 40),
      'brand-red-pressed': color('Red', 30),
      'brand-red-tint': colorTint('Red', 10),
      'brand-red-tint-strong': colorTint('Red', 20),
      'brand-red-tint-heavy': colorTint('Red', 30),
      'brand-orange': color('Orange'),
      'brand-orange-hover': color('Orange', 40),
      'brand-orange-pressed': color('Orange', 30),
      'brand-orange-tint': colorTint('Orange', 10),
      'brand-orange-tint-strong': colorTint('Orange', 20),
      'brand-orange-tint-heavy': colorTint('Orange', 30),
      'brand-yellow': color('Yellow'),
      'brand-yellow-hover': color('Yellow', 40),
      'brand-yellow-pressed': color('Yellow', 30),
      'brand-yellow-tint': colorTint('Yellow', 10),
      'brand-yellow-tint-strong': colorTint('Yellow', 20),
      'brand-yellow-tint-heavy': colorTint('Yellow', 30),
      'brand-green': color('Green'),
      'brand-green-hover': color('Green', 40),
      'brand-green-pressed': color('Green', 30),
      'brand-green-tint': colorTint('Green', 10),
      'brand-green-tint-strong': colorTint('Green', 20),
      'brand-green-tint-heavy': colorTint('Green', 30)
    }
  : {};
