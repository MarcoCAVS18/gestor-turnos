// src/contexts/OnboardingContext.jsx
// Manages the first-time settings onboarding spotlight wizard.
// Activates automatically after the DemoModal is dismissed (first login only).
// Completion is persisted in both localStorage (fast) and Firestore (cross-device).

import { createContext, useContext, useState, useCallback } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const OnboardingContext = createContext();

export const useOnboarding = () => useContext(OnboardingContext);

const STORAGE_KEY = 'orary_onboarding_done';
const TOTAL_STEPS = 7; // welcome (intro), location, smoko, shiftRange, preferences, delivery, color

export const OnboardingProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Start wizard — only if never completed before (localStorage = fast cache, Firestore = cross-device truth)
  const startOnboarding = useCallback(async () => {
    // Fast path: already marked locally
    if (localStorage.getItem(STORAGE_KEY)) return;

    // Definitive check: Firestore (handles reinstalls / new devices / other platforms)
    const user = auth.currentUser;
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.data()?.onboardingDone) {
          localStorage.setItem(STORAGE_KEY, 'true'); // sync locally for next time
          return;
        }
      } catch (_) {
        // If Firestore is unreachable, fall through and show onboarding
      }
    }

    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev >= TOTAL_STEPS - 1) return prev; // completeOnboarding handles final step
      return prev + 1;
    });
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const skipStep = nextStep;

  const completeOnboarding = useCallback(() => {
    setIsActive(false);
    localStorage.setItem(STORAGE_KEY, 'true');

    // Persist to Firestore so completion survives reinstalls and syncs across devices
    const user = auth.currentUser;
    if (user) {
      updateDoc(doc(db, 'users', user.uid), { onboardingDone: true }).catch(() => {});
    }
  }, []);

  return (
    <OnboardingContext.Provider
      value={{
        isActive,
        currentStep,
        totalSteps: TOTAL_STEPS,
        startOnboarding,
        nextStep,
        prevStep,
        skipStep,
        completeOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
