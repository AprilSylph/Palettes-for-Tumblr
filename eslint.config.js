import neostandard, { plugins } from 'neostandard';

export default [
  /**
   * Semistandard style guide, via neostandard package.
   * @see https://github.com/neostandard/neostandard?tab=readme-ov-file#readme
   *
   * Includes the following plugins and makes them available for use:
   * - `@stylistic`
   * - `import-x`
   * - `n`
   * - `promise`
   * - `react`
   * - `typescript-eslint`
   */
  ...neostandard({
    env: ['browser', 'jquery', 'webextensions'],
    ignores: ['src/lib/**'],
    semi: true,
  }),

  /**
   * Use recommended `import-x` lint rules. Additionally, prevent cyclical imports.
   * @see https://github.com/un-ts/eslint-plugin-import-x/blob/master/src/config/flat/recommended.ts
   * @see https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-cycle.md
   */
  { rules: { ...plugins['import-x'].flatConfigs.recommended.rules, 'import-x/no-cycle': 'error' } },
];
