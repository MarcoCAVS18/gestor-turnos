// src/components/stats/SmokoStatusCard/index.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee } from 'lucide-react';
import BaseStatsCard from '../../cards/base/BaseStatsCard';
import WavyText from '../../ui/WavyText';

const SmokoStatusCard = ({ smokoEnabled, loading, thematicColors, className = '' }) => {
  const navigate = useNavigate();
  const statusText = smokoEnabled ? 'ACTIVE' : 'INACTIVE';

  const handleClick = () => {
    navigate('/ajustes');
  };

  return (
    <div onClick={handleClick} className={`${className} cursor-pointer`}>
      <BaseStatsCard
        icon={Coffee}
        title="Break"
        loading={loading}
      >
        <div className="text-center w-full">
          <div className="text-4xl font-bold">
            {smokoEnabled ? (
              <WavyText text={statusText} color={thematicColors?.base} />
            ) : (
              <span className="text-gray-500">{statusText}</span>
            )}
          </div>
        </div>
      </BaseStatsCard>
    </div>
  );
};

export default SmokoStatusCard;