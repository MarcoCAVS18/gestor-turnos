// src/components/dashboard/ThisWeekSummaryCard/index.jsx 

import React from 'react';
import { Calendar, TrendingUp, Target, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import Flex from '../../ui/Flex';
import { useApp } from '../../../contexts/AppContext';
import Card from '../../ui/Card';
import ProgressBar from '../../ui/ProgressBar';
import Button from '../../ui/Button';

const ThisWeekSummaryCard = ({ stats, className }) => {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const { weeklyHoursGoal } = useApp(); 

  // Get data for this week from stats
  const currentWeek = stats.currentWeek || {};
  const totalWeek = currentWeek.totalEarned || 0;
  const hoursWeek = currentWeek.hoursWorked || 0;
  const shiftsWeek = currentWeek.totalShifts || 0; 

  // Use the user's goal or show call-to-action if there is no goal
  const goalHours = weeklyHoursGoal;
  const hasHoursGoal = goalHours && goalHours > 0;

  // Calculate progress only if there is a goal
  const progressHours = hasHoursGoal ? (hoursWeek / goalHours) * 100 : 0;
  const limitedProgress = Math.min(Math.max(progressHours, 0), 100);

  // Function to navigate to settings
  const goToSettings = () => {
    navigate('/ajustes');
  };

  const getProgressBarColor = (progress) => {
    if (progress >= 75) return '#10B981';
    if (progress >= 50) return colors.primary;
    return '#F59E0B';
  };

  return (
    <Card className={className}>
      <div className="flex flex-col h-full">
        <div> {/* Content wrapper */}
          <Flex variant="between" className="mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Calendar size={20} style={{ color: colors.primary }} className="mr-2" />
              This week
            </h3>
          </Flex>

          <div className="space-y-4">
            {/* Main earnings */}
            <div className="text-center">
              <p
                className="text-2xl font-bold"
                style={{ color: colors.primary }}
              >
                {formatCurrency(totalWeek)}
              </p>
              <p className="text-sm text-gray-600">Total earned</p>
            </div>

            {/* Hours progress - Only if there is a goal */}
            {hasHoursGoal ? (
              <div className="space-y-2">
                <Flex variant="between" className="text-sm">
                  <span className="text-gray-600">Progress: </span>
                  <span className="font-medium">{hoursWeek.toFixed(1)}h / {goalHours}h</span>
                </Flex>

                <ProgressBar
                  value={limitedProgress}
                  color={getProgressBarColor(limitedProgress)}
                />
              </div>
            ) : (
              <div className="text-center">
                <Flex variant="center" className="mb-2">
                  <Target size={16} className="text-gray-400 mr-1" />
                  <span className="text-lg font-semibold text-gray-700">{hoursWeek.toFixed(1)}h</span>
                </Flex>
                <div
                  className="p-2 rounded-lg border border-dashed transition-all duration-200"
                  style={{
                    borderColor: colors.transparent30,
                    backgroundColor: colors.transparent5
                  }}
                >
                  <p className="text-xs text-gray-600 mb-1">
                    No weekly goal yet?
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    Setting one helps you stay on track
                  </p>
                  <Button
                    onClick={goToSettings}
                    variant="ghost-animated"
                    size="sm"
                    icon={ArrowRight}
                    iconPosition="right"
                    themeColor={colors.primary}
                    className="-ml-2"
                  >
                    Set up
                  </Button>
                </div>
              </div>
            )}

            {/* Basic stats - Show shifts completed */}
            <Flex variant="between" className=" text-sm">
              <div className="text-center">
                <p className="font-semibold text-gray-800">{shiftsWeek}</p>
                <p className="text-xs text-gray-500">shifts</p>
              </div>
              
              {hasHoursGoal && (
                <div className="text-center">
                  <p className="font-semibold text-gray-800">{Math.ceil(limitedProgress)}%</p>
                  <p className="text-xs text-gray-500">goal</p>
                </div>
              )}
              
              <div className="text-center">
                <p className="font-semibold text-gray-800">{hoursWeek.toFixed(1)}h</p>
                <p className="text-xs text-gray-500">hours</p>
              </div>
            </Flex>

            {/* Motivational message */}
            {totalWeek > 0 && hasHoursGoal && (
              <div className="text-center p-2 rounded-lg" style={{ backgroundColor: colors.transparent10 }}>
                <Flex variant="center">
                  <TrendingUp size={12} style={{ color: colors.primary }} className="mr-1" />
                  <p className="text-xs font-medium" style={{ color: colors.primary }}>
                    {limitedProgress >= 75 ? 'Excellent progress!' : 'Good pace!'}
                  </p>
                </Flex>
              </div>
            )}
          </div>
        </div>
        <div className="flex-grow" /> 
      </div>
    </Card>
  );
};

export default ThisWeekSummaryCard;