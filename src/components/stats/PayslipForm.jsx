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
  lowConfidence = false, // parse came from OCR / cloud → suggest verifying figures
  countryLabel,
  countrySupported = true,
  error = null,
  taxSuggestion = null, // node comparing this payslip's implied tax rate against Settings
}) => {
  const { t } = useTranslation();
  const colors = useThemeColors();

  // Helper para actualizar un campo individual sin perder los demás
  const setField = (field) => (e) => {
    onChange({ ...values, [field]: e.target.value });
  };

  // ----- Revisión por campo -----
  // Solo para payslips parseados de un PDF: un campo "necesita revisión" si
  // quedó vacío (no se pudo leer) o si el parseo fue de baja confianza (OCR/
  // cloud) y es un valor numérico que conviene verificar.
  const fromPdf = source === 'pdf';
  const isEmpty = (v) => v === '' || v === null || v === undefined;
  const needsReview = (field, numeric = false) =>
    fromPdf && (isEmpty(values[field]) || (lowConfidence && numeric));
  const reviewHelper = (field, numeric = false) =>
    needsReview(field, numeric) ? t('payslip.checkField') : undefined;
  const hasReview =
    fromPdf &&
    parseStatus !== 'failed' &&
    (lowConfidence || ['periodStart', 'periodEnd', 'hours', 'gross', 'tax'].some((f) => isEmpty(values[f])));

  // El parser puede dejar un mensaje si no pudo extraer datos del PDF.
  const topMessage = source === 'pdf' && parseStatus === 'failed' ? t('payslip.parseError') : null;

  return (
    // h-full + flex-col para poder fijar los botones al fondo del contenedor.
    // min-w-0 evita que los inputs fuercen overflow horizontal.
    <div className="h-full flex flex-col min-w-0">
      <div className="space-y-4 lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:pr-1">
        {/* Título estable + nombre del archivo debajo. No cambia con los avisos
            de revisión, así la card se ve igual haya o no campos a revisar. */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {t('payslip.previewTitle')}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 min-w-0">
              <FileText size={12} className="flex-shrink-0" />
              <span className="truncate">{fileName || t('payslip.manualEntry')}</span>
            </p>
          </div>
          {countryLabel && (
            <Badge variant="theme" size="sm" className="flex-shrink-0" style={{ backgroundColor: colors.transparent10, color: colors.primary }}>
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

      {/* Aviso de revisión: parseo parcial o de baja confianza (OCR/cloud) */}
      {hasReview && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 text-sm">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{t('payslip.reviewHint')}</span>
        </div>
      )}


      {/* Inputs apilados (uno debajo del otro): la columna es angosta y alta. */}
      <div className="space-y-3">
        <Input
          label={t('payslip.periodStart')}
          type="date"
          value={toInputString(values.periodStart)}
          onChange={setField('periodStart')}
          focusColor={colors.primary}
          warning={needsReview('periodStart')}
          helperText={reviewHelper('periodStart')}
        />
        <Input
          label={t('payslip.periodEnd')}
          type="date"
          value={toInputString(values.periodEnd)}
          onChange={setField('periodEnd')}
          focusColor={colors.primary}
          warning={needsReview('periodEnd')}
          helperText={reviewHelper('periodEnd')}
        />
        <Input
          label={t('payslip.hours')}
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={toInputString(values.hours)}
          onChange={setField('hours')}
          focusColor={colors.primary}
          warning={needsReview('hours', true)}
          helperText={reviewHelper('hours', true)}
        />
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
          warning={needsReview('gross', true)}
          helperText={reviewHelper('gross', true)}
        />
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
          warning={needsReview('tax', true)}
          helperText={reviewHelper('tax', true)}
        />
      </div>

        {taxSuggestion}

        {/* Error de validación */}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>

      {/* Acciones — pegadas al fondo del contenedor */}
      <div className="mt-auto pt-4 flex items-center gap-2 flex-nowrap">
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
