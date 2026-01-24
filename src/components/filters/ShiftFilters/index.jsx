// src/components/filters/ShiftFilters/index.jsx

import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Badge from '../../ui/Badge';
import WorkFilter from '../WorkFilter';
import WeekDayFilter from '../WeekDayFilter';
import ShiftTypeFilter from '../ShiftTypeFilter';
import Flex from '../../ui/Flex';

const ShiftFilters = ({ onFiltersChange, activeFilters = {} }) => {
  const colors = useThemeColors();
  const [showFilters, setShowFilters] = useState(false);
  
  // Check if there are active filters
  const hasActiveFilters = Object.values(activeFilters).some(filter => {
    if (Array.isArray(filter)) {
      return filter.length > 0;
    }
    return filter && filter !== 'all';
  });
  
  // Handle changes in filters
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...activeFilters, [filterType]: value };
    onFiltersChange(newFilters);
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    const clearedFilters = {
      work: 'all',
      weekDays: [],
      shiftType: 'all'
    };
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="mb-6">
      {/* Button to show/hide filters */}
      <Flex variant="between" className="mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors"
          style={{
            backgroundColor: showFilters ? colors.transparent10 : 'white',
            borderColor: showFilters ? colors.primary : '#E5E7EB',
            color: showFilters ? colors.primary : '#6B7280'
          }}
        >
          <Filter size={18} />
          <span className="font-medium">Filters</span>
          {hasActiveFilters && (
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.primary }}
            />
          )}
        </button>
        
        {/* Clear filters button */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={14} />
            <span>Clear</span>
          </button>
        )}
      </Flex>

      {/* Filters panel */}
      {showFilters && (
        <div 
          className="rounded-lg border p-4 space-y-4 transition-all"
          style={{ 
            backgroundColor: colors.transparent5,
            borderColor: colors.transparent20 
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filter by work */}
            <WorkFilter
              value={activeFilters.work || 'all'}
              onChange={(value) => handleFilterChange('work', value)}
            />
            
            {/* Filter by days of the week */}
            <WeekDayFilter
              value={activeFilters.weekDays || []}
              onChange={(value) => handleFilterChange('weekDays', value)}
            />
            
            {/* Filter by shift type */}
            <ShiftTypeFilter
              value={activeFilters.shiftType || 'all'}
              onChange={(value) => handleFilterChange('shiftType', value)}
            />
          </div>
          
          {/* Active filters summary */}
          {hasActiveFilters && (
            <div className="pt-3 border-t" style={{ borderColor: colors.transparent20 }}>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600">Active filters:</span>
                {activeFilters.work && activeFilters.work !== 'all' && (
                  <Badge variant="info" size="xs" rounded>
                    Specific work
                  </Badge>
                )}
                {activeFilters.weekDays && activeFilters.weekDays.length > 0 && (
                  <Badge variant="info" size="xs" rounded>
                    {activeFilters.weekDays.length} days
                  </Badge>
                )}
                {activeFilters.shiftType && activeFilters.shiftType !== 'all' && (
                  <Badge variant="info" size="xs" rounded>
                    Type: {activeFilters.shiftType}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShiftFilters;