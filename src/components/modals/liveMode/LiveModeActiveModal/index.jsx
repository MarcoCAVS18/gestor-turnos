// src/components/modals/liveMode/LiveModeActiveModal/index.jsx
// Modal displaying active Live Mode session - Styled like FeatureAnnouncementCard

import React, { useState, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  Square,
  EyeOff,
  Clock,
  DollarSign,
  Sun,
  Sunset,
  Moon,
  Briefcase,
  Timer,
  X,
  CircleDotDashed
} from 'lucide-react';
import { motion } from 'framer-motion';
import Flex from '../../../ui/Flex';
import Button from '../../../ui/Button';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { useLiveMode } from '../../../../hooks/useLiveMode';
import { useConfigContext } from '../../../../contexts/ConfigContext';
import { generateColorVariations } from '../../../../utils/colorUtils';
import LiveModeFinishConfirmModal from '../LiveModeFinishConfirmModal';
import logger from '../../../../utils/logger';

const RATE_TYPE_CONFIG = {
  day: { icon: Sun, label: 'Day', color: '#10B981' },
  afternoon: { icon: Sunset, label: 'Afternoon', color: '#F59E0B' },
  night: { icon: Moon, label: 'Night', color: '#6366F1' },
  saturday: { icon: Briefcase, label: 'Saturday', color: '#8B5CF6' },
  sunday: { icon: Briefcase, label: 'Sunday', color: '#EF4444' },
};

