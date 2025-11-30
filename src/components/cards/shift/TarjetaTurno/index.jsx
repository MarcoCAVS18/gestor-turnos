// src/components/cards/TarjetaTurno/index.jsx 
import React from 'react';
import ***REMOVED***  Coffee ***REMOVED*** from 'lucide-react';
import BaseShiftCard from '../../base/BaseShiftCard';
import Badge from '../../../ui/Badge';
import ***REMOVED*** useApp ***REMOVED*** from '../../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../../utils/currency';
import Flex from '../../../ui/Flex';

const TarjetaTurno = (props) => ***REMOVED***
  const ***REMOVED*** turno, trabajo ***REMOVED*** = props;
  const ***REMOVED*** calculatePayment, smokoEnabled, currencySymbol ***REMOVED*** = useApp(); // Get currencySymbol from context
  const colors = useThemeColors();

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

        // mobileStats and desktopStats will no longer display earnings here.
        // They are handled by BaseShiftCard directly now.

        // Contenido expandido
        expandedContent: (
          <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-2">
            ***REMOVED***smokoEnabled && shiftData.smokoApplied && (
              <Flex justify="between">
                <span className="text-gray-600 mr-2">Descuento Smoko:</span>
                <span className="font-medium text-red-500">-***REMOVED***shiftData.smokoMinutes***REMOVED***min</span>
              </Flex>
            )***REMOVED***
            <Flex justify="between" className="pt-2 border-t border-gray-200">
              <span className="font-semibold text-gray-700 mr-2">Ganancia neta:</span>
              <span className="font-bold" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                ***REMOVED***formatCurrency(shiftData.totalWithDiscount, currencySymbol)***REMOVED***
              </span>
            </Flex>
          </div>
        )
      ***REMOVED******REMOVED***
    </BaseShiftCard>
  );
***REMOVED***;

export default TarjetaTurno;