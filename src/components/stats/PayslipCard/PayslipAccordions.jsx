// src/components/stats/PayslipCard/PayslipAccordions.jsx
// Acordeones colapsables del dashboard:
//   - Desglose por período (tabla)
//   - Resumen del año fiscal (cobertura, proyección, diferencia informal)

import { useTranslation } from 'react-i18next';
import { Calendar, TrendingUp } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { Accordion } from './ui';
import { formatPeriodShort } from './helpers';

const PayslipAccordions = ({
  breakdown,
  fiscalSummary,
  aggregate,
  formatMoney,
  expanded,
  onToggleExpanded,
}) => {
  const { t } = useTranslation();
  const colors = useThemeColors();

  return (
    <div className="space-y-3">
      {/* Acordeón: Desglose por período */}
      <Accordion
        icon={Calendar}
        title={t('payslip.dashboard.breakdownTitle')}
        subtitle={`${breakdown.items.length} · ${aggregate.coveredDays} ${t('payslip.coveredDays').toLowerCase()}`}
        expanded={expanded.breakdown}
        onToggle={() => onToggleExpanded('breakdown')}
        primaryColor={colors.primary}
      >
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-700">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-slate-800/50">
              <tr>
                <th className="text-left px-3 py-2 font-medium text-gray-600 dark:text-gray-400">{t('payslip.dashboard.breakdownPeriod')}</th>
                <th className="text-right px-3 py-2 font-medium text-gray-600 dark:text-gray-400">{t('payslip.dashboard.breakdownGross')}</th>
                <th className="text-right px-3 py-2 font-medium text-gray-600 dark:text-gray-400">{t('payslip.dashboard.breakdownTax')}</th>
                <th className="text-right px-3 py-2 font-medium text-gray-600 dark:text-gray-400">{t('payslip.dashboard.breakdownNet')}</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.items.map((it, idx) => (
                <tr key={idx} className="border-t border-gray-200 dark:border-slate-700">
                  <td className="px-3 py-2 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {formatPeriodShort(it.periodStart, it.periodEnd)}
                  </td>
                  <td className="px-3 py-2 text-right">{formatMoney(it.gross)}</td>
                  <td className="px-3 py-2 text-right">{formatMoney(it.tax)}</td>
                  <td className="px-3 py-2 text-right font-medium">{formatMoney(it.net)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Accordion>

      {/* Acordeón: Año fiscal */}
      {fiscalSummary && (
        <Accordion
          icon={TrendingUp}
          title={t('payslip.fy.title')}
          subtitle={fiscalSummary.currentFY.label}
          expanded={expanded.fy}
          onToggle={() => onToggleExpanded('fy')}
          primaryColor={colors.primary}
        >
          {fiscalSummary.summary ? (
            <div className="space-y-3">
              {/* Cobertura */}
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>{t('payslip.fy.coverage')}</span>
                  <span>
                    {t('payslip.fy.coverageHint', {
                      days: fiscalSummary.summary.coveredDays,
                      total: fiscalSummary.summary.daysInFY,
                      percent: (fiscalSummary.summary.coverageRatio * 100).toFixed(1),
                    })}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden bg-gray-100 dark:bg-slate-700">
                  <div
                    className="h-full"
                    style={{
                      width: `${Math.min(100, fiscalSummary.summary.coverageRatio * 100)}%`,
                      backgroundColor: colors.primary,
                    }}
                  />
                </div>
              </div>

              {/* Proyección anual */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg border border-gray-200 dark:border-slate-700">
                  <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {t('payslip.fy.projectedGross')}
                  </p>
                  <p className="text-sm font-bold mt-1 text-gray-900 dark:text-white truncate">
                    {formatMoney(fiscalSummary.summary.projectedAnnualGross)}
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-gray-200 dark:border-slate-700">
                  <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {t('payslip.fy.projectedTax')}
                  </p>
                  <p className="text-sm font-bold mt-1 text-gray-900 dark:text-white truncate">
                    {formatMoney(fiscalSummary.summary.projectedAnnualTaxByBrackets)}
                  </p>
                </div>
              </div>

              {/* Diferencia informal */}
              <div
                className="p-3 rounded-lg text-sm"
                style={{
                  backgroundColor:
                    fiscalSummary.summary.informalRefund > 0
                      ? colors.transparent10
                      : 'rgba(156,163,175,0.1)',
                }}
              >
                <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                  {t('payslip.fy.informalDiff')}
                </p>
                {fiscalSummary.summary.informalRefund > 0 && (
                  <p className="font-semibold" style={{ color: colors.primary }}>
                    {t('payslip.fy.informalRefund')}: {formatMoney(fiscalSummary.summary.informalRefund)}
                  </p>
                )}
                {fiscalSummary.summary.informalOwed > 0 && (
                  <p className="font-semibold text-gray-700 dark:text-gray-300">
                    {t('payslip.fy.informalOwed')}: {formatMoney(fiscalSummary.summary.informalOwed)}
                  </p>
                )}
                {fiscalSummary.summary.informalRefund === 0 &&
                  fiscalSummary.summary.informalOwed === 0 && (
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('payslip.noRefund')}
                    </p>
                  )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
              {t('payslip.fy.missingFY')}
            </p>
          )}
        </Accordion>
      )}
    </div>
  );
};

export default PayslipAccordions;
