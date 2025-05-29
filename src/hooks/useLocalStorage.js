// src/hooks/useLocalStorage.js
import ***REMOVED*** useState, useEffect, useCallback ***REMOVED*** from 'react';

export const useLocalStorage = (key, initialValue) => ***REMOVED***
  const [storedValue, setStoredValue] = useState(() => ***REMOVED***
    try ***REMOVED***
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    ***REMOVED*** catch (error) ***REMOVED***
      console.error(`Error reading localStorage key "$***REMOVED***key***REMOVED***":`, error);
      return initialValue;
    ***REMOVED***
  ***REMOVED***);

  const setValue = useCallback((value) => ***REMOVED***
    try ***REMOVED***
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    ***REMOVED*** catch (error) ***REMOVED***
      console.error(`Error setting localStorage key "$***REMOVED***key***REMOVED***":`, error);
    ***REMOVED***
  ***REMOVED***, [key, storedValue]);

  const removeValue = useCallback(() => ***REMOVED***
    try ***REMOVED***
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    ***REMOVED*** catch (error) ***REMOVED***
      console.error(`Error removing localStorage key "$***REMOVED***key***REMOVED***":`, error);
    ***REMOVED***
  ***REMOVED***, [key, initialValue]);

  return [storedValue, setValue, removeValue];
***REMOVED***;