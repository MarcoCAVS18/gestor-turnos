// src/hooks/useDebug.js

import ***REMOVED*** useCallback ***REMOVED*** from 'react';

export const useDebug = () => ***REMOVED***
  const isDebugMode = process.env.REACT_APP_DEBUG_MODE === 'true';
  const environment = process.env.REACT_APP_ENVIRONMENT || 'production';

  const debugLog = useCallback((...args) => ***REMOVED***
    if (isDebugMode) ***REMOVED***
    ***REMOVED***
  ***REMOVED***, [isDebugMode]);

  const debugWarn = useCallback((...args) => ***REMOVED***
    if (isDebugMode) ***REMOVED***
      console.warn('[DEBUG]', ...args);
    ***REMOVED***
  ***REMOVED***, [isDebugMode]);

  const debugError = useCallback((...args) => ***REMOVED***
    if (isDebugMode) ***REMOVED***
      console.error('[DEBUG]', ...args);
    ***REMOVED***
  ***REMOVED***, [isDebugMode]);

  const debugTable = useCallback((data) => ***REMOVED***
    if (isDebugMode && console.table) ***REMOVED***
      console.table(data);
    ***REMOVED***
  ***REMOVED***, [isDebugMode]);

  const debugTime = useCallback((label) => ***REMOVED***
    if (isDebugMode) ***REMOVED***
      console.time(label);
    ***REMOVED***
  ***REMOVED***, [isDebugMode]);

  const debugTimeEnd = useCallback((label) => ***REMOVED***
    if (isDebugMode) ***REMOVED***
      console.timeEnd(label);
    ***REMOVED***
  ***REMOVED***, [isDebugMode]);

  return ***REMOVED***
    isDebugMode,
    environment,
    debugLog,
    debugWarn,
    debugError,
    debugTable,
    debugTime,
    debugTimeEnd
  ***REMOVED***;
***REMOVED***;