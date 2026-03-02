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
