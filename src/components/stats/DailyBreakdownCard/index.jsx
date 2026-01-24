// src/components/stats/DailyBreakdownCard/index.jsx

import React from 'react';
import { Calendar, Clock, DollarSign } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import BaseStatsCard from '../../cards/base/BaseStatsCard';
import { calculateShiftHours, calculateShiftEarnings } from '../../../utils/statsCalculations';
import Flex from '../../ui/Flex';

const DailyBreakdownCard = ({ shiftsByDay = {}, works = [] }) => {
  const colors = useThemeColors();

  // Validate data
  const data = shiftsByDay && typeof shiftsByDay === 'object' ? shiftsByDay : {};
  const validWorks = Array.isArray(works) ? works : [];

  const isEmpty = Object.keys(data).length === 0;

  // Format date
  const formatDate = (date) => {
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
    } catch (error) {
      return date;
    }
  };

  return (
    <BaseStatsCard
      title="Daily Breakdown"
      icon={Calendar}
      empty={isEmpty}
      emptyMessage="No shifts registered this week"
      emptyDescription="Shifts will appear here once you add some"
    >
      <div className="space-y-3">
        {Object.entries(data).map(([date, shifts]) => {
          const totalHours = shifts.reduce((total, shift) => total + calculateShiftHours(shift), 0);
          const totalEarnings = shifts.reduce((total, shift) => total + calculateShiftEarnings(shift, validWorks), 0);

          return (
            <Flex variant="between" key={date} className="p-3 bg-gray-50 rounded-lg">
              <Flex>
                <Flex variant="center"
                  className="w-10 h-10 rounded-full mr-3"
                  style={{ backgroundColor: colors.transparent10 }}
                >
                  <Calendar size={16} style={{ color: colors.primary }} />
                </Flex>
                <div>
                  <p className="font-medium text-gray-800">
                    {formatDate(date)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {shifts.length} shift{shifts.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </Flex>

              <Flex className="space-x-4 text-sm">
                <Flex className="text-purple-600">
                  <Clock size={14} className="mr-1" />
                  <span>{totalHours.toFixed(1)}h</span>
                </Flex>
                <Flex className="text-green-600">
                  <DollarSign size={14} className="mr-1" />
                  <span>{formatCurrency(totalEarnings)}</span>
                </Flex>
              </Flex>
            </Flex>
          );
        })}
      </div>
    </BaseStatsCard>
  );
};

export default DailyBreakdownCard;