// src/components/cards/TarjetaTurno/index.jsx 
import React from 'react';
import {  Coffee, DollarSign } from 'lucide-react';
import BaseShiftCard from '../../base/BaseShiftCard';
import Badge from '../../../ui/Badge';
import { useApp } from '../../../../contexts/AppContext';
import { formatCurrency } from '../../../../utils/currency';
import Flex from '../../../ui/Flex';

const TarjetaTurno = (props) => {
  const { turno, trabajo } = props;
  const { calculatePayment, smokoEnabled, currencySymbol } = useApp(); // Get currencySymbol from context

  // Calcular información del turno
  const shiftData = React.useMemo(() => {
    if (!turno || !trabajo) {
      return { hours: 0, totalWithDiscount: 0, appliedRates: {} };
    }

    const result = calculatePayment(turno);
    return {
      hours: result.hours || 0,
      totalWithDiscount: result.totalWithDiscount || 0,
      smokoApplied: result.smokoApplied || false,
      smokoMinutes: result.smokoMinutes || 0,
      appliedRates: result.appliedRates || {}
    };
  }, [turno, trabajo, calculatePayment]);

  const renderAppliedRates = () => {
    const rates = Object.entries(shiftData.appliedRates);
    if (rates.length === 0) {
      if (trabajo && trabajo.tarifaBase > 0) {
        return <span>{formatCurrency(trabajo.tarifaBase, currencySymbol)} x hora</span>;
      }
      return null;
    }

    if (rates.length === 1) {
      return <span>{formatCurrency(rates[0][1], currencySymbol)} x hora</span>;
    }

    // Compact format for multiple rates
    const rateValues = rates.map(([, rate]) => Math.round(rate));
    const uniqueRateValues = [...new Set(rateValues)];

    return <span>{uniqueRateValues.join(' / ')} x hora</span>;
  };
  
  const hasRatesToShow = Object.keys(shiftData.appliedRates).length > 0 || (trabajo && trabajo.tarifaBase > 0);

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

        mobileStats: hasRatesToShow && (
          <Flex variant="start" className="pt-2 border-t border-gray-100 mt-2">
            <Flex variant="center" className="text-sm text-gray-600">
              <DollarSign size={12} className="mr-1 text-green-500" />
              {renderAppliedRates()}
            </Flex>
          </Flex>
        ),

        desktopStats: hasRatesToShow && (
          <Flex variant="start" className="mb-2">
            <Flex variant="center" className="text-sm text-gray-600">
              <DollarSign size={14} className="mr-1 text-green-500" />
              {renderAppliedRates()}
            </Flex>
          </Flex>
        ),
      }}
    </BaseShiftCard>
  );
};

export default TarjetaTurno;