// src/components/ui/OfflineBanner/index.jsx
// Shown while the device has no connection. With Firestore's persistent cache,
// shifts logged offline are kept on the device and synced when it reconnects.

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WifiOff } from 'lucide-react';

const isOffline = () => typeof navigator !== 'undefined' && navigator.onLine === false;

const OfflineBanner = () => {
  const { t } = useTranslation();
  const [offline, setOffline] = useState(isOffline);

  useEffect(() => {
    const update = () => setOffline(isOffline());
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md flex items-start gap-2 rounded-xl bg-slate-900/95 text-white text-sm px-4 py-3 shadow-lg"
      style={{ top: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
    >
      <WifiOff size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>{t('offline.banner')}</span>
    </div>
  );
};

export default OfflineBanner;
