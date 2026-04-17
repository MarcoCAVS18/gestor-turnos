// ga-consent.js
// Google Analytics consent initialisation — loaded as a deferred external script
// so that Content-Security-Policy can remove 'unsafe-inline' from script-src.
// The GA Measurement ID is read from <meta name="ga-id"> set in index.html,
// which allows CRA's %REACT_APP_GA_ID% substitution without embedding the ID here.

(function () {
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }

  // Set consent defaults before any GA event fires.
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    wait_for_update: 2000,
  });

  var gaId = (document.querySelector('meta[name="ga-id"]') || {}).content;

  window.loadGA = function () {
    if (window._gaLoaded || !gaId) return;
    window._gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + gaId;
    document.head.appendChild(s);
    s.onload = function () {
      gtag('js', new Date());
      gtag('config', gaId);
      gtag('consent', 'update', { analytics_storage: 'granted' });
    };
  };

  if (localStorage.getItem('orary_cookie_consent') === 'accepted') {
    window.loadGA();
  }
})();
