// src/components/cards/shift/ShiftCard/index.jsx 

import React from 'react';
import ***REMOVED***  Coffee, DollarSign ***REMOVED*** from 'lucide-react';
import BaseShiftCard from '../../base/BaseShiftCard';
import Badge from '../../../ui/Badge';
import ***REMOVED*** useApp ***REMOVED*** from '../../../../contexts/AppContext';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../../utils/currency';
import Flex from '../../../ui/Flex';

const ShiftCard = (props) => ***REMOVED***
  const ***REMOVED*** shift, work ***REMOVED*** = props;
  const ***REMOVED*** calculatePayment, smokoEnabled, currencySymbol, defaultDiscount ***REMOVED*** = useApp(); 

  // Calculate shift information
  const shiftData = React.useMemo(() => ***REMOVED***
    if (!shift || !work) ***REMOVED***
      return ***REMOVED*** hours: 0, totalWithDiscount: 0 ***REMOVED***;
    ***REMOVED***

    const result = calculatePayment(shift);
    return ***REMOVED*** ...result, defaultDiscount ***REMOVED***;
  ***REMOVED***, [shift, work, calculatePayment, defaultDiscount]);

  return (
    <BaseShiftCard
      ***REMOVED***...props***REMOVED***
      type="traditional"
      shiftData=***REMOVED***shiftData***REMOVED***
      earningValue=***REMOVED***shiftData.totalWithDiscount***REMOVED***
      earningLabel=***REMOVED***'Estimated Earnings'***REMOVED***
      currencySymbol=***REMOVED***currencySymbol***REMOVED***
    >
      ***REMOVED******REMOVED***
        // Smoko Badge - Only show if applied
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

        mobileStats: work.baseRate > 0 && (
          <Flex variant="start" className="pt-2 border-t border-gray-100 mt-2">
            <Flex variant="center" className="text-sm text-gray-600">
              <DollarSign size=***REMOVED***12***REMOVED*** className="mr-1 text-green-500" />
              <span>***REMOVED***formatCurrency(work.baseRate, currencySymbol)***REMOVED***/hr</span>
            </Flex>
          </Flex>
        ),

        desktopStats: work.baseRate > 0 && (
          <Flex variant="start" className="mb-2">
            <Flex variant="center" className="text-sm text-gray-600">
              <DollarSign size=***REMOVED***14***REMOVED*** className="mr-1 text-green-500" />
              <span>***REMOVED***formatCurrency(work.baseRate, currencySymbol)***REMOVED***/hr</span>
            </Flex>
          </Flex>
        ),
      ***REMOVED******REMOVED***
    </BaseShiftCard>
  );
***REMOVED***;

export default ShiftCard;