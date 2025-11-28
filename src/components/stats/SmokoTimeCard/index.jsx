// src/components/stats/SmokoTimeCard/index.jsx
import React from 'react';
import { Clock } from 'lucide-react';
import BaseStatsCard from '../../cards/base/BaseStatsCard';
import { formatMinutesToHoursAndMinutes } from '../../../utils/statsCalculations';

const SmokoTimeCard = ({ smokoMinutes, smokoEnabled, loading, thematicColors, className = '' }) => {
  return (
    <BaseStatsCard
      icon={Clock}
      title="Tiempo de Descanso"
      loading={loading}
      empty={!smokoEnabled}
      emptyText="Los descansos no están activados."
      className={className}
    >
      <div className="text-center w-full">
        <p 
          className="text-4xl font-bold"
          style={{ color: thematicColors?.primary }}
        >
          {formatMinutesToHoursAndMinutes(smokoMinutes || 0)}
        </p>
      </div>
    </BaseStatsCard>
  );
};

export default SmokoTimeCard;