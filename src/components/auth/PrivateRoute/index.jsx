// src/components/auth/PrivateRoute/index.jsx
import React from 'react';
import ***REMOVED*** Navigate, Outlet ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useAuth ***REMOVED*** from '../../../contexts/AuthContext';
import Loader from '../../other/Loader';

const PrivateRoute = () => ***REMOVED***
  const ***REMOVED*** currentUser, loading ***REMOVED*** = useAuth();

  if (loading) ***REMOVED***
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader size=***REMOVED***60***REMOVED*** />
      </div>
    );
  ***REMOVED***

  return currentUser ? <Outlet /> : <Navigate to="/login" />;
***REMOVED***;

export default PrivateRoute;