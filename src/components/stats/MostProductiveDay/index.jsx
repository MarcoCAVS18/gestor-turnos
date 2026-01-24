// src/components/stats/MostProductiveDay/index.jsx

import React from 'react';
import { Award } from 'lucide-react';
import { formatCurrency } from '../../../utils/currency';
import { formatHoursDecimal } from '../../../utils/time';
import BaseStatsCard from '../../cards/base/BaseStatsCard';
import Flex from '../../ui/Flex';

const MostProductiveDay = ({ currentData, loading, thematicColors, className = '' }) => {
  const mostProductiveDay = currentData?.mostProductiveDay;
  
  const isEmpty = !mostProductiveDay || mostProductiveDay.day === 'None' || !mostProductiveDay.earnings || mostProductiveDay.earnings <= 0;

  return (
    <BaseStatsCard
      icon={Award} // Pass component directly
      title="Most Productive Day"
      loading={loading}
      empty={isEmpty}
      emptyMessage="Not enough data this week."
      className={className}
    >
      <div className="w-full">
        <Flex variant="between">
          <div>
            <p className="font-bold text-lg" style={{ color: thematicColors?.primary }}>
              {mostProductiveDay.day}
            </p>
            <p className="text-xs text-gray-600">
              {mostProductiveDay.shifts || 0} shifts • {formatHoursDecimal(mostProductiveDay.hours || 0)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(mostProductiveDay.earnings)}
            </p>
          </div>
        </Flex>
      </div>
    </BaseStatsCard>
  );
};

export default MostProductiveDay;