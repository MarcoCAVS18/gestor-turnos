// src/components/layout/ProtectedLayout/ProtectedLayout.jsx

import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { useAuth } from '../../../contexts/AuthContext';
import { useConfigContext } from '../../../contexts/ConfigContext';
import { AppProvider } from '../../../contexts/AppContext';
import SplashLoader from '../../other/SplashLoader';
import ShiftReminderSync from '../../native/ShiftReminderSync';

// Animation phases: 1.5s draw + 0.3s pause + 0.8s circles = 2.6s.
// We hold the splash a bit longer so the user sees the full sequence.
const MIN_SPLASH_MS = 2800;
const SPLASH_SEEN_KEY = 'orary_splash_seen';

// The full animation is held only on the very first launch. After that the app
// opens as soon as auth and config are ready: people open it several times a
// day to log a shift, and a forced 2.8 s wait every time is pure friction.
const getMinSplashMs = () => {
  try {
    return localStorage.getItem(SPLASH_SEEN_KEY) ? 0 : MIN_SPLASH_MS;
  } catch {
    return 0;
  }
};

// Single gate that covers auth loading, config loading, and (first launch only)
// a minimum display time so the GSAP animation completes its first cycle.
const AuthAndConfigGate = ({ children }) => {
  const { currentUser, loading: authLoading, isLocked } = useAuth();
  const { loading: configLoading } = useConfigContext();
  const [minSplashMs] = useState(getMinSplashMs);
  const [minElapsed, setMinElapsed] = useState(minSplashMs === 0);

  useEffect(() => {
    if (minSplashMs === 0) return undefined;
    const t = setTimeout(() => {
      setMinElapsed(true);
      try { localStorage.setItem(SPLASH_SEEN_KEY, '1'); } catch { /* storage blocked: harmless */ }
    }, minSplashMs);
    return () => clearTimeout(t);
  }, [minSplashMs]);

  if (authLoading || configLoading || !minElapsed) {
    if (Capacitor.isNativePlatform()) return null;
    return <SplashLoader />;
  }

  if (currentUser && isLocked) return <Navigate to="/login" replace />;
  return currentUser ? children : <Navigate to="/login" replace />;
};

const ProtectedLayout = ({ children }) => {
  return (
    <AppProvider>
      <ShiftReminderSync />
      <AuthAndConfigGate>
        {children}
      </AuthAndConfigGate>
    </AppProvider>
  );
};

export default ProtectedLayout;
