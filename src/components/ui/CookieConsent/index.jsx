// src/components/ui/CookieConsent/index.jsx
// GDPR / Australian Privacy Act compliant cookie consent banner.
// Renders a bottom banner on first visit.
// Stores decision in localStorage key "orary_cookie_consent" = "accepted" | "declined".
// Calls window.loadGA() on acceptance to initialise Google Analytics.

import React, { useState, useEffect } from 'react';

const CONSENT_KEY = 'orary_cookie_consent';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      // Small delay so the banner doesn't flash on first paint
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
    if (typeof window.loadGA === 'function') window.loadGA();
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: '#1e293b',
        borderTop: '1px solid #334155',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.3)',
        // Above native navigation bars on mobile
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
      }}
    >
      <p style={{ color: '#cbd5e1', fontSize: '0.8125rem', lineHeight: 1.5, flex: 1, minWidth: 200, margin: 0 }}>
        We use cookies to improve your experience and analyse traffic.{' '}
        <a href="/privacy" style={{ color: '#f472b6', textDecoration: 'underline' }}>Privacy Policy</a>
      </p>
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={decline}
          style={{
            background: 'transparent',
            border: '1px solid #475569',
            color: '#94a3b8',
            padding: '7px 14px',
            borderRadius: '8px',
            fontSize: '0.8125rem',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Decline
        </button>
        <button
          onClick={accept}
          style={{
            background: '#db2777', // pink-600: 4.6:1 contrast with white (WCAG AA)
            border: 'none',
            color: '#fff',
            padding: '7px 16px',
            borderRadius: '8px',
            fontSize: '0.8125rem',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
