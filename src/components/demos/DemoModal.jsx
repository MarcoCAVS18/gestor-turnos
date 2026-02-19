// src/components/demos/DemoModal.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';
import StepWelcome from './steps/StepWelcome';
import StepWorkTypes from './steps/StepWorkTypes';
import StepLiveMode from './steps/StepLiveMode';
import StepAnalytics from './steps/StepAnalytics';
import { useIsMobile } from '../../hooks/useIsMobile';

const STORAGE_KEY = 'orary_demo_seen';
const TOTAL_STEPS = 4;

const STEP_COMPONENTS = [StepWelcome, StepWorkTypes, StepLiveMode, StepAnalytics];

const DemoModal = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const isMobile = useIsMobile();

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      // Small delay so the login page renders underneath first
      const timer = setTimeout(() => setIsVisible(true), 400);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, 'true');
    setTimeout(() => onComplete?.(), 350);
  }, [onComplete]);

  const handleNext = useCallback(() => {
    if (currentStep === TOTAL_STEPS - 1) {
      handleClose();
    } else {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep, handleClose]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const handleDotClick = useCallback((index) => {
    setDirection(index > currentStep ? 1 : -1);
    setCurrentStep(index);
  }, [currentStep]);

  if (!isVisible) return null;

  const isLastStep = currentStep === TOTAL_STEPS - 1;
  const StepComponent = STEP_COMPONENTS[currentStep];

  // Slide variants with depth — entering cards come from the direction of navigation
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? '40%' : '-40%',
      opacity: 0,
      scale: 0.92,
      rotateY: dir > 0 ? 8 : -8,
      filter: 'blur(4px)',
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: 'blur(0px)',
    },
    exit: (dir) => ({
      x: dir > 0 ? '-30%' : '30%',
      opacity: 0,
      scale: 0.95,
      rotateY: dir > 0 ? -6 : 6,
      filter: 'blur(3px)',
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{ perspective: '1200px' }}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ backdropFilter: 'blur(0px)' }}
        animate={{ backdropFilter: 'blur(12px)' }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-black/60"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`
          relative z-10 bg-white overflow-hidden
          ${isMobile
            ? 'w-full h-full rounded-none'
            : 'w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl'
          }
        `}
      >
        {/* Top bar with skip & close */}
        <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 pt-4">
          {/* Step counter */}
          <span className="text-xs font-medium text-gray-400 tracking-wide">
            {currentStep + 1}/{TOTAL_STEPS}
          </span>

          {/* Skip button */}
          <button
            onClick={handleClose}
            className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors group"
          >
            <span>Skip</span>
            <X size={14} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Step content area */}
        <div className={`relative ${isMobile ? 'h-[calc(100%-80px)] mt-10' : 'min-h-[460px] mt-8'} overflow-hidden`}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.45,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="absolute inset-0"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <StepComponent isMobile={isMobile} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom navigation */}
        <div className={`
          ${isMobile ? 'absolute bottom-0 left-0 right-0' : 'relative'}
          bg-white border-t border-gray-100 px-6 py-4
        `}>
          <div className="flex items-center justify-between">
            {/* Back button */}
            <button
              onClick={handleBack}
              className={`text-sm font-medium text-gray-400 hover:text-gray-600 transition-all duration-200 ${
                currentStep === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              Back
            </button>

            {/* Progress dots */}
            <div className="flex items-center gap-2">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleDotClick(i)}
                  className="relative p-0.5"
                >
                  <motion.div
                    className="rounded-full"
                    animate={{
                      width: i === currentStep ? 24 : 8,
                      height: 8,
                      backgroundColor: i === currentStep ? '#EC4899' : i < currentStep ? '#F9A8D4' : '#E5E7EB',
                    }}
                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                </button>
              ))}
            </div>

            {/* Next / Get Started button */}
            <motion.button
              onClick={handleNext}
              whileTap={{ scale: 0.96 }}
              className={`
                flex items-center gap-1.5 text-sm font-semibold rounded-xl px-5 py-2.5 transition-all duration-300
                ${isLastStep
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/30'
                  : 'text-pink-500 hover:bg-pink-50'
                }
              `}
            >
              <span>{isLastStep ? 'Get Started' : 'Next'}</span>
              <motion.div
                animate={isLastStep ? {} : { x: [0, 3, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ChevronRight size={16} />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DemoModal;
