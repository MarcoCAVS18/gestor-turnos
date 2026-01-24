// src/hooks/useShare.js

import ***REMOVED*** useState, useCallback ***REMOVED*** from 'react';
import ***REMOVED*** shareWorkNative ***REMOVED*** from '../services/shareService';
import ***REMOVED*** useAuth ***REMOVED*** from '../contexts/AuthContext';

export const useShare = () => ***REMOVED***
  const ***REMOVED*** currentUser ***REMOVED*** = useAuth();
  const [sharing, setSharing] = useState(***REMOVED******REMOVED***);
  const [messages, setMessages] = useState(***REMOVED******REMOVED***);

  const shareWork = useCallback(async (work) => ***REMOVED***
    if (!currentUser || !work) return;

    try ***REMOVED***
      setSharing(prev => (***REMOVED*** ...prev, [work.id]: true ***REMOVED***));
      setMessages(prev => (***REMOVED*** ...prev, [work.id]: '' ***REMOVED***));

      await shareWorkNative(currentUser.uid, work);

    ***REMOVED*** catch (error) ***REMOVED***
      setMessages(prev => (***REMOVED***
        ...prev,
        [work.id]: 'Error sharing work'
      ***REMOVED***));
      
      setTimeout(() => ***REMOVED***
        setMessages(prev => (***REMOVED*** ...prev, [work.id]: '' ***REMOVED***));
      ***REMOVED***, 3000);
    ***REMOVED*** finally ***REMOVED***
      setSharing(prev => (***REMOVED*** ...prev, [work.id]: false ***REMOVED***));
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  return ***REMOVED***
    sharing,
    messages,
    shareWork
  ***REMOVED***;
***REMOVED***;