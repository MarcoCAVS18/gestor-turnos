// src/components/cards/TarjetaTurno/index.jsx 
import React from 'react';
import {  Coffee } from 'lucide-react';
import BaseShiftCard from '../../base/BaseShiftCard';
import Badge from '../../../ui/Badge';
import { useApp } from '../../../../contexts/AppContext';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { formatCurrency } from '../../../../utils/currency';
import Flex from '../../../ui/Flex';

const TarjetaTurno = (props) => {
  const { turno, trabajo } = props;
  const { calculatePayment, smokoEnabled, currencySymbol } = useApp(); // Get currencySymbol from context
  const colors = useThemeColors();

  // Calcular información del turno
  const shiftData = React.useMemo(() => {
    if (!turno || !trabajo) {
      return { hours: 0, totalWithDiscount: 0 };
    }

    const result = calculatePayment(turno);
    return {
      hours: result.hours || 0,
      totalWithDiscount: result.totalWithDiscount || 0,
      smokoApplied: result.smokoApplied || false,
      smokoMinutes: result.smokoMinutes || 0
    };
  }, [turno, trabajo, calculatePayment]);

  return (
    <BaseShiftCard
      {...props}
      type="traditional"
      shiftData={shiftData}
      earningValue={shiftData.totalWithDiscount}
      earningLabel={'Ganancia estimada'}
      currencySymbol={currencySymbol}
    >
      {{
        // Badge de Smoko - Solo mostrar si está aplicado
        mobileBadge: smokoEnabled && shiftData.smokoApplied && (
          <Badge variant="warning" size="xs" icon={Coffee}>
            -{shiftData.smokoMinutes}min
          </Badge>
        ),

        desktopBadge: smokoEnabled && shiftData.smokoApplied && (
          <Badge variant="warning" size="xs" icon={Coffee} rounded>
            -{shiftData.smokoMinutes}min
          </Badge>
        ),

        // mobileStats and desktopStats will no longer display earnings here.
        // They are handled by BaseShiftCard directly now.

        // Contenido expandido
        expandedContent: (
          <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-2">
            {smokoEnabled && shiftData.smokoApplied && (
              <Flex justify="between">
                <span className="text-gray-600 mr-2">Descuento Smoko:</span>
                <span className="font-medium text-red-500">-{shiftData.smokoMinutes}min</span>
              </Flex>
            )}
            <Flex justify="between" className="pt-2 border-t border-gray-200">
              <span className="font-semibold text-gray-700 mr-2">Ganancia neta:</span>
              <span className="font-bold" style={{ color: colors.primary }}>
                {formatCurrency(shiftData.totalWithDiscount, currencySymbol)}
              </span>
            </Flex>
          </div>
        )
      }}
    </BaseShiftCard>
  );
};

export default TarjetaTurno;