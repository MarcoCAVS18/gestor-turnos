// src/components/shifts/WeeklyShiftsSection/index.jsx

import React from 'react';
// FIXED IMPORTS
import { formatCurrency, formatHours } from '../../../utils/statsCalculations'; 
import { formatShiftsCount } from '../../../utils/pluralization';
import  Card  from '../../ui/Card';

const WeeklyShiftsSection = ({ weeklyStats }) => {
  if (!weeklyStats) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-4">Weekly Overview</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Total Earnings */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(weeklyStats.totalEarned)}</p>
        </div>

        {/* Total Shifts */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">
             {formatShiftsCount(weeklyStats.totalShifts, true)}
          </p>
          <p className="text-2xl font-bold text-gray-900">{weeklyStats.totalShifts}</p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="space-y-2 text-sm mt-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Hours Worked</span>
          <span className="font-semibold">{formatHours(weeklyStats.hoursWorked)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Days Worked</span>
          <span className="font-semibold">{weeklyStats.daysWorked}</span>
        </div>
      </div>
    </Card>
  );
};

export default WeeklyShiftsSection;