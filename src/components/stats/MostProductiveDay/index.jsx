// src/components/stats/MostProductiveDay/index.jsx

import React from 'react';
import ***REMOVED*** Award ***REMOVED*** from 'lucide-react';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import ***REMOVED*** formatHoursDecimal ***REMOVED*** from '../../../utils/time';
import BaseStatsCard from '../../cards/base/BaseStatsCard';
import Flex from '../../ui/Flex';

const MostProductiveDay = (***REMOVED*** currentData, loading, thematicColors, className = '' ***REMOVED***) => ***REMOVED***
  const mostProductiveDay = currentData?.mostProductiveDay;
  
  const isEmpty = !mostProductiveDay || mostProductiveDay.day === 'None' || !mostProductiveDay.earnings || mostProductiveDay.earnings <= 0;

  return (
    <BaseStatsCard
      icon=***REMOVED***Award***REMOVED*** // Pass component directly
      title="Most Productive Day"
      loading=***REMOVED***loading***REMOVED***
      empty=***REMOVED***isEmpty***REMOVED***
      emptyMessage="Not enough data this week."
      className=***REMOVED***className***REMOVED***
    >
      <div className="w-full">
        <Flex variant="between">
          <div>
            <p className="font-bold text-lg" style=***REMOVED******REMOVED*** color: thematicColors?.primary ***REMOVED******REMOVED***>
              ***REMOVED***mostProductiveDay.day***REMOVED***
            </p>
            <p className="text-xs text-gray-600">
              ***REMOVED***mostProductiveDay.shifts || 0***REMOVED*** shifts • ***REMOVED***formatHoursDecimal(mostProductiveDay.hours || 0)***REMOVED***
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-600">
              ***REMOVED***formatCurrency(mostProductiveDay.earnings)***REMOVED***
            </p>
          </div>
        </Flex>
      </div>
    </BaseStatsCard>
  );
***REMOVED***;

export default MostProductiveDay;