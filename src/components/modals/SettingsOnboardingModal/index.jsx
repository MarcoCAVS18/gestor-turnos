// src/components/modals/SettingsOnboardingModal/index.jsx
// Friendly onboarding modal shown once after demos complete.
// Explains why we need permissions and recommends profile customization.

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Coins, Briefcase, Target, Receipt, Coffee } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../services/firebase';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { generateColorVariations } from '../../../utils/colorUtils';

const SETTINGS_ONBOARDING_KEY = 'settingsOnboardingDone';

// Logo SVG component with customizable color
const LogoIcon = ({ color = '#EC4899', className = '' }) => (
  <svg 
    viewBox="0 0 852.69 852.17" 
    className={className}
    fill="currentColor"
    style={{ color }}
  >
    <path d="M137.67,342.17v48.69c0,7.27,16.89,27.07,23.06,31.59,30.56,22.44,52.4.71,82.43-4.68,37.45-6.73,72.35,4.24,102.01,26.88,6.86-2.2,11.54-7.66,17.96-11.11,42.52-22.91,82.72-24.44,125.25-.49,4.59,2.58,15.31,12.09,19.04,11.72,29.6-22.6,64.77-33.71,102.14-26.99,29.96,5.39,51.6,27.31,82.43,4.68,6.17-4.54,23.06-24.32,23.06-31.59v-48.69h30.74v45.27c0,27.91-27.51,58.87-52.51,68.77-49.09,19.45-73.11-13.95-115.74-9.82-15.97,1.55-40.59,11.56-50.19,24.44,8.98,13.43,15.39,29.21,18.1,45.21,5.07,29.92-1.37,61.43-37.94,62-57.59.89-43.23-77.02-21.5-108.39-25.77-25.43-67.13-30.2-99.32-14.23-7.8,3.87-12.77,9.19-20.02,13.35,3.21,9.74,9.26,17.2,12.62,27.22,9.86,29.39,13.39,77.57-27.47,81.71-61.72,6.24-50.7-73.58-26.48-106.86-9.81-13.04-33.73-22.84-50.19-24.44-43.8-4.24-66.18,29.45-115.74,9.82-24.99-9.9-52.51-40.86-52.51-68.77v-45.27h30.77ZM347.75,497.63c-2.99-2.87-5.8,6.48-6.41,8.08-3.05,8.06-11.25,39.22.46,41.47,25.23,4.83,10.08-37.77,5.94-49.55h0ZM514.74,545.02c5.52-5.8-.97-37.61-5.05-44.46-1.3-2.18-1.71-3.53-4.73-2.93-3.42,11.29-17.45,46.02-.06,50.57,2.49.71,8.44-1.69,9.86-3.18h-.01Z"/>
    <path d="M420.89,274.33c86.69-6.01,97.59,122.97,16.38,132.58-96.24,11.37-103.02-126.57-16.38-132.58h0ZM422.54,305.02c-46.86,5.76-40.45,74.05,4.59,73.07,49.6-1.08,44.36-79.09-4.59-73.07h0Z"/>
    <path d="M263.69,274.32c85.8-1.47,90.86,124.78,11.46,132.76-98.24,9.87-99.63-131.26-11.46-132.76h0ZM261.93,305c-31.36,4.33-45.03,42.29-20.08,63.68,30.65,26.28,74.21-8.29,55.36-45.12-6.15-12.01-21.87-20.42-35.28-18.56h0Z"/>
    <path d="M586.37,274.5c85.87-1.33,88.05,124.8,11.64,132.58-99.95,10.16-101.11-131.18-11.64-132.58ZM581.36,305.01c-54.85,8.96-26.85,95.94,23.56,67.98,36.43-20.21,14.99-74.27-23.56-67.98h0Z"/>
  </svg>
);

const SettingsOnboardingModal = ({ onComplete }) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const gradient = useMemo(() => {
    const palette = generateColorVariations(colors.primary) || {
      lighter: colors.primary,
      base: colors.primary,
      dark: colors.primaryDark,
      darker: colors.primaryDark
    };
    return `linear-gradient(135deg, ${palette.lighter} 0%, ${colors.primary} 50%, ${palette.darker} 100%)`;
  }, [colors.primary, colors.primaryDark]);

  // Check Firebase if should show modal
  const checkShouldShow = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (!data[SETTINGS_ONBOARDING_KEY]) {
          setIsOpen(true);
        }
      } else {
        setIsOpen(true);
      }
    } catch {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkShouldShow();
    }, 500);
    return () => clearTimeout(timer);
  }, [checkShouldShow]);

  const markAsCompleted = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await setDoc(doc(db, 'users', user.uid), {
        [SETTINGS_ONBOARDING_KEY]: true,
        updatedAt: new Date()
      }, { merge: true });
    } catch {
      // Silent fail
    }
  };

  const handleContinue = async () => {
    setLoading(true);
    await markAsCompleted();
    setIsOpen(false);
    setTimeout(() => {
      onComplete?.();
      setLoading(false);
    }, 300);
  };

  if (!isOpen) return null;

  // Recommendations with icons
  const recommendations = [
    { key: 'goals', icon: Target },
    { key: 'deductions', icon: Receipt },
    { key: 'breaks', icon: Coffee },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleContinue}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`
          relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden
          ${isMobile ? 'w-full max-w-sm' : 'w-full max-w-md'}
        `}
      >
        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Logo centered */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 mb-3">
              <LogoIcon color={colors.primary} className="w-full h-full" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('settingsOnboarding.welcomeTitle')}
            </h2>
          </div>

          {/* Why we need location - compact */}
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center leading-relaxed">
              {t('settingsOnboarding.whyLocation')}
            </p>

            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50">
                <Globe size={20} className="mx-auto mb-1.5" style={{ color: colors.primary }} />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {t('settingsOnboarding.location.benefit1')}
                </p>
              </div>
              <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50">
                <Coins size={20} className="mx-auto mb-1.5" style={{ color: colors.primary }} />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {t('settingsOnboarding.location.benefit2')}
                </p>
              </div>
              <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50">
                <Briefcase size={20} className="mx-auto mb-1.5" style={{ color: colors.primary }} />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {t('settingsOnboarding.location.benefit3')}
                </p>
              </div>
            </div>
          </div>

          {/* Privacy note - subtle */}
          <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
            {t('settingsOnboarding.privacyNote')}
          </p>

          {/* Recommendations - compact */}
          <div className="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              {t('settingsOnboarding.recommendations.title')}
            </p>
            <div className="flex flex-wrap gap-2">
              {recommendations.map(({ key, icon: Icon }) => (
                <span 
                  key={key}
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full bg-white dark:bg-slate-600 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-500"
                >
                  <Icon size={12} style={{ color: colors.primary }} />
                  {t(`settingsOnboarding.recommendations.${key}`)}
                </span>
              ))}
            </div>
          </div>

          {/* Continue Button with gradient and animated arrow */}
          <button
            onClick={handleContinue}
            disabled={loading}
            className="w-full relative flex items-center justify-center gap-2 text-sm font-medium text-white rounded-xl px-5 py-3 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
            style={{ background: gradient }}
          >
            <span>{t('settingsOnboarding.continue')}</span>
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowRight size={16} />
            </motion.div>
          </button>

          {/* Native prompts note */}
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            {t('settingsOnboarding.nativePromptsNote')}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsOnboardingModal;