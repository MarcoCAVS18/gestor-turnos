// src/components/stats/SmokoStatusCard/index.jsx

import React from 'react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** Coffee ***REMOVED*** from 'lucide-react';
import BaseStatsCard from '../../cards/base/BaseStatsCard';
import WavyText from '../../ui/WavyText';

const SmokoStatusCard = (***REMOVED*** smokoEnabled, loading, thematicColors, className = '' ***REMOVED***) => ***REMOVED***
  const navigate = useNavigate();
  const statusText = smokoEnabled ? 'ACTIVE' : 'INACTIVE';

  const handleClick = () => ***REMOVED***
    navigate('/ajustes');
  ***REMOVED***;

  return (
    <div onClick=***REMOVED***handleClick***REMOVED*** className=***REMOVED***`$***REMOVED***className***REMOVED*** cursor-pointer`***REMOVED***>
      <BaseStatsCard
        icon=***REMOVED***Coffee***REMOVED***
        title="Break"
        loading=***REMOVED***loading***REMOVED***
      >
        <div className="text-center w-full">
          <div className="text-4xl font-bold">
            ***REMOVED***smokoEnabled ? (
              <WavyText text=***REMOVED***statusText***REMOVED*** color=***REMOVED***thematicColors?.base***REMOVED*** />
            ) : (
              <span className="text-gray-500">***REMOVED***statusText***REMOVED***</span>
            )***REMOVED***
          </div>
        </div>
      </BaseStatsCard>
    </div>
  );
***REMOVED***;

export default SmokoStatusCard;