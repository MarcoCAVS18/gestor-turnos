// src/App.js

import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import {
  scheduleReengagementNotifications,
  cancelReengagementNotifications,
} from './services/native/nativeNotifications';
import { AppProvider } from './contexts/AppContext';
import ProtectedLayout from './components/layout/ProtectedLayout/ProtectedLayout';
import { useAuth } from './contexts/AuthContext';
import SplashLoader from './components/other/SplashLoader';
import useModalManager from './hooks/useModalManager';
import './styles/animation.css';

import ScrollToTop from './components/layout/ScrollToTop/index.jsx';
import CookieConsent from './components/ui/CookieConsent';
import NativeSplash from './components/native/NativeSplash';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import { usePremium } from './contexts/PremiumContext';

// Landing — eager: it's the first page PageSpeed and most visitors see
import Landing from './pages/Landing';

// Everything else — lazy: only loaded when the user navigates to that route
const Login           = lazy(() => import('./pages/auth/Login'));
const Register        = lazy(() => import('./pages/auth/Register'));
const ForgotPassword  = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword   = lazy(() => import('./pages/auth/ResetPassword'));

const Australia88     = lazy(() => import('./pages/Australia88'));
const FAQ             = lazy(() => import('./pages/FAQ'));

const PrivacyPolicy   = lazy(() => import('./pages/legal/PrivacyPolicy'));
const TermsOfService  = lazy(() => import('./pages/legal/TermsOfService'));
const DeleteAccount   = lazy(() => import('./pages/legal/DeleteAccount'));
const ClearEverything = lazy(() => import('./pages/legal/ClearEverything'));

const NotFound        = lazy(() => import('./pages/NotFound'));
const ServerError     = lazy(() => import('./pages/ServerError'));

// Modals — lazy: only loaded when user opens them for the first time
const WorkModal       = lazy(() => import('./components/modals/work/WorkModal'));
const ShiftModal      = lazy(() => import('./components/modals/shift/ShiftModal'));
const PremiumModal    = lazy(() => import('./components/modals/premium/PremiumModal'));

// Protected pages
const Dashboard       = lazy(() => import('./pages/Dashboard'));
const Works           = lazy(() => import('./pages/Works'));
const Shifts          = lazy(() => import('./pages/Shifts'));
const StatisticsLayout   = lazy(() => import('./pages/StatisticsLayout'));
const Statistics         = lazy(() => import('./pages/Statistics'));
const StatisticsPayslips = lazy(() => import('./pages/StatisticsPayslips'));
const CalendarView    = lazy(() => import('./pages/CalendarView'));
const Settings        = lazy(() => import('./pages/Settings'));
const Integrations    = lazy(() => import('./pages/Integrations'));
const SharedWork      = lazy(() => import('./pages/SharedWork'));
const Premium         = lazy(() => import('./pages/Premium'));
const About           = lazy(() => import('./pages/About'));
const Support         = lazy(() => import('./pages/Support'));

// Public route that allows access without authentication
const PublicRoute = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return <SplashLoader />;
  }

  return children;
};

// General app layout
function AppLayout() {
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

  // min-h-dvh (dynamic viewport height) hace que el wrapper se ajuste cuando
  // la URL bar del navegador móvil se oculta. En standalone/PWA dvh = vh, no
  // afecta. Mantengo min-h-screen como fallback para browsers viejos.
  return (
    <div className="min-h-screen min-h-dvh bg-gray-100 dark:bg-slate-950 font-poppins transition-colors duration-300 md:flex md:h-screen md:min-h-0">
      {/* Header only on mobile */}
      <div className="md:hidden">
        <Header />
      </div>

      {/* Main content — Suspense here so ProtectedLayout's SplashLoader is never inside
          a Suspense boundary and never gets hidden when a lazy page chunk is loading */}
      <main
        className="max-w-md mx-auto px-4 md:max-w-none md:ml-72 md:px-6 md:pb-6 md:flex-1 md:overflow-y-auto md:h-screen"
        style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}
      >
        <Suspense fallback={null}>
          <Outlet context={{ openEditWorkModal, openEditShiftModal }} />
        </Suspense>
      </main>

      {/* Navigation */}
      <Navigation
        openNewWorkModal={openNewWorkModal}
        openNewShiftModal={openNewShiftModal}
      />

      {/* Modals are lazy — chunk loads on first open, fallback null avoids flash */}
      <Suspense fallback={null}>
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
        <PremiumModal
          isOpen={isPremiumModalOpen}
          onClose={closePremiumModal}
        />
      </Suspense>
    </div>
  );
}

// Main App
function App() {
  return (
    <>
      <NativeSplash />
      <CookieConsent />
      <Router>
      <ScrollToTop />
      <Routes>
        {/* Authentication */}
        <Route path="/login" element={<Suspense fallback={<SplashLoader />}><Login /></Suspense>} />
        <Route path="/register" element={<Suspense fallback={<SplashLoader />}><Register /></Suspense>} />
        <Route path="/forgot-password" element={<Suspense fallback={<SplashLoader />}><ForgotPassword /></Suspense>} />
        <Route path="/reset-password" element={<Suspense fallback={<SplashLoader />}><ResetPassword /></Suspense>} />


        {/* SPECIAL ROUTE for shared works - PUBLIC ACCESS */}
        <Route
          path="/share/:token"
          element={
            <PublicRoute>
              <AppProvider>
                <div className="min-h-screen bg-gray-100 dark:bg-slate-950 font-poppins transition-colors duration-300">
                  <main className="max-w-md mx-auto">
                    <Suspense fallback={<SplashLoader />}>
                      <SharedWork />
                    </Suspense>
                  </main>
                </div>
              </AppProvider>
            </PublicRoute>
          }
        />

        {/* Public legal pages — no auth required (accessible to Google/crawlers) */}
        <Route path="/privacy" element={<Suspense fallback={<SplashLoader />}><PrivacyPolicy /></Suspense>} />
        <Route path="/terms" element={<Suspense fallback={<SplashLoader />}><TermsOfService /></Suspense>} />

        {/* Public SEO landing pages */}
        <Route path="/australia-88" element={<Suspense fallback={<SplashLoader />}><Australia88 /></Suspense>} />
        <Route path="/faq" element={<Suspense fallback={<SplashLoader />}><FAQ /></Suspense>} />

        {/* Protected routes */}
        <Route element={<ProtectedLayout><AppLayout /></ProtectedLayout>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/works" element={<Works />} />
          <Route path="/shifts" element={<Shifts />} />
          <Route path="/statistics" element={<StatisticsLayout />}>
            <Route index element={<Statistics />} />
            <Route path="payslips" element={<StatisticsPayslips />} />
          </Route>
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
        <Route path="/error" element={<Suspense fallback={null}><ServerError /></Suspense>} />

        {/* Landing page — public, replaces old redirect */}
        <Route path="/" element={<Landing />} />
        {/* Localized landings — separate indexable URLs for international SEO */}
        <Route path="/es" element={<Landing lang="es" />} />
        <Route path="/fr" element={<Landing lang="fr" />} />
        <Route
          path="*"
          element={
            <AppProvider>
              <Suspense fallback={null}><NotFound /></Suspense>
            </AppProvider>
          }
        />
      </Routes>
    </Router>
    </>
  );
}

export default App;