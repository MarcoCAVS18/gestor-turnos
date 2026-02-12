// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import ProtectedLayout from './components/layout/ProtectedLayout/ProtectedLayout';
import LoadingSpinner from './components/ui/LoadingSpinner/LoadingSpinner';
import Flex from './components/ui/Flex';
import useModalManager from './hooks/useModalManager';
import './styles/animation.css';

// Auth Components
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ScrollToTop from './components/layout/ScrollToTop/index.jsx';

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
import Dashboard from './pages/Dashboard';
import Works from './pages/Works';
import Shifts from './pages/Shifts';
import Statistics from './pages/Statistics';
import CalendarView from './pages/CalendarView';
import Settings from './pages/Settings';
import Integrations from './pages/Integrations';
import SharedWork from './pages/SharedWork';
import Premium from './pages/Premium';
import About from './pages/About';

// Modals
import WorkModal from './components/modals/work/WorkModal';
import ShiftModal from './components/modals/shift/ShiftModal';

// Public route that allows access without authentication
const PublicRoute = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Flex variant="center" className="h-screen">
        <LoadingSpinner size="h-12 w-12" color="border-pink-500" />
      </Flex>
    );
  }

  return children;
};

// General app layout
function AppLayout() {
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

  return (
    <div className="min-h-screen h-screen bg-gray-100 dark:bg-slate-950 font-poppins transition-colors duration-300 md:flex">
      {/* Header only on mobile */}
      <div className="md:hidden">
        <Header />
      </div>

      {/* Main content */}
      <main className="max-w-md mx-auto px-4 pb-20 md:max-w-none md:ml-72 md:px-6 md:pb-6 md:flex-1 md:overflow-y-auto md:h-screen">
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
    </div>
  );
}

// Main App
function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Flex variant="center" className="h-screen">
        <LoadingSpinner size="h-12 w-12" color="border-pink-500" />
      </Flex>
    );
  }

  return (
    <Router>
      <ScrollToTop />
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
          {/* Legal Pages */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/delete-account" element={<DeleteAccount />} />
          <Route path="/clear-everything" element={<ClearEverything />} />
        </Route>

        {/* Error Pages */}
        <Route path="/error" element={<ServerError />} />

        {/* Redirections */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="*"
          element={
            <AppProvider>
              <NotFound />
            </AppProvider>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;