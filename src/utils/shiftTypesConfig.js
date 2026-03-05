// src/utils/shiftTypesConfig.js

import { Sun, Sunset, Moon, Calendar, Truck, Clock, Layers } from 'lucide-react';
import logger from './logger';

// Default English labels (fallback)
const defaultLabels = {
  day: 'Day',
  afternoon: 'Afternoon',
  night: 'Night',
  saturday: 'Saturday',
  sunday: 'Sunday',
  delivery: 'Delivery',
  mixed: 'Mixed',
  all: 'All types'
};

export const getShiftTypesConfig = (thematicColors, t) => {
  // Helper to get translated label
  const getLabel = (key) => {
    if (t) {
      return t(`filters.shiftTypes.${key}`, defaultLabels[key] || key);
    }
    return defaultLabels[key] || key;
  };

  return {
    day: {
      id: 'day',
      label: getLabel('day'),
      icon: Sun,
      color: '#F59E0B',
      bgColor: '#FEF3C7',
      description: 'Day shift'
    },
    afternoon: {
      id: 'afternoon',
      label: getLabel('afternoon'),
      icon: Sunset,
      color: '#F97316',
      bgColor: '#FED7AA',
      description: 'Afternoon shift'
    },
    night: {
      id: 'night',
      label: getLabel('night'),
      icon: Moon,
      color: thematicColors?.base || '#6366F1',
      bgColor: thematicColors?.transparent10 || '#E0E7FF',
      description: 'Night shift'
    },
    saturday: {
      id: 'saturday',
      label: getLabel('saturday'),
      icon: Calendar,
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
      description: 'Saturday shift'
    },
    sunday: {
      id: 'sunday',
      label: getLabel('sunday'),
      icon: Calendar,
      color: '#EF4444',
      bgColor: '#FEE2E2',
      description: 'Sunday shift'
    },
    delivery: {
      id: 'delivery',
      label: getLabel('delivery'),
      icon: Truck,
      color: '#10B981',
      bgColor: '#D1FAE5',
      description: 'Delivery shift'
    },
    mixed: {
      id: 'mixed',
      label: getLabel('mixed'),
      icon: Layers,
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
      description: 'Mixed shift (multiple time types)'
    }
  };
};

// Function to get available types based on existing shifts
export const getAvailableShiftTypes = (shiftsByDate, shiftRanges, thematicColors, t) => {
  const allShiftTypes = getShiftTypesConfig(thematicColors, t);
  const availableTypes = new Set(['all']); // Always include "all"
  
  const allTypesLabel = t ? t('filters.shiftTypes.all', 'All types') : 'All types';
  
  if (!shiftsByDate) return [{ id: 'all', label: allTypesLabel, icon: Clock, color: '#6B7280' }];
  
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
      { id: 'all', label: allTypesLabel, icon: Clock, color: '#6B7280' },
      ...Object.values(allShiftTypes)
    ];
  }
  
  // Return only the types that are available
  const result = [
    { id: 'all', label: allTypesLabel, icon: Clock, color: '#6B7280' }
  ];
  
  availableTypes.forEach(type => {
    if (type !== 'all' && allShiftTypes[type]) {
      result.push(allShiftTypes[type]);
    }
  });
  
  return result;
};