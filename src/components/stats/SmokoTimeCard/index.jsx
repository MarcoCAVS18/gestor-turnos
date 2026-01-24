// src/components/stats/SmokoTimeCard/index.jsx

import React from 'react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** Clock ***REMOVED*** from 'lucide-react';
import BaseStatsCard from '../../cards/base/BaseStatsCard';
import ***REMOVED*** formatMinutesToHoursAndMinutes ***REMOVED*** from '../../../utils/statsCalculations';
import WavyText from '../../ui/WavyText';

const SmokoTimeCard = (***REMOVED*** smokoMinutes, smokoEnabled, loading, thematicColors, className = '' ***REMOVED***) => ***REMOVED***
  const navigate = useNavigate();

  const handleClick = () => ***REMOVED***
    navigate('/ajustes');
  ***REMOVED***;

  return (
    <div onClick=***REMOVED***handleClick***REMOVED*** className=***REMOVED***`$***REMOVED***className***REMOVED*** cursor-pointer`***REMOVED***>
      <BaseStatsCard
        icon=***REMOVED***Clock***REMOVED***
        title="Time"
        loading=***REMOVED***loading***REMOVED***
        empty=***REMOVED***!smokoEnabled***REMOVED***
        emptyText="Breaks are not active."
      >
        <div className="text-center w-full">
          <div className="text-4xl font-bold">
            <WavyText
              text=***REMOVED***formatMinutesToHoursAndMinutes(smokoMinutes || 0)***REMOVED***
              color=***REMOVED***thematicColors?.base***REMOVED***
              initialDelay=***REMOVED***2500***REMOVED***
            />
          </div>
        </div>
      </BaseStatsCard>
    </div>
  );
***REMOVED***;

export default SmokoTimeCard;