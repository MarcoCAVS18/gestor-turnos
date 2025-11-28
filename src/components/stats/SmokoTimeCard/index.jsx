// src/components/stats/SmokoTimeCard/index.jsx
import React from 'react';
import ***REMOVED*** Clock ***REMOVED*** from 'lucide-react';
import BaseStatsCard from '../../cards/base/BaseStatsCard';
import ***REMOVED*** formatMinutesToHoursAndMinutes ***REMOVED*** from '../../../utils/statsCalculations';

const SmokoTimeCard = (***REMOVED*** smokoMinutes, smokoEnabled, loading, thematicColors, className = '' ***REMOVED***) => ***REMOVED***
  return (
    <BaseStatsCard
      icon=***REMOVED***Clock***REMOVED***
      title="Tiempo de Descanso"
      loading=***REMOVED***loading***REMOVED***
      empty=***REMOVED***!smokoEnabled***REMOVED***
      emptyText="Los descansos no están activados."
      className=***REMOVED***className***REMOVED***
    >
      <div className="text-center w-full">
        <p 
          className="text-4xl font-bold"
          style=***REMOVED******REMOVED*** color: thematicColors?.primary ***REMOVED******REMOVED***
        >
          ***REMOVED***formatMinutesToHoursAndMinutes(smokoMinutes || 0)***REMOVED***
        </p>
      </div>
    </BaseStatsCard>
  );
***REMOVED***;

export default SmokoTimeCard;