const LiveModeActiveModal = ({ isOpen, onClose }) => {
  const colors = useThemeColors();
  const isMobile = useIsMobile();
  const { smokoEnabled, smokoMinutes } = useConfigContext();
  const {
    isPaused,
    formattedTime,
    formattedEarnings,
    currentRate,
    rateType,
    selectedWork,
    loading,
    liveSession,
    elapsedTime,
    pauseSession,
    resumeSession,
    finishSession,
  } = useLiveMode();

  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Frozen data when finish modal opens
  const [frozenSessionData, setFrozenSessionData] = useState(null);

  const palette = useMemo(() => {
    return generateColorVariations(colors.primary) || {
      lighter: colors.primary,
      base: colors.primary,
      dark: colors.primaryDark,
      darker: colors.primaryDark
    };
  }, [colors.primary, colors.primaryDark]);

  const gradient = `linear-gradient(135deg, ${palette.lighter} 0%, ${colors.primary} 50%, ${palette.darker} 100%)`;

  const rateConfig = RATE_TYPE_CONFIG[rateType] || RATE_TYPE_CONFIG.day;
  const RateIcon = rateConfig.icon;

  const handlePauseResume = async () => {
    setActionLoading('pause');
    try {
      if (isPaused) {
        await resumeSession();
      } else {
        await pauseSession();
      }
    } catch (err) {
      logger.error('Error toggling pause:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Check if user had any pauses during the session
  const hadPauses = (liveSession?.totalPauseDuration || 0) > 0;

  // Should show smoko option: smoko enabled AND no pauses during session
  const shouldOfferSmoko = smokoEnabled && !hadPauses;

  const handleFinish = useCallback(() => {
    // Freeze the current session data when opening finish modal
    setFrozenSessionData({
      time: formattedTime.formatted,
      earnings: formattedEarnings,
      workName: selectedWork?.name,
      elapsedTime: elapsedTime,
      hadPauses: hadPauses,
      shouldOfferSmoko: shouldOfferSmoko,
      smokoMinutes: smokoMinutes,
    });
    setShowFinishConfirm(true);
  }, [formattedTime.formatted, formattedEarnings, selectedWork?.name, elapsedTime, hadPauses, shouldOfferSmoko, smokoMinutes]);

  const handleConfirmFinish = async (deductSmoko = false) => {
    setActionLoading('finish');
    try {
      await finishSession(deductSmoko ? smokoMinutes : 0);
      setShowFinishConfirm(false);
      setFrozenSessionData(null);
      onClose();
    } catch (err) {
      logger.error('Error finishing session:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCloseFinishModal = () => {
    setShowFinishConfirm(false);
    setFrozenSessionData(null);
  };

  const handleHide = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
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
            ${isMobile ? 'max-w-none mx-2 rounded-2xl max-h-[90vh] overflow-y-auto' : 'max-w-md rounded-2xl'}
          `}
          style={{ background: gradient }}
        >
          {/* Decorative background icon */}
          <Timer
            className="absolute -right-6 -bottom-6 text-white/5"
            size={150}
            strokeWidth={1}
            style={{ transform: 'rotate(-20deg)' }}
          />

          {/* Light effects */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-32 h-32 bg-white opacity-5 rounded-full blur-3xl pointer-events-none" />

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="p-6 pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Status badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/20 backdrop-blur-md text-white text-xs font-bold tracking-wide uppercase shadow-sm">
                    <motion.div
                      animate={isPaused ? {} : { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <CircleDotDashed size={14} className="text-red-400" />
                    </motion.div>
                    <span>{isPaused ? 'Paused' : 'Live Active'}</span>
                    {isPaused && <Pause size={12} />}
                  </div>

                  {/* Work name */}
                  {selectedWork && (
                    <p className="text-white/80 text-sm mt-3">{selectedWork.name}</p>
                  )}
                </div>

                {/* Close button */}
                <button
                  onClick={handleHide}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            </div>

            {/* Timer Display */}
            <div className="px-6 py-8 text-center">
              <motion.div
                animate={isPaused ? {} : { scale: [1, 1.01, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  <motion.div
                    animate={isPaused ? {} : { rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center"
                  >
                    <Clock size={28} className="text-white" />
                  </motion.div>
                </div>
                <p className="text-6xl sm:text-7xl font-bold text-white tracking-tight font-mono">
                  {formattedTime.formatted}
                </p>
              </motion.div>
            </div>

            {/* Earnings Display */}
            <div className="px-6 pb-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <DollarSign size={24} className="text-white" />
                  </div>
                  <span className="text-4xl font-bold text-white">{formattedEarnings}</span>
                </div>

                {/* Rate indicator */}
                <div className="flex items-center justify-center gap-3 text-white/70 text-sm">
                  <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                    <RateIcon size={16} />
                    <span>{rateConfig.label}</span>
                  </div>
                  <span className="text-white/50">·</span>
                  <span className="font-medium text-white">${currentRate}/hr</span>
                </div>
              </div>
            </div>

            {/* Time breakdown */}
            <div className="px-6 pb-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl py-3 text-center border border-white/10">
                  <p className="text-white font-bold text-2xl">{formattedTime.hours}</p>
                  <p className="text-white/60 text-xs">Hours</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl py-3 text-center border border-white/10">
                  <p className="text-white font-bold text-2xl">{formattedTime.minutes}</p>
                  <p className="text-white/60 text-xs">Minutes</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl py-3 text-center border border-white/10">
                  <p className="text-white font-bold text-2xl">{formattedTime.seconds}</p>
                  <p className="text-white/60 text-xs">Seconds</p>
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="p-6 pt-2 space-y-3">
              {/* Pause/Resume Button */}
              <Button
                variant="solid"
                onClick={handlePauseResume}
                loading={actionLoading === 'pause'}
                loadingText={isPaused ? 'Resuming...' : 'Pausing...'}
                disabled={loading || actionLoading !== null}
                className="w-full bg-white hover:bg-gray-50 font-semibold py-4 shadow-lg"
                themeColor={colors.primary}
                icon={isPaused ? Play : Pause}
              >
                {isPaused ? 'Resume' : 'Pause'}
              </Button>

              {/* Finish and Hide buttons */}
              <div className="flex gap-3">
                <Button
                  variant="solid"
                  onClick={handleFinish}
                  disabled={loading || actionLoading !== null}
                  className="flex-1 border-none py-3"
                  bgColor={colors.transparent20}
                  textColor={colors.textContrast}
                  icon={Square}
                >
                  Finish
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleHide}
                  disabled={loading || actionLoading !== null}
                  className="flex-1 py-3"
                  themeColor={colors.textContrast}
                  icon={EyeOff}
                >
                  Hide
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </Flex>

      {/* Finish Confirmation Modal */}
      <LiveModeFinishConfirmModal
        isOpen={showFinishConfirm}
        onClose={handleCloseFinishModal}
        onConfirm={handleConfirmFinish}
        loading={actionLoading === 'finish'}
        sessionData={frozenSessionData || {
          time: formattedTime.formatted,
          earnings: formattedEarnings,
          workName: selectedWork?.name,
        }}
      />
    </>
  );
};

export default LiveModeActiveModal;
