// src/components/stats/StatsProgressBar/index.jsx

import React from 'react';
import { Clock, DollarSign, Target } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';
import ProgressBar from '../../ui/ProgressBar';

const StatsProgressBar = ({ className = '', currentData, weeklyHoursGoal }) => {
  const { hoursWorked, totalEarned } = currentData;
  
  const colors = useThemeColors();
  
  const goalHours = weeklyHoursGoal || 40;
  const percentage = goalHours > 0 ? (hoursWorked / goalHours) * 100 : 0;
  const limitedPercentage = Math.min(Math.max(percentage, 0), 100);
  
  const getProgressColor = () => {
    if (percentage >= 100) return '#10B981';
    if (percentage >= 75) return colors.primary; 
    if (percentage >= 50) return '#F59E0B'; 
    return '#EF4444';
  };

  return (
    <Card className={`${className} ${!weeklyHoursGoal ? 'opacity-60' : ''} flex flex-col`}>
      <div className="flex-1 flex flex-col justify-between">
        {/* Header */}
        <Flex variant="between">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <Target size={18} className="mr-2" style={{ color: colors.primary }} />
            Weekly Progress
          </h3>
          <span className="text-sm text-gray-500">
            Goal: {goalHours}h
          </span>
        </Flex>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Flex variant="between" className="text-sm">
            <span className="font-medium">{hoursWorked.toFixed(1)} hours worked</span>
            <span className="text-gray-500">{limitedPercentage.toFixed(1)}%</span>
          </Flex>
          
          <ProgressBar
            value={limitedPercentage}
            color={getProgressColor()}
            height="h-3"
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <Flex>
            <Clock size={16} className="text-blue-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Hours remaining</p>
              <p className="font-medium">
                {Math.max(0, goalHours - hoursWorked).toFixed(1)}h
              </p>
            </div>
          </Flex>
          
          <Flex>
            <DollarSign size={16} className="text-green-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Total earnings</p>
              <p className="font-medium">{formatCurrency(totalEarned)}</p>
            </div>
          </Flex>
        </div>

        {percentage >= 100 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 font-medium">
              Goal met! You have worked the {goalHours} hours this week.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatsProgressBar;