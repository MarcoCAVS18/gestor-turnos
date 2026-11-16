// src/components/australia88/Australia88ActivateYear2/index.jsx
// Trigger + modal that lets the user declare they've started Year 2 (after
// their Year 2 visa is approved) directly from wherever the WHV tracker is
// shown, instead of forcing a trip to Settings > Working Holiday Visa.
// Two-step modal: a confirm step, then a confetti celebration (same visual
// language as src/components/premium/SuccessCelebration.jsx) once the year
// switch is saved. Only meant to be rendered once Year 1 is complete and
// Year 2 hasn't been declared yet.

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, PartyPopper, X } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { toLocalDateKey } from '../../../utils/time';

const CONFETTI_COLORS = ['#FFD700', '#FFA500', '#FF6347', '#7B68EE', '#00CED1', '#FF69B4', '#32CD32', '#FF4500'];

const ConfettiParticle = ({ delay, left, color, size = 8 }) => (
  <motion.div
    initial={{ y: -10, opacity: 0, rotate: 0 }}
    animate={{
      y: [0, -50, 280],
      x: [0, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 120],
      opacity: [0, 1, 1, 0],
      rotate: [0, Math.random() * 360, Math.random() * 720],
    }}
    transition={{ duration: 2.5, delay, ease: 'easeOut' }}
    className="absolute rounded-sm"
    style={{
      left: `${left}%`,
      top: '20%',
      width: size,
      height: size * (Math.random() > 0.5 ? 1 : 2.5),
      backgroundColor: color,
    }}
  />
);

const Australia88ActivateYear2 = ({ className = '' }) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { savePreferences } = useApp();
  // null | 'confirm' | 'saving' | 'celebrating'
  const [step, setStep] = useState(null);

  const handleConfirm = async () => {
    setStep('saving');
    try {
      // Mirrors Settings > Working Holiday Visa's "Year 2" card: declaring
      // Year 2 also resets the manual pre-Orary day count for the new year,
      // and records today as the cutover date — shifts logged before this
      // date count toward Year 1, shifts from here on count toward Year 2.
      await savePreferences({
        australia88VisaYear: 2,
        australia88ManualDays: 0,
        australia88Year2StartDate: toLocalDateKey(),
      });
      setStep('celebrating');
    } catch {
      setStep('confirm');
    }
  };

  const close = () => setStep(null);

  return (
    <>
      <button
        type="button"
        onClick={() => setStep('confirm')}
        className={`inline-flex items-center gap-1 text-xs font-semibold hover:underline ${className}`}
        style={{ color: colors.primary }}
      >
        {t('australia88.activateYear2')}
        <ArrowUpRight size={13} />
      </button>

      <AnimatePresence>
        {step && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60"
              onClick={step !== 'saving' ? close : undefined}
            />

            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 250, damping: 18 }}
              className={`relative rounded-2xl overflow-hidden shadow-2xl max-w-xs w-full ${
                step === 'celebrating' ? '' : 'bg-white dark:bg-slate-800'
              }`}
              style={
                step === 'celebrating'
                  ? { background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})` }
                  : undefined
              }
            >
              {step === 'celebrating' ? (
                <>
                  {/* Confetti */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <ConfettiParticle
                        key={i}
                        delay={0.2 + i * 0.06}
                        left={Math.random() * 100}
                        color={CONFETTI_COLORS[i % CONFETTI_COLORS.length]}
                        size={5 + Math.random() * 5}
                      />
                    ))}
                  </div>

                  <div className="relative z-10 py-10 px-6 text-center">
                    <motion.div
                      initial={{ rotate: -20, scale: 0 }}
                      animate={{ rotate: [-20, 8, -3, 0], scale: [0, 1.3, 0.9, 1] }}
                      transition={{ duration: 0.7, delay: 0.15 }}
                    >
                      <PartyPopper size={64} className="mx-auto mb-4 drop-shadow-lg" style={{ color: 'white' }} />
                    </motion.div>

                    <motion.h2
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                      className="text-xl font-black text-white mb-2 drop-shadow-md"
                    >
                      {t('australia88.year2CelebrationTitle')}
                    </motion.h2>

                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-white/85 text-sm mb-6"
                    >
                      {t('australia88.year2CelebrationDesc')}
                    </motion.p>

                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      type="button"
                      onClick={close}
                      className="px-5 py-2 rounded-xl bg-white/15 backdrop-blur-sm text-white text-sm font-semibold hover:bg-white/25 transition-colors"
                    >
                      {t('common.close')}
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center">
                  <button
                    type="button"
                    onClick={close}
                    disabled={step === 'saving'}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-40"
                  >
                    <X size={18} />
                  </button>

                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${colors.primary}15` }}
                  >
                    <ArrowUpRight size={26} style={{ color: colors.primary }} />
                  </div>

                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                    {t('australia88.activateYear2')}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    {t('australia88.activateYear2Confirm')}
                  </p>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={close}
                      disabled={step === 'saving'}
                      className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-40"
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirm}
                      disabled={step === 'saving'}
                      className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                      style={{ backgroundColor: colors.primary }}
                    >
                      {step === 'saving' ? t('common.saving') : t('common.confirm')}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Australia88ActivateYear2;
