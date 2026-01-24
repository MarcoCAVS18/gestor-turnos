// src/hooks/useIsMobile.js

import ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';

/**
 * Hook personalizado para detectar si el dispositivo es móvil
 *
 * @param ***REMOVED***number***REMOVED*** breakpoint - Punto de corte en píxeles (default: 768)
 * @returns ***REMOVED***boolean***REMOVED*** - true si el ancho de la ventana es menor al breakpoint
 *
 * @example
 * const isMobile = useIsMobile(); // usa 768px por defecto
 * const isSmallScreen = useIsMobile(640); // usa 640px como breakpoint
 */
export const useIsMobile = (breakpoint = 768) => ***REMOVED***
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => ***REMOVED***
    const checkMobile = () => ***REMOVED***
      setIsMobile(window.innerWidth < breakpoint);
    ***REMOVED***;

    checkMobile();

    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  ***REMOVED***, [breakpoint]);

  return isMobile;
***REMOVED***;
