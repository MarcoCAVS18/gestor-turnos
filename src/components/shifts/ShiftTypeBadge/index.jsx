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
    const configs = {
      day: {
        color: TURN_TYPE_COLORS.Day,
        label: 'Day',
        bgColor: TURN_TYPE_COLORS.Day + '20'
      },
      afternoon: {
        color: TURN_TYPE_COLORS.Afternoon,
        label: 'Afternoon', 
        bgColor: TURN_TYPE_COLORS.Afternoon + '20'
      },
      night: {
        color: TURN_TYPE_COLORS.Night,
        label: 'Night',
        bgColor: TURN_TYPE_COLORS.Night + '20'
      },
      saturday: {
        color: TURN_TYPE_COLORS.Saturday,
        label: 'Saturday',
        bgColor: TURN_TYPE_COLORS.Saturday + '20'
      },
      sunday: {
        color: TURN_TYPE_COLORS.Sunday,
        label: 'Sunday',
        bgColor: TURN_TYPE_COLORS.Sunday + '20'
      },
      delivery: {
        color: '#e8a7f8ff',
        label: 'Delivery',
        bgColor: '#6329a5b1'
      },
      mixed: {
        color: '#6B7280',
        label: 'Mixed',
        bgColor: '#6B728020'
      }
    };
    
    return configs[shiftType] || configs.mixed;
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