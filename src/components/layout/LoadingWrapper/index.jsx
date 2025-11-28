// src/components/layout/LoadingWrapper/index.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import Loader from '../../other/Loader';
import ***REMOVED*** useIsMobile ***REMOVED*** from '../../../hooks/useIsMobile';

const LoadingWrapper = (***REMOVED***
  loading,
  delay = 3000,
  children,
  className = ''
***REMOVED***) => ***REMOVED***
  const [showLoading, setShowLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => ***REMOVED***
    let timer;
    
    if (loading) ***REMOVED***
      setShowLoading(true);
    ***REMOVED*** else ***REMOVED***
      timer = setTimeout(() => ***REMOVED***
        setShowLoading(false);
      ***REMOVED***, delay);
    ***REMOVED***
    
    return () => ***REMOVED***
      if (timer) clearTimeout(timer);
    ***REMOVED***;
  ***REMOVED***, [loading, delay]);

  if (showLoading) ***REMOVED***
    return (
      <div className=***REMOVED***`
        flex justify-center items-center 
        $***REMOVED***isMobile ? 'h-screen pb-24 pt-16' : 'h-screen'***REMOVED*** 
        $***REMOVED***className***REMOVED***
      `***REMOVED***>
        <Loader fullScreen=***REMOVED***false***REMOVED*** />
      </div>
    );
  ***REMOVED***

  return children;
***REMOVED***;

export default LoadingWrapper;