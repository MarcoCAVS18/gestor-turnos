// src/components/stats/WorkBreakdown/index.jsx - REFACTORED

import React from 'react';
import { BarChart2 } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';

const WorkBreakdown = ({ earningsByWork = [], totalEarned = 0 }) => {
  const colors = useThemeColors();

  // Verify data
  const validWorks = Array.isArray(earningsByWork) ? earningsByWork : [];
  const safeTotal = typeof totalEarned === 'number' && !isNaN(totalEarned) ? totalEarned : 0;

  if (validWorks.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center mb-4">
          <BarChart2 size={18} style={{ color: colors.primary }} className="mr-2" />
          <h3 className="font-semibold">By work</h3>
        </div>
        <div className="flex items-center py-8 text-gray-500">
          <BarChart2 size={48} className="mx-auto mb-3 opacity-30" />
          <p>No work data</p>
        </div>
      </div>
    );
  }

  // Progress bar component for work
  const WorkProgressBar = ({ work, max }) => {
    const workSafe = {
      name: (work && typeof work.name === 'string') ? work.name : 'No name',
      earnings: (work && typeof work.earnings === 'number') ? work.earnings : 0,
      color: (work && typeof work.color === 'string') ? work.color : colors.primary
    };

    const percentage = max > 0 ? (workSafe.earnings / max) * 100 : 0;

    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{workSafe.name}</span>
          <div className="text-right">
            <span className="text-sm font-bold" style={{ color: workSafe.color }}>
              {formatCurrency(workSafe.earnings)}
            </span>
            <p className="text-xs text-gray-500">
              {workSafe.turns} turns · {workSafe.hours.toFixed(1)}h
            </p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: workSafe.color
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center mb-4">
        <BarChart2 size={18} style={{ color: colors.primary }} className="mr-2" />
        <h3 className="font-semibold">By work</h3>
      </div>

      <div className="space-y-3">
        {validWorks.map((work, index) => {
          const workSafe = {
            name: (work && typeof work.name === 'string') ? work.name : 'No name',
            earnings: (work && typeof work.earnings === 'number') ? work.earnings : 0,
            shifts: (work && typeof work.shifts === 'number') ? work.shifts : 0,
            hours: (work && typeof work.hours === 'number') ? work.hours : 0,
            color: (work && typeof work.color === 'string') ? work.color : colors.primary
          };

          return (
            <div key={work?.id || index}>
              <WorkProgressBar
                work={workSafe}
                max={safeTotal}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkBreakdown;