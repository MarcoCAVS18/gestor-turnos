// src/components/onboarding/OnboardingSpotlight/index.jsx
// Spotlight-style onboarding wizard that overlays the Settings page.
// Dims all sections except the current one, with a guide card near the spotlight.

import React, { useEffect, useLayoutEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb, MapPin, Coffee, Clock, Truck, Palette, Receipt, Sparkles,
  ChevronLeft, ChevronRight, Check, X
} from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const PADDING = 12;
const CARD_WIDTH = 340;
const CARD_HEIGHT_APPROX = 188;

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    elementId: null, // Full overlay — no spotlight target
    title: "Let's set up your account",
    description: "We'll walk you through the key settings to get Orary working perfectly for you. It only takes a minute.",
    icon: Sparkles,
    optional: false,
  },
  {
    id: 'location',
    elementId: 'settings-holiday',
    title: 'Set your location',
    description: 'Select your country so we can automatically detect public holidays in your area.',
    icon: MapPin,
    optional: false,
  },
  {
    id: 'smoko',
    elementId: 'settings-smoko',
    title: 'Smoko breaks',
    description: 'Enable smoko to automatically deduct break time from your shift hours.',
    icon: Coffee,
    optional: false,
  },
  {
    id: 'shiftRange',
    elementId: 'settings-turnrange',
    title: 'Shift hours',
    description: 'Define the time ranges that classify shifts as day, afternoon or night.',
    icon: Clock,
    optional: false,
  },
  {
    id: 'preferences',
    elementId: 'settings-preferences',
    title: 'Tax & deductions',
    description: 'Set the default tax percentage deducted from your gross pay. You can also configure a different rate per job.',
    icon: Receipt,
    optional: true,
  },
  {
    id: 'delivery',
    elementId: 'settings-delivery',
    title: 'Delivery work',
    description: 'Enable this if you work for platforms like Uber Eats, DoorDash or similar.',
    icon: Truck,
    optional: true,
  },
  {
    id: 'color',
    elementId: 'settings-customization',
    title: 'Choose your color',
    description: "Pick a theme color that reflects your style. You can change it anytime in settings.",
    icon: Palette,
    optional: true,
    isLast: true,
  },
];

/**
 * Settings.jsx renders both a desktop layout (hidden lg:block) and a mobile layout
 * (block lg:hidden). Both have the same IDs, so getElementById() always picks the
 * first one in the DOM — which may be display:none on the current breakpoint.
 * This helper finds the first element with the given ID that is actually visible.
 */
function getVisibleElement(id) {
  const all = Array.from(document.querySelectorAll(`[id="${id}"]`));
  return all.find((el) => el.offsetHeight > 0) || all[0] || null;
}

/**
 * Compute the guide card position so it appears near the spotlighted element.
 * - Mobile (<lg): full width, above bottom nav
 * - Desktop (>=lg): fixed width (CARD_WIDTH), below the element if room, else above,
 *   else bottom-right corner.
 */
function computeCardStyle(rect) {
  const isDesktop = window.innerWidth >= 1024;

  if (!isDesktop) {
    return { position: 'fixed', bottom: '88px', left: '16px', right: '16px', zIndex: 50 };
  }

  if (!rect) {
    return { position: 'fixed', bottom: '24px', right: '24px', width: CARD_WIDTH, zIndex: 50 };
  }

  const gap = 16;
  // Clamp left so the card stays within the viewport
  let left = Math.max(16, Math.min(rect.left, window.innerWidth - CARD_WIDTH - 16));

  const spaceBelow = window.innerHeight - rect.bottom - PADDING - gap;
  const spaceAbove = rect.top - PADDING - gap;

  if (spaceBelow >= CARD_HEIGHT_APPROX) {
    return { position: 'fixed', top: rect.bottom + PADDING + gap, left, width: CARD_WIDTH, zIndex: 50 };
  }
  if (spaceAbove >= CARD_HEIGHT_APPROX) {
    return { position: 'fixed', top: rect.top - PADDING - gap - CARD_HEIGHT_APPROX, left, width: CARD_WIDTH, zIndex: 50 };
  }
  // Fallback: bottom-right corner
  return { position: 'fixed', bottom: '24px', right: '24px', width: CARD_WIDTH, zIndex: 50 };
}

