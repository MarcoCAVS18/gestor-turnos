// src/components/stats/StatsProgressBar/index.jsx

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
      <div className="flex-1 flex flex-col justify-between gap-4">
        {/* Header */}
        <h3 className="font-semibold text-gray-800 flex items-center">
          <Target size={18} className="mr-2" style={{ color: colors.primary }} />
          Weekly Progress
        </h3>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Flex variant="between" className="text-sm">
            <span className="font-medium">{hoursWorked.toFixed(1)} hours worked</span>
          </Flex>

          <ProgressBar
            value={limitedPercentage}
            color={getProgressColor()}
            height="h-3"
          />
        </div>

        {/* Stats Row */}
        <Flex variant="between" className="pt-2 border-t">
          <Flex>
            <Clock size={16} className="text-blue-500 mr-2 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Remaining</p>
              <p className="font-medium">
                {Math.max(0, goalHours - hoursWorked).toFixed(1)}h
              </p>
            </div>
          </Flex>

          <Flex>
            <DollarSign size={16} className="text-green-500 mr-2 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Earnings</p>
              <p className="font-medium">{formatCurrency(totalEarned)}</p>
            </div>
          </Flex>

          <Flex>
            <Target size={16} className="mr-2 flex-shrink-0" style={{ color: colors.primary }} />
            <div>
              <p className="text-xs text-gray-500">Goal</p>
              <p className="font-medium">{goalHours}h ({limitedPercentage.toFixed(0)}%)</p>
            </div>
          </Flex>
        </Flex>

        {percentage >= 100 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 font-medium">
              Goal met! You worked {goalHours} hours this week.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatsProgressBar;