// src/components/dashboard/FeatureAnnouncementCard/index.jsx

import React, { useMemo } from 'react';
import { Sparkles, Clock, Timer, ArrowRight } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { generateColorVariations } from '../../../utils/colorUtils';
import Button from '../../ui/Button';
import BaseAnnouncementCard from '../../cards/base/BaseAnnouncementCard';

const FeatureAnnouncementCard = ({ onClick, className }) => {
  const colors = useThemeColors();
  
  const palette = useMemo(() => {
    return generateColorVariations(colors.primary) || {
      lighter: colors.primary,
      base: colors.primary,
      dark: colors.primaryDark,
      darker: colors.primaryDark
    };
  }, [colors.primary, colors.primaryDark]);

  const gradient = `linear-gradient(135deg, ${palette.lighter} 0%, ${colors.primary} 50%, ${palette.darker} 100%)`;

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