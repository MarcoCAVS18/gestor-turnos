// src/hooks/useIsMobile.js

import { useState, useEffect } from 'react';

/**
 * Hook personalizado para detectar si el dispositivo es móvil
 *
 * @param {number} breakpoint - Punto de corte en píxeles (default: 768)
 * @returns {boolean} - true si el ancho de la ventana es menor al breakpoint
 *
 * @example
 * const isMobile = useIsMobile(); // usa 768px por defecto
 * const isSmallScreen = useIsMobile(640); // usa 640px como breakpoint
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
