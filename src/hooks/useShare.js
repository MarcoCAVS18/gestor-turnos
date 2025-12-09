// src/hooks/useShare.js

import ***REMOVED*** useState, useCallback ***REMOVED*** from 'react';
import ***REMOVED*** compartirTrabajoNativo ***REMOVED*** from '../services/shareService';
import ***REMOVED*** useAuth ***REMOVED*** from '../contexts/AuthContext';

export const useShare = () => ***REMOVED***
  const ***REMOVED*** currentUser ***REMOVED*** = useAuth();
  const [sharing, setSharing] = useState(***REMOVED******REMOVED***);
  const [messages, setMessages] = useState(***REMOVED******REMOVED***);

  const shareWork = useCallback(async (trabajo) => ***REMOVED***
    if (!currentUser || !trabajo) return;

    try ***REMOVED***
      setSharing(prev => (***REMOVED*** ...prev, [trabajo.id]: true ***REMOVED***));
      setMessages(prev => (***REMOVED*** ...prev, [trabajo.id]: '' ***REMOVED***));

      await compartirTrabajoNativo(currentUser.uid, trabajo);

    ***REMOVED*** catch (error) ***REMOVED***
      setMessages(prev => (***REMOVED***
        ...prev,
        [trabajo.id]: 'Error al compartir trabajo'
      ***REMOVED***));
      
      setTimeout(() => ***REMOVED***
        setMessages(prev => (***REMOVED*** ...prev, [trabajo.id]: '' ***REMOVED***));
      ***REMOVED***, 3000);
    ***REMOVED*** finally ***REMOVED***
      setSharing(prev => (***REMOVED*** ...prev, [trabajo.id]: false ***REMOVED***));
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  return ***REMOVED***
    sharing,
    messages,
    shareWork
  ***REMOVED***;
***REMOVED***;