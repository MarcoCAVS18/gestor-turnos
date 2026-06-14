// src/components/stats/PayslipForm.jsx
// Formulario manual / preview editable de los campos del payslip.
// Recibe un objeto `values` y un setter; renderiza inputs controlados.
// La detección del país soportado y la validación viven en el padre (PayslipCard).

import { useTranslation } from 'react-i18next';
import { Calculator, AlertCircle, FileText } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useThemeColors } from '../../hooks/useThemeColors';

// Convierte cualquier valor a string seguro para un input controlado.
// Evita que un number se muestre vacío en algunos browsers, y que null/undefined
// disparen warnings de React.
const toInputString = (v) => {
  if (v === null || v === undefined) return '';
  if (typeof v === 'number') {
    if (isNaN(v)) return '';
    return String(v);
  }
  return String(v);
};

const PayslipForm = ({
  values,
  onChange,
  onSubmit,
  onReset,
  // Reemplazan al viejo `isPreview`: describen exactamente qué payslip estamos editando.
  parseStatus = null,   // 'ok' | 'failed' | null
  source = 'manual',    // 'manual' | 'pdf'
  fileName = null,
  countryLabel,
  countrySupported = true,
  error = null,
}) => {
  const { t } = useTranslation();
  const colors = useThemeColors();

  // Helper para actualizar un campo individual sin perder los demás
  const setField = (field) => (e) => {
    onChange({ ...values, [field]: e.target.value });
  };

  // Decide qué badge y qué mensaje mostrar según el estado del payslip
  let badgeVariant = 'default';
  let badgeLabel = t('payslip.manualEntry');
  let topMessage = null; // mensaje extra debajo del badge si el parser falló

  if (source === 'pdf' && parseStatus === 'ok') {
    badgeVariant = 'success';
    badgeLabel = t('payslip.previewTitle');
  } else if (source === 'pdf' && parseStatus === 'failed') {
    badgeVariant = 'warning';
    badgeLabel = t('payslip.list.incomplete');
    topMessage = t('payslip.parseError');
  }

  return (
    // min-w-0 evita que los grid items hijos fuercen overflow horizontal
    <div className="space-y-4 min-w-0">
      {/* Header del modo */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <Badge variant={badgeVariant} size="sm">
            {badgeLabel}
          </Badge>
          {fileName && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 truncate max-w-[12rem]">
              <FileText size={12} className="flex-shrink-0" />
              <span className="truncate">{fileName}</span>
            </span>
          )}
        </div>
        {countryLabel && (
          <Badge variant="theme" size="sm" style={{ backgroundColor: colors.transparent10, color: colors.primary }}>
            {countryLabel}
          </Badge>
        )}
      </div>

      {/* Mensaje cuando el parser no pudo extraer datos */}
      {topMessage && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 text-sm">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{topMessage}</span>
        </div>
      )}

      {/* Aviso si el país no está soportado */}
      {!countrySupported && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 text-sm">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{t('payslip.unsupportedCountry')}</span>
        </div>
      )}

      {/* Inputs de período: 1 col en mobile, 2 en desktop. min-w-0 en cada celda */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="min-w-0">
          <Input
            label={t('payslip.periodStart')}
            type="date"
            value={toInputString(values.periodStart)}
            onChange={setField('periodStart')}
            focusColor={colors.primary}
          />
        </div>
        <div className="min-w-0">
          <Input
            label={t('payslip.periodEnd')}
            type="date"
            value={toInputString(values.periodEnd)}
            onChange={setField('periodEnd')}
            focusColor={colors.primary}
          />
        </div>
      </div>

      {/* Horas + bruto + tax: 1 col en mobile (apilados), 3 en desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="min-w-0">
          <Input
            label={t('payslip.hours')}
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={toInputString(values.hours)}
            onChange={setField('hours')}
            focusColor={colors.primary}
          />
        </div>
        <div className="min-w-0">
          <Input
            label={t('payslip.gross')}
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            required
            value={toInputString(values.gross)}
            onChange={setField('gross')}
            focusColor={colors.primary}
          />
        </div>
        <div className="min-w-0">
          <Input
            label={t('payslip.tax')}
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            required
            value={toInputString(values.tax)}
            onChange={setField('tax')}
            focusColor={colors.primary}
          />
        </div>
      </div>

      {/* Error de validación */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Acciones — Calcular + Empezar de nuevo siempre en una línea */}
      <div className="flex items-center gap-2 pt-2 flex-nowrap">
        <Button
          onClick={onSubmit}
          icon={Calculator}
          iconPosition="left"
          themeColor={colors.primary}
          disabled={!countrySupported}
        >
          {t('payslip.confirm')}
        </Button>
        {onReset && (
          <Button
            onClick={onReset}
            variant="cancel"
          >
            {t('payslip.reset')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PayslipForm;
