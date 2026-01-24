// src/components/stats/SmokoTimeCard/index.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import BaseStatsCard from '../../cards/base/BaseStatsCard';
import { formatMinutesToHoursAndMinutes } from '../../../utils/statsCalculations';
import WavyText from '../../ui/WavyText';

const SmokoTimeCard = ({ smokoMinutes, smokoEnabled, loading, thematicColors, className = '' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/ajustes');
  };

  return (
    <div onClick={handleClick} className={`${className} cursor-pointer`}>
      <BaseStatsCard
        icon={Clock}
        title="Time"
        loading={loading}
        empty={!smokoEnabled}
        emptyText="Breaks are not active."
      >
        <div className="text-center w-full">
          <div className="text-4xl font-bold">
            <WavyText
              text={formatMinutesToHoursAndMinutes(smokoMinutes || 0)}
              color={thematicColors?.base}
              initialDelay={2500}
            />
          </div>
        </div>
      </BaseStatsCard>
    </div>
  );
};

export default SmokoTimeCard;