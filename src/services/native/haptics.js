// src/services/native/haptics.js
//
// Thin wrapper around @capacitor/haptics.
// All calls are no-ops on web — safe to call from any component.

import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

const isNative = () => Capacitor.isNativePlatform();

/**
 * Light tap — buttons, toggles, selections
 */
export const hapticLight = () => {
  if (!isNative()) return;
  Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
};

/**
 * Medium tap — confirmations, saving a shift/work
 */
export const hapticMedium = () => {
  if (!isNative()) return;
  Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});
};

/**
 * Heavy tap — destructive actions (delete, clear)
 */
export const hapticHeavy = () => {
  if (!isNative()) return;
  Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => {});
};

/**
 * Success pattern — onboarding complete, premium activated
 */
export const hapticSuccess = () => {
  if (!isNative()) return;
  Haptics.notification({ type: NotificationType.Success }).catch(() => {});
};

/**
 * Error pattern — form validation failed
 */
export const hapticError = () => {
  if (!isNative()) return;
  Haptics.notification({ type: NotificationType.Error }).catch(() => {});
};
