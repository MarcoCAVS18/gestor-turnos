// src/contexts/OnboardingContext.jsx
// Manages the first-time settings onboarding spotlight wizard.
// Activates automatically after the DemoModal is dismissed (first login only).

import { createContext, useContext, useState, useCallback } from 'react';

const OnboardingContext = createContext();

export const useOnboarding = () => useContext(OnboardingContext);

const STORAGE_KEY = 'orary_onboarding_done';
const TOTAL_STEPS = 7; // welcome (intro), location, smoko, shiftRange, preferences, delivery, color

export const OnboardingProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Start wizard — only if never completed before
  const startOnboarding = useCallback(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
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
