/** @see https://github.com/un-ts/eslint-plugin-import-x#readme */ import { importX } from 'eslint-plugin-import-x';
/** @see https://github.com/neostandard/neostandard#readme      */ import neostandard from 'neostandard';

export default [
  /**
   * Semistandard style guide.
   *
   * Includes the following plugins and makes them available for use:
   * - `@stylistic`
   * - `n`
   * - `promise`
   * - `react`
   * - `typescript-eslint`
   */
  ...neostandard({ env: ['browser', 'webextensions'], ignores: ['src/lib/**'], semi: true }),

  /**
   * Enable plugin `import-x` and use its recommended config.
   * @see https://github.com/un-ts/eslint-plugin-import-x/blob/master/src/config/flat/recommended.ts
   */
  importX.configs['flat/recommended'],

  /**
   * Prevent cyclical imports; enforce alphabetical imports.
   * @see https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-cycle.md
   * @see https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/order.md
   */
  {
    rules: {
      'import-x/no-cycle': 'error',
      'import-x/order': ['warn', { alphabetize: { order: 'asc', caseInsensitive: true } }],
    },
  },
];
