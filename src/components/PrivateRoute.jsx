
// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Componente para rutas que requieren autenticación
const PrivateRoute = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // Mostrar indicador de carga mientras se verifica la autenticación
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-t-4 border-gray-200 border-t-pink-600 animate-spin"></div>
      </div>
    );
  }

  // Si no hay usuario autenticado, redirigir a login
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
