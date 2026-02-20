// src/utils/shiftTypesConfig.js

import { Sun, Sunset, Moon, Calendar, Truck, Clock } from 'lucide-react';
import logger from './logger';

export const getShiftTypesConfig = (thematicColors) => ({
  day: {
    id: 'day',
    label: 'Day',
    icon: Sun,
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    description: 'Day shift'
  },
  afternoon: {
    id: 'afternoon',
    label: 'Afternoon',
    icon: Sunset,
    color: '#F97316',
    bgColor: '#FED7AA',
    description: 'Afternoon shift'
  },
  night: {
    id: 'night',
    label: 'Night',
    icon: Moon,
    color: thematicColors?.base || '#6366F1',
    bgColor: thematicColors?.transparent10 || '#E0E7FF',
    description: 'Night shift'
  },
  saturday: {
    id: 'saturday',
    label: 'Saturday',
    icon: Calendar,
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
    description: 'Saturday shift'
  },
  sunday: {
    id: 'sunday',
    label: 'Sunday',
    icon: Calendar,
    color: '#EF4444',
    bgColor: '#FEE2E2',
    description: 'Sunday shift'
  },
  delivery: {
    id: 'delivery',
    label: 'Delivery',
    icon: Truck,
    color: '#10B981',
    bgColor: '#D1FAE5',
    description: 'Delivery shift'
  },
  mixed: {
    id: 'mixed',
    label: 'Mixed',
    icon: Clock,
    color: '#6B7280',
    bgColor: '#F3F4F6',
    description: 'Mixed shift (multiple time types)'
  }
});

// Function to get available types based on existing shifts
export const getAvailableShiftTypes = (shiftsByDate, shiftRanges, thematicColors) => {
  const allShiftTypes = getShiftTypesConfig(thematicColors);
  const availableTypes = new Set(['all']); // Always include "all"
  
  if (!shiftsByDate) return [{ id: 'all', label: 'All types', icon: Clock, color: '#6B7280' }];
  
  // Dynamically import function to avoid circular dependencies
  try {
    const { determineShiftType } = require('./shiftDetailsUtils');
    
    // Analyze all shifts to see which types are present
    Object.values(shiftsByDate).flat().forEach(shift => {
      const shiftType = determineShiftType(shift, shiftRanges);
      availableTypes.add(shiftType);
    });
  } catch (error) {
    // If cannot import, return basic types
    logger.warn('Could not determine shift types dynamically:', error);
    return [
      { id: 'all', label: 'All types', icon: Clock, color: '#6B7280' },
      ...Object.values(allShiftTypes)
    ];
  }
  
  // Return only the types that are available
  const result = [
    { id: 'all', label: 'All types', icon: Clock, color: '#6B7280' }
  ];
  
  availableTypes.forEach(type => {
    if (type !== 'all' && allShiftTypes[type]) {
      result.push(allShiftTypes[type]);
    }
  });
  
  return result;
};