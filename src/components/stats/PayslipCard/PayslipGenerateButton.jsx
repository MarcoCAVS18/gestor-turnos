// src/components/stats/PayslipCard/PayslipGenerateButton.jsx
// Botón "Generar turnos desde este recibo" con todos sus estados:
//   - success: muestra el mensaje de éxito con el conteo
//   - error:   muestra el mensaje de error
//   - allPeriodsHaveShifts: muestra aviso de que ya hay turnos
//   - default: muestra el botón habilitado/deshabilitado
//
// Si no hay works regulares, muestra una nota en lugar del botón.

import { useTranslation } from 'react-i18next';
import { CheckSquare, Sparkles, AlertCircle, Calendar } from 'lucide-react';
import Button from '../../ui/Button';
import { useThemeColors } from '../../../hooks/useThemeColors';

const PayslipGenerateButton = ({
  generationStatus,
  generatedCount,
  allPeriodsHaveShifts,
  generatablePeriods,
  regularWorks,
  onClick,
}) => {
  const { t } = useTranslation();
  const colors = useThemeColors();

  if (generationStatus === 'success') {
    return (
      <div
        className="flex items-start gap-2 p-3 rounded-lg text-sm"
        style={{ backgroundColor: colors.transparent10, color: colors.primary }}
      >
        <Sparkles size={16} className="mt-0.5 flex-shrink-0" />
        <span>{t('payslip.generateSuccess', { count: generatedCount })}</span>
      </div>
    );
  }

  if (generationStatus === 'error') {
    return (
      <div className="flex items-start gap-2 p-3 rounded-lg text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
        <span>{t('payslip.generateError')}</span>
      </div>
    );
  }

  // El botón siempre se muestra; cambia su disponibilidad y subtítulo según el motivo:
  //   - allPeriodsHaveShifts → disabled gris + nota "ya hay turnos"
  //   - sin works regulares  → disabled gris + nota "creá un trabajo"
  //   - sin períodos válidos → disabled gris + nota implícita
  const noWorks = regularWorks.length === 0;
  const noPeriods = generatablePeriods.length === 0;
  const isDisabled = noWorks || noPeriods || allPeriodsHaveShifts;

  let subtitle = null;
  if (allPeriodsHaveShifts) subtitle = t('payslip.shiftsExist');
  else if (noWorks) subtitle = t('payslip.noWorks');

  return (
    <div className="space-y-2">
      <Button
        onClick={onClick}
        icon={allPeriodsHaveShifts ? Calendar : CheckSquare}
        iconPosition="left"
        themeColor={colors.primary}
        disabled={isDisabled}
        className="w-full"
      >
        {t('payslip.generateShifts')}
      </Button>
      {subtitle && (
        <p
          className={`text-xs flex items-start gap-1 ${
            allPeriodsHaveShifts
              ? 'text-gray-500 dark:text-gray-400'
              : 'text-orange-600 dark:text-orange-400'
          }`}
        >
          {allPeriodsHaveShifts && <Calendar size={12} className="mt-0.5 flex-shrink-0" />}
          <span>{subtitle}</span>
        </p>
      )}
    </div>
  );
};

export default PayslipGenerateButton;
