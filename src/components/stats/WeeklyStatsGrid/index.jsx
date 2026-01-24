// src/components/stats/WeeklyStatsGrid/index.jsx
import React from 'react';
import { DollarSign, Clock, Target, Activity } from 'lucide-react';
import Flex from '../../ui/Flex';
import Card from '../../ui/Card';
import LoadingSpinner from '../../ui/LoadingSpinner/LoadingSpinner';

const WeeklyStatsGrid = ({ currentData, thematicColors, loading, className = '' }) => {
  const safeData = {
    totalEarned: (currentData && typeof currentData.totalEarned === 'number' && !isNaN(currentData.totalEarned)) ? currentData.totalEarned : 0,
    hoursWorked: (currentData && typeof currentData.hoursWorked === 'number') ? currentData.hoursWorked : 0,
    daysWorked: (currentData && typeof currentData.daysWorked === 'number') ? currentData.daysWorked : 0,
    totalShifts: (currentData && typeof currentData.totalShifts === 'number') ? currentData.totalShifts : 0
  };

  const stats = [
    { icon: DollarSign, label: 'Total earned', value: `${safeData.totalEarned.toFixed(2)}` },
    { icon: Clock, label: 'Hours worked', value: `${safeData.hoursWorked.toFixed(1)}h` },
    { icon: Target, label: 'Total shifts', value: safeData.totalShifts },
    { icon: Activity, label: 'Days worked', value: `${safeData.daysWorked}/7` }
  ];

  if (loading) {
    return (
      <Card className={`p-4 flex items-center justify-center h-48 ${className}`}>
        <LoadingSpinner />
      </Card>
    );
  }

  return (
    <Card variant="transparent" padding="none" className={`flex flex-col ${className}`}>
      <div className="grid grid-cols-2 gap-4 flex-1">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg flex flex-col justify-center">
              <Flex variant="center" className="mb-2">
                <Icon size={18} style={{ color: stat.color }} className="mr-1" />
                <span className="text-sm text-gray-600">{stat.label}</span>
              </Flex>
              <p className="text-2xl font-bold" style={{ color: thematicColors?.base }}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default WeeklyStatsGrid;