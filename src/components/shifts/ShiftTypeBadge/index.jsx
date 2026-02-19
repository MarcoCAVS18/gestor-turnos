// src/components/shifts/ShiftTypeBadge/index.jsx 

import React from 'react';
import { useApp } from '../../../contexts/AppContext';
import { TURN_TYPE_COLORS } from '../../../constants/colors';
import { determineShiftType } from '../../../utils/shiftDetailsUtils';

const ShiftTypeBadge = ({ shiftType, shift, size = 'sm' }) => {
  const { shiftRanges } = useApp();
  
  // Determine the type if the full shift is passed
  const type = shiftType || determineShiftType(shift, shiftRanges);
  
  // Direct mapping to color constants
  const getColorAndConfig = (shiftType) => {
    const labels = {
      day: 'Day',
      afternoon: 'Afternoon',
      night: 'Night',
      saturday: 'Saturday',
      sunday: 'Sunday',
      holiday: 'Holiday',
      delivery: 'Delivery',
      mixed: 'Mixed',
    };

    const specialColors = {
      holiday: '#DC2626',
      delivery: '#e8a7f8ff',
    };
    const specialBg = {
      delivery: '#6329a5b1',
    };

    const color = specialColors[shiftType] || TURN_TYPE_COLORS[shiftType] || '#6B7280';
    const bgColor = specialBg[shiftType] || color + '20';
    const label = labels[shiftType] || 'Mixed';

    return { color, bgColor, label };
  };
  
  const typeConfig = getColorAndConfig(type);
  
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <div 
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} flex-shrink-0`}
      style={{ 
        backgroundColor: typeConfig.bgColor,
        color: typeConfig.color
      }}
      title={`Shift ${typeConfig.label}`}
    >
      <span className="truncate">{typeConfig.label}</span>
      
      {/* Special indicator for night shifts */}
      {shift?.crossesMidnight && type === 'night' && (
        <span className="ml-1 text-xs opacity-75">🌙</span>
      )}
      
      {/* Special indicator for mixed shifts */}
      {type === 'mixed' && (
        <span className="ml-1 text-xs opacity-75">~</span>
      )}
    </div>
  );
};

export default ShiftTypeBadge;