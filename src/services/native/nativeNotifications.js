// src/services/native/nativeNotifications.js
//
// Abstraction layer for notifications.
// On native (iOS/Android): uses @capacitor/local-notifications
// On web: uses window.Notification API — web behavior is COMPLETELY UNCHANGED.

import { Capacitor } from '@capacitor/core';

const isNative = () => Capacitor.isNativePlatform();

/**
 * Check if notifications are supported on this platform.
 */
export const isNotificationSupported = () => {
  if (isNative()) return true;
  return 'Notification' in window;
};

/**
 * Check current notification permission status.
 * Returns 'granted', 'denied', or 'prompt'/'default'.
 */
export const checkNotificationPermission = async () => {
  if (isNative()) {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const { display } = await LocalNotifications.checkPermissions();
    return display;
  }
  if ('Notification' in window) return Notification.permission;
  return 'denied';
};

/**
 * Request notification permission from the user.
 * Returns 'granted', 'denied', or 'prompt'.
 */
export const requestNotificationPermission = async () => {
  if (isNative()) {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const { display } = await LocalNotifications.requestPermissions();
    return display;
  }
  if ('Notification' in window) return await Notification.requestPermission();
  return 'denied';
};

/**
 * Send an immediate notification.
 * On native: schedules a local notification (fires in 100ms).
 * On web: uses window.Notification API.
 */
export const sendLocalNotification = async (title, body) => {
  if (isNative()) {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const { display } = await LocalNotifications.checkPermissions();
    if (display !== 'granted') return null;
    await LocalNotifications.schedule({
      notifications: [{
        id: Math.floor(Date.now() / 1000),
        title,
        body,
        schedule: { at: new Date(Date.now() + 100) },
      }]
    });
    return true;
  }
  if ('Notification' in window && Notification.permission === 'granted') {
    return new Notification(title, { body, icon: '/logo192.png', requireInteraction: true, tag: 'orary-notification' });
  }
  return null;
};

// ─── Re-engagement notification IDs (reserved range 9000–9099) ──────────────
const REENGAGEMENT_IDS = [9001, 9002, 9003, 9004];

const REENGAGEMENT_MESSAGES = [
  {
    title: "We miss you! 👋",
    body: "You haven't logged a shift in a while. Ready to get back on track?",
    daysOffset: 7,
  },
  {
    title: "On vacation? 🏖️",
    body: "We'll be here whenever you're back! Your shifts are waiting for you.",
    daysOffset: 14,
  },
  {
    title: "Your stats are waiting 📊",
    body: "Log your recent shifts to keep your earnings history up to date.",
    daysOffset: 21,
  },
  {
    title: "Long time no see! ⏰",
    body: "Don't lose track of your work. Open Orary and add your latest shifts.",
    daysOffset: 30,
  },
];

/**
 * Schedule re-engagement local notifications.
 * Cancels any previously scheduled ones first, then schedules new ones
 * starting from `referenceDate` (defaults to now).
 *
 * Only works on native platforms (iOS/Android) with LocalNotifications.
 * On web there is no persistent scheduling API — this is a no-op.
 *
 * @param {Date} [referenceDate] - Base date from which offsets are calculated.
 */
export const scheduleReengagementNotifications = async (referenceDate = new Date()) => {
  if (!isNative()) return;

  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const { display } = await LocalNotifications.checkPermissions();
    if (display !== 'granted') return;

    // Cancel any previously scheduled re-engagement notifications
    await LocalNotifications.cancel({ notifications: REENGAGEMENT_IDS.map(id => ({ id })) });

    const notifications = REENGAGEMENT_MESSAGES.map(({ title, body, daysOffset }, i) => {
      const fireAt = new Date(referenceDate);
      fireAt.setDate(fireAt.getDate() + daysOffset);
      // Always fire at 10:00 local time on that day
      fireAt.setHours(10, 0, 0, 0);
      return {
        id: REENGAGEMENT_IDS[i],
        title,
        body,
        schedule: { at: fireAt },
        smallIcon: 'ic_stat_orary',
        iconColor: '#EC4899',
      };
    });

    await LocalNotifications.schedule({ notifications });
  } catch (err) {
    // Non-critical — swallow silently so app startup is never blocked
    console.warn('[nativeNotifications] scheduleReengagementNotifications error:', err);
  }
};

/**
 * Cancel all pending re-engagement notifications.
 * Call this when the user opens the app so the cycle resets.
 */
export const cancelReengagementNotifications = async () => {
  if (!isNative()) return;
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    await LocalNotifications.cancel({ notifications: REENGAGEMENT_IDS.map(id => ({ id })) });
  } catch {
    // ignore
  }
};
