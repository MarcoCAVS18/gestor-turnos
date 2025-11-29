// src/components/cards/TarjetaTurno/index.jsx - Refactorizado usando BaseShiftCard

import React from 'react';
import { DollarSign, Coffee } from 'lucide-react';
import BaseShiftCard from '../../base/BaseShiftCard';
import Badge from '../../../ui/Badge';
import { useApp } from '../../../../contexts/AppContext';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { formatCurrency } from '../../../../utils/currency';
import Flex from '../../../ui/Flex';

const TarjetaTurno = (props) => {
  const { turno, trabajo } = props;
  const { calculatePayment, smokoEnabled } = useApp();
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
    <BaseShiftCard {...props} type="traditional" shiftData={shiftData}>
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

        // Stats móvil - Ganancia destacada
        mobileStats: (
          <Flex variant="between" className="pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-500">Ganancia estimada</span>
            <div className="flex items-center">
              <DollarSign size={16} className="mr-1" style={{ color: colors.primary }} />
              <span className="font-bold text-lg" style={{ color: colors.primary }}>
                {formatCurrency(shiftData.totalWithDiscount)}
              </span>
            </div>
          </Flex>
        ),

        // Stats desktop - Ganancia
        desktopStats: (
          <Flex variant="between">
            <span className="text-sm text-gray-500">Ganancia estimada</span>
            <div className="flex items-center">
              <DollarSign size={16} className="mr-1" style={{ color: colors.primary }} />
              <span className="font-semibold text-lg" style={{ color: colors.primary }}>
                {formatCurrency(shiftData.totalWithDiscount)}
              </span>
            </div>
          </Flex>
        )
      }}
    </BaseShiftCard>
  );
};

export default TarjetaTurno;