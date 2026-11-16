// src/components/australia88/Australia88WeeklyChart/index.jsx
// Bar chart of visa days earned in the last 12 weeks, plus a scrollable
// ledger with the full weekly history — scoped to whichever year is
// selected (Y1/Y2 toggle, defaults to the currently active year) so the
// page doesn't keep showing Year 1's history once the user has moved on to
// Year 2. Self-contained: calls useAustralia88() internally — no prop
// drilling needed.

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useAustralia88 } from '../../../hooks/useAustralia88';
import { formatWeekRange } from '../../../services/australia88Service';
import Card from '../../ui/Card';
import BaseChart from '../../charts/BaseChart';
import VisaDots from '../VisaDots';

const RECENT_WEEKS_IN_CHART = 12;

const Australia88WeeklyChart = () => {
  const { t, i18n } = useTranslation();
  const colors = useThemeColors();
  const { year2Active, year1WeeklyBreakdown, year2WeeklyBreakdown } = useAustralia88();

  // Defaults to the active year, but the user can flip back to see Year 1.
  const [viewYear, setViewYear] = useState(year2Active ? 2 : 1);
  useEffect(() => { setViewYear(year2Active ? 2 : 1); }, [year2Active]);

  const weeklyBreakdown = viewYear === 2 ? year2WeeklyBreakdown : year1WeeklyBreakdown;

  const chartData = weeklyBreakdown.slice(-RECENT_WEEKS_IN_CHART).map((week) => ({
    label: formatWeekRange(week.weekStart, week.weekEnd, i18n.language),
    visaDays: week.visaDays,
  }));

  // Most recent weeks first in the full ledger
  const allWeeksDesc = [...weeklyBreakdown].sort((a, b) => b.weekStart - a.weekStart);

  const dayTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 text-xs">
        <p className="font-bold text-gray-800 dark:text-gray-100">{label}</p>
        <p style={{ color: colors.primary }}>{payload[0].value} {t('australia88.daysUnit')}</p>
      </div>
    );
  };

  return (
    <Card className="flex flex-col min-w-0">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
            {t('australia88.stats.weeklyTitle')}
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {t('australia88.stats.weeklySubtitle', { count: RECENT_WEEKS_IN_CHART })}
          </p>
        </div>

        {year2Active && (
          <div className="flex rounded-lg overflow-hidden border flex-shrink-0" style={{ borderColor: colors.border }}>
            {[1, 2].map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setViewYear(y)}
                className="px-2 py-0.5 text-[10px] font-semibold transition-colors"
                style={
                  viewYear === y
                    ? { backgroundColor: colors.primary, color: '#fff' }
                    : { backgroundColor: 'transparent', color: colors.textSecondary }
                }
              >
                Y{y}
              </button>
            ))}
          </div>
        )}
      </div>

      {weeklyBreakdown.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 py-6 text-center">
          {t('australia88.stats.empty')}
        </p>
      ) : (
        <>
          <div className="h-48 min-h-0 min-w-0">
            <BaseChart
              data={chartData}
              chartType="bar"
              dataKeys={[{ key: 'visaDays', name: t('australia88.stats.daysShort') }]}
              nameKey="label"
              showLegend={false}
              customTooltipContent={dayTooltip}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            />
          </div>

          {/* Full weekly ledger — same data as the chart, as a scrollable table */}
          <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-3 max-h-72 overflow-y-auto">
            <div className="space-y-1.5">
              {allWeeksDesc.map((week) => (
                <div
                  key={week.weekKey}
                  className="flex items-center gap-2 px-1 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                >
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-24 flex-shrink-0 tabular-nums">
                    {formatWeekRange(week.weekStart, week.weekEnd, i18n.language)}
                  </span>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300 w-12 flex-shrink-0 tabular-nums">
                    {week.hours.toFixed(1)}h
                  </span>
                  <VisaDots days={week.visaDays} color={colors.primary} />
                  <span
                    className="text-xs font-bold ml-auto flex-shrink-0 tabular-nums"
                    style={{ color: week.visaDays > 0 ? colors.primary : colors.textSecondary }}
                  >
                    {week.visaDays}{t('australia88.daysUnit')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default Australia88WeeklyChart;
