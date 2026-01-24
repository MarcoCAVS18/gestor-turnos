// src/hooks/useSharedWork.js

import ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useParams, useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** useAuth ***REMOVED*** from '../contexts/AuthContext';
import ***REMOVED*** getSharedWork, acceptSharedWork ***REMOVED*** from '../services/shareService';

export const useSharedWork = () => ***REMOVED***
  const ***REMOVED*** token ***REMOVED*** = useParams();
  const navigate = useNavigate();
  const ***REMOVED*** currentUser ***REMOVED*** = useAuth();
  const ***REMOVED*** reloadJobs ***REMOVED*** = useApp(); 
  
  const [sharedWork, setSharedWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => ***REMOVED***
    const loadSharedWork = async () => ***REMOVED***
      if (!token) ***REMOVED***
        setError('Invalid link token');
        setLoading(false);
        return;
      ***REMOVED***

      try ***REMOVED***
        
        const data = await getSharedWork(token);
        
        setSharedWork(data);
      ***REMOVED*** catch (err) ***REMOVED***
        setError(err.message || 'Error loading shared work');
      ***REMOVED*** finally ***REMOVED***
        setLoading(false);
      ***REMOVED***
    ***REMOVED***;

    loadSharedWork();
  ***REMOVED***, [token]);

  const addWork = async () => ***REMOVED***
    if (!sharedWork || !currentUser) ***REMOVED***
      setError('No work to add or user not authenticated');
      return;
    ***REMOVED***
    
    try ***REMOVED***
      setAdding(true);
      setError('');
            
      // Use the shareService function to add the work
      await acceptSharedWork(currentUser.uid, token);
            
      // Reload jobs in the context
      if (reloadJobs) ***REMOVED***
        await reloadJobs();
      ***REMOVED***
      
      // Navigate to the work list
      navigate('/works');
      
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error adding work: ' + err.message);
    ***REMOVED*** finally ***REMOVED***
      setAdding(false);
    ***REMOVED***
  ***REMOVED***;

  return ***REMOVED***
    sharedWork: sharedWork?.workData,
    loading,
    error,
    adding,
    addWork,
    tokenInfo: sharedWork
  ***REMOVED***;
***REMOVED***;