// src/components/settings/IntegrationsBanner/index.jsx

import React, ***REMOVED*** useMemo ***REMOVED*** from 'react';
import ***REMOVED*** ArrowRight, Share2, Puzzle ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** generateColorVariations ***REMOVED*** from '../../../utils/colorUtils';
import BaseAnnouncementCard from '../../cards/base/BaseAnnouncementCard';
import Button from '../../ui/Button';

const IntegrationsBanner = (***REMOVED*** className ***REMOVED***) => ***REMOVED***
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
      to="/integraciones"
      gradient=***REMOVED***gradient***REMOVED***
      className=***REMOVED***className***REMOVED***
      decorativeIcon=***REMOVED***Share2***REMOVED***
    >
      <div className="p-6 flex items-center justify-between gap-4">
        ***REMOVED***/* Content */***REMOVED***
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Puzzle size=***REMOVED***20***REMOVED*** className="text-white/80" />
            <h3 className="text-lg font-bold text-white">
              Integrations
            </h3>
          </div>
          <p className="text-sm text-white/80 mt-1 pl-8">
            Set up alerts, Google Calendar and more.
          </p>
        </div>

        ***REMOVED***/* Action Button */***REMOVED***
        <div className="flex-shrink-0">
          <Button
            variant="ghost-animated"
            icon=***REMOVED***ArrowRight***REMOVED***
            textColor="white"
            className="hover:bg-white/10"
          >
            Set up
          </Button>
        </div>
      </div>
    </BaseAnnouncementCard>
  );
***REMOVED***;

export default IntegrationsBanner;