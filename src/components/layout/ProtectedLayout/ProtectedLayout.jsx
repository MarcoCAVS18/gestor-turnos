// src/components/layout/ProtectedLayout/ProtectedLayout.jsx
import React from 'react';
import ***REMOVED*** Navigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useAuth ***REMOVED*** from '../../../contexts/AuthContext';
import ***REMOVED*** AppProvider ***REMOVED*** from '../../../contexts/AppContext';
import LoadingSpinner from '../../ui/LoadingSpinner/LoadingSpinner';

// NOTE: This component was copied from App.js.
// For a future refactor, it could be moved to its own file inside /components/auth.
const PrivateRoute = (***REMOVED*** children ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** currentUser, loading ***REMOVED*** = useAuth();

  if (loading) ***REMOVED***
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="h-12 w-12" color="border-pink-500" />
      </div>
    );
  ***REMOVED***

  return currentUser ? children : <Navigate to="/login" replace />;
***REMOVED***;

const ProtectedLayout = (***REMOVED*** children ***REMOVED***) => ***REMOVED***
  return (
    <PrivateRoute>
      <AppProvider>
        ***REMOVED***children***REMOVED***
      </AppProvider>
    </PrivateRoute>
  );
***REMOVED***;

export default ProtectedLayout;
