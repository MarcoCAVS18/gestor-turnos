// src/services/biometricService.js

const CRED_KEY = (uid) => `orary_biometric_cred_${uid}`;
const UID_KEY = 'orary_biometric_uid';

export const checkBiometricSupport = async () => {
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
