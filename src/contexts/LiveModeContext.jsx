// src/contexts/LiveModeContext.jsx
// Context for managing Live Mode state

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useDataContext } from './DataContext';
import { useConfigContext } from './ConfigContext';
import * as liveSessionService from '../services/liveSessionService';
import * as firebaseService from '../services/firebaseService';
import * as premiumService from '../services/premiumService';
import { requestNotificationPermission, sendLocalNotification } from '../services/native/nativeNotifications';
import {
  startLiveActivity,
  updateLiveActivity,
  endLiveActivity,
} from '../services/native/liveActivityService';
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
  const lastLAUpdateRef = useRef(0); // timestamp of last Live Activity earnings push

  // Derived state
  const isActive = liveSession?.status === 'active';
  const isPaused = liveSession?.status === 'paused';

  // Memoize selectedWork so it only changes when works data or workId actually changes.
  // Without useMemo, works.find() returns a new object reference on every render,
  // causing calculateEarnings to get a new ref → timer useEffect re-runs → interval resets.
  const selectedWork = useMemo(
    () => works?.find(w => w.id === liveSession?.workId) || null,
    [works, liveSession?.workId]
  );

  // Ref for works — lets startSession always read the latest works without adding
  // works to its useCallback deps (which would create a new fn ref on every works update).
  const worksRef = useRef(works);
  worksRef.current = works;

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

  // Calculate earnings by walking from startedAt → now, applying the correct
  // rate for each time segment (day / afternoon / night / saturday / sunday).
  // Pauses are handled by scaling with (elapsedActive / totalSpan).
  const calculateEarnings = useCallback(() => {
    if (!selectedWork?.rates || !liveSession?.startedAt) return 0;

    const startTime = liveSession.startedAt instanceof Date
      ? liveSession.startedAt
      : new Date(liveSession.startedAt);

    const now = new Date();
    if (startTime >= now) return 0;

    const ranges = shiftRanges || {
      dayStart: 6, dayEnd: 14,
      afternoonStart: 14, afternoonEnd: 20,
    };

    // Rate boundary hours within a weekday
    const rateHours = [ranges.dayStart, ranges.dayEnd, ranges.afternoonStart, ranges.afternoonEnd];

    // Walk through the clock from startedAt to now, segment by segment
    let grossEarnings = 0;
    let current = new Date(startTime);

    while (current < now) {
      const dayOfWeek = current.getDay();
      const h = current.getHours();

      // Next rate boundary
      let nextBoundary = new Date(current);
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Weekend: flat rate all day, boundary is midnight
        nextBoundary.setHours(24, 0, 0, 0);
      } else {
        const nextHour = rateHours.find(rh => rh > h);
        if (nextHour !== undefined) {
          nextBoundary.setHours(nextHour, 0, 0, 0);
        } else {
          nextBoundary.setHours(24, 0, 0, 0);
        }
      }

      const segmentEnd = nextBoundary < now ? nextBoundary : now;
      const segmentHours = (segmentEnd.getTime() - current.getTime()) / (1000 * 60 * 60);

      let rate = 0;
      if (dayOfWeek === 0) rate = selectedWork.rates.sunday || 0;
      else if (dayOfWeek === 6) rate = selectedWork.rates.saturday || 0;
      else if (h >= ranges.dayStart && h < ranges.dayEnd) rate = selectedWork.rates.day || 0;
      else if (h >= ranges.afternoonStart && h < ranges.afternoonEnd) rate = selectedWork.rates.afternoon || 0;
      else rate = selectedWork.rates.night || 0;

      grossEarnings += segmentHours * rate;
      current = new Date(segmentEnd.getTime());
    }

    // Scale by active fraction to account for pauses (proportional approximation)
    const totalSpanMs = now.getTime() - startTime.getTime();
    const elapsedActiveMs = liveSessionService.calculateElapsedTime(liveSession);
    if (totalSpanMs > 0 && elapsedActiveMs < totalSpanMs) {
      grossEarnings *= elapsedActiveMs / totalSpanMs;
    }

    return Math.max(0, grossEarnings);
  }, [selectedWork, liveSession, shiftRanges]);

  // Request notification permission (native + web via nativeNotifications wrapper)
  const requestNotificationPermissionFn = useCallback(async () => {
    await requestNotificationPermission();
  }, []);

  // Send notification (native + web via nativeNotifications wrapper)
  const sendNotification = useCallback(async (title, body) => {
    return await sendLocalNotification(title, body);
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

        const earnings = calculateEarnings();
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

      const earnings = calculateEarnings();
      setCurrentEarnings(earnings);

      // Push earnings to Live Activity every ~30 s (non-critical, fire-and-forget)
      const nowTs = Date.now();
      if (nowTs - lastLAUpdateRef.current >= 30_000) {
        lastLAUpdateRef.current = nowTs;
        updateLiveActivity({
          totalPausedSeconds: Math.floor((liveSession.totalPauseDuration || 0) / 1000),
          pausedSince: null,
          earningsFormatted: `$${earnings.toFixed(2)}`,
          isPaused: false,
        }).catch(() => {});
      }

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

      await requestNotificationPermissionFn();
      const session = await liveSessionService.createLiveSession(currentUser.uid, workId);
      setLiveSession(session);

      // Start Live Activity on iOS (non-critical, fire-and-forget)
      const work = worksRef.current?.find(w => w.id === workId);
      if (work) {
        const sessionStart = session.startedAt instanceof Date
          ? session.startedAt
          : new Date(session.startedAt);
        startLiveActivity({
          workName: work.name,
          workColor: work.color || '#EC4899',
          sessionStart,
        }).catch(() => {});
      }

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
      // Don't persist "already active" errors in global state — the modal
      // handles them silently by closing; persisting would bleed into the UI.
      if (!err.message?.includes('already an active live session')) {
        setError(err.message);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid, requestNotificationPermissionFn, liveModeUsage]);

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
      // Notify Live Activity of pause immediately
      updateLiveActivity({
        totalPausedSeconds: Math.floor((liveSession.totalPauseDuration || 0) / 1000),
        pausedSince: pausedAt,
        earningsFormatted: `$${currentEarnings.toFixed(2)}`,
        isPaused: true,
      }).catch(() => {});
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
  }, [liveSession?.id, liveSession?.totalPauseDuration, currentEarnings]);

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
      // Notify Live Activity of resume immediately
      updateLiveActivity({
        totalPausedSeconds: Math.floor(totalPauseDuration / 1000),
        pausedSince: null,
        earningsFormatted: `$${currentEarnings.toFixed(2)}`,
        isPaused: false,
      }).catch(() => {});
    } catch (err) {
      // Revert optimistic update on error
      setLiveSession(prevSession);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [liveSession, currentEarnings]);

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

      // End Live Activity
      endLiveActivity().catch(() => {});

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
      // End Live Activity
      endLiveActivity().catch(() => {});
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
    requestNotificationPermission: requestNotificationPermissionFn,
  };

  return (
    <LiveModeContext.Provider value={value}>
      {children}
    </LiveModeContext.Provider>
  );
};

export default LiveModeProvider;
