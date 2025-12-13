// src/components/cards/shift/TarjetaTurno/index.jsx 

import React from 'react';
import {  Coffee, DollarSign } from 'lucide-react';
import BaseShiftCard from '../../base/BaseShiftCard';
import Badge from '../../../ui/Badge';
import { useApp } from '../../../../contexts/AppContext';
import { formatCurrency } from '../../../../utils/currency';
import Flex from '../../../ui/Flex';

const TarjetaTurno = (props) => {
  const { turno, trabajo } = props;
  const { calculatePayment, smokoEnabled, currencySymbol, defaultDiscount } = useApp(); 

  // Calcular información del turno
  const shiftData = React.useMemo(() => {
    if (!turno || !trabajo) {
      return { hours: 0, totalWithDiscount: 0 };
    }

    const result = calculatePayment(turno);
    return { ...result, defaultDiscount };
  }, [turno, trabajo, calculatePayment, defaultDiscount]);

  return (
    <BaseShiftCard
      {...props}
      type="traditional"
      shiftData={shiftData}
      earningValue={shiftData.totalWithDiscount}
      earningLabel={'Ganancia Estimada'}
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

        mobileStats: trabajo.tarifaBase > 0 && (
          <Flex variant="start" className="pt-2 border-t border-gray-100 mt-2">
            <Flex variant="center" className="text-sm text-gray-600">
              <DollarSign size={12} className="mr-1 text-green-500" />
              <span>{formatCurrency(trabajo.tarifaBase, currencySymbol)}/hr</span>
            </Flex>
          </Flex>
        ),

        desktopStats: trabajo.tarifaBase > 0 && (
          <Flex variant="start" className="mb-2">
            <Flex variant="center" className="text-sm text-gray-600">
              <DollarSign size={14} className="mr-1 text-green-500" />
              <span>{formatCurrency(trabajo.tarifaBase, currencySymbol)}/hr</span>
            </Flex>
          </Flex>
        ),
      }}
    </BaseShiftCard>
  );
};

export default TarjetaTurno;