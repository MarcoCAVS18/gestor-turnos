// src/components/settings/Australia88Section/index.jsx
// Settings section for Australian Working Holiday Visa 88-day tracker.
// Shown inside DeliveryPlatformsSection when holidayCountry === 'AU'.

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, CheckCircle, Plus, Minus, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import logger from '../../../utils/logger';

const Australia88Section = ({ className }) => {
  const { t } = useTranslation();
  const { australia88VisaYear, australia88ManualDays, savePreferences } = useApp();
  const colors = useThemeColors();

  const [selectedYear, setSelectedYear] = useState(australia88VisaYear ?? 1);
  const [manualDays, setManualDays] = useState(australia88ManualDays ?? 0);
  const [showManualEntry, setShowManualEntry] = useState((australia88ManualDays ?? 0) > 0);
  const [saving, setSaving] = useState(false);

  // Sync local state when context changes (e.g. on load from Firebase)
  useEffect(() => {
    setSelectedYear(australia88VisaYear ?? 1);
    const days = australia88ManualDays ?? 0;
    setManualDays(days);
    if (days > 0) setShowManualEntry(true);
  }, [australia88VisaYear, australia88ManualDays]);

  // Auto-save with debounce
  useEffect(() => {
    const timeout = setTimeout(async () => {
      const yearChanged = selectedYear !== (australia88VisaYear ?? 1);
      const daysChanged = manualDays !== (australia88ManualDays ?? 0);
      if (!yearChanged && !daysChanged) return;

      try {
        setSaving(true);
        await savePreferences({
          australia88VisaYear: selectedYear,
          australia88ManualDays: manualDays,
        });
      } catch (err) {
        logger.error('Error saving Australia88 settings:', err);
      } finally {
        setSaving(false);
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [selectedYear, manualDays, australia88VisaYear, australia88ManualDays, savePreferences]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setManualDays(0);
    setShowManualEntry(false);
  };

  const increment = () => setManualDays(d => Math.min(88, d + 1));
  const decrement = () => {
    setManualDays(d => {
      const next = Math.max(0, d - 1);
      if (next === 0) setShowManualEntry(false);
      return next;
    });
  };

  const handleActivateManual = () => {
    setShowManualEntry(true);
    setManualDays(1);
  };

  return (
    <SettingsSection
      icon={Globe}
      title={`🇦🇺 ${t('settings.australia88.title')}`}
      className={className}
    >
      <div className="space-y-4">

        {/* Year Cards */}
        <div className="grid grid-cols-2 gap-2">
          {[1, 2].map((year) => {
            const isActive = selectedYear === year;
            const isY1DoneByY2 = year === 1 && selectedYear === 2;

            // Goal display key — drives AnimatePresence swap
            const goalKey = isActive && year === 2 ? '176' : isY1DoneByY2 ? 'done' : '88';
            const goalText = isActive && year === 2 ? '176 d' : isY1DoneByY2 ? '88 / 88' : '88 d';

            return (
              <button
                key={year}
                onClick={() => handleYearChange(year)}
                className="relative flex flex-col items-center justify-center py-4 px-3 rounded-xl border-2 transition-all duration-200 overflow-hidden"
                style={
                  isActive
                    ? { backgroundColor: `${colors.primary}15`, borderColor: colors.primary }
                    : {
                        borderColor: isY1DoneByY2 ? '#d1fae5' : '#e5e7eb',
                        backgroundColor: isY1DoneByY2 ? '#f0fdf4' : 'transparent',
                      }
                }
              >
                {/* Checkmark for Y1 when user is in Y2 */}
                <AnimatePresence>
                  {isY1DoneByY2 && (
                    <motion.span
                      className="absolute top-1.5 right-1.5"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CheckCircle size={14} className="text-green-500" />
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Active indicator dot */}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.15 }}
                      style={{ backgroundColor: colors.primary }}
                    />
                  )}
                </AnimatePresence>

                {/* Year label */}
                <span
                  className="text-lg font-black leading-none text-center transition-colors duration-200"
                  style={{
                    color: isActive ? colors.primary : isY1DoneByY2 ? '#16a34a' : '#9ca3af',
                  }}
                >
                  {year === 1 ? t('settings.australia88.year1') : t('settings.australia88.year2')}
                </span>

                {/* Animated goal badge */}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={goalKey}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="mt-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: isActive
                        ? `${colors.primary}20`
                        : isY1DoneByY2
                        ? '#dcfce7'
                        : '#f3f4f6',
                      color: isActive ? colors.primary : isY1DoneByY2 ? '#15803d' : '#9ca3af',
                    }}
                  >
                    {goalText}
                  </motion.span>
                </AnimatePresence>

                {/* "~6 months" label — only for active Y2 */}
                <AnimatePresence>
                  {isActive && year === 2 && (
                    <motion.span
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                      className="text-[9px] mt-0.5"
                      style={{ color: `${colors.primary}90` }}
                    >
                      ~6 months
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>

        {/* Pre-Orary days section */}
        <div
          className="rounded-xl border transition-all duration-200"
          style={{
            borderColor: showManualEntry ? `${colors.primary}40` : '#e5e7eb',
            backgroundColor: showManualEntry ? `${colors.primary}08` : 'transparent',
          }}
        >
          <AnimatePresence mode="wait">
            {!showManualEntry ? (
              /* Inactive state — compact row with optional action */
              <motion.button
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={handleActivateManual}
                className="w-full flex items-center justify-between px-3 py-3 text-left"
              >
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {t('settings.australia88.manualDays')}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                    {selectedYear === 1
                      ? t('settings.australia88.manualDaysDescY1')
                      : t('settings.australia88.manualDaysDescY2')}
                  </p>
                </div>
                <div
                  className="flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0 ml-3"
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  <Plus size={14} style={{ color: colors.primary }} />
                </div>
              </motion.button>
            ) : (
              /* Active state — stepper + day dots */
              <motion.div
                key="expanded"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.18 }}
                className="px-3 py-3 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    {selectedYear === 1
                      ? t('settings.australia88.manualDaysY1Title')
                      : t('settings.australia88.manualDaysY2Title')}
                  </p>
                  {saving ? (
                    <span className="text-[10px] text-gray-400">{t('common.saving')}</span>
                  ) : manualDays > 0 ? (
                    <span className="flex items-center gap-1 text-[10px]" style={{ color: colors.primary }}>
                      <Check size={11} />
                      {t('common.saved')}
                    </span>
                  ) : null}
                </div>

                {/* Stepper control */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={decrement}
                    className="w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all active:scale-95"
                    style={{ borderColor: '#e5e7eb', color: '#9ca3af' }}
                  >
                    <Minus size={16} />
                  </button>

                  <div className="flex-1 text-center">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={manualDays}
                        initial={{ opacity: 0, y: manualDays > 0 ? -8 : 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: manualDays > 0 ? 8 : -8 }}
                        transition={{ duration: 0.12 }}
                        className="text-3xl font-black inline-block"
                        style={{ color: colors.primary }}
                      >
                        {manualDays}
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-sm text-gray-400 ml-1.5">d</span>
                  </div>

                  <button
                    onClick={increment}
                    disabled={manualDays >= 88}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all active:scale-95 disabled:opacity-40"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Visual dot grid — 1 dot per day */}
                {manualDays > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {Array.from({ length: Math.min(manualDays, 44) }).map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.15, delay: i * 0.012 }}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: `${colors.primary}60` }}
                      />
                    ))}
                    {manualDays > 44 && (
                      <span className="text-[10px] text-gray-400 self-center ml-1">
                        +{manualDays - 44}
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </SettingsSection>
  );
};

export default Australia88Section;
