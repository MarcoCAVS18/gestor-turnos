// src/components/stats/SmokoStatusCard/index.jsx

import { useNavigate } from 'react-router-dom';
import { Coffee, Clock, Hash } from 'lucide-react';
import Card from '../../ui/Card';
import LoadingSpinner from '../../ui/LoadingSpinner/LoadingSpinner';
import { useThemeColors } from '../../../hooks/useThemeColors';

const SmokoStatusCard = ({
  smokoEnabled,
  smokoMinutes = 0,
  shiftsWithBreak = 0,
  loading,
  className = ''
}) => {
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

  if (loading) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="flex items-center justify-center h-16">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${className}`}
      onClick={handleClick}
    >
      {/* Header with title */}
      <div className="flex items-center gap-2 mb-4">
        <Coffee size={20} style={{ color: colors.primary }} />
        <h3 className="text-lg font-semibold">Break Settings</h3>
      </div>

      {/* Horizontal stats row */}
      <div className="flex items-center justify-between gap-4">
        {/* Status */}
        <div className="flex-1 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Status</p>
          <p
            className="text-xl sm:text-2xl font-bold"
            style={{ color: smokoEnabled ? '#10B981' : '#9CA3AF' }}
          >
            {smokoEnabled ? 'ON' : 'OFF'}
          </p>
        </div>

        {/* Divider */}
        <div className="w-px h-12 bg-gray-200" />

        {/* Duration */}
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock size={12} className="text-gray-500" />
            <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
          </div>
          <p
            className="text-xl sm:text-2xl font-bold"
            style={{ color: smokoEnabled ? colors.primary : '#9CA3AF' }}
          >
            {smokoEnabled ? formatTime(smokoMinutes) : '-'}
          </p>
        </div>

        {/* Divider */}
        <div className="w-px h-12 bg-gray-200" />

        {/* Shifts with break this week */}
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Hash size={12} className="text-gray-500" />
            <p className="text-xs text-gray-500 uppercase tracking-wide">This Week</p>
          </div>
          <p
            className="text-xl sm:text-2xl font-bold"
            style={{ color: shiftsWithBreak > 0 ? colors.primary : '#9CA3AF' }}
          >
            {shiftsWithBreak}
          </p>
        </div>
      </div>

      {/* Tap to edit hint */}
      <p className="text-xs text-gray-400 text-center mt-3">Tap to configure</p>
    </Card>
  );
};

export default SmokoStatusCard;
