
// src/components/PrivateRoute.jsx

import React from 'react';
import ***REMOVED*** Navigate, Outlet ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useAuth ***REMOVED*** from '../contexts/AuthContext';

// Componente para rutas que requieren autenticación
const PrivateRoute = () => ***REMOVED***
  const ***REMOVED*** currentUser, loading ***REMOVED*** = useAuth();

  if (loading) ***REMOVED***
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-t-4 border-gray-200 border-t-pink-600 animate-spin"></div>
      </div>
    );
  ***REMOVED***

  // Si no hay usuario autenticado, redirigir a login
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
***REMOVED***;

export default PrivateRoute;
