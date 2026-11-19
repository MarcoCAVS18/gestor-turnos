// src/serviceWorkerRegistration.js
// Registers the service worker (see src/service-worker.js) on the production
// website only: not in development, not inside the Capacitor apps (they ship
// their files locally), and not during prerendering (scripts/prerender.js).
// When a new version is installed and waiting, fires the `orary:sw-update`
// window event with the registration; UpdateBanner offers to apply it.

import { Capacitor } from '@capacitor/core';
import logger from './utils/logger';

export const SW_UPDATE_EVENT = 'orary:sw-update';

const announce = (registration) => {
  window.dispatchEvent(new CustomEvent(SW_UPDATE_EVENT, { detail: registration }));
};

const shouldRegister = () =>
  process.env.NODE_ENV === 'production'
  && typeof window !== 'undefined'
  && 'serviceWorker' in navigator
  && window.isSecureContext
  && !Capacitor.isNativePlatform()
  && navigator.userAgent !== 'OraryPrerender';

export const registerServiceWorker = () => {
  if (!shouldRegister()) return;

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register(`${process.env.PUBLIC_URL || ''}/service-worker.js`);

      // A version already waiting from an earlier visit
      if (registration.waiting && navigator.serviceWorker.controller) announce(registration);

      registration.addEventListener('updatefound', () => {
        const installing = registration.installing;
        if (!installing) return;
        installing.addEventListener('statechange', () => {
          // installed + an existing controller = an update (not the first install)
          if (installing.state === 'installed' && navigator.serviceWorker.controller) announce(registration);
        });
      });

      // Look for a new release whenever the app comes back to the foreground
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') registration.update().catch(() => {});
      });
    } catch (err) {
      logger.warn('Service worker registration failed:', err);
    }
  });
};

/** Activates the waiting version and reloads once it takes control. */
export const applyServiceWorkerUpdate = (registration) => {
  if (!registration?.waiting) return;
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloaded) return;
    reloaded = true;
    window.location.reload();
  });
  registration.waiting.postMessage({ type: 'SKIP_WAITING' });
};
