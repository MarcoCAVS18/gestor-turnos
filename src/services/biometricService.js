// src/services/biometricService.js
// On native iOS/Android: uses @capgo/capacitor-native-biometric (Face ID / Touch ID)
// On web: uses WebAuthn (navigator.credentials) — web behavior is UNCHANGED.

import { Capacitor } from '@capacitor/core';

const isNative = () => Capacitor.isNativePlatform();
const CRED_KEY = (uid) => `orary_biometric_cred_${uid}`;
const UID_KEY = 'orary_biometric_uid';

export const checkBiometricSupport = async () => {
  if (isNative()) {
    try {
      const { NativeBiometric } = await import('@capgo/capacitor-native-biometric');
      const result = await NativeBiometric.isAvailable();
      return result.isAvailable;
    } catch {
      return false;
    }
  }
  if (!window.PublicKeyCredential) return false;
  return window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
};

// Check if biometric is enabled for a specific user (used in Integrations toggle state)
export const isBiometricEnabledOnDevice = (userId) =>
  !!localStorage.getItem(CRED_KEY(userId));

// Check if ANY biometric credential exists on this device (used in Login page)
export const isBiometricAvailable = () => {
  const uid = localStorage.getItem(UID_KEY);
  return uid ? isBiometricEnabledOnDevice(uid) : false;
};

// Get the stored UID for the registered biometric credential
export const getStoredBiometricUid = () => localStorage.getItem(UID_KEY);

export const registerBiometric = async (userId, userEmail) => {
  if (isNative()) {
    // On native: trigger Face ID / Touch ID once to confirm it works, then store flag
    const { NativeBiometric } = await import('@capgo/capacitor-native-biometric');
    await NativeBiometric.verifyIdentity({
      reason: 'Enable biometric login for Orary',
      title: 'Set up Biometric Login',
      subtitle: 'Use your fingerprint or face to sign in faster',
      negativeButtonText: 'Cancel', // Required on Android
    });
    localStorage.setItem(CRED_KEY(userId), 'native');
    localStorage.setItem(UID_KEY, userId);
    return;
  }
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: { name: 'Orary', id: window.location.hostname },
      user: {
        id: new TextEncoder().encode(userId),
        name: userEmail,
        displayName: userEmail,
      },
      pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
      authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required' },
      timeout: 60000,
    },
  });
  const credId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
  localStorage.setItem(CRED_KEY(userId), credId);
  localStorage.setItem(UID_KEY, userId);
};

export const verifyBiometric = async (userId) => {
  if (isNative()) {
    const { NativeBiometric } = await import('@capgo/capacitor-native-biometric');
    await NativeBiometric.verifyIdentity({
      reason: 'Unlock Orary',
      title: 'Biometric Login',
      negativeButtonText: 'Cancel', // Required on Android
    });
    return; // Resolves = success, rejects = cancelled/failed
  }
  const stored = localStorage.getItem(CRED_KEY(userId));
  if (!stored) throw new Error('No biometric credential');
  const credIdBytes = Uint8Array.from(atob(stored), (c) => c.charCodeAt(0));
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  await navigator.credentials.get({
    publicKey: {
      challenge,
      allowCredentials: [{ id: credIdBytes, type: 'public-key' }],
      userVerification: 'required',
      timeout: 60000,
    },
  });
};

export const removeBiometricCredential = (userId) => {
  localStorage.removeItem(CRED_KEY(userId));
  localStorage.removeItem(UID_KEY);
};
