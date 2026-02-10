// src/components/cards/shift/DeliveryShiftCard/index.jsx
import React from 'react';
import { Package, Navigation, Fuel, DollarSign } from 'lucide-react';
import BaseShiftCard from '../../base/BaseShiftCard';
import Flex from '../../../ui/Flex';
import { getShiftGrossEarnings } from '../../../../utils/shiftUtils';
import { formatCurrency } from '../../../../utils/currency';
import { useApp } from '../../../../contexts/AppContext';

const DeliveryShiftCard = (props) => {
  const { shift } = props;
  const { currencySymbol } = useApp();

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
    const netEarning = grossEarning - (shift.fuelExpense || 0);
    const averagePerOrder = shift.orderCount > 0 ? grossEarning / shift.orderCount : 0;

    return {
      hours: hours,
      totalWithDiscount: netEarning,
      numberOfOrders: shift.orderCount || 0,
      kilometers: shift.kilometers || 0,
      tips: shift.tips || 0,
      expenses: shift.fuelExpense || 0,
      totalEarning: grossEarning,
      baseEarning: shift.baseEarnings ?? grossEarning - (shift.tips || 0),
      averagePerOrder
    };
  }, [shift]);

  return (
    <BaseShiftCard
      {...props}
      job={props.work} 
      type="delivery"
      shiftData={shiftData}
      // We pass earning to Base to put it at the bottom
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

        // Desktop stats - Complete delivery breakdown for expanded view
        desktopStats: (
          <div className="space-y-2 text-xs">
            {/* Orders & Kilometers */}
            <Flex variant="between">
              <Flex variant="center" className="text-gray-600 dark:text-gray-400">
                <Package size={12} className="mr-1.5 text-blue-500" />
                <span>Orders</span>
              </Flex>
              <span className="font-semibold dark:text-white">{shiftData.numberOfOrders || 0}</span>
            </Flex>

            {shiftData.kilometers > 0 && (
              <Flex variant="between">
                <Flex variant="center" className="text-gray-600 dark:text-gray-400">
                  <Navigation size={12} className="mr-1.5 text-purple-500" />
                  <span>Distance</span>
                </Flex>
                <span className="font-semibold dark:text-white">{shiftData.kilometers} km</span>
              </Flex>
            )}

            {/* Earnings breakdown */}
            <div className="pt-2 border-t border-gray-100 dark:border-[rgba(255,255,255,0.08)] space-y-1.5">
              <Flex variant="between">
                <span className="text-gray-500 dark:text-gray-400">Base earnings</span>
                <span className="font-medium dark:text-white">{formatCurrency(shiftData.baseEarning, currencySymbol)}</span>
              </Flex>

              {shiftData.tips > 0 && (
                <Flex variant="between">
                  <Flex variant="center" className="text-gray-500 dark:text-gray-400">
                    <DollarSign size={10} className="mr-1 text-green-500" />
                    <span>Tips</span>
                  </Flex>
                  <span className="font-medium text-green-600">{formatCurrency(shiftData.tips, currencySymbol)}</span>
                </Flex>
              )}

              {shiftData.expenses > 0 && (
                <Flex variant="between">
                  <Flex variant="center" className="text-gray-500 dark:text-gray-400">
                    <Fuel size={10} className="mr-1 text-orange-500" />
                    <span>Fuel expense</span>
                  </Flex>
                  <span className="font-medium text-red-600 dark:text-red-400">-{formatCurrency(shiftData.expenses, currencySymbol)}</span>
                </Flex>
              )}

              {shiftData.averagePerOrder > 0 && (
                <Flex variant="between" className="pt-1.5 border-t border-gray-50 dark:border-[rgba(255,255,255,0.05)]">
                  <span className="text-gray-500 dark:text-gray-400">Avg per order</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(shiftData.averagePerOrder, currencySymbol)}</span>
                </Flex>
              )}
            </div>
          </div>
        ),
      }}
    </BaseShiftCard>
  );
};

export default DeliveryShiftCard;