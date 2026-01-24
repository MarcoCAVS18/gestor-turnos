// src/utils/shiftTypesConfig.js

import ***REMOVED*** Sun, Sunset, Moon, Calendar, Truck, Clock ***REMOVED*** from 'lucide-react';

export const getShiftTypesConfig = (thematicColors) => (***REMOVED***
  day: ***REMOVED***
    id: 'day',
    label: 'Day',
    icon: Sun,
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    description: 'Day shift'
  ***REMOVED***,
  afternoon: ***REMOVED***
    id: 'afternoon',
    label: 'Afternoon',
    icon: Sunset,
    color: '#F97316',
    bgColor: '#FED7AA',
    description: 'Afternoon shift'
  ***REMOVED***,
  night: ***REMOVED***
    id: 'night',
    label: 'Night',
    icon: Moon,
    color: thematicColors?.base || '#6366F1',
    bgColor: thematicColors?.transparent10 || '#E0E7FF',
    description: 'Night shift'
  ***REMOVED***,
  saturday: ***REMOVED***
    id: 'saturday',
    label: 'Saturday',
    icon: Calendar,
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
    description: 'Saturday shift'
  ***REMOVED***,
  sunday: ***REMOVED***
    id: 'sunday',
    label: 'Sunday',
    icon: Calendar,
    color: '#EF4444',
    bgColor: '#FEE2E2',
    description: 'Sunday shift'
  ***REMOVED***,
  delivery: ***REMOVED***
    id: 'delivery',
    label: 'Delivery',
    icon: Truck,
    color: '#10B981',
    bgColor: '#D1FAE5',
    description: 'Delivery shift'
  ***REMOVED***,
  mixed: ***REMOVED***
    id: 'mixed',
    label: 'Mixed',
    icon: Clock,
    color: '#6B7280',
    bgColor: '#F3F4F6',
    description: 'Mixed shift (multiple time types)'
  ***REMOVED***
***REMOVED***);

// Function to get available types based on existing shifts
export const getAvailableShiftTypes = (shiftsByDate, shiftRanges, thematicColors) => ***REMOVED***
  const allShiftTypes = getShiftTypesConfig(thematicColors);
  const availableTypes = new Set(['all']); // Always include "all"
  
  if (!shiftsByDate) return [***REMOVED*** id: 'all', label: 'All types', icon: Clock, color: '#6B7280' ***REMOVED***];
  
  // Dynamically import function to avoid circular dependencies
  try ***REMOVED***
    const ***REMOVED*** determineShiftType ***REMOVED*** = require('./shiftDetailsUtils');
    
    // Analyze all shifts to see which types are present
    Object.values(shiftsByDate).flat().forEach(shift => ***REMOVED***
      const shiftType = determineShiftType(shift, shiftRanges);
      availableTypes.add(shiftType);
    ***REMOVED***);
  ***REMOVED*** catch (error) ***REMOVED***
    // If cannot import, return basic types
    console.warn('Could not determine shift types dynamically:', error);
    return [
      ***REMOVED*** id: 'all', label: 'All types', icon: Clock, color: '#6B7280' ***REMOVED***,
      ...Object.values(allShiftTypes)
    ];
  ***REMOVED***
  
  // Return only the types that are available
  const result = [
    ***REMOVED*** id: 'all', label: 'All types', icon: Clock, color: '#6B7280' ***REMOVED***
  ];
  
  availableTypes.forEach(type => ***REMOVED***
    if (type !== 'all' && allShiftTypes[type]) ***REMOVED***
      result.push(allShiftTypes[type]);
    ***REMOVED***
  ***REMOVED***);
  
  return result;
***REMOVED***;