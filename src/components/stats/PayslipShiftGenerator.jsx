// src/components/stats/PayslipShiftGenerator.jsx
// Mini-configurador para generar turnos a partir de uno o varios payslips.
// Recibe `periods: [{ periodStart, periodEnd, hours }]` y aplica el mismo
// patrón (días + horario + work) a cada uno. Por período, si las horas no
// cierran exacto, el último turno se ajusta para llegar al total.
// Si hay países como Australia, agrega la pregunta de los 88 días una sola vez.

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, CheckSquare, Sparkles, AlertCircle, Crown } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useThemeColors } from '../../hooks/useThemeColors';
import { createSafeDate, calculateShiftHours } from '../../utils/time';

// Orden visual lunes → domingo, mapeado a getDay() (0 = domingo, 1 = lunes, ...)
const WEEKDAY_ORDER = [
  { dayIndex: 1, key: 'mon' },
  { dayIndex: 2, key: 'tue' },
  { dayIndex: 3, key: 'wed' },
  { dayIndex: 4, key: 'thu' },
  { dayIndex: 5, key: 'fri' },
  { dayIndex: 6, key: 'sat' },
  { dayIndex: 0, key: 'sun' },
];

const formatDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const computeAdjustedEnd = (start, hours) => {
  const [h, m] = start.split(':').map(Number);
  const totalMinutes = h * 60 + m + Math.round(hours * 60);
  const endH = Math.floor((totalMinutes / 60) % 24);
  const endM = totalMinutes % 60;
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
};

/**
 * Genera turnos para un único período aplicando el patrón.
 * `onlyDates` (Set opcional de 'YYYY-MM-DD') restringe los turnos generados
 * a esas fechas puntuales — usado para completar solo los días faltantes de
 * un payslip parcialmente cubierto, en vez del período completo.
 * Devuelve los turnos generados + flags de ajuste.
 */
