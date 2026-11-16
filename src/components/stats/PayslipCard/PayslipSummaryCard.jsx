// src/components/stats/PayslipCard/PayslipSummaryCard.jsx
// Compact at-a-glance summary of a single payslip: gross / tax / net / hours
// for its period, with a status badge. Small and presentational.

import { useTranslation } from 'react-i18next';
import { Briefcase, User, MapPin } from 'lucide-react';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { isComplete, formatPeriodShort } from './helpers';
import PayslipShiftCoverage from './PayslipShiftCoverage';

const Metric = ({ label, value, accentColor }) => (
  <div className="rounded-xl bg-gray-50 dark:bg-slate-700/50 px-3 py-2.5">
    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">{label}</p>
    <p className="text-base font-bold mt-0.5" style={accentColor ? { color: accentColor } : undefined}>{value}</p>
  </div>
);

const InfoRow = ({ icon: Icon, label, value, accentColor }) => (
  <div className="flex items-center gap-2 min-w-0">
    <Icon size={14} className="flex-shrink-0" style={{ color: accentColor }} />
    <span className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500 shrink-0">{label}</span>
    <span className="text-xs font-medium text-gray-800 dark:text-gray-100 truncate ml-auto text-right">{value}</span>
  </div>
);

const PayslipSummaryCard = ({ payslip, formatMoney, coverage, className = '' }) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  if (!payslip) return null;

  const gross = Number(payslip.gross) || 0;
  const tax = Number(payslip.tax) || 0;
  const net = gross - tax;
  const hours = Number(payslip.hours) || 0;
  const needsReview = payslip.lowConfidence || !isComplete(payslip);
  const hasMeta = payslip.employer || payslip.employee || payslip.location;

  return (
    <Card className={`p-5 h-full flex flex-col ${className}`}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
          {payslip.fileName || t('payslip.manualEntry')}
        </p>
        <Badge variant={needsReview ? 'warning' : 'success'} size="sm">
          {needsReview ? t('payslip.list.incomplete') : t('payslip.previewTitle')}
        </Badge>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        {formatPeriodShort(payslip.periodStart, payslip.periodEnd)}
      </p>

      {hasMeta && (
        <div className="space-y-2 mb-4 pb-4 border-b border-gray-100 dark:border-slate-700">
          {payslip.employer && (
            <InfoRow icon={Briefcase} label={t('payslip.employer')} value={payslip.employer} accentColor={colors.primary} />
          )}
          {payslip.employee && (
            <InfoRow icon={User} label={t('payslip.employee')} value={payslip.employee} accentColor={colors.primary} />
          )}
          {payslip.location && (
            <InfoRow icon={MapPin} label={t('payslip.location')} value={payslip.location} accentColor={colors.primary} />
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2.5 mt-auto">
        <Metric label={t('payslip.gross')} value={formatMoney(gross)} />
        <Metric label={t('payslip.tax')} value={formatMoney(tax)} />
        <Metric label={t('payslip.net')} value={formatMoney(net)} accentColor={colors.primary} />
        <Metric label={t('payslip.hours')} value={hours > 0 ? hours : '—'} />
      </div>

      {coverage && (
        <div className="mt-4">
          {/* Sin onAddMissing: esta página es de solo lectura, la acción de
              completar turnos vive en Documentos. */}
          <PayslipShiftCoverage coverage={coverage} />
        </div>
      )}
    </Card>
  );
};

export default PayslipSummaryCard;