const OnboardingSpotlight = () => {
  const { isActive, currentStep, totalSteps, nextStep, prevStep, completeOnboarding } = useOnboarding();
  const [rect, setRect] = useState(null);
  const observerRef = useRef(null);
  const recalcTimerRef = useRef(null);

  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === totalSteps - 1;

  const isWelcomeStep = !step?.elementId;

  const calculateRect = useCallback(() => {
    if (!step || isWelcomeStep) return;
    const el = getVisibleElement(step.elementId);
    if (!el) {
      // Element not found yet — retry shortly
      recalcTimerRef.current = setTimeout(calculateRect, 300);
      return;
    }
    const r = el.getBoundingClientRect();
    if (r.height === 0) {
      // Element exists but hasn't painted yet (e.g. data still loading) — retry
      recalcTimerRef.current = setTimeout(calculateRect, 300);
      return;
    }
    setRect(r);
  }, [step, isWelcomeStep]);

  // Scroll to the visible element, then recalculate rect after scroll settles
  useLayoutEffect(() => {
    if (!isActive || !step) return;

    setRect(null); // clear while scrolling

    // Welcome step: no element to scroll to — stay on full overlay
    if (isWelcomeStep) return;

    const el = getVisibleElement(step.elementId);
    if (!el) return;

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    clearTimeout(recalcTimerRef.current);
    recalcTimerRef.current = setTimeout(calculateRect, 650);

    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new ResizeObserver(calculateRect);
    observerRef.current.observe(el);

    return () => {
      clearTimeout(recalcTimerRef.current);
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [isActive, currentStep]); // eslint-disable-line react-hooks/exhaustive-deps

  // Recalculate on window resize and main container scroll (desktop uses overflow-y-auto on <main>)
  useEffect(() => {
    if (!isActive) return;
    const main = document.querySelector('main');
    window.addEventListener('resize', calculateRect);
    if (main) main.addEventListener('scroll', calculateRect, { passive: true });
    return () => {
      window.removeEventListener('resize', calculateRect);
      if (main) main.removeEventListener('scroll', calculateRect);
    };
  }, [isActive, calculateRect]);

  const handleDone = () => {
    completeOnboarding();
    // Stay on Settings — scroll position stays at the last spotlighted section
  };

  const handleNext = () => {
    if (isLastStep) {
      handleDone();
    } else {
      nextStep();
    }
  };

  // Skip closes the entire wizard immediately
  const handleSkip = () => {
    handleDone();
  };

  if (!isActive) return null;

  const overlayStyle = {
    backgroundColor: 'rgba(0,0,0,0.72)',
    position: 'fixed',
    zIndex: 40,
    pointerEvents: 'none',
  };

  // Welcome step: centered on desktop, bottom-anchored on mobile (same as other steps)
  const cardStyle = isWelcomeStep
    ? window.innerWidth >= 1024
      ? { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: CARD_WIDTH, zIndex: 50 }
      : { position: 'fixed', bottom: '88px', left: '16px', right: '16px', zIndex: 50 }
    : computeCardStyle(rect);

  return (
    <>
      {/* Overlay */}
      {isWelcomeStep ? (
        // Welcome step: full-screen dim, no spotlight cutout
        <div style={{ ...overlayStyle, inset: 0 }} />
      ) : rect ? (
        <>
          {/* Top */}
          <div style={{ ...overlayStyle, top: 0, left: 0, right: 0, height: Math.max(0, rect.top - PADDING) }} />
          {/* Left */}
          <div style={{ ...overlayStyle, top: rect.top - PADDING, left: 0, width: Math.max(0, rect.left - PADDING), height: rect.height + PADDING * 2 }} />
          {/* Right */}
          <div style={{ ...overlayStyle, top: rect.top - PADDING, left: rect.right + PADDING, right: 0, height: rect.height + PADDING * 2 }} />
          {/* Bottom */}
          <div style={{ ...overlayStyle, top: rect.bottom + PADDING, left: 0, right: 0, bottom: 0 }} />

          {/* Dashed highlight border around the spotlighted section */}
          <div
            style={{
              position: 'fixed',
              top: rect.top - PADDING,
              left: rect.left - PADDING,
              width: rect.width + PADDING * 2,
              height: rect.height + PADDING * 2,
              border: '2px dashed #9CA3AF',
              borderRadius: 16,
              zIndex: 41,
              pointerEvents: 'none',
            }}
          />
        </>
      ) : (
        // Full overlay while scrolling / waiting for rect
        <div style={{ ...overlayStyle, inset: 0 }} />
      )}

      {/* Guide card — positioned near the spotlighted element */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={cardStyle}
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 p-4">

            {/* Header row: icon + title + step counter + close */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <Lightbulb size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-base font-semibold text-gray-800 dark:text-white leading-tight">
                  {step.title}
                </span>
                {step.optional && (
                  <span className="text-[10px] font-medium text-gray-400 bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-full">
                    optional
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                <span className="text-xs text-gray-400">
                  {currentStep + 1} / {totalSteps}
                </span>
                <button
                  onClick={handleSkip}
                  className="text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 transition-colors"
                  title="Close tutorial"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 ml-[26px]">
              {step.description}
            </p>

            {/* Bottom row: Back | dots | Next */}
            <div className="flex items-center justify-between">
              {/* Back button */}
              <button
                onClick={prevStep}
                className={`flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors ${
                  currentStep === 0 ? 'opacity-0 pointer-events-none' : ''
                }`}
              >
                <ChevronLeft size={14} />
                Back
              </button>

              {/* Progress dots */}
              <div className="flex items-center gap-1.5">
                {ONBOARDING_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === currentStep ? 20 : 8,
                      height: 8,
                      backgroundColor:
                        i < currentStep
                          ? '#6B7280'
                          : i === currentStep
                          ? '#374151'
                          : '#E5E7EB',
                    }}
                  />
                ))}
              </div>

              {/* Next / Done */}
              <button
                onClick={handleNext}
                className="flex items-center gap-1 text-sm font-semibold text-white bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 px-3 py-1.5 rounded-xl transition-colors"
              >
                {isLastStep ? (
                  <>
                    <Check size={13} />
                    Done
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default OnboardingSpotlight;
