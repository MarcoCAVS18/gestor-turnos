// src/components/shifts/ShiftTypeBadge/index.jsx 

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../../contexts/AppContext';
import { TURN_TYPE_COLORS } from '../../../constants/colors';
import { determineShiftType } from '../../../utils/shiftDetailsUtils';

const ShiftTypeBadge = ({ shiftType, shift, size = 'sm' }) => {
  const { t } = useTranslation();
  const { shiftRanges } = useApp();
  
  // Determine the type if the full shift is passed
  const type = shiftType || determineShiftType(shift, shiftRanges);
  
  // Direct mapping to color constants
  const getColorAndConfig = (shiftType) => {
    // Use centralized filter shift type translations
    const labels = {
      day: t('filters.shiftTypes.day'),
      afternoon: t('filters.shiftTypes.afternoon'),
      night: t('filters.shiftTypes.night'),
      saturday: t('filters.shiftTypes.saturday'),
      sunday: t('filters.shiftTypes.sunday'),
      holiday: t('forms.work.rates.holiday'),
      delivery: t('filters.shiftTypes.delivery'),
      mixed: t('filters.shiftTypes.mixed'),
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
    const label = labels[shiftType] || labels.mixed;

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
      title={`${t('forms.shift.shift')} ${typeConfig.label}`}
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
