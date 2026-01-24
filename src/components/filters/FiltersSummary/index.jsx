// src/components/filters/FiltersSummary/index.jsx

import React from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Flex from '../../ui/Flex';

const FiltersSummary = ({ filters, onRemoveFilter, onClearAll, statistics }) => {
  const { works, deliveryWork } = useApp();
  const colors = useThemeColors();
  
  // Combine works to get names
  const allWorks = [...works, ...deliveryWork];
  
  // Check if there are active filters
  const hasActiveFilters = filters.work !== 'all' || 
                          filters.weekDays.length > 0 || 
                          filters.shiftType !== 'all';
  
  if (!hasActiveFilters) return null;

  // Get work name
  const getWorkName = (id) => {
    const work = allWorks.find(t => t.id === id);
    return work?.name || 'Unknown work';
  };

  // Map days of the week
  const weekDayLabels = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  // Map shift types
  const shiftTypeLabels = {
    day: 'Day',
    afternoon: 'Afternoon',
    night: 'Night',
    saturday: 'Saturday',
    sunday: 'Sunday',
    delivery: 'Delivery'
  };

  return (
    <div 
      className="p-4 rounded-lg border-l-4 space-y-3"
      style={{ 
        backgroundColor: colors.transparent5,
        borderLeftColor: colors.primary 
      }}
    >
      {/* Statistics */}
      <Flex variant="between" className="text-sm">
        <span style={{ color: colors.primary }} className="font-medium">
          Active filters: {statistics?.filteredShifts || 0} of {statistics?.totalShifts || 0} shifts
        </span>
        <button
          onClick={onClearAll}
          className="flex items-center space-x-1 px-2 py-1 text-xs rounded-md hover:bg-gray-100 transition-colors"
          style={{ color: colors.primary }}
        >
          <X size={12} />
          <span>Clear all</span>
        </button>
      </Flex>

      {/* Active filter tags */}
      <div className="flex flex-wrap gap-2">
        {filters.work !== 'all' && (
          <div 
            className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm"
            style={{ 
              backgroundColor: colors.transparent20,
              color: colors.primary 
            }}
          >
            <span>Work: {getWorkName(filters.work)}</span>
            <button 
              onClick={() => onRemoveFilter('work')}
              className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
            >
              <X size={14} />
            </button>
          </div>
        )}
        
        {filters.weekDays.length > 0 && (
          <div 
            className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm"
            style={{ 
              backgroundColor: colors.transparent20,
              color: colors.primary 
            }}
          >
            <span>
              Days: {filters.weekDays.length === 7 
                ? 'All' 
                : filters.weekDays.map(day => weekDayLabels[day]).join(', ')
              }
            </span>
            <button 
              onClick={() => onRemoveFilter('weekDays')}
              className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
            >
              <X size={14} />
            </button>
          </div>
        )}
        
        {filters.shiftType !== 'all' && (
          <Flex variant="center" 
            className="space-x-2 px-3 py-1 rounded-full text-sm"
            style={{ 
              backgroundColor: colors.transparent20,
              color: colors.primary 
            }}
          >
            <span>Type: {shiftTypeLabels[filters.shiftType] || filters.shiftType}</span>
            <button 
              onClick={() => onRemoveFilter('shiftType')}
              className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
            >
              <X size={14} />
            </button>
          </Flex>
        )}
      </div>
    </div>
  );
};

export default FiltersSummary;