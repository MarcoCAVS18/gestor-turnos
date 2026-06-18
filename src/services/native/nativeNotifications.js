// src/services/native/nativeNotifications.js
//
// Abstraction layer for notifications.
// On native (iOS/Android): uses @capacitor/local-notifications
// On web: uses window.Notification API — web behavior is COMPLETELY UNCHANGED.

import { Capacitor } from '@capacitor/core';
import i18n from '../../i18n';

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

// Strings are resolved from i18n at schedule time (see notifications.reengagement).
const REENGAGEMENT_DEFS = [
  { daysOffset: 7, key: '7' },
  { daysOffset: 14, key: '14' },
  { daysOffset: 21, key: '21' },
  { daysOffset: 30, key: '30' },
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

    const notifications = REENGAGEMENT_DEFS.map(({ daysOffset, key }, i) => {
      const fireAt = new Date(referenceDate);
      fireAt.setDate(fireAt.getDate() + daysOffset);
      // Always fire at 10:00 local time on that day
      fireAt.setHours(10, 0, 0, 0);
      return {
        id: REENGAGEMENT_IDS[i],
        title: i18n.t(`notifications.reengagement.title${key}`),
        body: i18n.t(`notifications.reengagement.body${key}`),
        schedule: { at: fireAt },
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

// ─── Working Holiday Visa milestone alerts ──────────────────────────────────
const VISA_NOTIFIED_KEY = 'orary_visa_milestones_notified';

/**
 * Fire a one-time local notification when the user crosses a visa-day milestone
 * (~80/91/97% of the current goal — i.e. 70/80/85 for the 88-day goal). Tracks
 * which milestones were already notified (per goal) in localStorage so it never
 * repeats. Native-only. Pass the displayed total and the current goal (88 | 176).
 *
 * @param {number} totalDays - Current accumulated visa days (as shown to the user).
 * @param {number} milestone - Current goal: 88 or 176.
 */
export const checkVisaMilestone = async (totalDays, milestone) => {
  if (!isNative() || typeof milestone !== 'number' || totalDays <= 0) return;
  try {
    const thresholds = [0.8, 0.91, 0.97].map((f) => Math.round(f * milestone));
    const store = JSON.parse(localStorage.getItem(VISA_NOTIFIED_KEY) || '{}');
    const done = store[milestone] || [];
    const reached = thresholds.filter((th) => totalDays >= th && totalDays < milestone && !done.includes(th));
    if (reached.length === 0) return;

    const remaining = Math.max(0, milestone - totalDays);
    await sendLocalNotification(
      i18n.t('notifications.australia88.title'),
      i18n.t('notifications.australia88.body', { days: totalDays, remaining, milestone })
    );
    store[milestone] = [...new Set([...done, ...reached])];
    localStorage.setItem(VISA_NOTIFIED_KEY, JSON.stringify(store));
  } catch (err) {
    console.warn('[nativeNotifications] checkVisaMilestone error:', err);
  }
};

// ─── Daily "log your shift" reminder (reserved ID 3000) ─────────────────────
const DAILY_REMINDER_ID = 3000;

/**
 * Schedule a repeating daily reminder at the given local time ("HH:MM").
 * Replaces any existing one. Native-only; repeating schedules persist across
 * app restarts, so this only needs to run when the user enables it or changes
 * the time. No-op if permission isn't granted.
 */
export const scheduleDailyReminder = async (time = '19:00') => {
  if (!isNative()) return;
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const { display } = await LocalNotifications.checkPermissions();
    if (display !== 'granted') return;

    const [h, m] = String(time).split(':').map(Number);
    await LocalNotifications.cancel({ notifications: [{ id: DAILY_REMINDER_ID }] });
    await LocalNotifications.schedule({
      notifications: [{
        id: DAILY_REMINDER_ID,
        title: i18n.t('notifications.dailyReminder.title'),
        body: i18n.t('notifications.dailyReminder.body'),
        schedule: { on: { hour: Number.isFinite(h) ? h : 19, minute: Number.isFinite(m) ? m : 0 }, allowWhileIdle: true },
        iconColor: '#EC4899',
      }],
    });
  } catch (err) {
    console.warn('[nativeNotifications] scheduleDailyReminder error:', err);
  }
};

/** Cancel the daily reminder. */
export const cancelDailyReminder = async () => {
  if (!isNative()) return;
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    await LocalNotifications.cancel({ notifications: [{ id: DAILY_REMINDER_ID }] });
  } catch { /* ignore */ }
};
