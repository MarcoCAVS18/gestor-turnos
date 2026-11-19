// src/components/ui/UpdateBanner/index.jsx
// Offers to load a new version of the web app once its service worker is
// installed. Applying it reloads the page; dismissing keeps the current version
// until the next launch.

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw, X } from 'lucide-react';
import { SW_UPDATE_EVENT, applyServiceWorkerUpdate } from '../../../serviceWorkerRegistration';

const UpdateBanner = () => {
  const { t } = useTranslation();
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    const onUpdate = (event) => setRegistration(event.detail);
    window.addEventListener(SW_UPDATE_EVENT, onUpdate);
    return () => window.removeEventListener(SW_UPDATE_EVENT, onUpdate);
  }, []);

  if (!registration) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md flex items-center gap-3 rounded-xl bg-slate-900/95 text-white text-sm px-4 py-3 shadow-lg"
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 6rem)' }}
    >
      <span className="flex-1">{t('update.available')}</span>
      <button
        type="button"
        onClick={() => applyServiceWorkerUpdate(registration)}
        className="flex items-center gap-1.5 rounded-lg bg-white text-slate-900 font-semibold px-3 py-1.5"
      >
        <RefreshCw size={14} aria-hidden="true" />
        {t('update.reload')}
      </button>
      <button
        type="button"
        onClick={() => setRegistration(null)}
        aria-label={t('update.dismiss')}
        className="p-1 rounded-lg text-white/70 hover:text-white"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
};

export default UpdateBanner;
