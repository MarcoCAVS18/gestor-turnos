// src/components/stats/MonthlyProjection/index.jsx

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import BaseStatsCard from '../../cards/base/BaseStatsCard';

const MonthlyProjection = ({ totalEarned = 0, hoursWorked = 0 }) => {
  const colors = useThemeColors();

  // Validate data
  const safeTotal = typeof totalEarned === 'number' && !isNaN(totalEarned) ? totalEarned : 0;
  const safeHours = typeof hoursWorked === 'number' && !isNaN(hoursWorked) ? hoursWorked : 0;

  const projectedEarnings = safeTotal * 4.33;
  const projectedHours = safeHours * 4.33;

  const isEmpty = safeTotal === 0 && safeHours === 0;

  return (
    <BaseStatsCard
      icon={TrendingUp}
      title="Monthly Projection"
      empty={isEmpty}
      emptyMessage="No recent activity data"
      emptyDescription="Register shifts to see your monthly projection"
    >
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          If you maintain this pace throughout the month
        </p>
        <p
          className="text-3xl font-bold"
          style={{ color: colors.primary }}
        >
          {formatCurrency(projectedEarnings)}
        </p>
        <p className="text-sm text-gray-500">
          ~{projectedHours.toFixed(0)} hours
        </p>
      </div>
    </BaseStatsCard>
  );
};

export default MonthlyProjection;