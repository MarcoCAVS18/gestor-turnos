// src/components/dashboard/FavoriteWorksCard/index.jsx
//
// ── Dashboard slot orchestrator ───────────────────────────────────────────────
//
// This component owns the "favorite works" slot on the Dashboard grid.
// It decides which card to render based on the active feature context:
//
//  • AU MODE (holidayCountry === 'AU' + at least one eligible work)
//    → Australia88DashboardCard  (Working Holiday Visa 88-day tracker)
//    The visibility guard (hasEligibleWorks) prevents surfacing an empty
//    tracker before the user has configured any eligible works.
//
//  • DEFAULT
//    → top-earning works list with progress bars
//
// To add a new variant: import it here and add an early-return guard above
// the default view. Keep each variant's UI in its own component/folder.
//
// ─────────────────────────────────────────────────────────────────────────────

import { useNavigate } from 'react-router-dom';
import { BarChart3, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useAustralia88 } from '../../../hooks/useAustralia88';
import { formatCurrency } from '../../../utils/currency';
import { DELIVERY_PLATFORMS_AUSTRALIA } from '../../../constants/delivery';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Flex from '../../ui/Flex';
import ProgressBar from '../../ui/ProgressBar';
import Australia88DashboardCard from '../../australia88/Australia88DashboardCard';

const FavoriteWorksCard = ({ favoriteWorks }) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // useAustralia88 returns safe defaults when AU mode is off — always safe to call.
  const { isAustraliaMode, hasEligibleWorks } = useAustralia88();

  // ── Variant: AU Working Holiday Visa tracker ───────────────────────────────
  if (isAustraliaMode && hasEligibleWorks) {
    return <Australia88DashboardCard />;
  }
  // ─────────────────────────────────────────────────────────────────────────

  // Helper function to get the correct color for the work
  const getWorkColor = (work) => {
    // 1. If it is a traditional work, it has its own color
    if (work.color) return work.color;

    // 2. If it is delivery, we look for the color of the selected platform
    if (work.platform) {
      const platform = DELIVERY_PLATFORMS_AUSTRALIA.find(
        p => p.name === work.platform
      );
      if (platform) return platform.color;
    }

    // 3. Fallback: avatarColor or gray by default
    return work.avatarColor || '#9CA3AF';
  };

  // Empty state
  if (favoriteWorks.length === 0) {
    return (
      <Card className="flex flex-col h-full">
        <Flex variant="between" className="mb-4 flex-nowrap gap-3">
          <h3 className="text-base font-semibold flex items-center text-gray-800 dark:text-gray-100 truncate">
            <BarChart3 size={20} style={{ color: colors.primary }} className="mr-2 flex-shrink-0" />
            <span className="truncate">{t('dashboard.favoriteWorks.title')}</span>
          </h3>
        </Flex>
        <Flex variant="center" className="flex-grow py-6">
          <div className="text-center text-gray-400">
            <BarChart3 size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t('dashboard.favoriteWorks.empty')}</p>
          </div>
        </Flex>
      </Card>
    );
  }

  // Calculate max earnings for progress bars
  const maxEarnings = Math.max(...favoriteWorks.map(w => w.earnings));

  return (
    <Card className="flex flex-col h-full">
      <Flex variant="between" className="mb-4 flex-nowrap gap-3">
        <h3 className="text-base font-semibold flex items-center text-gray-800 dark:text-gray-100 truncate">
          <BarChart3 size={20} style={{ color: colors.primary }} className="mr-2 flex-shrink-0" />
          <span className="truncate">{t('dashboard.favoriteWorks.title')}</span>
        </h3>

        <Button
          onClick={() => navigate('/statistics')}
          size="sm"
          variant="ghost"
          animatedChevron
          collapsed={isMobile}
          className="flex-shrink-0 whitespace-nowrap text-gray-400 hover:text-gray-600"
          themeColor={colors.primary}
          icon={ChevronRight}
          iconPosition="right"
        >
          {t('dashboard.favoriteWorks.viewMore')}
        </Button>
      </Flex>

      <div className="space-y-4 flex-grow">
        {favoriteWorks.map((workInfo, index) => {
          const progressPercentage = (workInfo.earnings / maxEarnings) * 100;
          const workColor = getWorkColor(workInfo.work);

          return (
            <div key={workInfo.work.id} className="space-y-2">
              <Flex variant="between">
                <Flex variant="center" className="overflow-hidden">
                  <span className="text-sm font-semibold text-gray-400 mr-3 flex-shrink-0">
                    #{index + 1}
                  </span>

                  <div
                    className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                    style={{ backgroundColor: workColor }}
                  />

                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 dark:text-gray-100 truncate">
                      {workInfo.work.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {workInfo.shifts} {t('dashboard.favoriteWorks.shiftLabel')} • {workInfo.hours.toFixed(1)}h
                    </p>
                  </div>
                </Flex>
                <p
                  className="text-sm font-semibold whitespace-nowrap ml-2"
                  style={{ color: colors.primary }}
                >
                  {formatCurrency(workInfo.earnings)}
                </p>
              </Flex>

              {/* Visual progress bar */}
              <div className="ml-8">
                <ProgressBar
                  value={progressPercentage}
                  color={workColor}
                  height="6px"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Flex variant="between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t('dashboard.favoriteWorks.totalLabel')} {favoriteWorks.length}
          </span>
          <span className="text-base font-bold" style={{ color: colors.primary }}>
            {formatCurrency(favoriteWorks.reduce((sum, w) => sum + w.earnings, 0))}
          </span>
        </Flex>
      </div>
    </Card>
  );
};

export default FavoriteWorksCard;
