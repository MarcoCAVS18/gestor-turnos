// src/components/stats/StatsProgressBar/index.jsx

import React from 'react';
import { Clock, DollarSign, Target, Trophy, TrendingUp, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
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
  const isGoalMet = percentage >= 100;
  const overHours = Math.max(0, hoursWorked - goalHours);

  const getProgressColor = () => {
    if (isGoalMet) return '#10B981';
    if (percentage >= 75) return colors.primary;
    if (percentage >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const getMilestoneLabel = () => {
    if (percentage >= 150) return { text: 'Overachiever!', icon: Flame, color: '#EF4444' };
    if (percentage >= 100) return { text: 'Goal reached!', icon: Trophy, color: '#10B981' };
    if (percentage >= 75) return { text: 'Almost there!', icon: TrendingUp, color: colors.primary };
    return null;
  };

  const milestone = getMilestoneLabel();

  return (
    <Card className={`${className} ${!weeklyHoursGoal ? 'opacity-60' : ''} flex flex-col`}>
      <div className="flex-1 flex flex-col justify-between gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
            <Target size={18} className="mr-2" style={{ color: colors.primary }} />
            Weekly Progress
          </h3>
          {milestone && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: `${milestone.color}15`, color: milestone.color }}
            >
              <milestone.icon size={12} />
              {milestone.text}
            </motion.div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Flex variant="between" className="text-sm">
            <span className="font-medium dark:text-gray-200">{hoursWorked.toFixed(1)} hours worked</span>
            <span className="text-gray-500 dark:text-gray-400">{goalHours}h goal</span>
          </Flex>

          <ProgressBar
            value={limitedPercentage}
            color={getProgressColor()}
            height="h-3"
          />

          {/* Percentage indicator */}
          <div className="flex justify-end">
            <span
              className="text-xs font-semibold"
              style={{ color: getProgressColor() }}
            >
              {limitedPercentage.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <Flex variant="between" className="pt-2 border-t dark:border-slate-700">
          <Flex>
            <Clock size={16} className="text-blue-500 mr-2 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Remaining</p>
              <p className="font-medium dark:text-white">
                {Math.max(0, goalHours - hoursWorked).toFixed(1)}h
              </p>
            </div>
          </Flex>

          <Flex>
            <DollarSign size={16} className="text-green-500 mr-2 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Earnings</p>
              <p className="font-medium dark:text-white">{formatCurrency(totalEarned)}</p>
            </div>
          </Flex>

          <Flex>
            <Target size={16} className="mr-2 flex-shrink-0" style={{ color: colors.primary }} />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Goal</p>
              <p className="font-medium dark:text-white">{goalHours}h</p>
            </div>
          </Flex>
        </Flex>

        {/* Goal Achievement Celebration */}
        {isGoalMet && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="relative overflow-hidden rounded-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-10" />
            <div className="relative p-4 flex items-center gap-3">
              <motion.div
                initial={{ rotate: -15, scale: 0 }}
                animate={{ rotate: [0, -10, 5, 0], scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg"
              >
                <Trophy size={20} className="text-white" />
              </motion.div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  {percentage >= 150 ? 'Incredible work!' : percentage >= 120 ? 'Exceeded your goal!' : 'Weekly goal achieved!'}
                </p>
                <p className="text-xs text-emerald-600/80 dark:text-emerald-500/80">
                  {overHours > 0
                    ? `${hoursWorked.toFixed(1)}h worked — ${overHours.toFixed(1)}h over your ${goalHours}h goal`
                    : `You completed ${goalHours} hours this week`
                  }
                </p>
              </div>
              {/* Sparkle dots */}
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
};

export default StatsProgressBar;
