// src/components/dashboard/FeatureAnnouncementCard/index.jsx

import React, { useMemo, useState } from 'react';
import {
  Sparkles,
  Clock,
  Timer,
  ArrowRight,
  Info,
  DollarSign,
  Pause,
  Play,
  Square,
  CircleDotDashed,
  Plus,
  Truck,
  Crown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { generateColorVariations } from '../../../utils/colorUtils';
import Button from '../../ui/Button';
import BaseAnnouncementCard from '../../cards/base/BaseAnnouncementCard';
import { useLiveMode } from '../../../hooks/useLiveMode';
import { useDataContext } from '../../../contexts/DataContext';
import LiveModeFinishConfirmModal from '../../modals/liveMode/LiveModeFinishConfirmModal';
import { useConfigContext } from '../../../contexts/ConfigContext';
import { PREMIUM_COLORS } from '../../../contexts/PremiumContext';

const FeatureAnnouncementCard = ({ onClick, onShowActive, className }) => {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const { works } = useDataContext();
  const { smokoEnabled, smokoMinutes } = useConfigContext();
  const {
    isActive,
    isPaused,
    formattedTime,
    formattedEarnings,
    selectedWork,
    liveSession,
    elapsedTime,
    pauseSession,
    resumeSession,
    finishSession,
    loading,
    liveModeUsage,
    liveModeLimit
  } = useLiveMode();

  // Modal state for finish confirmation
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [frozenSessionData, setFrozenSessionData] = useState(null);

  // Check if user has regular (traditional) works
  const regularWorks = useMemo(() => {
    return (works || []).filter(w => w.type === 'regular' && w.active !== false);
  }, [works]);

  const hasRegularWorks = regularWorks.length > 0;

  const palette = useMemo(() => {
    return generateColorVariations(colors.primary) || {
      lighter: colors.primary,
      base: colors.primary,
      dark: colors.primaryDark,
      darker: colors.primaryDark
    };
  }, [colors.primary, colors.primaryDark]);

  const gradient = `linear-gradient(135deg, ${palette.lighter} 0%, ${colors.primary} 50%, ${palette.darker} 100%)`;

  // Handle pause/resume
  const handlePauseResume = async (e) => {
    e.stopPropagation();
    setActionLoading('pause');
    try {
      if (isPaused) {
        await resumeSession();
      } else {
        await pauseSession();
      }
    } catch (err) {
      console.error('Error toggling pause:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle finish - open confirmation modal
  const handleFinish = (e) => {
    e.stopPropagation();
    const hadPauses = (liveSession?.totalPauseDuration || 0) > 0;
    const shouldOfferSmoko = smokoEnabled && !hadPauses;

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
  };

  // Confirm finish
  const handleConfirmFinish = async (deductSmoko = false) => {
    setActionLoading('finish');
    try {
      await finishSession(deductSmoko ? smokoMinutes : 0);
      setShowFinishConfirm(false);
      setFrozenSessionData(null);
    } catch (err) {
      console.error('Error finishing session:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Navigate to add work
  const handleAddWork = (e) => {
    e.stopPropagation();
    navigate('/works');
  };

  // Active state - Live Mode is running
  if (isActive) {
    return (
      <>
        <BaseAnnouncementCard
          onClick={onShowActive}
          gradient={gradient}
          className={className}
          decorativeIcon={Timer}
        >
          <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between gap-6 h-full">
            {/* Left Side: Active Status Content */}
            <div className="flex-1 space-y-4">
              {/* Live indicator badge with CircleDotDashed icon */}
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

              {/* Work name and timer */}
              <div>
                <p className="text-white/80 text-sm mb-1">{selectedWork?.name || 'Live Shift'}</p>
                <motion.h2
                  animate={isPaused ? {} : { scale: [1, 1.01, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-3xl sm:text-4xl font-bold text-white leading-tight font-mono"
                >
                  {formattedTime.formatted}
                </motion.h2>
              </div>

              {/* Earnings indicator */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                  <DollarSign size={18} className="text-white/80" />
                  <span className="text-white font-semibold text-lg">{formattedEarnings}</span>
                </div>
              </div>

              {/* Action buttons: Pause/Resume, Finish, More Info */}
              <div className="pt-2 flex flex-wrap gap-2">
                <Button
                  onClick={handlePauseResume}
                  variant='solid'
                  loading={actionLoading === 'pause'}
                  disabled={loading || actionLoading !== null}
                  className="bg-white/20 hover:bg-white/30 text-white border-none font-semibold shadow-md active:scale-95 transition-transform"
                  icon={isPaused ? Play : Pause}
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button
                  onClick={handleFinish}
                  variant='solid'
                  disabled={loading || actionLoading !== null}
                  className="bg-white/20 hover:bg-white/30 text-white border-none font-semibold shadow-md active:scale-95 transition-transform"
                  icon={Square}
                >
                  Finish
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowActive?.();
                  }}
                  variant='solid'
                  className="bg-white border-none font-semibold shadow-md active:scale-95 transition-transform hover:bg-gray-50"
                  themeColor={colors.primary}
                  icon={Info}
                >
                  More info
                </Button>
              </div>
            </div>

            {/* Right Side: Animated clock with Live icon */}
            <div className="hidden sm:flex flex-col items-center justify-center relative">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-2xl backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg relative"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <Clock size={32} className="text-white" />
                {/* Live indicator */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white"
                >
                  <CircleDotDashed size={10} className="text-white" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </BaseAnnouncementCard>

        {/* Finish Confirmation Modal */}
        <LiveModeFinishConfirmModal
          isOpen={showFinishConfirm}
          onClose={() => {
            setShowFinishConfirm(false);
            setFrozenSessionData(null);
          }}
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
  }

  // Inactive state - No regular works available
  if (!hasRegularWorks) {
    return (
      <BaseAnnouncementCard
        gradient={gradient}
        className={className}
        decorativeIcon={Timer}
      >
        <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between gap-6 h-full">
          {/* Left Side: Text Content */}
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/20 backdrop-blur-md text-white text-xs font-bold tracking-wide uppercase shadow-sm">
              <Sparkles size={12} className="text-yellow-300" />
              <span>New Feature</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-2">
                Live Mode
              </h2>
              <p className="text-white text-sm sm:text-base leading-relaxed max-w-md opacity-90">
                To use Live Mode, you need to add a traditional work to your profile first.
              </p>
            </div>

            {/* Info about delivery coming soon */}
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 text-white/80 text-xs">
              <Truck size={14} />
              <span>Delivery works support coming soon</span>
            </div>

            <div className="pt-2">
              <Button
                onClick={handleAddWork}
                variant='solid'
                className="bg-white border-none font-semibold shadow-md active:scale-95 transition-transform hover:bg-gray-50"
                themeColor={colors.primary}
                icon={Plus}
              >
                Add Work
              </Button>
            </div>
          </div>

          {/* Right Side: Illustration */}
          <div className="hidden sm:flex flex-col items-center justify-center relative opacity-50 group-hover/card:opacity-100 transition-opacity">
            <div
              className="absolute -bottom-2 -left-4 w-12 h-12 rounded-xl backdrop-blur-sm border border-white/20 flex items-center justify-center transform -rotate-12 shadow-lg animate-pulse"
              style={{ backgroundColor: palette.light }}
            >
              <Clock size={24} className="text-white" />
            </div>
          </div>
        </div>
      </BaseAnnouncementCard>
    );
  }

  // Inactive state - Has regular works, show "Try now"
  return (
    <BaseAnnouncementCard
      onClick={onClick}
      gradient={gradient}
      className={className}
      decorativeIcon={Timer}
    >
      <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between gap-6 h-full">
        {/* Left Side: Text Content */}
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/20 backdrop-blur-md text-white text-xs font-bold tracking-wide uppercase shadow-sm">
            <Sparkles size={12} className="text-yellow-300" />
            <span>New Feature</span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-2">
              Live Mode
            </h2>
            <p className="text-white text-sm sm:text-base leading-relaxed max-w-md opacity-90">
              Full control of your shifts in real time. Clock in, pause, and monitor your earnings instantly.
            </p>
          </div>

          {/* Usage counter section */}
          {liveModeUsage?.isPremium ? (
            // Premium user badge
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2 w-fit"
              style={{
                backgroundColor: `${PREMIUM_COLORS.gold}30`,
                border: `1px solid ${PREMIUM_COLORS.gold}50`
              }}
            >
              <Crown size={16} style={{ color: PREMIUM_COLORS.gold }} />
              <span className="text-sm text-white font-semibold">
                Unlimited Sessions
              </span>
            </div>
          ) : (
            // Free user - usage counter with progress
            <div className="space-y-2">
              <div
                className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-2 w-fit"
                style={(liveModeUsage?.remaining ?? liveModeLimit) <= 2 ? {
                  backgroundColor: 'rgba(251, 191, 36, 0.2)',
                  border: '1px solid rgba(251, 191, 36, 0.4)'
                } : {}}
              >
                <Crown size={16} style={{ color: PREMIUM_COLORS.gold }} />
                <span className="text-sm text-white">
                  <span className="font-semibold">{liveModeUsage?.remaining ?? liveModeLimit}</span>
                  <span className="opacity-80">/{liveModeLimit} sessions this month</span>
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-32 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${((liveModeUsage?.remaining ?? liveModeLimit) / liveModeLimit) * 100}%`,
                    backgroundColor: (liveModeUsage?.remaining ?? liveModeLimit) <= 2
                      ? PREMIUM_COLORS.gold
                      : 'white'
                  }}
                />
              </div>

              {/* Upgrade hint when running low */}
              {(liveModeUsage?.remaining ?? liveModeLimit) <= 2 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/premium');
                  }}
                  className="text-xs text-white/80 hover:text-white underline underline-offset-2 transition-colors"
                >
                  Upgrade to Premium for unlimited →
                </button>
              )}
            </div>
          )}

          <div className="pt-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
              variant='solid'
              className="bg-white border-none font-semibold shadow-md active:scale-95 transition-transform hover:bg-gray-50"
              themeColor={colors.primary}
              icon={ArrowRight}
            >
              Try now
            </Button>
          </div>
        </div>

        {/* Right Side: Illustration / Iconography */}
        <div className="hidden sm:flex flex-col items-center justify-center relative opacity-50 group-hover/card:opacity-100 transition-opacity">
          <div
            className="absolute -bottom-2 -left-4 w-12 h-12 rounded-xl backdrop-blur-sm border border-white/20 flex items-center justify-center transform -rotate-12 shadow-lg animate-pulse"
            style={{ backgroundColor: palette.light }}
          >
            <Clock size={24} className="text-white" />
          </div>
        </div>
      </div>
    </BaseAnnouncementCard>
  );
};

export default FeatureAnnouncementCard;
