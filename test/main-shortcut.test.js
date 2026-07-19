import assert from 'node:assert/strict';
import test from 'node:test';

test('intercepts Shift+P when a custom palette is selected', async () => {
  const eventListeners = new Map();
  let storageChangedListener;
  const storage = {
    currentPalette: 'palette:custom:1',
    'palette:custom:1': { background: '#fff' }
  };

  globalThis.window = {
    addEventListener (type, listener, options) {
      eventListeners.set(type, { listener, options });
    }
  };
  globalThis.document = {
    createElement () {
      return {};
    },
    documentElement: {
      append () {},
      style: {
        removeProperty () {},
        setProperty () {}
      }
    },
    head: {
      querySelectorAll () {
        return [];
      }
    },
    readyState: 'complete',
    getElementById () {
      return null;
    }
  };
  globalThis.MutationObserver = class {
    observe () {}
  };
  globalThis.fetch = async url => ({
    json: async () => url.endsWith('/palette_system_data.json') ? {} : {}
  });
  globalThis.browser = {
    runtime: {
      getURL: path => new URL(`../src${path}`, import.meta.url).href
    },
    storage: {
      local: {
        async get (key) {
          return { [key]: storage[key] };
        },
        onChanged: {
          addListener (listener) {
            storageChangedListener = listener;
          }
        }
      }
    }
  };

  await import('../src/main.js');
  await new Promise(resolve => setImmediate(resolve));

  const keydown = eventListeners.get('keydown');
  assert.equal(typeof keydown?.listener, 'function', 'registers a keydown listener');
  assert.equal(keydown.options, true, 'registers the listener during capture');

  let prevented = false;
  let propagationStopped = false;
  keydown.listener({
    key: 'P',
    shiftKey: true,
    preventDefault () {
      prevented = true;
    },
    stopImmediatePropagation () {
      propagationStopped = true;
    }
  });

  assert.equal(prevented, true, 'prevents Tumblr from handling the shortcut');
  assert.equal(propagationStopped, true, 'stops Tumblr keyboard listeners');

  storage.currentPalette = '';
  storageChangedListener({ currentPalette: { oldValue: 'palette:custom:1', newValue: '' } });
  prevented = false;
  propagationStopped = false;
  keydown.listener({
    key: 'P',
    shiftKey: true,
    preventDefault () {
      prevented = true;
    },
    stopImmediatePropagation () {
      propagationStopped = true;
    }
  });

  assert.equal(prevented, false, 'leaves the shortcut enabled without an override');
  assert.equal(propagationStopped, false, 'leaves Tumblr keyboard listeners enabled');
});
