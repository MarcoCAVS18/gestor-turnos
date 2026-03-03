// src/components/stats/ShiftTypeStats/index.jsx

import { useTranslation } from 'react-i18next';
import { Zap } from 'lucide-react';
import { TURN_TYPE_COLORS } from '../../../constants/colors';
import { formatShiftsCount, pluralizeShiftTypes, calculateTotalShifts } from '../../../utils/pluralization';
import BaseStatsCard from '../../cards/base/BaseStatsCard';

// Columns per number of shift types (1–6)
const COLS = { 1: 1, 2: 2, 3: 3, 4: 2, 5: 3, 6: 3 };

const ShiftTypeStats = ({ currentData, loading, className = '' }) => {
  const { t } = useTranslation();
  const { shiftTypes } = currentData;

  const validTypes = shiftTypes && typeof shiftTypes === 'object' && !Array.isArray(shiftTypes) ? shiftTypes : {};
  const entries = Object.entries(validTypes);
  const count = entries.length;
  const totalShifts = calculateTotalShifts(validTypes);
  const titlePlural = pluralizeShiftTypes(totalShifts);
  const isEmpty = count === 0;

  const getColorForType = (type) => {
    const key = type === 'undefined' ? 'mixed' : type.toLowerCase();
    return TURN_TYPE_COLORS[key] || '#6B7280';
  };

  const cols = COLS[count] || 3;

  return (
    <BaseStatsCard
      icon={Zap}
      title={titlePlural}
      loading={loading}
      empty={isEmpty}
      emptyMessage={t('stats.shiftTypeStats.emptyText')}
      className={className}
    >
      {/* Grid fills the full height; each row gets an equal fraction via gridAutoRows 1fr */}
      <div
        className={`grid gap-2 w-full h-full`}
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridAutoRows: '1fr',
        }}
      >
        {entries.map(([type, data]) => {
          const safeData = {
            shifts: (data && typeof data.shifts === 'number') ? data.shifts : 0,
            hours: (data && typeof data.hours === 'number') ? data.hours : 0,
            earnings: (data && typeof data.earnings === 'number') ? data.earnings : 0,
          };

          const typeShown = type === 'undefined' ? 'MIXTO' : type.toUpperCase();
          const typeColor = getColorForType(type);

          return (
            <div
              key={type}
              className="flex flex-col items-center justify-center rounded-lg border min-h-0 p-2"
              style={{
                borderColor: `${typeColor}35`,
                backgroundColor: `${typeColor}12`,
              }}
            >
              <div
                className="rounded-full mb-1.5 flex-shrink-0"
                style={{
                  width: count <= 2 ? 16 : 12,
                  height: count <= 2 ? 16 : 12,
                  backgroundColor: typeColor,
                }}
              />
              <p
                className="text-gray-600 dark:text-gray-300 capitalize font-medium leading-tight text-center"
                style={{ fontSize: count <= 2 ? '0.8rem' : '0.7rem' }}
              >
                {typeShown}
              </p>
              <p
                className="font-bold text-gray-800 dark:text-gray-100 leading-tight"
                style={{ fontSize: count === 1 ? '2rem' : count <= 3 ? '1.25rem' : '0.95rem' }}
              >
                {formatShiftsCount(safeData.shifts)}
              </p>
              <p
                className="text-gray-500 dark:text-gray-400 leading-tight"
                style={{ fontSize: count <= 2 ? '0.8rem' : '0.7rem' }}
              >
                {safeData.hours.toFixed(1)}h
              </p>
            </div>
          );
        })}
      </div>
    </BaseStatsCard>
  );
};

export default ShiftTypeStats;
