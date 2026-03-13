// src/services/native/shiftReminderService.js
//
// Schedules and cancels local notifications for upcoming shifts.
// Only operates on native (iOS/Android) via @capacitor/local-notifications.
// On web this is a no-op — the web Notification API has no persistent scheduling.

import { Capacitor } from '@capacitor/core';

const isNative = () => Capacitor.isNativePlatform();

// Reserved notification ID range for shift reminders: 2000–2063
const REMINDER_ID_BASE = 2000;
const MAX_REMINDERS = 64; // safe cap to avoid OS limits

/**
 * Build the Date at which to fire the reminder:
 * shift start datetime minus minutesBefore.
 */
const buildFireAt = (dateStr, timeStr, minutesBefore) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = (timeStr || '09:00').split(':').map(Number);
  const d = new Date(year, month - 1, day, hours, minutes, 0, 0);
  d.setMinutes(d.getMinutes() - minutesBefore);
  return d;
};

/**
 * Schedule shift reminder notifications.
 * Cancels any existing reminders first, then schedules new ones
 * for all upcoming shifts (capped at MAX_REMINDERS).
 *
 * @param {Array}  shifts        - Array of shift objects { startDate, startTime, workId, ... }
 * @param {Object} worksMap      - Plain object: { [workId]: { name, ... } }
 * @param {number} minutesBefore - Minutes before shift start to fire the notification
 * @returns {{ scheduled: number }} - How many notifications were actually scheduled
 */
export const scheduleShiftReminders = async (shifts, worksMap, minutesBefore = 15) => {
  if (!isNative()) return { scheduled: 0 };

  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const { display } = await LocalNotifications.checkPermissions();
    if (display !== 'granted') return { scheduled: 0 };

    // Always cancel existing ones first so there are no stale reminders
    await cancelShiftReminders();

    const now = new Date();

    const upcoming = shifts
      .filter(s => s.startDate && s.startTime)
      .map(s => ({ shift: s, fireAt: buildFireAt(s.startDate, s.startTime, minutesBefore) }))
      .filter(({ fireAt }) => fireAt > now)
      .sort((a, b) => a.fireAt - b.fireAt)
      .slice(0, MAX_REMINDERS);

    if (upcoming.length === 0) return { scheduled: 0 };

    const notifications = upcoming.map(({ shift, fireAt }, i) => {
      const work = worksMap[shift.workId];
      const workSuffix = work?.name ? ` — ${work.name}` : '';
      return {
        id: REMINDER_ID_BASE + i,
        title: `Shift starting soon${workSuffix}`,
        body: `Your shift starts at ${shift.startTime} (${minutesBefore} min reminder).`,
        schedule: { at: fireAt },
        iconColor: '#EC4899',
      };
    });

    await LocalNotifications.schedule({ notifications });
    return { scheduled: upcoming.length };
  } catch (err) {
    console.warn('[shiftReminderService] scheduleShiftReminders error:', err);
    return { scheduled: 0 };
  }
};

/**
 * Cancel all pending shift reminder notifications.
 */
export const cancelShiftReminders = async () => {
  if (!isNative()) return;
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const ids = Array.from({ length: MAX_REMINDERS }, (_, i) => ({ id: REMINDER_ID_BASE + i }));
    await LocalNotifications.cancel({ notifications: ids });
  } catch { /* non-critical, ignore */ }
};
