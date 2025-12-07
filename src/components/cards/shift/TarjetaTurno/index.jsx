// src/components/cards/TarjetaTurno/index.jsx 
import React from 'react';
import ***REMOVED***  Coffee, DollarSign ***REMOVED*** from 'lucide-react';
import BaseShiftCard from '../../base/BaseShiftCard';
import Badge from '../../../ui/Badge';
import ***REMOVED*** useApp ***REMOVED*** from '../../../../contexts/AppContext';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../../utils/currency';
import Flex from '../../../ui/Flex';

const TarjetaTurno = (props) => ***REMOVED***
  const ***REMOVED*** turno, trabajo ***REMOVED*** = props;
  const ***REMOVED*** calculatePayment, smokoEnabled, currencySymbol ***REMOVED*** = useApp(); // Get currencySymbol from context

  // Calcular información del turno
  const shiftData = React.useMemo(() => ***REMOVED***
    if (!turno || !trabajo) ***REMOVED***
      return ***REMOVED*** hours: 0, totalWithDiscount: 0, appliedRates: ***REMOVED******REMOVED*** ***REMOVED***;
    ***REMOVED***

    const result = calculatePayment(turno);
    return ***REMOVED***
      hours: result.hours || 0,
      totalWithDiscount: result.totalWithDiscount || 0,
      smokoApplied: result.smokoApplied || false,
      smokoMinutes: result.smokoMinutes || 0,
      appliedRates: result.appliedRates || ***REMOVED******REMOVED***
    ***REMOVED***;
  ***REMOVED***, [turno, trabajo, calculatePayment]);

  const renderAppliedRates = () => ***REMOVED***
    const rates = Object.entries(shiftData.appliedRates);
    if (rates.length === 0) ***REMOVED***
      if (trabajo && trabajo.tarifaBase > 0) ***REMOVED***
        return <span>***REMOVED***formatCurrency(trabajo.tarifaBase, currencySymbol)***REMOVED*** x hora</span>;
      ***REMOVED***
      return null;
    ***REMOVED***

    if (rates.length === 1) ***REMOVED***
      return <span>***REMOVED***formatCurrency(rates[0][1], currencySymbol)***REMOVED*** x hora</span>;
    ***REMOVED***

    // Compact format for multiple rates
    const rateValues = rates.map(([, rate]) => Math.round(rate));
    const uniqueRateValues = [...new Set(rateValues)];

    return <span>***REMOVED***uniqueRateValues.join(' / ')***REMOVED*** x hora</span>;
  ***REMOVED***;
  
  const hasRatesToShow = Object.keys(shiftData.appliedRates).length > 0 || (trabajo && trabajo.tarifaBase > 0);

  return (
    <BaseShiftCard
      ***REMOVED***...props***REMOVED***
      type="traditional"
      shiftData=***REMOVED***shiftData***REMOVED***
      earningValue=***REMOVED***shiftData.totalWithDiscount***REMOVED***
      earningLabel=***REMOVED***'Ganancia estimada'***REMOVED***
      currencySymbol=***REMOVED***currencySymbol***REMOVED***
    >
      ***REMOVED******REMOVED***
        // Badge de Smoko - Solo mostrar si está aplicado
        mobileBadge: smokoEnabled && shiftData.smokoApplied && (
          <Badge variant="warning" size="xs" icon=***REMOVED***Coffee***REMOVED***>
            -***REMOVED***shiftData.smokoMinutes***REMOVED***min
          </Badge>
        ),

        desktopBadge: smokoEnabled && shiftData.smokoApplied && (
          <Badge variant="warning" size="xs" icon=***REMOVED***Coffee***REMOVED*** rounded>
            -***REMOVED***shiftData.smokoMinutes***REMOVED***min
          </Badge>
        ),

        mobileStats: hasRatesToShow && (
          <Flex variant="start" className="pt-2 border-t border-gray-100 mt-2">
            <Flex variant="center" className="text-sm text-gray-600">
              <DollarSign size=***REMOVED***12***REMOVED*** className="mr-1 text-green-500" />
              ***REMOVED***renderAppliedRates()***REMOVED***
            </Flex>
          </Flex>
        ),

        desktopStats: hasRatesToShow && (
          <Flex variant="start" className="mb-2">
            <Flex variant="center" className="text-sm text-gray-600">
              <DollarSign size=***REMOVED***14***REMOVED*** className="mr-1 text-green-500" />
              ***REMOVED***renderAppliedRates()***REMOVED***
            </Flex>
          </Flex>
        ),
      ***REMOVED******REMOVED***
    </BaseShiftCard>
  );
***REMOVED***;

export default TarjetaTurno;