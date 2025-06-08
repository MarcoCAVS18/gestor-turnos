// src/hooks/useSwipeActions.js

import { useState, useRef, useCallback } from 'react';

export const useSwipeActions = (threshold = 80) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(null);

  const handleTouchStart = useCallback((e) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || startX.current === null) return;

    const currentXPos = e.touches[0].clientX;
    const diffX = startX.current - currentXPos;

    if (diffX > 0) {
      setCurrentX(Math.min(diffX, threshold));
    } else {
      setCurrentX(0);
    }
  }, [isDragging, threshold]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);

    if (currentX > threshold / 2) {
      setIsOpen(true);
      setCurrentX(threshold);
    } else {
      setIsOpen(false);
      setCurrentX(0);
    }

    startX.current = null;
  }, [currentX, threshold]);

  const closeSwipe = useCallback(() => {
    setIsOpen(false);
    setCurrentX(0);
  }, []);

  const openSwipe = useCallback(() => {
    setIsOpen(true);
    setCurrentX(threshold);
  }, [threshold]);

  return {
    isOpen,
    currentX,
    isDragging,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    closeSwipe,
    openSwipe
  };
};