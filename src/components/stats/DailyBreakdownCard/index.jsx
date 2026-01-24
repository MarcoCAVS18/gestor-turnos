// src/components/stats/DailyBreakdownCard/index.jsx

import React from 'react';
import ***REMOVED*** Calendar, Clock, DollarSign ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import BaseStatsCard from '../../cards/base/BaseStatsCard';
import ***REMOVED*** calculateShiftHours, calculateShiftEarnings ***REMOVED*** from '../../../utils/statsCalculations';
import Flex from '../../ui/Flex';

const DailyBreakdownCard = (***REMOVED*** shiftsByDay = ***REMOVED******REMOVED***, works = [] ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();

  // Validate data
  const data = shiftsByDay && typeof shiftsByDay === 'object' ? shiftsByDay : ***REMOVED******REMOVED***;
  const validWorks = Array.isArray(works) ? works : [];

  const isEmpty = Object.keys(data).length === 0;

  // Format date
  const formatDate = (date) => ***REMOVED***
    try ***REMOVED***
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString('en-US', ***REMOVED***
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      ***REMOVED***);
    ***REMOVED*** catch (error) ***REMOVED***
      return date;
    ***REMOVED***
  ***REMOVED***;

  return (
    <BaseStatsCard
      title="Daily Breakdown"
      icon=***REMOVED***Calendar***REMOVED***
      empty=***REMOVED***isEmpty***REMOVED***
      emptyMessage="No shifts registered this week"
      emptyDescription="Shifts will appear here once you add some"
    >
      <div className="space-y-3">
        ***REMOVED***Object.entries(data).map(([date, shifts]) => ***REMOVED***
          const totalHours = shifts.reduce((total, shift) => total + calculateShiftHours(shift), 0);
          const totalEarnings = shifts.reduce((total, shift) => total + calculateShiftEarnings(shift, validWorks), 0);

          return (
            <Flex variant="between" key=***REMOVED***date***REMOVED*** className="p-3 bg-gray-50 rounded-lg">
              <Flex>
                <Flex variant="center"
                  className="w-10 h-10 rounded-full mr-3"
                  style=***REMOVED******REMOVED*** backgroundColor: colors.transparent10 ***REMOVED******REMOVED***
                >
                  <Calendar size=***REMOVED***16***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** />
                </Flex>
                <div>
                  <p className="font-medium text-gray-800">
                    ***REMOVED***formatDate(date)***REMOVED***
                  </p>
                  <p className="text-sm text-gray-500">
                    ***REMOVED***shifts.length***REMOVED*** shift***REMOVED***shifts.length !== 1 ? 's' : ''***REMOVED***
                  </p>
                </div>
              </Flex>

              <Flex className="space-x-4 text-sm">
                <Flex className="text-purple-600">
                  <Clock size=***REMOVED***14***REMOVED*** className="mr-1" />
                  <span>***REMOVED***totalHours.toFixed(1)***REMOVED***h</span>
                </Flex>
                <Flex className="text-green-600">
                  <DollarSign size=***REMOVED***14***REMOVED*** className="mr-1" />
                  <span>***REMOVED***formatCurrency(totalEarnings)***REMOVED***</span>
                </Flex>
              </Flex>
            </Flex>
          );
        ***REMOVED***)***REMOVED***
      </div>
    </BaseStatsCard>
  );
***REMOVED***;

export default DailyBreakdownCard;