// src/components/cards/shift/DeliveryShiftCard/index.jsx
import React from 'react';
import { Package, Navigation } from 'lucide-react';
import BaseShiftCard from '../../base/BaseShiftCard';
import Flex from '../../../ui/Flex';
import { getShiftGrossEarnings } from '../../../../utils/shiftUtils';

const DeliveryShiftCard = (props) => {
  const { shift } = props;

  // Calculate shift data
  const shiftData = React.useMemo(() => {
    if (!shift) {
      return { hours: 0, totalWithDiscount: 0 };
    }

    // Calculate hours manually for delivery
    const [startHour, startMinute] = shift.startTime.split(':').map(Number);
    const [endHour, endMinute] = shift.endTime.split(':').map(Number);
    let hours = (endHour + endMinute / 60) - (startHour + startMinute / 60);
    if (hours < 0) hours += 24;

    const grossEarning = getShiftGrossEarnings(shift);
    const netEarning = grossEarning - (shift.fuelCost || 0);
    const averagePerOrder = shift.numberOfOrders > 0 ? grossEarning / shift.numberOfOrders : 0;

    return {
      hours: hours,
      totalWithDiscount: netEarning,
      numberOfOrders: shift.numberOfOrders || 0,
      kilometers: shift.kilometers || 0,
      tips: shift.tips || 0,
      expenses: shift.fuelCost || 0,
      totalEarning: grossEarning,
      baseEarning: shift.baseEarning ?? grossEarning - (shift.tips || 0),
      averagePerOrder
    };
  }, [shift]);

  return (
    <BaseShiftCard 
      {...props} 
      type="delivery" 
      shiftData={shiftData}
      // We pass the earning to the Base to put it at the bottom
      earningValue={shiftData.totalWithDiscount}
      earningLabel="Net Earnings"
    >
      {{
        // Mobile stats - Orders and km (NO Earning, only physical stats)
        mobileStats: (
          <Flex variant="between" className="pt-2 border-t border-gray-100">
            <Flex variant="center" className="space-x-4 text-sm text-gray-600">
              {shiftData.numberOfOrders > 0 && (
                <Flex variant="center">
                  <Package size={12} className="mr-1 text-blue-500" />
                  <span>{shiftData.numberOfOrders}</span>
                </Flex>
              )}

              {shiftData.kilometers > 0 && (
                <Flex variant="center">
                  <Navigation size={12} className="mr-1 text-purple-500" />
                  <span>{shiftData.kilometers}km</span>
                </Flex>
              )}
            </Flex>
          </Flex>
        ),

        // Desktop stats - Orders and km (NO Earning)
        desktopStats: (
          <Flex variant="between">
            <Flex variant="center" className="text-sm text-gray-600 gap-4">
              {shiftData.numberOfOrders > 0 && (
                <Flex variant="center">
                  <Package size={14} className="mr-1 text-blue-500" />
                  <span>{shiftData.numberOfOrders}</span>
                </Flex>
              )}

              {shiftData.kilometers > 0 && (
                <Flex variant="center">
                  <Navigation size={14} className="mr-1 text-purple-500" />
                  <span>{shiftData.kilometers} km</span>
                </Flex>
              )}
            </Flex>
          </Flex>
        ),

        // Expanded content - Financial details in Popover
        
      }}
    </BaseShiftCard>
  );
};

export default DeliveryShiftCard;