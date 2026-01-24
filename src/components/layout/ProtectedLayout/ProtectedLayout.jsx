// src/components/layout/ProtectedLayout/ProtectedLayout.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { AppProvider } from '../../../contexts/AppContext';
import LoadingSpinner from '../../ui/LoadingSpinner/LoadingSpinner';
import Flex from '../../ui/Flex';

// NOTE: This component was copied from App.js.
// For a future refactor, it could be moved to its own file inside /components/auth.
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <Flex variant="center" className="h-screen">
        <LoadingSpinner size="h-12 w-12" color="border-pink-500" />
      </Flex>
    );
  }

  return currentUser ? children : <Navigate to="/login" replace />;
};

const ProtectedLayout = ({ children }) => {
  return (
    <PrivateRoute>
      <AppProvider>
        {children}
      </AppProvider>
    </PrivateRoute>
  );
};

export default ProtectedLayout;
