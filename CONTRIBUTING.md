### Prerequisites

1. [Download and install Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) for your platform
2. [Install editorconfig](https://editorconfig.org/#download) for your favourite text editor

### Setup

1. Fork this repository
2. Clone your fork locally
3. In your local copy, install the project dependencies with **`npm install`**

### Development

Load your clone's `src/` directory as a temporary addon:
- Firefox: [Loading a temporary extension](https://firefox-source-docs.mozilla.org/devtools-user/about_colon_debugging/index.html#extensions)
- Chromium: [Load an unpacked extension](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked)

If you make changes, be sure to reload the temporary addon.

### CLI reference

- **`npm start`**: Run your local copy of the addon (see [`web-ext run`](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/#web-ext-run)).
- **`npm test`**: Runs all linters. Will report any syntax or style errors.
- **`npm test --ignore-scripts`**: Runs only the addon linter. Only reports syntax and WebExtension API errors.
- **`npm run autofix`**: Automatically fixes any style errors.
- **`npm run build`**: Creates an unsigned ZIP of the addon.
