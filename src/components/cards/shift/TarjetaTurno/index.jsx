// src/components/cards/shift/TarjetaTurno/index.jsx 

import React from 'react';
import ***REMOVED***  Coffee, DollarSign ***REMOVED*** from 'lucide-react';
import BaseShiftCard from '../../base/BaseShiftCard';
import Badge from '../../../ui/Badge';
import ***REMOVED*** useApp ***REMOVED*** from '../../../../contexts/AppContext';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../../utils/currency';
import Flex from '../../../ui/Flex';

const TarjetaTurno = (props) => ***REMOVED***
  const ***REMOVED*** turno, trabajo ***REMOVED*** = props;
  const ***REMOVED*** calculatePayment, smokoEnabled, currencySymbol ***REMOVED*** = useApp(); 

  // Calcular información del turno
  const shiftData = React.useMemo(() => ***REMOVED***
    if (!turno || !trabajo) ***REMOVED***
      return ***REMOVED*** hours: 0, totalWithDiscount: 0 ***REMOVED***;
    ***REMOVED***

    const result = calculatePayment(turno);
    return ***REMOVED***
      hours: result.hours || 0,
      totalWithDiscount: result.totalWithDiscount || 0,
      smokoApplied: result.smokoApplied || false,
      smokoMinutes: result.smokoMinutes || 0
    ***REMOVED***;
  ***REMOVED***, [turno, trabajo, calculatePayment]);

  return (
    <BaseShiftCard
      ***REMOVED***...props***REMOVED***
      type="traditional"
      shiftData=***REMOVED***shiftData***REMOVED***
      earningValue=***REMOVED***shiftData.totalWithDiscount***REMOVED***
      earningLabel=***REMOVED***'Ganancia Estimada'***REMOVED***
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

        mobileStats: trabajo.tarifaBase > 0 && (
          <Flex variant="start" className="pt-2 border-t border-gray-100 mt-2">
            <Flex variant="center" className="text-sm text-gray-600">
              <DollarSign size=***REMOVED***12***REMOVED*** className="mr-1 text-green-500" />
              <span>***REMOVED***formatCurrency(trabajo.tarifaBase, currencySymbol)***REMOVED***/hr</span>
            </Flex>
          </Flex>
        ),

        desktopStats: trabajo.tarifaBase > 0 && (
          <Flex variant="start" className="mb-2">
            <Flex variant="center" className="text-sm text-gray-600">
              <DollarSign size=***REMOVED***14***REMOVED*** className="mr-1 text-green-500" />
              <span>***REMOVED***formatCurrency(trabajo.tarifaBase, currencySymbol)***REMOVED***/hr</span>
            </Flex>
          </Flex>
        ),
      ***REMOVED******REMOVED***
    </BaseShiftCard>
  );
***REMOVED***;

export default TarjetaTurno;