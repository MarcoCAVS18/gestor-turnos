// src/components/stats/ShiftTypeStats/index.jsx

import React from 'react';
import ***REMOVED*** Zap ***REMOVED*** from 'lucide-react';
import ***REMOVED*** TURN_TYPE_COLORS ***REMOVED*** from '../../../constants/colors';
import ***REMOVED*** formatShiftsCount, pluralizeShiftTypes, calculateTotalShifts ***REMOVED*** from '../../../utils/pluralization';
import BaseStatsCard from '../../cards/base/BaseStatsCard';

const ShiftTypeStats = (***REMOVED*** currentData, loading, className = '' ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** shiftTypes ***REMOVED*** = currentData;

  const validTypes = shiftTypes && typeof shiftTypes === 'object' && !Array.isArray(shiftTypes) ? shiftTypes : ***REMOVED******REMOVED***;
  const totalShifts = calculateTotalShifts(validTypes);
  const titlePlural = pluralizeShiftTypes(totalShifts);
  const isEmpty = Object.keys(validTypes).length === 0;

  const getColorForType = (type) => ***REMOVED***
    const colorMap = ***REMOVED***
      'diurno': TURN_TYPE_COLORS.Diurno,
      'tarde': TURN_TYPE_COLORS.Tarde,
      'noche': TURN_TYPE_COLORS.Noche,
      'nocturno': TURN_TYPE_COLORS.Nocturno,
      'sabado': TURN_TYPE_COLORS.Sábado,
      'domingo': TURN_TYPE_COLORS.Domingo,
      'mixto': '#6B7280'
    ***REMOVED***;
    return colorMap[type.toLowerCase()] || '#6B7280';
  ***REMOVED***;

  return (
    <BaseStatsCard
      icon=***REMOVED***Zap***REMOVED***
      title=***REMOVED***titlePlural***REMOVED***
      loading=***REMOVED***loading***REMOVED***
      empty=***REMOVED***isEmpty***REMOVED***
      emptyText="Add shifts to see this statistic."
      className=***REMOVED***className***REMOVED***
    >
      <div className="w-full h-full overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 min-h-full items-start">
          ***REMOVED***Object.entries(validTypes).map(([type, data]) => ***REMOVED***
            const safeData = ***REMOVED***
              shifts: (data && typeof data.shifts === 'number') ? data.shifts : 0,
              hours: (data && typeof data.hours === 'number') ? data.hours : 0,
              earnings: (data && typeof data.earnings === 'number') ? data.earnings : 0
            ***REMOVED***;

            const typeShown = type === 'undefined' ? 'MIXTO' : type.toUpperCase();
            const typeColor = getColorForType(type);

            return (
              <div key=***REMOVED***type***REMOVED*** className="text-center p-2 bg-gray-50 rounded-lg">
                <div
                  className="w-3 h-3 rounded-full mx-auto mb-2"
                  style=***REMOVED******REMOVED*** backgroundColor: typeColor ***REMOVED******REMOVED***
                />
                <p className="text-xs text-gray-600 capitalize">***REMOVED***typeShown***REMOVED***</p>
                <p className="font-semibold text-sm">***REMOVED***formatShiftsCount(safeData.shifts)***REMOVED***</p>
                <p className="text-xs text-gray-500">***REMOVED***safeData.hours.toFixed(1)***REMOVED***h</p>
              </div>
            );
          ***REMOVED***)***REMOVED***
        </div>
      </div>
    </BaseStatsCard>
  );
***REMOVED***;

export default ShiftTypeStats;