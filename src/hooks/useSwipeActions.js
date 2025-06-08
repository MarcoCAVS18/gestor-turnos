// src/hooks/useSwipeActions.js

import ***REMOVED*** useState, useRef, useCallback ***REMOVED*** from 'react';

export const useSwipeActions = (threshold = 80) => ***REMOVED***
  const [isOpen, setIsOpen] = useState(false);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(null);

  const handleTouchStart = useCallback((e) => ***REMOVED***
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  ***REMOVED***, []);

  const handleTouchMove = useCallback((e) => ***REMOVED***
    if (!isDragging || startX.current === null) return;

    const currentXPos = e.touches[0].clientX;
    const diffX = startX.current - currentXPos;

    if (diffX > 0) ***REMOVED***
      setCurrentX(Math.min(diffX, threshold));
    ***REMOVED*** else ***REMOVED***
      setCurrentX(0);
    ***REMOVED***
  ***REMOVED***, [isDragging, threshold]);

  const handleTouchEnd = useCallback(() => ***REMOVED***
    setIsDragging(false);

    if (currentX > threshold / 2) ***REMOVED***
      setIsOpen(true);
      setCurrentX(threshold);
    ***REMOVED*** else ***REMOVED***
      setIsOpen(false);
      setCurrentX(0);
    ***REMOVED***

    startX.current = null;
  ***REMOVED***, [currentX, threshold]);

  const closeSwipe = useCallback(() => ***REMOVED***
    setIsOpen(false);
    setCurrentX(0);
  ***REMOVED***, []);

  const openSwipe = useCallback(() => ***REMOVED***
    setIsOpen(true);
    setCurrentX(threshold);
  ***REMOVED***, [threshold]);

  return ***REMOVED***
    isOpen,
    currentX,
    isDragging,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    closeSwipe,
    openSwipe
  ***REMOVED***;
***REMOVED***;