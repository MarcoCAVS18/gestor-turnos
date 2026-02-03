// src/hooks/useLiveModeTimer.js
// Hook for Live Mode timer utilities

import { useState, useEffect, useRef, useCallback } from 'react';

// Constants
const NOTIFICATION_HOURS = 12;
const AUTO_CLOSE_HOURS = 24;

export const useLiveModeTimer = (session, onNotification, onAutoClose) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [elapsedHours, setElapsedHours] = useState(0);
  const timerRef = useRef(null);
  const notificationSentRef = useRef(false);
  const autoCloseTriggeredRef = useRef(false);

  // Calculate elapsed time
  const calculateElapsed = useCallback(() => {
    if (!session || !session.startedAt) return 0;

    const now = new Date();
    const start = session.startedAt instanceof Date
      ? session.startedAt
      : new Date(session.startedAt);

    let elapsed = now.getTime() - start.getTime();

    // Subtract total pause duration
    elapsed -= (session.totalPauseDuration || 0);

    // If currently paused, subtract current pause duration
    if (session.status === 'paused' && session.pausedAt) {
      const pauseStart = session.pausedAt instanceof Date
        ? session.pausedAt
        : new Date(session.pausedAt);
      elapsed -= (now.getTime() - pauseStart.getTime());
    }

    return Math.max(0, elapsed);
  }, [session]);

  // Timer effect
  useEffect(() => {
    if (!session || session.status === 'completed') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setElapsedTime(0);
      setElapsedHours(0);
      return;
    }

    const updateTimer = () => {
      const elapsed = calculateElapsed();
      const hours = elapsed / (1000 * 60 * 60);

      setElapsedTime(elapsed);
      setElapsedHours(hours);

      // 12h notification
      if (hours >= NOTIFICATION_HOURS && !notificationSentRef.current) {
        notificationSentRef.current = true;
        onNotification?.();
      }

      // 24h auto-close
      if (hours >= AUTO_CLOSE_HOURS && !autoCloseTriggeredRef.current) {
        autoCloseTriggeredRef.current = true;
        onAutoClose?.();
      }
    };

    // Reset refs when session changes
    notificationSentRef.current = false;
    autoCloseTriggeredRef.current = false;

    // Initial update
    updateTimer();

    // Set up interval
    timerRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [session, calculateElapsed, onNotification, onAutoClose]);

  // Format time as HH:MM:SS
  const formatTime = useCallback((ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours,
      minutes,
      seconds,
      formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
    };
  }, []);

  return {
    elapsedTime,
    elapsedHours,
    formattedTime: formatTime(elapsedTime),
    isNotificationDue: elapsedHours >= NOTIFICATION_HOURS,
    isAutoCloseDue: elapsedHours >= AUTO_CLOSE_HOURS,
  };
};

export default useLiveModeTimer;
