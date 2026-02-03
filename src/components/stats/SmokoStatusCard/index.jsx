// src/components/stats/SmokoStatusCard/index.jsx

import { useNavigate } from 'react-router-dom';
import { Coffee, Check, X } from 'lucide-react';
import BaseStatsCard from '../../cards/base/BaseStatsCard';

const SmokoStatusCard = ({ smokoEnabled, loading, thematicColors, className = '' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/settings');
  };

  return (
    <div onClick={handleClick} className={`${className} cursor-pointer`}>
      <BaseStatsCard
        icon={Coffee}
        title="Break"
        loading={loading}
      >
        <div className="flex flex-col items-center justify-center w-full gap-2">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              smokoEnabled
                ? 'bg-green-100'
                : 'bg-gray-100'
            }`}
          >
            {smokoEnabled ? (
              <Check size={24} className="text-green-600" />
            ) : (
              <X size={24} className="text-gray-400" />
            )}
          </div>
          <span
            className={`text-sm font-semibold ${
              smokoEnabled ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            {smokoEnabled ? 'Active' : 'Inactive'}
          </span>
        </div>
      </BaseStatsCard>
    </div>
  );
};

export default SmokoStatusCard;
