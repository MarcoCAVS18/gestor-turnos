// src/components/stats/WeeklyStatsGrid/index.jsx
import React from 'react';
import ***REMOVED*** DollarSign, Clock, Target, Activity ***REMOVED*** from 'lucide-react';
import Flex from '../../ui/Flex';
import Card from '../../ui/Card';
import LoadingSpinner from '../../ui/LoadingSpinner/LoadingSpinner';

const WeeklyStatsGrid = (***REMOVED*** currentData, thematicColors, loading, className = '' ***REMOVED***) => ***REMOVED***
  const safeData = ***REMOVED***
    totalEarned: (currentData && typeof currentData.totalEarned === 'number' && !isNaN(currentData.totalEarned)) ? currentData.totalEarned : 0,
    hoursWorked: (currentData && typeof currentData.hoursWorked === 'number') ? currentData.hoursWorked : 0,
    daysWorked: (currentData && typeof currentData.daysWorked === 'number') ? currentData.daysWorked : 0,
    totalShifts: (currentData && typeof currentData.totalShifts === 'number') ? currentData.totalShifts : 0
  ***REMOVED***;

  const stats = [
    ***REMOVED*** icon: DollarSign, label: 'Total earned', value: `$***REMOVED***safeData.totalEarned.toFixed(2)***REMOVED***` ***REMOVED***,
    ***REMOVED*** icon: Clock, label: 'Hours worked', value: `$***REMOVED***safeData.hoursWorked.toFixed(1)***REMOVED***h` ***REMOVED***,
    ***REMOVED*** icon: Target, label: 'Total shifts', value: safeData.totalShifts ***REMOVED***,
    ***REMOVED*** icon: Activity, label: 'Days worked', value: `$***REMOVED***safeData.daysWorked***REMOVED***/7` ***REMOVED***
  ];

  if (loading) ***REMOVED***
    return (
      <Card className=***REMOVED***`p-4 flex items-center justify-center h-48 $***REMOVED***className***REMOVED***`***REMOVED***>
        <LoadingSpinner />
      </Card>
    );
  ***REMOVED***

  return (
    <Card variant="transparent" padding="none" className=***REMOVED***`flex flex-col $***REMOVED***className***REMOVED***`***REMOVED***>
      <div className="grid grid-cols-2 gap-4 flex-1">
        ***REMOVED***stats.map((stat, index) => ***REMOVED***
          const Icon = stat.icon;
          return (
            <div key=***REMOVED***index***REMOVED*** className="text-center p-4 bg-gray-50 rounded-lg flex flex-col justify-center">
              <Flex variant="center" className="mb-2">
                <Icon size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: stat.color ***REMOVED******REMOVED*** className="mr-1" />
                <span className="text-sm text-gray-600">***REMOVED***stat.label***REMOVED***</span>
              </Flex>
              <p className="text-2xl font-bold" style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED***>
                ***REMOVED***stat.value***REMOVED***
              </p>
            </div>
          );
        ***REMOVED***)***REMOVED***
      </div>
    </Card>
  );
***REMOVED***;

export default WeeklyStatsGrid;