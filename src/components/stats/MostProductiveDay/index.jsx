// src/components/stats/MostProductiveDay/index.jsx

import React from 'react';
import { Award } from 'lucide-react';
import { formatCurrency } from '../../../utils/currency';
import { formatHoursDecimal } from '../../../utils/time';
import BaseStatsCard from '../../cards/base/BaseStatsCard';

const MostProductiveDay = ({ currentData, loading, thematicColors, className = '' }) => {
  const mostProductiveDay = currentData?.mostProductiveDay;

  const isEmpty = !mostProductiveDay || mostProductiveDay.day === 'None' || !mostProductiveDay.earnings || mostProductiveDay.earnings <= 0;

  return (
    <BaseStatsCard
      icon={Award}
      title="Most Productive Day"
      loading={loading}
      empty={isEmpty}
      emptyMessage="Not enough data this week."
      className={className}
    >
      <div className="w-full flex flex-col items-center text-center gap-1">
        {/* Earnings — prominently large */}
        <p
          className="text-4xl font-extrabold tracking-tight leading-none"
          style={{ color: thematicColors?.base || '#10B981' }}
        >
          {formatCurrency(mostProductiveDay.earnings)}
        </p>

        {/* Day name */}
        <p className="text-base font-semibold text-gray-700 dark:text-gray-200 mt-1">
          {mostProductiveDay.day}
        </p>

        {/* Meta */}
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {mostProductiveDay.shifts || 0} shifts · {formatHoursDecimal(mostProductiveDay.hours || 0)}
        </p>
      </div>
    </BaseStatsCard>
  );
};

export default MostProductiveDay;
