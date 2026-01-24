// src/components/stats/WeeklyComparison/index.jsx

import React from 'react';
import ***REMOVED*** TrendingUp, TrendingDown, Minus ***REMOVED*** from 'lucide-react';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';

const WeeklyComparison = (***REMOVED*** currentData, previousData, thematicColors, className = '' ***REMOVED***) => ***REMOVED***
  const hoursCurrent = currentData?.hoursWorked || 0;
  const hoursPrevious = previousData?.hoursWorked || 0;
  
  const shiftsCurrent = currentData?.totalShifts || 0;
  const shiftsPrevious = previousData?.totalShifts || 0;

  const earningsCurrent = (currentData && typeof currentData.totalEarnings === 'number' && !isNaN(currentData.totalEarnings)) ? currentData.totalEarnings : 0;
  const earningsPrevious = (previousData && typeof previousData.totalEarnings === 'number' && !isNaN(previousData.totalEarnings)) ? previousData.totalEarnings : 0;

  const daysCurrent = currentData?.daysWorked || 0;
  const daysPrevious = previousData?.daysWorked || 0;

  const avgEarningsPerHourCurrent = currentData?.averageEarningsPerHour || 0;
  const avgEarningsPerHourPrevious = previousData?.averageEarningsPerHour || 0;

  const calculateChange = (current, previous) => ***REMOVED***
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  ***REMOVED***;

  const changeHours = calculateChange(hoursCurrent, hoursPrevious);
  const changeShifts = calculateChange(shiftsCurrent, shiftsPrevious);
  const changeEarnings = calculateChange(earningsCurrent, earningsPrevious);
  const changeAvg = calculateChange(avgEarningsPerHourCurrent, avgEarningsPerHourPrevious);
  const changeDays = calculateChange(daysCurrent, daysPrevious);

  const getIcon = (change) => ***REMOVED***
    if (change > 0) return TrendingUp;
    if (change < 0) return TrendingDown;
    return Minus;
  ***REMOVED***;

  const getColor = (change) => ***REMOVED***
    if (change > 0) return thematicColors.success || '#10B981';
    if (change < 0) return thematicColors.danger || '#EF4444';
    return thematicColors.neutral || '#6B7280';
  ***REMOVED***;

  const comparisons = [
    ***REMOVED*** label: 'Earnings vs last week', change: changeEarnings, valueAbs: formatCurrency(earningsCurrent - earningsPrevious) ***REMOVED***,
    ***REMOVED*** label: 'Hours vs last week', change: changeHours, valueAbs: `$***REMOVED***Math.abs(hoursCurrent - hoursPrevious).toFixed(1)***REMOVED***h` ***REMOVED***,
    ***REMOVED*** label: 'Avg/Hour vs last week', change: changeAvg, valueAbs: formatCurrency(Math.abs(avgEarningsPerHourCurrent - avgEarningsPerHourPrevious)) ***REMOVED***,
    ***REMOVED*** label: 'Shifts vs last week', change: changeShifts, valueAbs: `$***REMOVED***Math.abs(shiftsCurrent - shiftsPrevious)***REMOVED*** shifts` ***REMOVED***,
    ***REMOVED*** label: 'Days vs last week', change: changeDays, valueAbs: `$***REMOVED***Math.abs(daysCurrent - daysPrevious)***REMOVED*** days` ***REMOVED***
  ];

  return (
    <Card className=***REMOVED***`p-4 flex flex-col $***REMOVED***className***REMOVED***`***REMOVED***>
      <h3 className="font-semibold mb-4">Weekly Comparison</h3>
      
      <div className="flex-1 flex flex-col justify-between">
        ***REMOVED***comparisons.map((comp, index) => ***REMOVED***
          const Icon = getIcon(comp.change);
          const color = getColor(comp.change);
          
          return (
            <Flex variant="between" key=***REMOVED***index***REMOVED*** className="p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-sm text-gray-600">***REMOVED***comp.label***REMOVED***</span>
              </div>
              <div className="flex items-center">
                ***REMOVED***comp.valueAbs && (
                  <p className="text-sm text-gray-800 font-medium mr-2">***REMOVED***comp.valueAbs***REMOVED***</p>
                )***REMOVED***
                <Flex variant="center" className="gap-1">
                  <Icon size=***REMOVED***14***REMOVED*** className=***REMOVED***`mr-1 $***REMOVED***color***REMOVED***`***REMOVED*** />
                  <span className="text-xs font-medium">***REMOVED***Math.abs(comp.change).toFixed(1)***REMOVED***%</span>
                </Flex>
              </div>
            </Flex>
          );
        ***REMOVED***)***REMOVED***
      </div>
    </Card>
  );
***REMOVED***;

export default WeeklyComparison;