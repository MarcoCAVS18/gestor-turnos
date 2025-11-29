// src/components/cards/TarjetaTurno/index.jsx - Refactorizado usando BaseShiftCard

import React from 'react';
import ***REMOVED*** DollarSign, Coffee ***REMOVED*** from 'lucide-react';
import BaseShiftCard from '../../base/BaseShiftCard';
import Badge from '../../../ui/Badge';
import ***REMOVED*** useApp ***REMOVED*** from '../../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../../utils/currency';
import Flex from '../../../ui/Flex';

const TarjetaTurno = (props) => ***REMOVED***
  const ***REMOVED*** turno, trabajo ***REMOVED*** = props;
  const ***REMOVED*** calculatePayment, smokoEnabled ***REMOVED*** = useApp();
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
    <BaseShiftCard ***REMOVED***...props***REMOVED*** type="traditional" shiftData=***REMOVED***shiftData***REMOVED***>
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

        // Stats móvil - Ganancia destacada
        mobileStats: (
          <Flex variant="between" className="pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-500">Ganancia estimada</span>
            <div className="flex items-center">
              <DollarSign size=***REMOVED***16***REMOVED*** className="mr-1" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** />
              <span className="font-bold text-lg" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                ***REMOVED***formatCurrency(shiftData.totalWithDiscount)***REMOVED***
              </span>
            </div>
          </Flex>
        ),

        // Stats desktop - Ganancia
        desktopStats: (
          <Flex variant="between">
            <span className="text-sm text-gray-500">Ganancia estimada</span>
            <div className="flex items-center">
              <DollarSign size=***REMOVED***16***REMOVED*** className="mr-1" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** />
              <span className="font-semibold text-lg" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                ***REMOVED***formatCurrency(shiftData.totalWithDiscount)***REMOVED***
              </span>
            </div>
          </Flex>
        )
      ***REMOVED******REMOVED***
    </BaseShiftCard>
  );
***REMOVED***;

export default TarjetaTurno;