// src/components/stats/ShiftTypeStats/index.jsx

import React from 'react';
import { Zap } from 'lucide-react';
import { TURN_TYPE_COLORS } from '../../../constants/colors';
import { formatShiftsCount, pluralizeShiftTypes, calculateTotalShifts } from '../../../utils/pluralization';
import BaseStatsCard from '../../cards/base/BaseStatsCard';

const ShiftTypeStats = ({ currentData, loading, className = '' }) => {
  const { shiftTypes } = currentData;

  const validTypes = shiftTypes && typeof shiftTypes === 'object' && !Array.isArray(shiftTypes) ? shiftTypes : {};
  const totalShifts = calculateTotalShifts(validTypes);
  const titlePlural = pluralizeShiftTypes(totalShifts);
  const isEmpty = Object.keys(validTypes).length === 0;

  const getColorForType = (type) => {
    const key = type === 'undefined' ? 'mixed' : type.toLowerCase();
    return TURN_TYPE_COLORS[key] || '#6B7280';
  };

  return (
    <BaseStatsCard
      icon={Zap}
      title={titlePlural}
      loading={loading}
      empty={isEmpty}
      emptyText="Add shifts to see this statistic."
      className={className}
    >
      <div className="w-full h-full overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 min-h-full items-start">
          {Object.entries(validTypes).map(([type, data]) => {
            const safeData = {
              shifts: (data && typeof data.shifts === 'number') ? data.shifts : 0,
              hours: (data && typeof data.hours === 'number') ? data.hours : 0,
              earnings: (data && typeof data.earnings === 'number') ? data.earnings : 0
            };

            const typeShown = type === 'undefined' ? 'MIXTO' : type.toUpperCase();
            const typeColor = getColorForType(type);

            return (
              <div key={type} className="text-center p-2 bg-gray-50 rounded-lg">
                <div
                  className="w-3 h-3 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: typeColor }}
                />
                <p className="text-xs text-gray-600 capitalize">{typeShown}</p>
                <p className="font-semibold text-sm">{formatShiftsCount(safeData.shifts)}</p>
                <p className="text-xs text-gray-500">{safeData.hours.toFixed(1)}h</p>
              </div>
            );
          })}
        </div>
      </div>
    </BaseStatsCard>
  );
};

export default ShiftTypeStats;