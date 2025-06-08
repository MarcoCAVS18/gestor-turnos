// src/hooks/useDebug.js

import { useCallback } from 'react';

export const useDebug = () => {
  const isDebugMode = process.env.REACT_APP_DEBUG_MODE === 'true';
  const environment = process.env.REACT_APP_ENVIRONMENT || 'production';

  const debugLog = useCallback((...args) => {
    if (isDebugMode) {
    }
  }, [isDebugMode]);

  const debugWarn = useCallback((...args) => {
    if (isDebugMode) {
      console.warn('[DEBUG]', ...args);
    }
  }, [isDebugMode]);

  const debugError = useCallback((...args) => {
    if (isDebugMode) {
      console.error('[DEBUG]', ...args);
    }
  }, [isDebugMode]);

  const debugTable = useCallback((data) => {
    if (isDebugMode && console.table) {
      console.table(data);
    }
  }, [isDebugMode]);

  const debugTime = useCallback((label) => {
    if (isDebugMode) {
      console.time(label);
    }
  }, [isDebugMode]);

  const debugTimeEnd = useCallback((label) => {
    if (isDebugMode) {
      console.timeEnd(label);
    }
  }, [isDebugMode]);

  return {
    isDebugMode,
    environment,
    debugLog,
    debugWarn,
    debugError,
    debugTable,
    debugTime,
    debugTimeEnd
  };
};