// src/components/layout/ScrollToTop/index.jsx

import ***REMOVED*** useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useLocation ***REMOVED*** from 'react-router-dom';

const ScrollToTop = () => ***REMOVED***
  const ***REMOVED*** pathname ***REMOVED*** = useLocation();

  useEffect(() => ***REMOVED***
    window.scrollTo(0, 0);
  ***REMOVED***, [pathname]);

  return null;
***REMOVED***;

export default ScrollToTop;
