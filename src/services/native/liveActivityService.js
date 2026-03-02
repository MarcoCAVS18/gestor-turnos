// src/services/native/liveActivityService.js
// Bridge to iOS Live Activities (Dynamic Island) via the custom LiveActivityPlugin.
// On web / Android: all calls are no-ops that resolve immediately.

import { registerPlugin, Capacitor } from '@capacitor/core';

// Register the native plugin. Web fallback is a no-op object.
const LiveActivityPlugin = registerPlugin('LiveActivityPlugin', {
  web: {
    isSupported:     async () => ({ supported: false }),
    startActivity:   async () => ({ activityId: '' }),
    updateActivity:  async () => {},
    endActivity:     async () => {},
  },
});

const isNativeIOS = () =>
  Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios';

/**
 * Returns true if Live Activities are available and enabled on this device.
 * Requires iOS 16.2+ and iPhone with Dynamic Island or Lock Screen support.
 */
export const isLiveActivitySupported = async () => {
  if (!isNativeIOS()) return false;
  try {
    const { supported } = await LiveActivityPlugin.isSupported();
    return !!supported;
  } catch {
    return false;
  }
};

/**
 * Start a Live Activity for an active Live Mode session.
 * @param {object} params
 * @param {string} params.workName       - Name of the job/work
 * @param {string} params.workColor      - Hex color e.g. "#EC4899"
 * @param {Date}   params.sessionStart   - JS Date when the session started
 * @returns {Promise<string>} activityId (empty string if unsupported)
 */
export const startLiveActivity = async ({ workName, workColor, sessionStart }) => {
  if (!isNativeIOS()) return '';
  try {
    const { activityId } = await LiveActivityPlugin.startActivity({
      workName,
      workColor,
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
 * Update the Live Activity state (call on pause/resume and every ~30s for earnings).
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
  if (!isNativeIOS()) return;
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
 * End the Live Activity (call when session finishes or is cancelled).
 */
export const endLiveActivity = async () => {
  if (!isNativeIOS()) return;
  try {
    await LiveActivityPlugin.endActivity();
  } catch {
    // Non-critical
  }
};
