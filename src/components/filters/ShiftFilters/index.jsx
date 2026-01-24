// src/components/filters/ShiftFilters/index.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** Filter, X ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import Badge from '../../ui/Badge';
import WorkFilter from '../WorkFilter';
import WeekDayFilter from '../WeekDayFilter';
import ShiftTypeFilter from '../ShiftTypeFilter';
import Flex from '../../ui/Flex';

const ShiftFilters = (***REMOVED*** onFiltersChange, activeFilters = ***REMOVED******REMOVED*** ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const [showFilters, setShowFilters] = useState(false);
  
  // Check if there are active filters
  const hasActiveFilters = Object.values(activeFilters).some(filter => ***REMOVED***
    if (Array.isArray(filter)) ***REMOVED***
      return filter.length > 0;
    ***REMOVED***
    return filter && filter !== 'all';
  ***REMOVED***);
  
  // Handle changes in filters
  const handleFilterChange = (filterType, value) => ***REMOVED***
    const newFilters = ***REMOVED*** ...activeFilters, [filterType]: value ***REMOVED***;
    onFiltersChange(newFilters);
  ***REMOVED***;
  
  // Clear all filters
  const clearAllFilters = () => ***REMOVED***
    const clearedFilters = ***REMOVED***
      work: 'all',
      weekDays: [],
      shiftType: 'all'
    ***REMOVED***;
    onFiltersChange(clearedFilters);
  ***REMOVED***;

  return (
    <div className="mb-6">
      ***REMOVED***/* Button to show/hide filters */***REMOVED***
      <Flex variant="between" className="mb-4">
        <button
          onClick=***REMOVED***() => setShowFilters(!showFilters)***REMOVED***
          className="flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors"
          style=***REMOVED******REMOVED***
            backgroundColor: showFilters ? colors.transparent10 : 'white',
            borderColor: showFilters ? colors.primary : '#E5E7EB',
            color: showFilters ? colors.primary : '#6B7280'
          ***REMOVED******REMOVED***
        >
          <Filter size=***REMOVED***18***REMOVED*** />
          <span className="font-medium">Filters</span>
          ***REMOVED***hasActiveFilters && (
            <div 
              className="w-2 h-2 rounded-full"
              style=***REMOVED******REMOVED*** backgroundColor: colors.primary ***REMOVED******REMOVED***
            />
          )***REMOVED***
        </button>
        
        ***REMOVED***/* Clear filters button */***REMOVED***
        ***REMOVED***hasActiveFilters && (
          <button
            onClick=***REMOVED***clearAllFilters***REMOVED***
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size=***REMOVED***14***REMOVED*** />
            <span>Clear</span>
          </button>
        )***REMOVED***
      </Flex>

      ***REMOVED***/* Filters panel */***REMOVED***
      ***REMOVED***showFilters && (
        <div 
          className="rounded-lg border p-4 space-y-4 transition-all"
          style=***REMOVED******REMOVED*** 
            backgroundColor: colors.transparent5,
            borderColor: colors.transparent20 
          ***REMOVED******REMOVED***
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            ***REMOVED***/* Filter by work */***REMOVED***
            <WorkFilter
              value=***REMOVED***activeFilters.work || 'all'***REMOVED***
              onChange=***REMOVED***(value) => handleFilterChange('work', value)***REMOVED***
            />
            
            ***REMOVED***/* Filter by days of the week */***REMOVED***
            <WeekDayFilter
              value=***REMOVED***activeFilters.weekDays || []***REMOVED***
              onChange=***REMOVED***(value) => handleFilterChange('weekDays', value)***REMOVED***
            />
            
            ***REMOVED***/* Filter by shift type */***REMOVED***
            <ShiftTypeFilter
              value=***REMOVED***activeFilters.shiftType || 'all'***REMOVED***
              onChange=***REMOVED***(value) => handleFilterChange('shiftType', value)***REMOVED***
            />
          </div>
          
          ***REMOVED***/* Active filters summary */***REMOVED***
          ***REMOVED***hasActiveFilters && (
            <div className="pt-3 border-t" style=***REMOVED******REMOVED*** borderColor: colors.transparent20 ***REMOVED******REMOVED***>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600">Active filters:</span>
                ***REMOVED***activeFilters.work && activeFilters.work !== 'all' && (
                  <Badge variant="info" size="xs" rounded>
                    Specific work
                  </Badge>
                )***REMOVED***
                ***REMOVED***activeFilters.weekDays && activeFilters.weekDays.length > 0 && (
                  <Badge variant="info" size="xs" rounded>
                    ***REMOVED***activeFilters.weekDays.length***REMOVED*** days
                  </Badge>
                )***REMOVED***
                ***REMOVED***activeFilters.shiftType && activeFilters.shiftType !== 'all' && (
                  <Badge variant="info" size="xs" rounded>
                    Type: ***REMOVED***activeFilters.shiftType***REMOVED***
                  </Badge>
                )***REMOVED***
              </div>
            </div>
          )***REMOVED***
        </div>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default ShiftFilters;