// src/components/modals/liveMode/LiveModeStartModal/index.jsx
// Modal to start a new Live Mode session - Styled like FeatureAnnouncementCard

import React, { useState, useMemo } from 'react';
import { Play, Briefcase, AlertCircle, X, Timer, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Flex from '../../../ui/Flex';
import Button from '../../../ui/Button';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { useDataContext } from '../../../../contexts/DataContext';
import { useLiveMode } from '../../../../hooks/useLiveMode';
import { generateColorVariations } from '../../../../utils/colorUtils';

const LiveModeStartModal = ({ isOpen, onClose }) => {
  const colors = useThemeColors();
  const isMobile = useIsMobile();
  const { works } = useDataContext();
  const { startSession, isActive, loading, error } = useLiveMode();

  const [selectedWorkId, setSelectedWorkId] = useState('');
  const [localError, setLocalError] = useState(null);

  // Filter only regular works (not delivery)
  const regularWorks = useMemo(() => {
    return (works || []).filter(w => w.type === 'regular' && w.active !== false);
  }, [works]);

  const selectedWork = regularWorks.find(w => w.id === selectedWorkId);

  const palette = useMemo(() => {
    return generateColorVariations(colors.primary) || {
      lighter: colors.primary,
      base: colors.primary,
      dark: colors.primaryDark,
      darker: colors.primaryDark
    };
  }, [colors.primary, colors.primaryDark]);

  const gradient = `linear-gradient(135deg, ${palette.lighter} 0%, ${colors.primary} 50%, ${palette.darker} 100%)`;

  const handleStart = async () => {
    if (!selectedWorkId) {
      setLocalError('Please select a work first');
      return;
    }

    if (isActive) {
      setLocalError('There is already an active live session');
      return;
    }

    try {
      setLocalError(null);
      await startSession(selectedWorkId);
      onClose();
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const handleClose = () => {
    setSelectedWorkId('');
    setLocalError(null);
    onClose();
  };

  const displayError = localError || error;

  if (!isOpen) return null;

  return (
    <Flex
      variant="center"
      className="fixed inset-0 bg-black/60 backdrop-blur-sm p-4"
      style={{ zIndex: 9999 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className={`
          relative overflow-hidden w-full
          ${isMobile ? 'max-w-none mx-2 rounded-2xl' : 'max-w-md rounded-2xl'}
        `}
        style={{ background: gradient }}
      >
        {/* Decorative background icon */}
        <Timer
          className="absolute -right-4 -bottom-4 text-white/5"
          size={120}
          strokeWidth={1}
          style={{ transform: 'rotate(-20deg)' }}
        />

        {/* Light effects */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-32 h-32 bg-white opacity-5 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/20 backdrop-blur-md text-white text-xs font-bold tracking-wide uppercase shadow-sm mb-4">
                  <Sparkles size={12} className="text-yellow-300" />
                  <span>Live Mode</span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                  Start Tracking
                </h2>
                <p className="text-white/80 text-sm">
                  Select your work and start tracking your shift in real-time
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={handleClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 pb-6 space-y-4">
            {/* Warning if already active */}
            {isActive && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <AlertCircle size={20} className="text-yellow-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Active session detected</p>
                  <p className="text-sm text-white/70 mt-1">
                    You already have a live session running. Please finish it first.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Error display */}
            <AnimatePresence>
              {displayError && !isActive && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-red-500/20 backdrop-blur-sm border border-red-400/30"
                >
                  <AlertCircle size={20} className="text-red-300 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-white">{displayError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Work selector */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-white/80">
                Select Work
              </label>

              {regularWorks.length === 0 ? (
                <div className="text-center py-8 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <Briefcase size={40} className="mx-auto mb-3 text-white/50" />
                  <p className="text-white/80">No works available</p>
                  <p className="text-sm mt-1 text-white/60">Please create a work first</p>
                </div>
              ) : (
                <div className="grid gap-2 max-h-64 overflow-y-auto pr-1">
                  {regularWorks.map((work) => (
                    <motion.button
                      key={work.id}
                      type="button"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedWorkId(work.id)}
                      className={`
                        w-full p-4 rounded-xl text-left transition-all backdrop-blur-sm
                        ${selectedWorkId === work.id
                          ? 'bg-white/30 border-2 border-white shadow-lg'
                          : 'bg-white/10 border border-white/20 hover:bg-white/20'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                          <Briefcase size={20} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white truncate">{work.name}</p>
                          {work.rates && (
                            <p className="text-sm text-white/60">
                              ${work.rates.day}/hr
                            </p>
                          )}
                        </div>
                        {selectedWorkId === work.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-white flex items-center justify-center"
                          >
                            <svg
                              className="w-4 h-4"
                              style={{ color: colors.primary }}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected work rates preview */}
            {selectedWork && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <p className="text-sm text-white/60 mb-3">Hourly rates:</p>
                <div className="grid grid-cols-3 gap-2">
                  {selectedWork.rates?.day && (
                    <div className="text-center p-2 bg-white/10 rounded-lg">
                      <p className="text-xs text-white/60">Day</p>
                      <p className="font-semibold text-white">${selectedWork.rates.day}</p>
                    </div>
                  )}
                  {selectedWork.rates?.afternoon && (
                    <div className="text-center p-2 bg-white/10 rounded-lg">
                      <p className="text-xs text-white/60">Afternoon</p>
                      <p className="font-semibold text-white">${selectedWork.rates.afternoon}</p>
                    </div>
                  )}
                  {selectedWork.rates?.night && (
                    <div className="text-center p-2 bg-white/10 rounded-lg">
                      <p className="text-xs text-white/60">Night</p>
                      <p className="font-semibold text-white">${selectedWork.rates.night}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="solid"
                onClick={handleClose}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white border-none"
              >
                Cancel
              </Button>
              <Button
                variant="solid"
                onClick={handleStart}
                loading={loading}
                loadingText="Starting..."
                disabled={!selectedWorkId || isActive || loading}
                className="flex-1 bg-white hover:bg-gray-50 font-semibold shadow-lg"
                themeColor={colors.primary}
                icon={Play}
              >
                Start Live
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </Flex>
  );
};

export default LiveModeStartModal;
