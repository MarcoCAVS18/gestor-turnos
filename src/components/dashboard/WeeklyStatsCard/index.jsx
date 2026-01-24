// src/components/dashboard/WeeklyStatsCard/index.jsx

import React from 'react';
import { DollarSign, Clock, Target, Activity } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import Flex from '../../ui/Flex';

const WeeklyStatsGrid = ({ data = {} }) => {
  const colors = useThemeColors();

  const safeData = {
    totalEarned: (data && typeof data.totalEarned === 'number' && !isNaN(data.totalEarned)) ? data.totalEarned : 0,
    hoursWorked: (data && typeof data.hoursWorked === 'number') ? data.hoursWorked : 0,
    daysWorked: (data && typeof data.daysWorked === 'number') ? data.daysWorked : 0,
    totalShifts: (data && typeof data.totalShifts === 'number') ? data.totalShifts : 0
  };

  const stats = [
    {
      icon: DollarSign,
      label: 'Total earned',
      value: formatCurrency(safeData.totalEarned),
      color: colors.primary
    },
    {
      icon: Clock,
      label: 'Hours worked',
      value: `${safeData.hoursWorked.toFixed(1)}h`,
      color: colors.primary
    },
    {
      icon: Target,
      label: 'Total shifts',
      value: safeData.totalShifts,
      color: colors.primary
    },
    {
      icon: Activity,
      label: 'Days worked',
      value: `${safeData.daysWorked}/7`,
      color: colors.primary
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
            <Flex variant="center" className="mb-2">
              <Icon size={18} style={{ color: stat.color }} className="mr-1" />
              <span className="text-sm text-gray-600">{stat.label}</span>
            </Flex>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyStatsGrid;