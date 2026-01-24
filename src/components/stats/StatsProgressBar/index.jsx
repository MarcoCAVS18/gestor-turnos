// src/components/stats/StatsProgressBar/index.jsx

import React from 'react';
import ***REMOVED*** Clock, DollarSign, Target ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';
import ProgressBar from '../../ui/ProgressBar';

const StatsProgressBar = (***REMOVED*** className = '', currentData, weeklyHoursGoal ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** hoursWorked, totalEarned ***REMOVED*** = currentData;
  
  const colors = useThemeColors();
  
  const goalHours = weeklyHoursGoal || 40;
  const percentage = goalHours > 0 ? (hoursWorked / goalHours) * 100 : 0;
  const limitedPercentage = Math.min(Math.max(percentage, 0), 100);
  
  const getProgressColor = () => ***REMOVED***
    if (percentage >= 100) return '#10B981';
    if (percentage >= 75) return colors.primary; 
    if (percentage >= 50) return '#F59E0B'; 
    return '#EF4444';
  ***REMOVED***;

  return (
    <Card className=***REMOVED***`$***REMOVED***className***REMOVED*** $***REMOVED***!weeklyHoursGoal ? 'opacity-60' : ''***REMOVED*** flex flex-col`***REMOVED***>
      <div className="flex-1 flex flex-col justify-between">
        ***REMOVED***/* Header */***REMOVED***
        <Flex variant="between">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <Target size=***REMOVED***18***REMOVED*** className="mr-2" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** />
            Weekly Progress
          </h3>
          <span className="text-sm text-gray-500">
            Goal: ***REMOVED***goalHours***REMOVED***h
          </span>
        </Flex>

        ***REMOVED***/* Progress Bar */***REMOVED***
        <div className="space-y-2">
          <Flex variant="between" className="text-sm">
            <span className="font-medium">***REMOVED***hoursWorked.toFixed(1)***REMOVED*** hours worked</span>
            <span className="text-gray-500">***REMOVED***limitedPercentage.toFixed(1)***REMOVED***%</span>
          </Flex>
          
          <ProgressBar
            value=***REMOVED***limitedPercentage***REMOVED***
            color=***REMOVED***getProgressColor()***REMOVED***
            height="h-3"
          />
        </div>

        ***REMOVED***/* Additional Stats */***REMOVED***
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <Flex>
            <Clock size=***REMOVED***16***REMOVED*** className="text-blue-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Hours remaining</p>
              <p className="font-medium">
                ***REMOVED***Math.max(0, goalHours - hoursWorked).toFixed(1)***REMOVED***h
              </p>
            </div>
          </Flex>
          
          <Flex>
            <DollarSign size=***REMOVED***16***REMOVED*** className="text-green-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Total earnings</p>
              <p className="font-medium">***REMOVED***formatCurrency(totalEarned)***REMOVED***</p>
            </div>
          </Flex>
        </div>

        ***REMOVED***percentage >= 100 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 font-medium">
              Goal met! You have worked the ***REMOVED***goalHours***REMOVED*** hours this week.
            </p>
          </div>
        )***REMOVED***
      </div>
    </Card>
  );
***REMOVED***;

export default StatsProgressBar;