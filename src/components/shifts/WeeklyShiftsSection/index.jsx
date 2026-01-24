// src/components/shifts/WeeklyShiftsSection/index.jsx

import React from 'react';
// FIXED IMPORTS
import ***REMOVED*** formatCurrency, formatHours ***REMOVED*** from '../../../utils/statsCalculations'; 
import ***REMOVED*** formatShiftsCount ***REMOVED*** from '../../../utils/pluralization';
import  Card  from '../../ui/Card';

const WeeklyShiftsSection = (***REMOVED*** weeklyStats ***REMOVED***) => ***REMOVED***
  if (!weeklyStats) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-4">Weekly Overview</h3>

      <div className="grid grid-cols-2 gap-4">
        ***REMOVED***/* Total Earnings */***REMOVED***
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
          <p className="text-2xl font-bold text-gray-900">***REMOVED***formatCurrency(weeklyStats.totalEarned)***REMOVED***</p>
        </div>

        ***REMOVED***/* Total Shifts */***REMOVED***
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">
             ***REMOVED***formatShiftsCount(weeklyStats.totalShifts, true)***REMOVED***
          </p>
          <p className="text-2xl font-bold text-gray-900">***REMOVED***weeklyStats.totalShifts***REMOVED***</p>
        </div>
      </div>

      ***REMOVED***/* Detailed Stats */***REMOVED***
      <div className="space-y-2 text-sm mt-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Hours Worked</span>
          <span className="font-semibold">***REMOVED***formatHours(weeklyStats.hoursWorked)***REMOVED***</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Days Worked</span>
          <span className="font-semibold">***REMOVED***weeklyStats.daysWorked***REMOVED***</span>
        </div>
      </div>
    </Card>
  );
***REMOVED***;

export default WeeklyShiftsSection;