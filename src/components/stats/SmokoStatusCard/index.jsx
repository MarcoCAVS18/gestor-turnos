// src/components/stats/SmokoStatusCard/index.jsx
import React from 'react';
import ***REMOVED*** Coffee ***REMOVED*** from 'lucide-react';
import BaseStatsCard from '../../cards/base/BaseStatsCard';

const SmokoStatusCard = (***REMOVED*** smokoEnabled, loading, thematicColors, className = '' ***REMOVED***) => ***REMOVED***
  return (
    <BaseStatsCard
      icon=***REMOVED***Coffee***REMOVED***
      title="Descanso"
      loading=***REMOVED***loading***REMOVED***
      className=***REMOVED***className***REMOVED***
    >
      <div className="text-center w-full">
        <p
          className=***REMOVED***`text-3xl font-bold $***REMOVED***smokoEnabled ? '' : 'text-gray-500'***REMOVED***`***REMOVED***
          style=***REMOVED***smokoEnabled ? ***REMOVED*** color: thematicColors?.primary ***REMOVED*** : ***REMOVED******REMOVED******REMOVED***
        >
          ***REMOVED***smokoEnabled ? 'ACTIVADO' : 'DESACTIVADO'***REMOVED***
        </p>
      </div>
    </BaseStatsCard>
  );
***REMOVED***;

export default SmokoStatusCard;