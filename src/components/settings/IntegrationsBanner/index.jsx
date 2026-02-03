// src/components/settings/IntegrationsBanner/index.jsx

import React, { useMemo } from 'react';
import { ArrowRight, Share2, Puzzle } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { generateColorVariations } from '../../../utils/colorUtils';
import BaseAnnouncementCard from '../../cards/base/BaseAnnouncementCard';
import Button from '../../ui/Button';

const IntegrationsBanner = ({ className }) => {
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
      to="/integrations"
      gradient={gradient}
      className={className}
      decorativeIcon={Share2}
    >
      <div className="p-6 flex items-center justify-between gap-4">
        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Puzzle size={20} className="text-white/80" />
            <h3 className="text-lg font-bold text-white">
              Integrations
            </h3>
          </div>
          <p className="text-sm text-white/80 mt-1 pl-8">
            Set up alerts, Google Calendar and more.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0">
          <Button
            variant="ghost-animated"
            icon={ArrowRight}
            textColor="white"
            className="hover:bg-white/10"
          >
            Set up
          </Button>
        </div>
      </div>
    </BaseAnnouncementCard>
  );
};

export default IntegrationsBanner;