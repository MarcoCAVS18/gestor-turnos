// src/services/native/liveActivityService.js
// Bridge to iOS Live Activities (Dynamic Island) and Android Foreground Service
// via the custom LiveActivityPlugin.
// On web: all calls are no-ops that resolve immediately.

import { registerPlugin, Capacitor } from '@capacitor/core';

// Same plugin name resolves to LiveActivityPlugin.swift on iOS
// and LiveModePlugin.java (@CapacitorPlugin name="LiveActivityPlugin") on Android.
const LiveActivityPlugin = registerPlugin('LiveActivityPlugin', {
  web: {
    isSupported:    async () => ({ supported: false }),
    startActivity:  async () => ({ activityId: '' }),
    updateActivity: async () => {},
    endActivity:    async () => {},
  },
});

const isNativeIOS = () =>
  Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios';

const isNativeAndroid = () =>
  Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';

const isNativeMobile = () => isNativeIOS() || isNativeAndroid();

/**
 * Returns true if live notifications are supported on this device.
 * iOS: requires iOS 16.2+ with Live Activities enabled.
 * Android: always supported (API 24+).
 */
export const isLiveActivitySupported = async () => {
  if (!isNativeMobile()) return false;
  try {
    const { supported } = await LiveActivityPlugin.isSupported();
    return !!supported;
  } catch {
    return false;
  }
};

/**
 * Start a Live Activity (iOS) or persistent foreground notification (Android).
 * @param {object} params
 * @param {string} params.workName      - Name of the job/work
 * @param {string} params.workColor     - Hex color of the work e.g. "#EC4899"
 * @param {string} params.themeColor    - User's primary theme color e.g. "#EC4899"
 * @param {Date}   params.sessionStart  - JS Date when the session started
 * @returns {Promise<string>} activityId (empty string if unsupported)
 */
export const startLiveActivity = async ({ workName, workColor, themeColor, sessionStart }) => {
  if (!isNativeMobile()) return '';
  try {
    const { activityId } = await LiveActivityPlugin.startActivity({
      workName,
      workColor,
      themeColor: themeColor || workColor || '#EC4899',
      sessionStartDate: sessionStart instanceof Date
        ? sessionStart.toISOString()
        : new Date(sessionStart).toISOString(),
    });
    return activityId || '';
  } catch (err) {
    console.warn('[LiveActivity] startActivity failed:', err);
    return '';
  }
};

/**
 * Update the live notification state.
 * iOS: updates Live Activity every ~30s.
 * Android: updates the foreground service notification immediately.
 * @param {object} params
 * @param {number}      params.totalPausedSeconds  - Accumulated pause time in seconds
 * @param {Date|null}   params.pausedSince         - When current pause started (null if active)
 * @param {string}      params.earningsFormatted   - e.g. "$12.50"
 * @param {boolean}     params.isPaused
 */
export const updateLiveActivity = async ({
  totalPausedSeconds,
  pausedSince,
  earningsFormatted,
  isPaused,
}) => {
  if (!isNativeMobile()) return;
  try {
    await LiveActivityPlugin.updateActivity({
      totalPausedSeconds: Math.floor(totalPausedSeconds || 0),
      pausedSince: pausedSince instanceof Date
        ? pausedSince.toISOString()
        : (pausedSince ? new Date(pausedSince).toISOString() : ''),
      earningsFormatted: earningsFormatted || '$0.00',
      isPaused: !!isPaused,
    });
  } catch {
    // Non-critical — silently ignore
  }
};

/**
 * End the live notification (call when session finishes or is cancelled).
 */
export const endLiveActivity = async () => {
  if (!isNativeMobile()) return;
  try {
    await LiveActivityPlugin.endActivity();
  } catch {
    // Non-critical
  }
};
