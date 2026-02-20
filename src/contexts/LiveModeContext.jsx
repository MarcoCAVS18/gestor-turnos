// src/contexts/LiveModeContext.jsx
// Context for managing Live Mode state

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useDataContext } from './DataContext';
import { useConfigContext } from './ConfigContext';
import * as liveSessionService from '../services/liveSessionService';
import * as firebaseService from '../services/firebaseService';
import * as premiumService from '../services/premiumService';
import logger from '../utils/logger';

const LiveModeContext = createContext();

export const useLiveModeContext = () => {
  return useContext(LiveModeContext);
};

// Constants for notifications and auto-close
const NOTIFICATION_HOURS = 12;
const AUTO_CLOSE_HOURS = 24;
const NOTIFICATION_MS = NOTIFICATION_HOURS * 60 * 60 * 1000;
const AUTO_CLOSE_MS = AUTO_CLOSE_HOURS * 60 * 60 * 1000;

export const LiveModeProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { works } = useDataContext();
  const { shiftRanges } = useConfigContext();

  // State
  const [liveSession, setLiveSession] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentEarnings, setCurrentEarnings] = useState(0);
  const [currentRate, setCurrentRate] = useState(0);
  const [rateType, setRateType] = useState('day');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Premium/Usage state
  const [liveModeUsage, setLiveModeUsage] = useState({
    monthlyCount: 0,
    remaining: premiumService.LIVE_MODE_FREE_LIMIT,
    isPremium: false,
  });

  // Refs
  const timerRef = useRef(null);
  const notificationSentRef = useRef(false);
  const autoCloseTriggeredRef = useRef(false);

  // Derived state
  const isActive = liveSession?.status === 'active';
  const isPaused = liveSession?.status === 'paused';
  const selectedWork = works?.find(w => w.id === liveSession?.workId) || null;

  // Calculate current rate based on time
  const calculateCurrentRate = useCallback(() => {
    if (!selectedWork?.rates) return { rate: 0, type: 'day' };

    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentHour = now.getHours();

    const ranges = shiftRanges || {
      dayStart: 6,
      dayEnd: 14,
      afternoonStart: 14,
      afternoonEnd: 20,
      nightStart: 20,
    };

    let rate;
    let type;

    if (dayOfWeek === 0) {
      rate = selectedWork.rates.sunday || 0;
      type = 'sunday';
    } else if (dayOfWeek === 6) {
      rate = selectedWork.rates.saturday || 0;
      type = 'saturday';
    } else if (currentHour >= ranges.dayStart && currentHour < ranges.dayEnd) {
      rate = selectedWork.rates.day || 0;
      type = 'day';
    } else if (currentHour >= ranges.afternoonStart && currentHour < ranges.afternoonEnd) {
      rate = selectedWork.rates.afternoon || 0;
      type = 'afternoon';
    } else {
      rate = selectedWork.rates.night || 0;
      type = 'night';
    }

    return { rate, type };
  }, [selectedWork, shiftRanges]);

  // Calculate earnings based on elapsed time and current rate
  const calculateEarnings = useCallback((elapsedMs) => {
    if (!selectedWork?.rates) return 0;

    const hours = elapsedMs / (1000 * 60 * 60);
    const { rate } = calculateCurrentRate();

    return hours * rate;
  }, [selectedWork, calculateCurrentRate]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }, []);

  // Send notification
  const sendNotification = useCallback((title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: '/logo192.png',
        requireInteraction: true,
        tag: 'live-mode-notification',
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    }
    return null;
  }, []);

  // Auto-finish session
  const autoFinishSession = useCallback(async () => {
    if (!liveSession || autoCloseTriggeredRef.current) return;

    autoCloseTriggeredRef.current = true;

    try {
      await finishSession();
      sendNotification(
        'Shift automatically ended',
        'Your live shift was automatically ended after 24 hours.'
      );
    } catch (err) {
      logger.error('Error auto-finishing session:', err);
      autoCloseTriggeredRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveSession]);

  // Timer logic
  useEffect(() => {
    // Clear timer if no session, completed, or PAUSED
    if (!liveSession || liveSession.status === 'completed' || liveSession.status === 'paused') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // If paused, still calculate the frozen elapsed time once
      if (liveSession?.status === 'paused') {
        const elapsed = liveSessionService.calculateElapsedTime(liveSession);
        setElapsedTime(elapsed);

        const { rate, type } = calculateCurrentRate();
        setCurrentRate(rate);
        setRateType(type);

        const earnings = calculateEarnings(elapsed);
        setCurrentEarnings(earnings);
      }
      return;
    }

    const updateTimer = () => {
      const elapsed = liveSessionService.calculateElapsedTime(liveSession);
      setElapsedTime(elapsed);

      const { rate, type } = calculateCurrentRate();
      setCurrentRate(rate);
      setRateType(type);

      const earnings = calculateEarnings(elapsed);
      setCurrentEarnings(earnings);

      // Check for 12h notification
      if (elapsed >= NOTIFICATION_MS && !notificationSentRef.current) {
        notificationSentRef.current = true;
        sendNotification(
          'Did you forget to end your shift?',
          'Your live session has been running for 12 hours.'
        );
      }

      // Check for 24h auto-close
      if (elapsed >= AUTO_CLOSE_MS) {
        autoFinishSession();
      }
    };

    // Initial update
    updateTimer();

    // Set up interval (update every second) - ONLY when active
    timerRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [liveSession, calculateCurrentRate, calculateEarnings, sendNotification, autoFinishSession]);

  // Subscribe to live session changes
  useEffect(() => {
    if (!currentUser?.uid) {
      setLiveSession(null);
      return;
    }

    const unsubscribe = liveSessionService.subscribeToLiveSession(
      currentUser.uid,
      (session) => {
        setLiveSession(session);
        if (session) {
          notificationSentRef.current = false;
          autoCloseTriggeredRef.current = false;
        }
      }
    );

    return () => unsubscribe();
  }, [currentUser?.uid]);

  // Load Live Mode usage on mount
  useEffect(() => {
    const loadUsage = async () => {
      if (!currentUser?.uid) {
        setLiveModeUsage({
          monthlyCount: 0,
          remaining: premiumService.LIVE_MODE_FREE_LIMIT,
          isPremium: false,
        });
        return;
      }

      try {
        const result = await premiumService.canUseLiveMode(currentUser.uid);
        setLiveModeUsage({
          monthlyCount: result.monthlyCount || 0,
          remaining: result.remaining,
          isPremium: result.isPremium,
        });
      } catch (err) {
        logger.error('Error loading Live Mode usage:', err);
      }
    };

    loadUsage();
  }, [currentUser?.uid]);

  // Start a new live session
  const startSession = useCallback(async (workId) => {
    if (!currentUser?.uid) throw new Error('User not authenticated');
    if (!workId) throw new Error('Work ID is required');

    setLoading(true);
    setError(null);

    try {
      // Use cached liveModeUsage instead of fetching again
      const canUse = liveModeUsage.isPremium || liveModeUsage.remaining > 0;

      if (!canUse) {
        const errorMsg = `You have reached the limit of ${premiumService.LIVE_MODE_FREE_LIMIT} Live Mode sessions this month. Upgrade to Premium for unlimited sessions.`;
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      await requestNotificationPermission();
      const session = await liveSessionService.createLiveSession(currentUser.uid, workId);
      setLiveSession(session);

      // Increment usage for free users
      if (!liveModeUsage.isPremium) {
        await premiumService.incrementLiveModeUsage(currentUser.uid);
        setLiveModeUsage({
          monthlyCount: liveModeUsage.monthlyCount + 1,
          remaining: Math.max(0, liveModeUsage.remaining - 1),
          isPremium: false,
        });
      }

      return session;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid, requestNotificationPermission, liveModeUsage]);

  // Pause the current session
  const pauseSession = useCallback(async () => {
    if (!liveSession?.id) throw new Error('No active session');

    setLoading(true);
    setError(null);

    // Optimistic update - immediately update local state
    const pausedAt = new Date();
    setLiveSession(prev => ({
      ...prev,
      status: 'paused',
      pausedAt: pausedAt,
    }));

    try {
      await liveSessionService.pauseLiveSession(liveSession.id);
    } catch (err) {
      // Revert optimistic update on error
      setLiveSession(prev => ({
        ...prev,
        status: 'active',
        pausedAt: null,
      }));
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [liveSession?.id]);

  // Resume the current session
  const resumeSession = useCallback(async () => {
    if (!liveSession?.id) throw new Error('No active session');

    setLoading(true);
    setError(null);

    // Calculate current pause duration before optimistic update
    let totalPauseDuration = liveSession.totalPauseDuration || 0;
    if (liveSession.pausedAt) {
      const pauseStart = liveSession.pausedAt instanceof Date
        ? liveSession.pausedAt
        : new Date(liveSession.pausedAt);
      const currentPauseDuration = Date.now() - pauseStart.getTime();
      totalPauseDuration += currentPauseDuration;
    }

    // Save previous state for rollback
    const prevSession = { ...liveSession };

    // Optimistic update - immediately update local state
    setLiveSession(prev => ({
      ...prev,
      status: 'active',
      pausedAt: null,
      totalPauseDuration: totalPauseDuration,
    }));

    try {
      await liveSessionService.resumeLiveSession(liveSession.id, totalPauseDuration);
    } catch (err) {
      // Revert optimistic update on error
      setLiveSession(prevSession);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [liveSession]);

  // Helper function to safely convert any timestamp format to Date
  const toLocalDate = (timestamp) => {
    if (!timestamp) return new Date();

    // Already a Date
    if (timestamp instanceof Date) return timestamp;

    // Firestore Timestamp object (has toDate method)
    if (typeof timestamp.toDate === 'function') return timestamp.toDate();

    // Firestore Timestamp-like object (has seconds property)
    if (timestamp.seconds !== undefined) {
      return new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000);
    }

    // ISO string or other parseable format
    if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      return new Date(timestamp);
    }

    logger.warn('Unknown timestamp format:', timestamp);
    return new Date();
  };

  // Finish the current session and create a shift
  // smokoMinutesToDeduct: number of minutes to deduct for smoko (0 if not applicable)
  const finishSession = useCallback(async (smokoMinutesToDeduct = 0) => {
    if (!liveSession?.id) throw new Error('No active session');
    if (!currentUser?.uid) throw new Error('User not authenticated');

    setLoading(true);
    setError(null);

    try {
      // Calculate final values - use helper for robust timestamp conversion
      const startTime = toLocalDate(liveSession.startedAt);
      const endTime = new Date();

      // Calculate final pause duration
      let finalPauseDuration = liveSession.totalPauseDuration || 0;
      if (liveSession.status === 'paused' && liveSession.pausedAt) {
        const pauseStart = toLocalDate(liveSession.pausedAt);
        finalPauseDuration += (endTime.getTime() - pauseStart.getTime());
      }

      // Format times (using local timezone, not UTC)
      const formatTime = (date) => {
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      };

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const startDate = formatDate(startTime);
      const endDate = formatDate(endTime);
      const crossesMidnight = startDate !== endDate;

      // Create shift data
      const shiftData = {
        workId: liveSession.workId,
        date: startDate,
        startDate: startDate,
        endDate: endDate,
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
        crossesMidnight,
        isLive: true,
        liveSessionId: liveSession.id,
        // Smoko/break deduction
        hadBreak: smokoMinutesToDeduct > 0,
        breakMinutes: smokoMinutesToDeduct > 0 ? smokoMinutesToDeduct : 0,
      };

      // Add the shift
      await firebaseService.addShift(currentUser.uid, shiftData, false);

      // Complete the live session
      await liveSessionService.completeLiveSession(liveSession.id, finalPauseDuration, currentUser.uid);

      // Reset state
      setLiveSession(null);
      setElapsedTime(0);
      setCurrentEarnings(0);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [liveSession, currentUser?.uid]);

  // Cancel session without saving
  const cancelSession = useCallback(async () => {
    if (!liveSession?.id) throw new Error('No active session');

    setLoading(true);
    setError(null);

    try {
      await liveSessionService.deleteLiveSession(liveSession.id);
      setLiveSession(null);
      setElapsedTime(0);
      setCurrentEarnings(0);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [liveSession?.id]);

  // Format elapsed time
  const formattedTime = liveSessionService.formatElapsedTime(elapsedTime);

  // Format earnings
  const formattedEarnings = `$${currentEarnings.toFixed(2)}`;

  const value = {
    // State
    liveSession,
    isActive: !!liveSession && (isActive || isPaused),
    isPaused,
    elapsedTime,
    currentEarnings,
    currentRate,
    rateType,
    loading,
    error,
    selectedWork,

    // Formatted values
    formattedTime,
    formattedEarnings,

    // Premium/Usage state
    liveModeUsage,
    liveModeLimit: premiumService.LIVE_MODE_FREE_LIMIT,

    // Actions
    startSession,
    pauseSession,
    resumeSession,
    finishSession,
    cancelSession,

    // Utilities
    requestNotificationPermission,
  };

  return (
    <LiveModeContext.Provider value={value}>
      {children}
    </LiveModeContext.Provider>
  );
};

export default LiveModeProvider;
