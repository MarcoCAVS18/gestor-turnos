// src/components/stats/PayslipCard/PayslipShiftCoverage.jsx
// Panel COMPACTO de cobertura: badge de estado + una línea + link a detalle.
// El desglose día por día vive en un Modal (no inline) a propósito — un
// acordeón inline dentro de un grid de cards (PayslipSummaryCard) o de un
// layout de 2 columnas (PayslipCard) cambia de alto al expandirse y eso
// estira/rompe visualmente todo lo que comparte fila con él. El Modal es un
// overlay: nunca afecta el alto de la card ni del grid que la contiene.
//   - onAddMissing presente (Documentos) → botón para completar los días
//     faltantes reusando PayslipShiftGenerator en modo "solo huecos".
//   - onAddMissing ausente (Cálculos, de solo lectura) → link a Documentos.

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Calendar, Plus, ChevronRight } from 'lucide-react';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatDayShort } from './helpers';

const STATUS_BADGE = {
  full: { variant: 'success', icon: CheckCircle2 },
  partial: { variant: 'warning', icon: AlertTriangle },
  empty: { variant: 'default', icon: Calendar },
};

const PayslipShiftCoverage = ({ coverage, onAddMissing, className = '', bare = false }) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [detailOpen, setDetailOpen] = useState(false);

  if (!coverage) return null;

  const { status, daysMissing, loggedHours, payslipHours, hoursDelta, days } = coverage;
  const badge = STATUS_BADGE[status];
  const hoursMismatch = Math.abs(hoursDelta) > 0.5;

  return (
    <>
      <div className={bare ? className : `rounded-xl border border-gray-200 dark:border-slate-700 p-3 ${className}`}>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {t('payslip.coverage.title')}
          </p>
          <Badge variant={badge.variant} icon={badge.icon}>
            {t(`payslip.coverage.status.${status}`)}
          </Badge>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {status === 'full' && t('payslip.coverage.full')}
          {status === 'partial' && t('payslip.coverage.partial', { count: daysMissing })}
          {status === 'empty' && t('payslip.coverage.empty')}
        </p>

        {hoursMismatch && (
          <p className="flex items-start gap-1.5 text-xs text-orange-600 dark:text-orange-400 mt-1.5">
            <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
            {t('payslip.coverage.hoursMismatch', { delta: Math.abs(hoursDelta) })}
          </p>
        )}

        <button
          type="button"
          onClick={() => setDetailOpen(true)}
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium hover:underline"
          style={{ color: colors.primary }}
        >
          {t('payslip.coverage.viewDetail')}
          <ChevronRight size={13} />
        </button>

        {status !== 'full' && (
          <div className="mt-2.5">
            {onAddMissing ? (
              status === 'partial' && (
                <Button
                  onClick={onAddMissing}
                  icon={Plus}
                  iconPosition="left"
                  themeColor={colors.primary}
                  size="sm"
                  className="w-full"
                >
                  {t('payslip.coverage.addMissing')}
                </Button>
              )
            ) : (
              <Link
                to="/statistics/payslips"
                className="inline-flex items-center justify-center gap-1.5 w-full text-xs font-medium py-2 rounded-lg border transition-colors"
                style={{ borderColor: colors.primary, color: colors.primary }}
              >
                {t('payslip.coverage.goToDocuments')}
              </Link>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={t('payslip.coverage.dayByDay')}
        size="md"
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-gray-50 dark:bg-slate-700/50 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
                {t('payslip.coverage.loggedHours')}
              </p>
              <p className="text-sm font-bold mt-0.5 text-gray-900 dark:text-white">{loggedHours} h</p>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-slate-700/50 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
                {t('payslip.coverage.payslipHours')}
              </p>
              <p className="text-sm font-bold mt-0.5 text-gray-900 dark:text-white">{payslipHours} h</p>
            </div>
          </div>

          <div className="space-y-1 max-h-[50vh] overflow-y-auto pr-1">
            {days.map((day) => (
              <div
                key={day.date}
                className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-slate-800/50"
              >
                <span className="text-gray-600 dark:text-gray-300 font-medium capitalize">
                  {formatDayShort(day.date)}
                </span>
                {day.hasShift ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 size={13} />
                    {day.shifts.map((s) => `${s.startTime}–${s.endTime}`).join(', ')}
                  </span>
                ) : (
                  <Link
                    to={`/calendar?date=${day.date}`}
                    className="inline-flex items-center gap-1 text-gray-400 dark:text-slate-500 border border-dashed border-gray-300 dark:border-slate-600 rounded px-1.5 py-0.5 hover:border-gray-400 dark:hover:border-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                  >
                    <Plus size={12} />
                    {t('payslip.coverage.noShiftThisDay')}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PayslipShiftCoverage;
