// src/components/stats/SmokoTimeCard/index.jsx

import { useNavigate } from 'react-router-dom';
import { Timer, Coffee } from 'lucide-react';
import BaseStatsCard from '../../cards/base/BaseStatsCard';
import { useThemeColors } from '../../../hooks/useThemeColors';

const SmokoTimeCard = ({ smokoMinutes, smokoEnabled, loading, thematicColors, className = '' }) => {
  const navigate = useNavigate();
  const colors = useThemeColors();

  const handleClick = () => {
    navigate('/settings');
  };

  const formatTime = (minutes) => {
    if (!minutes || minutes <= 0) return '0m';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div onClick={handleClick} className={`${className} cursor-pointer`}>
      <BaseStatsCard
        icon={Timer}
        title="Duration"
        loading={loading}
        empty={!smokoEnabled}
        emptyText="Breaks not active"
      >
        <div className="flex flex-col items-center justify-center w-full gap-2">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${colors.primary}15` }}
          >
            <Coffee size={24} style={{ color: colors.primary }} />
          </div>
          <span
            className="text-xl font-bold text-gray-800"
          >
            {formatTime(smokoMinutes)}
          </span>
          <span className="text-xs text-gray-500">per shift</span>
        </div>
      </BaseStatsCard>
    </div>
  );
};

export default SmokoTimeCard;
