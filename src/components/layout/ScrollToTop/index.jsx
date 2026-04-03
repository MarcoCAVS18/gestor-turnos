// src/components/layout/ScrollToTop/index.jsx

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../../../utils/analytics';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Skip scroll-to-top when navigating with a hash anchor (e.g. /about#feedback)
    if (hash) return;
    window.scrollTo(0, 0);
    trackPageView(pathname, document.title);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
