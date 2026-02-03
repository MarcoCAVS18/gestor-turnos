// src/components/dashboard/FeatureAnnouncementCard/index.jsx

import React, { useMemo } from 'react';
import { Sparkles, Clock, Timer, ArrowRight, Info, DollarSign, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { generateColorVariations } from '../../../utils/colorUtils';
import Button from '../../ui/Button';
import BaseAnnouncementCard from '../../cards/base/BaseAnnouncementCard';
import { useLiveMode } from '../../../hooks/useLiveMode';

const FeatureAnnouncementCard = ({ onClick, onShowActive, className }) => {
  const colors = useThemeColors();
  const { isActive, isPaused, formattedTime, formattedEarnings, selectedWork } = useLiveMode();

  const palette = useMemo(() => {
    return generateColorVariations(colors.primary) || {
      lighter: colors.primary,
      base: colors.primary,
      dark: colors.primaryDark,
      darker: colors.primaryDark
    };
  }, [colors.primary, colors.primaryDark]);

  const gradient = `linear-gradient(135deg, ${palette.lighter} 0%, ${colors.primary} 50%, ${palette.darker} 100%)`;

  // Active state - Live Mode is running
  if (isActive) {
    return (
      <BaseAnnouncementCard
        onClick={onShowActive}
        gradient={gradient}
        className={className}
        decorativeIcon={Timer}
      >
        <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between gap-6 h-full">
          {/* Left Side: Active Status Content */}
          <div className="flex-1 space-y-4">
            {/* Live indicator badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/20 backdrop-blur-md text-white text-xs font-bold tracking-wide uppercase shadow-sm">
              <motion.span
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`w-2.5 h-2.5 rounded-full ${isPaused ? 'bg-yellow-400' : 'bg-green-400'}`}
              />
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

            <div className="pt-2">
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
                More information
              </Button>
            </div>
          </div>

          {/* Right Side: Animated clock */}
          <div className="hidden sm:flex flex-col items-center justify-center relative">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-2xl backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <Clock size={32} className="text-white" />
            </motion.div>
          </div>
        </div>
      </BaseAnnouncementCard>
    );
  }

  // Inactive state - Show "Try now" (original)
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

        {/* Right Side: Illustration / Iconography (Now more subtle) */}
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