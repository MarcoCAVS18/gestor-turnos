// src/components/stats/SmokoStatusCard/index.jsx
import React from 'react';
import { Coffee } from 'lucide-react';
import BaseStatsCard from '../../cards/base/BaseStatsCard';

const SmokoStatusCard = ({ smokoEnabled, loading, thematicColors, className = '' }) => {
  return (
    <BaseStatsCard
      icon={Coffee}
      title="Descanso"
      loading={loading}
      className={className}
    >
      <div className="text-center w-full">
        <p
          className={`text-3xl font-bold ${smokoEnabled ? '' : 'text-gray-500'}`}
          style={smokoEnabled ? { color: thematicColors?.primary } : {}}
        >
          {smokoEnabled ? 'ACTIVADO' : 'DESACTIVADO'}
        </p>
      </div>
    </BaseStatsCard>
  );
};

export default SmokoStatusCard;