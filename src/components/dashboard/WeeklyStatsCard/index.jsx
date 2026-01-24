// src/components/dashboard/WeeklyStatsCard/index.jsx

import React from 'react';
import ***REMOVED*** DollarSign, Clock, Target, Activity ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import Flex from '../../ui/Flex';

const WeeklyStatsGrid = (***REMOVED*** data = ***REMOVED******REMOVED*** ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();

  const safeData = ***REMOVED***
    totalEarnings: (data && typeof data.totalEarnings === 'number' && !isNaN(data.totalEarnings)) ? data.totalEarnings : 0,
    hoursWorked: (data && typeof data.hoursWorked === 'number') ? data.hoursWorked : 0,
    daysWorked: (data && typeof data.daysWorked === 'number') ? data.daysWorked : 0,
    totalShifts: (data && typeof data.totalShifts === 'number') ? data.totalShifts : 0
  ***REMOVED***;

  const stats = [
    ***REMOVED***
      icon: DollarSign,
      label: 'Total earned',
      value: formatCurrency(safeData.totalEarnings),
      color: colors.primary
    ***REMOVED***,
    ***REMOVED***
      icon: Clock,
      label: 'Hours worked',
      value: `$***REMOVED***safeData.hoursWorked.toFixed(1)***REMOVED***h`,
      color: colors.primary
    ***REMOVED***,
    ***REMOVED***
      icon: Target,
      label: 'Total shifts',
      value: safeData.totalShifts,
      color: colors.primary
    ***REMOVED***,
    ***REMOVED***
      icon: Activity,
      label: 'Days worked',
      value: `$***REMOVED***safeData.daysWorked***REMOVED***/7`,
      color: colors.primary
    ***REMOVED***
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      ***REMOVED***stats.map((stat, index) => ***REMOVED***
        const Icon = stat.icon;
        return (
          <div key=***REMOVED***index***REMOVED*** className="text-center p-4 bg-gray-50 rounded-lg">
            <Flex variant="center" className="mb-2">
              <Icon size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: stat.color ***REMOVED******REMOVED*** className="mr-1" />
              <span className="text-sm text-gray-600">***REMOVED***stat.label***REMOVED***</span>
            </Flex>
            <p className="text-2xl font-bold" style=***REMOVED******REMOVED*** color: stat.color ***REMOVED******REMOVED***>
              ***REMOVED***stat.value***REMOVED***
            </p>
          </div>
        );
      ***REMOVED***)***REMOVED***
    </div>
  );
***REMOVED***;

export default WeeklyStatsGrid;