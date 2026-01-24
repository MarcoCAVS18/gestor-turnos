// src/components/filters/FiltersSummary/index.jsx

import React from 'react';
import ***REMOVED*** X ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import Flex from '../../ui/Flex';

const FiltersSummary = (***REMOVED*** filters, onRemoveFilter, onClearAll, statistics ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** works, deliveryWork ***REMOVED*** = useApp();
  const colors = useThemeColors();
  
  // Combine works to get names
  const allWorks = [...works, ...deliveryWork];
  
  // Check if there are active filters
  const hasActiveFilters = filters.work !== 'all' || 
                          filters.weekDays.length > 0 || 
                          filters.shiftType !== 'all';
  
  if (!hasActiveFilters) return null;

  // Get work name
  const getWorkName = (id) => ***REMOVED***
    const work = allWorks.find(t => t.id === id);
    return work?.name || 'Unknown work';
  ***REMOVED***;

  // Map days of the week
  const weekDayLabels = ***REMOVED***
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  ***REMOVED***;

  // Map shift types
  const shiftTypeLabels = ***REMOVED***
    day: 'Day',
    afternoon: 'Afternoon',
    night: 'Night',
    saturday: 'Saturday',
    sunday: 'Sunday',
    delivery: 'Delivery'
  ***REMOVED***;

  return (
    <div 
      className="p-4 rounded-lg border-l-4 space-y-3"
      style=***REMOVED******REMOVED*** 
        backgroundColor: colors.transparent5,
        borderLeftColor: colors.primary 
      ***REMOVED******REMOVED***
    >
      ***REMOVED***/* Statistics */***REMOVED***
      <Flex variant="between" className="text-sm">
        <span style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="font-medium">
          Active filters: ***REMOVED***statistics?.filteredShifts || 0***REMOVED*** of ***REMOVED***statistics?.totalShifts || 0***REMOVED*** shifts
        </span>
        <button
          onClick=***REMOVED***onClearAll***REMOVED***
          className="flex items-center space-x-1 px-2 py-1 text-xs rounded-md hover:bg-gray-100 transition-colors"
          style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
        >
          <X size=***REMOVED***12***REMOVED*** />
          <span>Clear all</span>
        </button>
      </Flex>

      ***REMOVED***/* Active filter tags */***REMOVED***
      <div className="flex flex-wrap gap-2">
        ***REMOVED***filters.work !== 'all' && (
          <div 
            className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm"
            style=***REMOVED******REMOVED*** 
              backgroundColor: colors.transparent20,
              color: colors.primary 
            ***REMOVED******REMOVED***
          >
            <span>Work: ***REMOVED***getWorkName(filters.work)***REMOVED***</span>
            <button 
              onClick=***REMOVED***() => onRemoveFilter('work')***REMOVED***
              className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
            >
              <X size=***REMOVED***14***REMOVED*** />
            </button>
          </div>
        )***REMOVED***
        
        ***REMOVED***filters.weekDays.length > 0 && (
          <div 
            className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm"
            style=***REMOVED******REMOVED*** 
              backgroundColor: colors.transparent20,
              color: colors.primary 
            ***REMOVED******REMOVED***
          >
            <span>
              Days: ***REMOVED***filters.weekDays.length === 7 
                ? 'All' 
                : filters.weekDays.map(day => weekDayLabels[day]).join(', ')
              ***REMOVED***
            </span>
            <button 
              onClick=***REMOVED***() => onRemoveFilter('weekDays')***REMOVED***
              className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
            >
              <X size=***REMOVED***14***REMOVED*** />
            </button>
          </div>
        )***REMOVED***
        
        ***REMOVED***filters.shiftType !== 'all' && (
          <Flex variant="center" 
            className="space-x-2 px-3 py-1 rounded-full text-sm"
            style=***REMOVED******REMOVED*** 
              backgroundColor: colors.transparent20,
              color: colors.primary 
            ***REMOVED******REMOVED***
          >
            <span>Type: ***REMOVED***shiftTypeLabels[filters.shiftType] || filters.shiftType***REMOVED***</span>
            <button 
              onClick=***REMOVED***() => onRemoveFilter('shiftType')***REMOVED***
              className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
            >
              <X size=***REMOVED***14***REMOVED*** />
            </button>
          </Flex>
        )***REMOVED***
      </div>
    </div>
  );
***REMOVED***;

export default FiltersSummary;