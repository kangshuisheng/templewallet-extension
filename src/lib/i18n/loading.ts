import browser from 'webextension-polyfill';

import { init } from './core';
import { saveLocale } from './saving';

const REFRESH_MSGTYPE = 'TEMPLE_I18N_REFRESH';

const initPromise = init();

browser.runtime.onMessage.addListener(msg => {
  if (msg?.type === REFRESH_MSGTYPE) {
    refresh();
  }
});

export function onInited(callback: () => void) {
  initPromise.then(callback);
}

export function updateLocale(locale: string) {
  saveLocale(locale);
  notifyOthers();
  refresh();
}

function notifyOthers() {
  browser.runtime.sendMessage({ type: REFRESH_MSGTYPE });
}

async function refresh() {
  window.location.reload();
}
