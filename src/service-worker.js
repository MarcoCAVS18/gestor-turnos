/* eslint-disable no-restricted-globals */
// src/service-worker.js
// Built by react-scripts (Workbox InjectManifest) into build/service-worker.js.
// Purpose: the web app opens without a connection. Shift data itself is already
// kept offline by Firestore's persistent cache; this caches the app shell.
//
// - Every versioned JS/CSS file of the build is precached (~1.8 MB compressed,
//   downloaded once per release; unchanged files are not re-downloaded).
// - Page navigations go to the network first so deploys and the prerendered
//   SEO pages stay fresh; without a connection the precached app shell
//   (index.html) is served and React Router renders the route.
// - Static files from public/ (images, icons, the pdf.js worker, OCR assets)
//   are cached the first time they are used.
// - A new version waits until the user accepts it (UpdateBanner), so an open
//   tab never loses the chunks it was built with.

import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches, matchPrecache } from 'workbox-precaching';
import { registerRoute, setCatchHandler } from 'workbox-routing';
import { NetworkOnly, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

const sameOrigin = (url) => url.origin === self.location.origin;

// Firebase Auth's redirect handler and the ICS calendar feed are not app pages.
const NOT_APP_PAGES = [/^\/__\//, /^\/cal(\/|$)/];

registerRoute(
  ({ request, url }) => request.mode === 'navigate' && sameOrigin(url)
    && !NOT_APP_PAGES.some((re) => re.test(url.pathname)),
  new NetworkOnly({ networkTimeoutSeconds: 5 })
);

registerRoute(
  ({ url }) => sameOrigin(url) && (url.pathname.startsWith('/tesseract/') || url.pathname === '/pdf.worker.min.js'),
  new CacheFirst({
    cacheName: 'orary-ocr',
    plugins: [new ExpirationPlugin({ maxEntries: 10 })],
  })
);

registerRoute(
  ({ request, url }) => sameOrigin(url)
    && (url.pathname.startsWith('/assets/') || ['image', 'font', 'manifest'].includes(request.destination)),
  new StaleWhileRevalidate({
    cacheName: 'orary-static',
    plugins: [new ExpirationPlugin({ maxEntries: 120, maxAgeSeconds: 30 * 24 * 60 * 60 })],
  })
);

// Offline (or timed out) navigation: serve the precached app shell.
setCatchHandler(async ({ request }) => {
  if (request.mode === 'navigate') {
    return (await matchPrecache('/index.html')) || Response.error();
  }
  return Response.error();
});

// Sent by UpdateBanner when the user accepts the new version.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
