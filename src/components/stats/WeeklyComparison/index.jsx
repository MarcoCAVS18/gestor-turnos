// src/components/stats/WeeklyComparison/index.jsx

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency } from '../../../utils/currency';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';

const WeeklyComparison = ({ currentData, previousData, thematicColors, className = '' }) => {
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

  const calculateChange = (current, previous) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  const changeHours = calculateChange(hoursCurrent, hoursPrevious);
  const changeShifts = calculateChange(shiftsCurrent, shiftsPrevious);
  const changeEarnings = calculateChange(earningsCurrent, earningsPrevious);
  const changeAvg = calculateChange(avgEarningsPerHourCurrent, avgEarningsPerHourPrevious);
  const changeDays = calculateChange(daysCurrent, daysPrevious);

  const getIcon = (change) => {
    if (change > 0) return TrendingUp;
    if (change < 0) return TrendingDown;
    return Minus;
  };

  const getColor = (change) => {
    if (change > 0) return thematicColors.success || '#10B981';
    if (change < 0) return thematicColors.danger || '#EF4444';
    return thematicColors.neutral || '#6B7280';
  };

  const comparisons = [
    { label: 'Earnings vs last week', change: changeEarnings, valueAbs: formatCurrency(earningsCurrent - earningsPrevious) },
    { label: 'Hours vs last week', change: changeHours, valueAbs: `${Math.abs(hoursCurrent - hoursPrevious).toFixed(1)}h` },
    { label: 'Avg/Hour vs last week', change: changeAvg, valueAbs: formatCurrency(Math.abs(avgEarningsPerHourCurrent - avgEarningsPerHourPrevious)) },
    { label: 'Shifts vs last week', change: changeShifts, valueAbs: `${Math.abs(shiftsCurrent - shiftsPrevious)} shifts` },
    { label: 'Days vs last week', change: changeDays, valueAbs: `${Math.abs(daysCurrent - daysPrevious)} days` }
  ];

  return (
    <Card className={`p-4 flex flex-col ${className}`}>
      <h3 className="font-semibold mb-4">Weekly Comparison</h3>

      <div className="flex flex-col gap-2">
        {comparisons.map((comp, index) => {
          const Icon = getIcon(comp.change);
          const color = getColor(comp.change);
          
          return (
            <Flex variant="between" key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-sm text-gray-600">{comp.label}</span>
              </div>
              <div className="flex items-center">
                {comp.valueAbs && (
                  <p className="text-sm text-gray-800 font-medium mr-2">{comp.valueAbs}</p>
                )}
                <Flex variant="center" className="gap-1">
                  <Icon size={14} className={`mr-1 ${color}`} />
                  <span className="text-xs font-medium">{Math.abs(comp.change).toFixed(1)}%</span>
                </Flex>
              </div>
            </Flex>
          );
        })}
      </div>
    </Card>
  );
};

export default WeeklyComparison;