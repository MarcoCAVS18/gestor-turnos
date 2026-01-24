// src/components/stats/DailyDistribution/index.jsx

import React from 'react';
import { Calendar, Clock, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../../utils/currency';
import { formatHoursDecimal } from '../../../utils/time';
import BaseStatsCard from '../../cards/base/BaseStatsCard';
import Flex from '../../ui/Flex';

const DailyDistribution = ({ currentData, loading, thematicColors }) => {
  const { earningsByDay, totalEarned } = currentData || {};

  const isEmpty = !totalEarned || totalEarned === 0;

  return (
    <BaseStatsCard
      icon={Calendar}
      title="Weekly Distribution"
      loading={loading}
      empty={isEmpty}
      emptyMessage="No earnings data this week."
    >
      <div className="w-full">
        {/* Wrapper to enable horizontal scroll on mobile */}
        <div className="lg:overflow-x-hidden overflow-x-auto">
          <div className="space-y-2 lg:w-full min-w-[30rem]">
            {earningsByDay && Object.entries(earningsByDay).map(([day, data]) => (
              <div key={day} className="p-2 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-4 gap-x-2 items-center">
                  <span className="text-sm font-medium text-gray-700 col-span-1 truncate">{day}</span>
                  <Flex variant="end" className="col-span-1">
                    <DollarSign size={14} className="mr-1 flex-shrink-0" style={{ color: thematicColors?.primary }} />
                    <span className="text-sm font-bold text-right" style={{ color: thematicColors?.primary }}>
                      {formatCurrency(data.earnings)}
                    </span>
                  </Flex>

                  <Flex variant="end" className="col-span-1">
                    <Clock size={14} className="mr-1 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600 text-right whitespace-nowrap">
                      {formatHoursDecimal(data.hours)}
                    </span>
                  </Flex>

                  <div className="text-sm text-gray-500 text-right col-span-1 whitespace-nowrap">
                    {data.shifts} shift{data.shifts !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseStatsCard>
  );
};

export default DailyDistribution;