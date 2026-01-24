// src/components/shifts/ShiftTypeBadge/index.jsx 

import React from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** TURN_TYPE_COLORS ***REMOVED*** from '../../../constants/colors';
import ***REMOVED*** determineShiftType ***REMOVED*** from '../../../utils/shiftDetailsUtils';

const ShiftTypeBadge = (***REMOVED*** shiftType, shift, size = 'sm' ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** shiftRanges ***REMOVED*** = useApp();
  
  // Determine the type if the full shift is passed
  const type = shiftType || determineShiftType(shift, shiftRanges);
  
  // Direct mapping to color constants
  const getColorAndConfig = (shiftType) => ***REMOVED***
    const configs = ***REMOVED***
      day: ***REMOVED***
        color: TURN_TYPE_COLORS.Day,
        label: 'Day',
        bgColor: TURN_TYPE_COLORS.Day + '20'
      ***REMOVED***,
      afternoon: ***REMOVED***
        color: TURN_TYPE_COLORS.Afternoon,
        label: 'Afternoon', 
        bgColor: TURN_TYPE_COLORS.Afternoon + '20'
      ***REMOVED***,
      night: ***REMOVED***
        color: TURN_TYPE_COLORS.Night,
        label: 'Night',
        bgColor: TURN_TYPE_COLORS.Night + '20'
      ***REMOVED***,
      saturday: ***REMOVED***
        color: TURN_TYPE_COLORS.Saturday,
        label: 'Saturday',
        bgColor: TURN_TYPE_COLORS.Saturday + '20'
      ***REMOVED***,
      sunday: ***REMOVED***
        color: TURN_TYPE_COLORS.Sunday,
        label: 'Sunday',
        bgColor: TURN_TYPE_COLORS.Sunday + '20'
      ***REMOVED***,
      delivery: ***REMOVED***
        color: '#e8a7f8ff',
        label: 'Delivery',
        bgColor: '#6329a5b1'
      ***REMOVED***,
      mixed: ***REMOVED***
        color: '#6B7280',
        label: 'Mixed',
        bgColor: '#6B728020'
      ***REMOVED***
    ***REMOVED***;
    
    return configs[shiftType] || configs.mixed;
  ***REMOVED***;
  
  const typeConfig = getColorAndConfig(type);
  
  const sizeClasses = ***REMOVED***
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  ***REMOVED***;

  return (
    <div 
      className=***REMOVED***`inline-flex items-center rounded-full font-medium $***REMOVED***sizeClasses[size]***REMOVED*** flex-shrink-0`***REMOVED***
      style=***REMOVED******REMOVED*** 
        backgroundColor: typeConfig.bgColor,
        color: typeConfig.color
      ***REMOVED******REMOVED***
      title=***REMOVED***`Shift $***REMOVED***typeConfig.label***REMOVED***`***REMOVED***
    >
      <span className="truncate">***REMOVED***typeConfig.label***REMOVED***</span>
      
      ***REMOVED***/* Special indicator for night shifts */***REMOVED***
      ***REMOVED***shift?.crossesMidnight && type === 'night' && (
        <span className="ml-1 text-xs opacity-75">🌙</span>
      )***REMOVED***
      
      ***REMOVED***/* Special indicator for mixed shifts */***REMOVED***
      ***REMOVED***type === 'mixed' && (
        <span className="ml-1 text-xs opacity-75">~</span>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default ShiftTypeBadge;