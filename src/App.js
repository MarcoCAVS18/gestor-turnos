// src/App.js

import React from 'react';
import ***REMOVED*** BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useAuth ***REMOVED*** from './contexts/AuthContext';
import ***REMOVED*** AppProvider ***REMOVED*** from './contexts/AppContext';
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

// Main Components
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import Dashboard from './pages/Dashboard';
import Works from './pages/Works';
import Shifts from './pages/Shifts';
import Statistics from './pages/Statistics';
import CalendarView from './pages/CalendarView';
import Settings from './pages/Settings';
import SharedWork from './pages/SharedWork';

// Modals
import WorkModal from './components/modals/work/WorkModal';
import ShiftModal from './components/modals/shift/ShiftModal';

// Public route that allows access without authentication
const PublicRoute = (***REMOVED*** children ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** loading ***REMOVED*** = useAuth();

  if (loading) ***REMOVED***
    return (
      <Flex variant="center" className="h-screen">
        <LoadingSpinner size="h-12 w-12" color="border-pink-500" />
      </Flex>
    );
  ***REMOVED***

  return children;
***REMOVED***;

// General app layout
function AppLayout() ***REMOVED***
  const location = useLocation();
  const currentView = location.pathname.substring(1); // Removes leading '/'

  const ***REMOVED***
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
  ***REMOVED*** = useModalManager();

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      ***REMOVED***/* Header only on mobile */***REMOVED***
      <div className="md:hidden">
        <Header
          currentView=***REMOVED***currentView***REMOVED***
          openNewWorkModal=***REMOVED***openNewWorkModal***REMOVED***
          openNewShiftModal=***REMOVED***openNewShiftModal***REMOVED***
        />
      </div>

      ***REMOVED***/* Main content */***REMOVED***
      <main className="max-w-md mx-auto px-4 pb-20 md:max-w-none md:ml-72 md:px-6 md:pb-6">
        <Outlet context=***REMOVED******REMOVED*** openEditWorkModal, openEditShiftModal ***REMOVED******REMOVED*** />
      </main>

      ***REMOVED***/* Navigation */***REMOVED***
      <Navigation
        openNewWorkModal=***REMOVED***openNewWorkModal***REMOVED***
        openNewShiftModal=***REMOVED***openNewShiftModal***REMOVED***
      />

      <WorkModal
        isOpen=***REMOVED***isWorkModalOpen***REMOVED***
        onClose=***REMOVED***closeWorkModal***REMOVED***
        work=***REMOVED***selectedWork***REMOVED***
      />

      <ShiftModal
        isOpen=***REMOVED***isShiftModalOpen***REMOVED***
        onClose=***REMOVED***closeShiftModal***REMOVED***
        shift=***REMOVED***selectedShift***REMOVED***
      />
    </div>
  );
***REMOVED***

// Main App
function App() ***REMOVED***
  const ***REMOVED*** loading ***REMOVED*** = useAuth();

  if (loading) ***REMOVED***
    return (
      <Flex variant="center" className="h-screen">
        <LoadingSpinner size="h-12 w-12" color="border-pink-500" />
      </Flex>
    );
  ***REMOVED***

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        ***REMOVED***/* Authentication */***REMOVED***
        <Route path="/login" element=***REMOVED***<Login />***REMOVED*** />
        <Route path="/register" element=***REMOVED***<Register />***REMOVED*** />
        <Route path="/forgot-password" element=***REMOVED***<ForgotPassword />***REMOVED*** />
        <Route path="/reset-password" element=***REMOVED***<ResetPassword />***REMOVED*** />

        ***REMOVED***/* Legal Pages */***REMOVED***
        <Route path="/privacy" element=***REMOVED***<PrivacyPolicy />***REMOVED*** />
        <Route path="/terms" element=***REMOVED***<TermsOfService />***REMOVED*** />
        <Route path="/delete-account" element=***REMOVED***<DeleteAccount />***REMOVED*** />

        ***REMOVED***/* SPECIAL ROUTE for shared works - PUBLIC ACCESS */***REMOVED***
        <Route
          path="/share/:token"
          element=***REMOVED***
            <PublicRoute>
              <AppProvider>
                <div className="min-h-screen bg-gray-100 font-poppins">
                  <main className="max-w-md mx-auto">
                    <SharedWork />
                  </main>
                </div>
              </AppProvider>
            </PublicRoute>
          ***REMOVED***
        />

        ***REMOVED***/* Protected routes */***REMOVED***
        <Route element=***REMOVED***<ProtectedLayout><AppLayout /></ProtectedLayout>***REMOVED***>
          <Route path="/dashboard" element=***REMOVED***<Dashboard />***REMOVED*** />
          <Route path="/works" element=***REMOVED***<Works />***REMOVED*** />
          <Route path="/shifts" element=***REMOVED***<Shifts />***REMOVED*** />
          <Route path="/statistics" element=***REMOVED***<Statistics />***REMOVED*** />
          <Route path="/calendar" element=***REMOVED***<CalendarView />***REMOVED*** />
          <Route path="/settings" element=***REMOVED***<Settings />***REMOVED*** />
        </Route>

        ***REMOVED***/* Redirections */***REMOVED***
        <Route path="/" element=***REMOVED***<Navigate to="/dashboard" replace />***REMOVED*** />
        <Route path="*" element=***REMOVED***<Navigate to="/dashboard" replace />***REMOVED*** />
      </Routes>
    </Router>
  );
***REMOVED***

export default App;