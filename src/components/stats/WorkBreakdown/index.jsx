// src/components/stats/WorkBreakdown/index.jsx - REFACTORED

import React from 'react';
import ***REMOVED*** BarChart2 ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';

const WorkBreakdown = (***REMOVED*** earningsByWork = [], totalEarned = 0 ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();

  // Verify data
  const validWorks = Array.isArray(earningsByWork) ? earningsByWork : [];
  const safeTotal = typeof totalEarned === 'number' && !isNaN(totalEarned) ? totalEarned : 0;

  if (validWorks.length === 0) ***REMOVED***
    return (
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center mb-4">
          <BarChart2 size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
          <h3 className="font-semibold">By work</h3>
        </div>
        <div className="flex items-center py-8 text-gray-500">
          <BarChart2 size=***REMOVED***48***REMOVED*** className="mx-auto mb-3 opacity-30" />
          <p>No work data</p>
        </div>
      </div>
    );
  ***REMOVED***

  // Progress bar component for work
  const WorkProgressBar = (***REMOVED*** work, max ***REMOVED***) => ***REMOVED***
    const workSafe = ***REMOVED***
      name: (work && typeof work.name === 'string') ? work.name : 'No name',
      earnings: (work && typeof work.earnings === 'number') ? work.earnings : 0,
      color: (work && typeof work.color === 'string') ? work.color : colors.primary
    ***REMOVED***;

    const percentage = max > 0 ? (workSafe.earnings / max) * 100 : 0;

    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">***REMOVED***workSafe.name***REMOVED***</span>
          <div className="text-right">
            <span className="text-sm font-bold" style=***REMOVED******REMOVED*** color: workSafe.color ***REMOVED******REMOVED***>
              ***REMOVED***formatCurrency(workSafe.earnings)***REMOVED***
            </span>
            <p className="text-xs text-gray-500">
              ***REMOVED***workSafe.turns***REMOVED*** turns · ***REMOVED***workSafe.hours.toFixed(1)***REMOVED***h
            </p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full transition-all duration-1000 ease-out"
            style=***REMOVED******REMOVED***
              width: `$***REMOVED***Math.min(percentage, 100)***REMOVED***%`,
              backgroundColor: workSafe.color
            ***REMOVED******REMOVED***
          />
        </div>
      </div>
    );
  ***REMOVED***;

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center mb-4">
        <BarChart2 size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
        <h3 className="font-semibold">By work</h3>
      </div>

      <div className="space-y-3">
        ***REMOVED***validWorks.map((work, index) => ***REMOVED***
          const workSafe = ***REMOVED***
            name: (work && typeof work.name === 'string') ? work.name : 'No name',
            earnings: (work && typeof work.earnings === 'number') ? work.earnings : 0,
            shifts: (work && typeof work.shifts === 'number') ? work.shifts : 0,
            hours: (work && typeof work.hours === 'number') ? work.hours : 0,
            color: (work && typeof work.color === 'string') ? work.color : colors.primary
          ***REMOVED***;

          return (
            <div key=***REMOVED***work?.id || index***REMOVED***>
              <WorkProgressBar
                work=***REMOVED***workSafe***REMOVED***
                max=***REMOVED***safeTotal***REMOVED***
              />
            </div>
          );
        ***REMOVED***)***REMOVED***
      </div>
    </div>
  );
***REMOVED***;

export default WorkBreakdown;