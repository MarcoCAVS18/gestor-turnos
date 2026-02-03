// src/hooks/useLiveMode.js
// Hook for accessing Live Mode functionality

import { useLiveModeContext } from '../contexts/LiveModeContext';

export const useLiveMode = () => {
  const context = useLiveModeContext();

  if (!context) {
    throw new Error('useLiveMode must be used within a LiveModeProvider');
  }

  return context;
};

export default useLiveMode;
