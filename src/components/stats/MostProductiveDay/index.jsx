// src/components/stats/MostProductiveDay/index.jsx
//
// Thin orchestrator for the "Most Productive Day" stats slot.
//
// Variants (evaluated in order, first match wins):
//   1. Australia Working Holiday Visa tracker — when AU mode is active
//      AND at least one work is marked australia88Eligible.
//      → Renders Australia88StatsCard (full visa ledger).
//
//   2. Default — most productive day of the current week.
//      → Shows earnings + day name on the left, hours + shifts on the right.
//
// To add a new variant: import it here and add an early-return guard above
// the default block. Keep each variant's UI in its own component/folder.
// ─────────────────────────────────────────────────────────────────────────────

import { useTranslation } from 'react-i18next';
import { Award, Clock, Repeat } from 'lucide-react';
import { formatCurrency } from '../../../utils/currency';
import { formatHoursDecimal } from '../../../utils/time';
import BaseStatsCard from '../../cards/base/BaseStatsCard';
import { useAustralia88 } from '../../../hooks/useAustralia88';
import Australia88StatsCard from '../../australia88/Australia88StatsCard';
import { useThemeColors } from '../../../hooks/useThemeColors';

const MostProductiveDay = ({ currentData, loading, thematicColors, className = '' }) => {
  const { t } = useTranslation();
  const { isAustraliaMode, hasEligibleWorks } = useAustralia88();
  const colors = useThemeColors();

  // ── Variant: Australia 88-day visa tracker ───────────────────────────────
  // Replaces the default view when the user is in AU mode and has eligible shifts.
  if (isAustraliaMode && hasEligibleWorks) {
    return <Australia88StatsCard className={className} />;
  }

  // ── Default: most productive day ─────────────────────────────────────────
  const mostProductiveDay = currentData?.mostProductiveDay;
  const isEmpty =
    !mostProductiveDay ||
    mostProductiveDay.day === 'None' ||
    !mostProductiveDay.earnings ||
    mostProductiveDay.earnings <= 0;

  return (
    <BaseStatsCard
      icon={Award}
      title={t('stats.mostProductiveDay.title')}
      loading={loading}
      empty={isEmpty}
      emptyMessage={t('stats.mostProductiveDay.empty')}
      className={className}
    >
      {/* Two-column layout: left = earnings + day, right = hours + shifts */}
      <div className="grid grid-cols-2 gap-4 w-full">

        {/* Left — primary earning info */}
        <div className="flex flex-col items-center justify-center text-center">
          <p
            className="text-3xl font-extrabold tracking-tight leading-none"
            style={{ color: thematicColors?.base || colors.primary }}
          >
            {formatCurrency(mostProductiveDay.earnings)}
          </p>
          <p className="text-base font-semibold text-gray-700 dark:text-gray-200 mt-1.5">
            {t(`common.daysFull.${mostProductiveDay.day}`, mostProductiveDay.day)}
          </p>
        </div>

        {/* Right — hours + shifts (with left border as divider) */}
        <div className="flex flex-col items-center justify-center gap-3 border-l border-gray-100 dark:border-gray-700 pl-4">

          <div className="flex items-center gap-2">
            <Clock size={14} className="text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 leading-none mb-0.5">
                {t('stats.mostProductiveDay.hours')}
              </p>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                {formatHoursDecimal(mostProductiveDay.hours || 0)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Repeat size={14} className="text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 leading-none mb-0.5">
                {t('stats.mostProductiveDay.shifts')}
              </p>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                {mostProductiveDay.shifts || 0}
              </p>
            </div>
          </div>

        </div>
      </div>
    </BaseStatsCard>
  );
};

export default MostProductiveDay;
