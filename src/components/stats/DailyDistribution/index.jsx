// src/components/stats/DailyDistribution/index.jsx

import React from 'react';
import ***REMOVED*** Calendar, Clock, DollarSign ***REMOVED*** from 'lucide-react';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import ***REMOVED*** formatHoursDecimal ***REMOVED*** from '../../../utils/time';
import BaseStatsCard from '../../cards/base/BaseStatsCard';
import Flex from '../../ui/Flex';

const DailyDistribution = (***REMOVED*** currentData, loading, thematicColors ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** earningsPerDay, totalEarned ***REMOVED*** = currentData || ***REMOVED******REMOVED***;
  
  const isEmpty = !totalEarned || totalEarned === 0;

  return (
    <BaseStatsCard
      icon=***REMOVED***Calendar***REMOVED***
      title="Weekly Distribution"
      loading=***REMOVED***loading***REMOVED***
      empty=***REMOVED***isEmpty***REMOVED***
      emptyMessage="No earnings data this week."
    >
      <div className="w-full">
        ***REMOVED***/* Wrapper to enable horizontal scroll on mobile */***REMOVED***
        <div className="lg:overflow-x-hidden overflow-x-auto">
          <div className="space-y-2 lg:w-full min-w-[30rem]">
            ***REMOVED***Object.entries(earningsPerDay).map(([day, data]) => (
              <div key=***REMOVED***day***REMOVED*** className="p-2 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-4 gap-x-2 items-center">
                  <span className="text-sm font-medium text-gray-700 col-span-1 truncate">***REMOVED***day***REMOVED***</span>
                  <Flex variant="end" className="col-span-1">
                    <DollarSign size=***REMOVED***14***REMOVED*** className="mr-1 flex-shrink-0" style=***REMOVED******REMOVED*** color: thematicColors?.primary ***REMOVED******REMOVED*** />
                    <span className="text-sm font-bold text-right" style=***REMOVED******REMOVED*** color: thematicColors?.primary ***REMOVED******REMOVED***>
                      ***REMOVED***formatCurrency(data.earnings)***REMOVED***
                    </span>
                  </Flex>

                  <Flex variant="end" className="col-span-1">
                    <Clock size=***REMOVED***14***REMOVED*** className="mr-1 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600 text-right whitespace-nowrap">
                      ***REMOVED***formatHoursDecimal(data.hours)***REMOVED***
                    </span>
                  </Flex>

                  <div className="text-sm text-gray-500 text-right col-span-1 whitespace-nowrap">
                    ***REMOVED***data.shifts***REMOVED*** shift***REMOVED***data.shifts !== 1 ? 's' : ''***REMOVED***
                  </div>
                </div>
              </div>
            ))***REMOVED***
          </div>
        </div>
      </div>
    </BaseStatsCard>
  );
***REMOVED***;

export default DailyDistribution;