// src/components/australia88/Australia88MonthlyChart/index.jsx
// Radial bar chart of visa days earned per calendar month (deliberately a
// different chart geometry from the weekly bar chart, for visual variety),
// plus the same values as a text grid (table view) — scoped to whichever
// year is selected (Y1/Y2 toggle, defaults to the currently active year).
// Self-contained: calls useAustralia88() internally.

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useAustralia88 } from '../../../hooks/useAustralia88';
import Card from '../../ui/Card';
import BaseChart from '../../charts/BaseChart';

const formatMonthLabel = (monthStart, locale) =>
  monthStart.toLocaleDateString(locale || 'en', { month: 'short', year: '2-digit' });

const Australia88MonthlyChart = () => {
  const { t, i18n } = useTranslation();
  const colors = useThemeColors();
  const { year2Active, year1MonthlyBreakdown, year2MonthlyBreakdown } = useAustralia88();

  // Defaults to the active year, but the user can flip back to see Year 1.
  const [viewYear, setViewYear] = useState(year2Active ? 2 : 1);
  useEffect(() => { setViewYear(year2Active ? 2 : 1); }, [year2Active]);

  const monthlyBreakdown = viewYear === 2 ? year2MonthlyBreakdown : year1MonthlyBreakdown;

  const chartData = monthlyBreakdown.map((month) => ({
    label: formatMonthLabel(month.monthStart, i18n.language),
    visaDays: month.visaDays,
  }));

  // Reads the label from the data row itself (payload[0].payload.label)
  // rather than Recharts' top-level `label` arg, since RadialBarChart —
  // unlike Cartesian charts with an XAxis — doesn't supply one.
  const dayTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const row = payload[0].payload;
    return (
      <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 text-xs">
        <p className="font-bold text-gray-800 dark:text-gray-100">{row.label}</p>
        <p style={{ color: colors.primary }}>{row.visaDays} {t('australia88.daysUnit')}</p>
      </div>
    );
  };

  return (
    <Card className="flex flex-col min-w-0">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
            {t('australia88.stats.monthlyTitle')}
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {t('australia88.stats.monthlySubtitle')}
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

      {monthlyBreakdown.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 py-6 text-center">
          {t('australia88.stats.empty')}
        </p>
      ) : (
        <>
          <div className="h-80 min-h-0 min-w-0">
            <BaseChart
              data={chartData}
              chartType="radialBar"
              dataKeys="visaDays"
              nameKey="label"
              showLegend={false}
              customTooltipContent={dayTooltip}
            />
          </div>

          {/* Table view — same values as the chart, as text */}
          <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {monthlyBreakdown.map((month) => (
              <div
                key={month.monthKey}
                className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50"
              >
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatMonthLabel(month.monthStart, i18n.language)}
                </span>
                <span className="text-xs font-bold tabular-nums" style={{ color: colors.primary }}>
                  {month.visaDays}{t('australia88.daysUnit')}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};

export default Australia88MonthlyChart;
