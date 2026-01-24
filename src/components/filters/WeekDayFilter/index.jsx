// src/components/filters/WeekDayFilter/index.jsx

import React from 'react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import Flex from '../../ui/Flex';

const WeekDayFilter = (***REMOVED*** value, onChange ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  
  const weekDays = [
    ***REMOVED*** id: 'monday', label: 'M', name: 'Monday' ***REMOVED***,
    ***REMOVED*** id: 'tuesday', label: 'T', name: 'Tuesday' ***REMOVED***,
    ***REMOVED*** id: 'wednesday', label: 'W', name: 'Wednesday' ***REMOVED***,
    ***REMOVED*** id: 'thursday', label: 'T', name: 'Thursday' ***REMOVED***,
    ***REMOVED*** id: 'friday', label: 'F', name: 'Friday' ***REMOVED***,
    ***REMOVED*** id: 'saturday', label: 'S', name: 'Saturday' ***REMOVED***,
    ***REMOVED*** id: 'sunday', label: 'S', name: 'Sunday' ***REMOVED***
  ];

  const handleDayToggle = (dayId) => ***REMOVED***
    const newValue = value.includes(dayId)
      ? value.filter(d => d !== dayId)
      : [...value, dayId];
    onChange(newValue);
  ***REMOVED***;

  const selectAll = () => ***REMOVED***
    onChange(weekDays.map(d => d.id));
  ***REMOVED***;

  const clearAll = () => ***REMOVED***
    onChange([]);
  ***REMOVED***;

  return (
    <div>
      <Flex variant="between" className="mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Days of the week
        </label>
        <div className="flex space-x-1">
          ***REMOVED***value.length < weekDays.length && (
            <button
              onClick=***REMOVED***selectAll***REMOVED***
              className="text-xs px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
              style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
            >
              All
            </button>
          )***REMOVED***
          ***REMOVED***value.length > 0 && (
            <button
              onClick=***REMOVED***clearAll***REMOVED***
              className="text-xs text-gray-500 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              None
            </button>
          )***REMOVED***
        </div>
      </Flex>
      
      <div className="grid grid-cols-7 gap-1">
        ***REMOVED***weekDays.map(day => ***REMOVED***
          const isSelected = value.includes(day.id);
          return (
            <button
              key=***REMOVED***day.id***REMOVED***
              onClick=***REMOVED***() => handleDayToggle(day.id)***REMOVED***
              className="w-8 h-8 rounded-lg text-xs font-medium transition-all hover:scale-105 flex items-center justify-center"
              style=***REMOVED******REMOVED***
                backgroundColor: isSelected 
                  ? colors.primary 
                  : 'transparent',
                color: isSelected 
                  ? 'white' 
                  : colors.primary,
                border: `1px solid $***REMOVED***isSelected 
                  ? colors.primary 
                  : colors.transparent30***REMOVED***`,
                boxShadow: isSelected 
                  ? `0 2px 4px $***REMOVED***colors.transparent30***REMOVED***` 
                  : 'none'
              ***REMOVED******REMOVED***
              title=***REMOVED***day.name***REMOVED***
            >
              ***REMOVED***day.label***REMOVED***
            </button>
          );
        ***REMOVED***)***REMOVED***
      </div>
      
      ***REMOVED***/* Show selected days */***REMOVED***
      ***REMOVED***value.length > 0 && (
        <div className="mt-2 text-xs text-gray-600">
          Selected: ***REMOVED***value.length***REMOVED***/***REMOVED***weekDays.length***REMOVED***
        </div>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default WeekDayFilter;