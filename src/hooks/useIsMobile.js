// src/hooks/useIsMobile.js

import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the viewport is mobile-sized
 *
 * @param {number} breakpoint - Width breakpoint in pixels (default: 768)
 * @returns {boolean} - true if window width is below the breakpoint
 *
 * @example
 * const isMobile = useIsMobile(); // uses 768px by default
 * const isSmallScreen = useIsMobile(640); // uses 640px as breakpoint
 */
export const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkMobile();

    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
};
