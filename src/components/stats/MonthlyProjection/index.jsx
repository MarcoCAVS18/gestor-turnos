// src/components/stats/MonthlyProjection/index.jsx

import React from 'react';
import ***REMOVED*** TrendingUp ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import BaseStatsCard from '../../cards/base/BaseStatsCard';

const MonthlyProjection = (***REMOVED*** totalEarned = 0, hoursWorked = 0 ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();

  // Validate data
  const safeTotal = typeof totalEarned === 'number' && !isNaN(totalEarned) ? totalEarned : 0;
  const safeHours = typeof hoursWorked === 'number' && !isNaN(hoursWorked) ? hoursWorked : 0;

  const projectedEarnings = safeTotal * 4.33;
  const projectedHours = safeHours * 4.33;

  const isEmpty = safeTotal === 0 && safeHours === 0;

  return (
    <BaseStatsCard
      icon=***REMOVED***TrendingUp***REMOVED***
      title="Monthly Projection"
      empty=***REMOVED***isEmpty***REMOVED***
      emptyMessage="No recent activity data"
      emptyDescription="Register shifts to see your monthly projection"
    >
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          If you maintain this pace throughout the month
        </p>
        <p
          className="text-3xl font-bold"
          style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
        >
          ***REMOVED***formatCurrency(projectedEarnings)***REMOVED***
        </p>
        <p className="text-sm text-gray-500">
          ~***REMOVED***projectedHours.toFixed(0)***REMOVED*** hours
        </p>
      </div>
    </BaseStatsCard>
  );
***REMOVED***;

export default MonthlyProjection;