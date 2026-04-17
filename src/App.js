// src/App.js

import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { useAuth } from './contexts/AuthContext';
import {
  scheduleReengagementNotifications,
  cancelReengagementNotifications,
} from './services/native/nativeNotifications';
import { AppProvider } from './contexts/AppContext';
import { useConfigContext } from './contexts/ConfigContext';
import ProtectedLayout from './components/layout/ProtectedLayout/ProtectedLayout';
import Loader from './components/other/Loader';
import useModalManager from './hooks/useModalManager';
import './styles/animation.css';

// Auth Components
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ScrollToTop from './components/layout/ScrollToTop/index.jsx';
import CookieConsent from './components/ui/CookieConsent';

// Landing page
import Landing from './pages/Landing';

// Public SEO pages
import Australia88 from './pages/Australia88';
import FAQ from './pages/FAQ';

// Native
import NativeSplash from './components/native/NativeSplash';

// Legal Pages
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import DeleteAccount from './pages/legal/DeleteAccount';
import ClearEverything from './pages/legal/ClearEverything';

// Error Pages
import NotFound from './pages/NotFound';
import ServerError from './pages/ServerError';

// Main Components
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';

// Modals
import WorkModal from './components/modals/work/WorkModal';
import ShiftModal from './components/modals/shift/ShiftModal';
import PremiumModal from './components/modals/premium/PremiumModal';
import { usePremium } from './contexts/PremiumContext';

// Lazy-loaded pages (route-based code splitting)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Works = lazy(() => import('./pages/Works'));
const Shifts = lazy(() => import('./pages/Shifts'));
const Statistics = lazy(() => import('./pages/Statistics'));
const CalendarView = lazy(() => import('./pages/CalendarView'));
const Settings = lazy(() => import('./pages/Settings'));
const Integrations = lazy(() => import('./pages/Integrations'));
const SharedWork = lazy(() => import('./pages/SharedWork'));
const Premium = lazy(() => import('./pages/Premium'));
const About = lazy(() => import('./pages/About'));
const Support = lazy(() => import('./pages/Support'));

// Context-free fallback used before AppProvider mounts (Suspense, auth loading)
const AppLoader = () => (
  <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
    <img src="/assets/SVG/logo.svg" alt="Orary" style={{ width: 80, height: 80, opacity: 0.9 }} />
  </div>
);

// Public route that allows access without authentication
const PublicRoute = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return <AppLoader />;
  }

  return children;
};

// General app layout
function AppLayout() {
  const { loading: configLoading } = useConfigContext();

  // Re-engagement notifications: every time the authenticated user opens the app,
  // cancel any pending notifications and reschedule them starting from now.
  // This resets the 7-day clock so users only get notifications when truly inactive.
  useEffect(() => {
    const resetNotifications = async () => {
      await cancelReengagementNotifications();
      await scheduleReengagementNotifications(new Date());
    };
    resetNotifications();
  }, []);
  const { isPremiumModalOpen, closePremiumModal } = usePremium();
  const {
    isWorkModalOpen,
    isShiftModalOpen,
    selectedWork,
    selectedShift,
    openNewWorkModal,
    openNewShiftModal,
    openEditWorkModal,
    openEditShiftModal,
    closeWorkModal,
    closeShiftModal,
  } = useModalManager();

  // Show loader until user config (color, theme) is fully loaded.
  // En nativo NativeSplash ya cubre este tiempo — no mostrar Loader duplicado.
  if (configLoading) {
    if (Capacitor.isNativePlatform()) return null;
    return (
      <div className="min-h-screen h-screen bg-gray-100 dark:bg-slate-950 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 font-poppins transition-colors duration-300 md:flex md:h-screen">
      {/* Header only on mobile */}
      <div className="md:hidden">
        <Header />
      </div>

      {/* Main content */}
      <main
        className="max-w-md mx-auto px-4 md:max-w-none md:ml-72 md:px-6 md:pb-6 md:flex-1 md:overflow-y-auto md:h-screen"
        style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}
      >
        <Outlet context={{ openEditWorkModal, openEditShiftModal }} />
      </main>

      {/* Navigation */}
      <Navigation
        openNewWorkModal={openNewWorkModal}
        openNewShiftModal={openNewShiftModal}
      />

      <WorkModal
        isOpen={isWorkModalOpen}
        onClose={closeWorkModal}
        work={selectedWork}
      />

      <ShiftModal
        isOpen={isShiftModalOpen}
        onClose={closeShiftModal}
        shift={selectedShift}
      />

      {/* Global premium modal — triggered by LockedFeatureCard and other components */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={closePremiumModal}
      />
    </div>
  );
}

// Main App
function App() {
  const { loading } = useAuth();

  // NativeSplash siempre monta primero (se descarta sola en web).
  // En nativo cubre el spinner mientras auth/config cargan.
  return (
    <>
      <NativeSplash />
      <CookieConsent />
      {loading ? (
        // Web: loader visible. En nativo queda tapado bajo NativeSplash (z-9999).
        <AppLoader />
      ) : (
      <Router>
      <ScrollToTop />
      <Suspense fallback={<AppLoader />}>
      <Routes>
        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />


        {/* SPECIAL ROUTE for shared works - PUBLIC ACCESS */}
        <Route
          path="/share/:token"
          element={
            <PublicRoute>
              <AppProvider>
                <div className="min-h-screen bg-gray-100 dark:bg-slate-950 font-poppins transition-colors duration-300">
                  <main className="max-w-md mx-auto">
                    <SharedWork />
                  </main>
                </div>
              </AppProvider>
            </PublicRoute>
          }
        />

        {/* Public legal pages — no auth required (accessible to Google/crawlers) */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* Public SEO landing pages */}
        <Route path="/australia-88" element={<Australia88 />} />
        <Route path="/faq" element={<FAQ />} />

        {/* Protected routes */}
        <Route element={<ProtectedLayout><AppLayout /></ProtectedLayout>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/works" element={<Works />} />
          <Route path="/shifts" element={<Shifts />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          {/* Legal Pages (also in settings) */}
          <Route path="/delete-account" element={<DeleteAccount />} />
          <Route path="/clear-everything" element={<ClearEverything />} />
        </Route>

        {/* Error Pages */}
        <Route path="/error" element={<ServerError />} />

        {/* Landing page — public, replaces old redirect */}
        <Route path="/" element={<Landing />} />
        <Route
          path="*"
          element={
            <AppProvider>
              <NotFound />
            </AppProvider>
          }
        />
      </Routes>
      </Suspense>
    </Router>
      )}
    </>
  );
}

export default App;