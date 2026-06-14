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

// Single gate that covers auth loading, config loading, and a minimum display
// time — ensures the GSAP animation always completes its first visible cycle.
const AuthAndConfigGate = ({ children }) => {
  const { currentUser, loading: authLoading, isLocked } = useAuth();
  const { loading: configLoading } = useConfigContext();
  const [minElapsed, setMinElapsed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinElapsed(true), MIN_SPLASH_MS);
    return () => clearTimeout(t);
  }, []);

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
