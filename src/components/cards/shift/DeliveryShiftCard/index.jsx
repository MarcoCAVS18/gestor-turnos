// src/components/cards/shift/DeliveryShiftCard/index.jsx
import React from 'react';
import ***REMOVED*** Package, Navigation ***REMOVED*** from 'lucide-react';
import BaseShiftCard from '../../base/BaseShiftCard';
import Flex from '../../../ui/Flex';
import ***REMOVED*** getShiftGrossEarnings ***REMOVED*** from '../../../../utils/shiftUtils';

const DeliveryShiftCard = (props) => ***REMOVED***
  const ***REMOVED*** shift ***REMOVED*** = props;

  // Calculate shift data
  const shiftData = React.useMemo(() => ***REMOVED***
    if (!shift) ***REMOVED***
      return ***REMOVED*** hours: 0, totalWithDiscount: 0 ***REMOVED***;
    ***REMOVED***

    // Calculate hours manually for delivery
    const [startHour, startMinute] = shift.startTime.split(':').map(Number);
    const [endHour, endMinute] = shift.endTime.split(':').map(Number);
    let hours = (endHour + endMinute / 60) - (startHour + startMinute / 60);
    if (hours < 0) hours += 24;

    const grossEarning = getShiftGrossEarnings(shift);
    const netEarning = grossEarning - (shift.fuelCost || 0);
    const averagePerOrder = shift.numberOfOrders > 0 ? grossEarning / shift.numberOfOrders : 0;

    return ***REMOVED***
      hours: hours,
      totalWithDiscount: netEarning,
      numberOfOrders: shift.numberOfOrders || 0,
      kilometers: shift.kilometers || 0,
      tips: shift.tips || 0,
      expenses: shift.fuelCost || 0,
      totalEarning: grossEarning,
      baseEarning: shift.baseEarning ?? grossEarning - (shift.tips || 0),
      averagePerOrder
    ***REMOVED***;
  ***REMOVED***, [shift]);

  return (
    <BaseShiftCard 
      ***REMOVED***...props***REMOVED*** 
      type="delivery" 
      shiftData=***REMOVED***shiftData***REMOVED***
      // We pass the earning to the Base to put it at the bottom
      earningValue=***REMOVED***shiftData.totalWithDiscount***REMOVED***
      earningLabel="Net Earnings"
    >
      ***REMOVED******REMOVED***
        // Mobile stats - Orders and km (NO Earning, only physical stats)
        mobileStats: (
          <Flex variant="between" className="pt-2 border-t border-gray-100">
            <Flex variant="center" className="space-x-4 text-sm text-gray-600">
              ***REMOVED***shiftData.numberOfOrders > 0 && (
                <Flex variant="center">
                  <Package size=***REMOVED***12***REMOVED*** className="mr-1 text-blue-500" />
                  <span>***REMOVED***shiftData.numberOfOrders***REMOVED***</span>
                </Flex>
              )***REMOVED***

              ***REMOVED***shiftData.kilometers > 0 && (
                <Flex variant="center">
                  <Navigation size=***REMOVED***12***REMOVED*** className="mr-1 text-purple-500" />
                  <span>***REMOVED***shiftData.kilometers***REMOVED***km</span>
                </Flex>
              )***REMOVED***
            </Flex>
          </Flex>
        ),

        // Desktop stats - Orders and km (NO Earning)
        desktopStats: (
          <Flex variant="between">
            <Flex variant="center" className="text-sm text-gray-600 gap-4">
              ***REMOVED***shiftData.numberOfOrders > 0 && (
                <Flex variant="center">
                  <Package size=***REMOVED***14***REMOVED*** className="mr-1 text-blue-500" />
                  <span>***REMOVED***shiftData.numberOfOrders***REMOVED***</span>
                </Flex>
              )***REMOVED***

              ***REMOVED***shiftData.kilometers > 0 && (
                <Flex variant="center">
                  <Navigation size=***REMOVED***14***REMOVED*** className="mr-1 text-purple-500" />
                  <span>***REMOVED***shiftData.kilometers***REMOVED*** km</span>
                </Flex>
              )***REMOVED***
            </Flex>
          </Flex>
        ),

        // Expanded content - Financial details in Popover
        
      ***REMOVED******REMOVED***
    </BaseShiftCard>
  );
***REMOVED***;

export default DeliveryShiftCard;