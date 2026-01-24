// src/components/dashboard/FeatureAnnouncementCard/index.jsx

import React, ***REMOVED*** useMemo ***REMOVED*** from 'react';
import ***REMOVED*** Sparkles, Clock, Timer, ArrowRight ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** generateColorVariations ***REMOVED*** from '../../../utils/colorUtils';
import Button from '../../ui/Button';
import BaseAnnouncementCard from '../../cards/base/BaseAnnouncementCard';

const FeatureAnnouncementCard = (***REMOVED*** onClick, className ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  
  const palette = useMemo(() => ***REMOVED***
    return generateColorVariations(colors.primary) || ***REMOVED***
      lighter: colors.primary,
      base: colors.primary,
      dark: colors.primaryDark,
      darker: colors.primaryDark
    ***REMOVED***;
  ***REMOVED***, [colors.primary, colors.primaryDark]);

  const gradient = `linear-gradient(135deg, $***REMOVED***palette.lighter***REMOVED*** 0%, $***REMOVED***colors.primary***REMOVED*** 50%, $***REMOVED***palette.darker***REMOVED*** 100%)`;

  return (
    <BaseAnnouncementCard
      onClick=***REMOVED***onClick***REMOVED***
      gradient=***REMOVED***gradient***REMOVED***
      className=***REMOVED***className***REMOVED***
      decorativeIcon=***REMOVED***Timer***REMOVED***
    >
      <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between gap-6 h-full">
        ***REMOVED***/* Left Side: Text Content */***REMOVED***
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/20 backdrop-blur-md text-white text-xs font-bold tracking-wide uppercase shadow-sm">
            <Sparkles size=***REMOVED***12***REMOVED*** className="text-yellow-300" />
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
                onClick=***REMOVED***(e) => ***REMOVED***
                    e.stopPropagation();
                    onClick?.();
                ***REMOVED******REMOVED***
                variant='solid'
                className="bg-white border-none font-semibold shadow-md active:scale-95 transition-transform hover:bg-gray-50"
                themeColor=***REMOVED***colors.primary***REMOVED***
                icon=***REMOVED***ArrowRight***REMOVED***
            >
              Try now
            </Button>
          </div>
        </div>

        ***REMOVED***/* Right Side: Illustration / Iconography (Now more subtle) */***REMOVED***
        <div className="hidden sm:flex flex-col items-center justify-center relative opacity-50 group-hover/card:opacity-100 transition-opacity">
            <div 
                className="absolute -bottom-2 -left-4 w-12 h-12 rounded-xl backdrop-blur-sm border border-white/20 flex items-center justify-center transform -rotate-12 shadow-lg animate-pulse"
                style=***REMOVED******REMOVED*** backgroundColor: palette.light ***REMOVED******REMOVED***
            >
                <Clock size=***REMOVED***24***REMOVED*** className="text-white" />
            </div>
        </div>
      </div>
    </BaseAnnouncementCard>
  );
***REMOVED***;

export default FeatureAnnouncementCard;