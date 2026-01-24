// src/components/cards/shift/ShiftCard/index.jsx 

import React from 'react';
import {  Coffee, DollarSign } from 'lucide-react';
import BaseShiftCard from '../../base/BaseShiftCard';
import Badge from '../../../ui/Badge';
import { useApp } from '../../../../contexts/AppContext';
import { formatCurrency } from '../../../../utils/currency';
import Flex from '../../../ui/Flex';

const ShiftCard = (props) => {
  const { shift, work } = props;
  const { calculatePayment, smokoEnabled, currencySymbol, defaultDiscount } = useApp(); 

  // Calculate shift information
  const shiftData = React.useMemo(() => {
    if (!shift || !work) {
      return { hours: 0, totalWithDiscount: 0 };
    }

    const result = calculatePayment(shift);
    return { ...result, defaultDiscount };
  }, [shift, work, calculatePayment, defaultDiscount]);

  return (
    <BaseShiftCard
      {...props}
      job={work} 
      type="traditional"
      shiftData={shiftData}
      earningValue={shiftData.totalWithDiscount}
      earningLabel={'Estimated Earnings'}
      currencySymbol={currencySymbol}
    >
      {{
        // Smoko Badge - Only show if applied
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

        mobileStats: work.baseRate > 0 && (
          <Flex variant="start" className="pt-2 border-t border-gray-100 mt-2">
            <Flex variant="center" className="text-sm text-gray-600">
              <DollarSign size={12} className="mr-1 text-green-500" />
              <span>{formatCurrency(work.baseRate, currencySymbol)}/hr</span>
            </Flex>
          </Flex>
        ),

        desktopStats: work.baseRate > 0 && (
          <Flex variant="start" className="mb-2">
            <Flex variant="center" className="text-sm text-gray-600">
              <DollarSign size={14} className="mr-1 text-green-500" />
              <span>{formatCurrency(work.baseRate, currencySymbol)}/hr</span>
            </Flex>
          </Flex>
        ),
      }}
    </BaseShiftCard>
  );
};

export default ShiftCard;