const buildShiftsForPeriod = ({ periodStart, periodEnd, selectedDays, startTime, endTime, totalHours, workId, onlyDates = null }) => {
  const start = createSafeDate(periodStart);
  const end = createSafeDate(periodEnd);
  if (!start || !end || start > end) return { shifts: [], hoursPerShift: 0, lastHours: 0, adjusted: false };

  const matchingDates = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    if (selectedDays.includes(cursor.getDay()) && (!onlyDates || onlyDates.has(formatDate(cursor)))) {
      matchingDates.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  if (matchingDates.length === 0) {
    return { shifts: [], hoursPerShift: 0, lastHours: 0, adjusted: false };
  }

  const baseHours = calculateShiftHours(startTime, endTime);
  const total = Number(totalHours) > 0 ? Number(totalHours) : baseHours * matchingDates.length;
  const projected = baseHours * matchingDates.length;
  const lastShiftHours = total - baseHours * (matchingDates.length - 1);
  const adjusted = Math.abs(projected - total) > 0.05;

  const shifts = matchingDates.map((date, idx) => {
    const isLast = idx === matchingDates.length - 1;
    const shiftHours = adjusted && isLast ? Math.max(0, lastShiftHours) : baseHours;
    const shiftEnd = adjusted && isLast ? computeAdjustedEnd(startTime, shiftHours) : endTime;
    const crosses = startTime > shiftEnd;
    return {
      workId: workId || null,
      startDate: formatDate(date),
      startTime,
      endTime: shiftEnd,
      crossesMidnight: crosses,
      hadBreak: false,
      breakMinutes: 0,
      notes: '',
      createdWith: 'payslip',
    };
  });

  return {
    shifts,
    hoursPerShift: baseHours,
    lastHours: adjusted ? lastShiftHours : baseHours,
    adjusted,
  };
};

const PayslipShiftGenerator = ({
  periods = [],
  works = [],
  showAustralia88 = false,
  // Gate premium: free con >=1 trabajo tradicional no puede crear otro
  canCreateWork = true,
  // Tarifa efectiva del recibo (formateada) con la que se precargará el trabajo nuevo
  estimatedRateLabel = null,
  // Fechas puntuales ('YYYY-MM-DD') a completar — modo "solo huecos" del
  // detector de cobertura (PayslipShiftCoverage). undefined/[] = período completo.
  restrictToDates = null,
  onCancel,
  onConfirm,
  loading = false,
}) => {
  const { t } = useTranslation();
  const colors = useThemeColors();

  const onlyDatesSet = useMemo(
    () => (restrictToDates && restrictToDates.length > 0 ? new Set(restrictToDates) : null),
    [restrictToDates]
  );

  const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5]); // L–V por defecto
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  // '__new__' = create a brand-new work (reuses the app's addJob via onConfirm).
  const [workId, setWorkId] = useState(works[0]?.id || '__new__');
  const [newWorkName, setNewWorkName] = useState('');
  const [australia88, setAustralia88] = useState(showAustralia88 ? null : false);
  const [error, setError] = useState(null);

  const creatingNew = workId === '__new__';

  const toggleDay = (dayIndex) => {
    setSelectedDays((prev) =>
      prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex]
    );
  };

  // Genera el preview combinado para todos los períodos
  const preview = useMemo(() => {
    if (!startTime || !endTime || selectedDays.length === 0 || periods.length === 0) {
      return { allShifts: [], totalShifts: 0, periodCount: 0, anyAdjusted: false };
    }
    let allShifts = [];
    let anyAdjusted = false;
    let validPeriods = 0;
    for (const p of periods) {
      if (!p.periodStart || !p.periodEnd) continue;
      const r = buildShiftsForPeriod({
        periodStart: p.periodStart,
        periodEnd: p.periodEnd,
        selectedDays,
        startTime,
        endTime,
        totalHours: p.hours,
        workId: creatingNew ? null : workId,
        onlyDates: onlyDatesSet,
      });
      if (r.shifts.length > 0) {
        validPeriods += 1;
        allShifts = allShifts.concat(r.shifts);
        if (r.adjusted) anyAdjusted = true;
      }
    }
    return {
      allShifts,
      totalShifts: allShifts.length,
      periodCount: validPeriods,
      anyAdjusted,
    };
  }, [periods, selectedDays, startTime, endTime, workId, creatingNew, onlyDatesSet]);

  const skippedCount = periods.filter((p) => !p.periodStart || !p.periodEnd).length;

  const handleConfirm = () => {
    if (!startTime || !endTime) {
      setError(t('payslip.missingTimeFields'));
      return;
    }
    if (preview.totalShifts === 0) {
      setError(t('payslip.shiftsPreviewEmpty'));
      return;
    }
    if (creatingNew && !canCreateWork) {
      setError(t('payslipNav.newWorkPremium'));
      return;
    }
    if (creatingNew && !newWorkName.trim()) {
      setError(t('payslip.workNameRequired'));
      return;
    }
    if (!creatingNew && !workId) {
      setError(t('payslip.noWorks'));
      return;
    }
    if (showAustralia88 && australia88 === null) {
      setError(null);
      return;
    }

    setError(null);
    onConfirm({
      shifts: preview.allShifts,
      workId: creatingNew ? null : workId,
      newWorkName: creatingNew ? newWorkName.trim() : null,
      australia88: showAustralia88 ? Boolean(australia88) : false,
    });
  };

  return (
    // min-w-0 evita overflow horizontal en grids hijos
    <div className="space-y-4 min-w-0">
      {/* Selector de work */}
      <div className="min-w-0">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('payslip.selectWork')}
        </label>
        <select
          value={workId}
          onChange={(e) => setWorkId(e.target.value)}
          className="block w-full max-w-full px-3 py-2 border rounded-lg shadow-sm border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-offset-0"
          style={{ '--tw-ring-color': colors.primary }}
        >
          {works.map((w) => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
          <option value="__new__" disabled={!canCreateWork}>
            + {t('payslip.createWork')}{!canCreateWork ? ` (${t('premium.badge')})` : ''}
          </option>
        </select>
        {!canCreateWork && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400">
            <Crown size={12} style={{ color: '#F59E0B' }} className="flex-shrink-0" />
            {t('payslipNav.newWorkPremium')}
          </p>
        )}
        {creatingNew && canCreateWork && (
          <>
            <input
              type="text"
              value={newWorkName}
              onChange={(e) => setNewWorkName(e.target.value)}
              placeholder={t('payslip.workNamePlaceholder')}
              className="mt-2 block w-full max-w-full px-3 py-2 border rounded-lg shadow-sm border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-offset-0"
              style={{ '--tw-ring-color': colors.primary }}
            />
            {estimatedRateLabel && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400">
                <Sparkles size={12} className="flex-shrink-0" style={{ color: colors.primary }} />
                {t('payslipNav.rateFromPayslip', { rate: estimatedRateLabel })}
              </p>
            )}
          </>
        )}
      </div>

      {/* Aviso de modo "solo huecos" (completar días faltantes) */}
      {onlyDatesSet && (
        <div
          className="flex items-start gap-2 p-3 rounded-lg text-xs"
          style={{ backgroundColor: colors.transparent10, color: colors.primary }}
        >
          <Sparkles size={14} className="flex-shrink-0 mt-0.5" />
          <span>{t('payslip.fillGapsHint', { count: onlyDatesSet.size })}</span>
        </div>
      )}

      {/* Días de la semana */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Calendar size={16} className="inline mr-2" />
          {t('payslip.workDays')}
        </label>
        <div className="flex flex-wrap gap-2">
          {WEEKDAY_ORDER.map(({ dayIndex, key }) => {
            const active = selectedDays.includes(dayIndex);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleDay(dayIndex)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors"
                style={{
                  backgroundColor: active ? colors.primary : 'transparent',
                  color: active ? '#fff' : colors.primary,
                  borderColor: colors.primary,
                }}
              >
                {t(`payslip.weekdays.${key}`)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Horarios */}
      <div className="grid grid-cols-2 gap-3">
        <div className="min-w-0">
          <Input
            label={t('payslip.startTime')}
            icon={Clock}
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            focusColor={colors.primary}
          />
        </div>
        <div className="min-w-0">
          <Input
            label={t('payslip.endTime')}
            icon={Clock}
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            focusColor={colors.primary}
          />
        </div>
      </div>

      {/* Aviso de payslips sin período */}
      {skippedCount > 0 && (
        <div className="flex items-start gap-2 p-2 rounded text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{t('payslip.noPeriods')}</span>
        </div>
      )}

      {/* Preview */}
      <div
        className="p-3 rounded-lg text-sm"
        style={{ backgroundColor: colors.transparent10, color: colors.primary }}
      >
        {preview.totalShifts === 0 ? (
          <span>{t('payslip.shiftsPreviewEmpty')}</span>
        ) : (
          <div className="flex items-center gap-2 font-medium">
            <Sparkles size={14} />
            {t('payslip.shiftsTotal', {
              count: preview.totalShifts,
              periods: preview.periodCount,
            })}
          </div>
        )}
      </div>

      {/* Pregunta de 88 días (solo Australia) */}
      {showAustralia88 && (
        <div className="p-3 rounded-lg border border-gray-200 dark:border-slate-700 space-y-2">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {t('payslip.australia88Question')}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAustralia88(true)}
              className="flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors"
              style={{
                backgroundColor: australia88 === true ? colors.primary : 'transparent',
                color: australia88 === true ? '#fff' : colors.primary,
                borderColor: colors.primary,
              }}
            >
              {t('payslip.australia88Yes')}
            </button>
            <button
              type="button"
              onClick={() => setAustralia88(false)}
              className="flex-1 px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 transition-colors"
              style={
                australia88 === false
                  ? { backgroundColor: '#9CA3AF', color: '#fff', borderColor: '#9CA3AF' }
                  : {}
              }
            >
              {t('payslip.australia88No')}
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Acciones */}
      <div className="flex items-center gap-2 pt-2">
        <Button
          onClick={handleConfirm}
          icon={CheckSquare}
          iconPosition="left"
          themeColor={colors.primary}
          loading={loading}
          loadingText={t('payslip.generating')}
          disabled={(creatingNew ? !newWorkName.trim() : !workId) || preview.totalShifts === 0 || (showAustralia88 && australia88 === null)}
        >
          {t('payslip.confirmGenerate')}
        </Button>
        {onCancel && (
          <Button onClick={onCancel} variant="cancel">
            {t('payslip.reset')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PayslipShiftGenerator;
