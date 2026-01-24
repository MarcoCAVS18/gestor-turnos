// src/components/filters/ShiftTypeFilter/index.jsx 

import React from 'react';
import ***REMOVED*** Clock ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** getAvailableShiftTypes ***REMOVED*** from '../../../utils/shiftTypesConfig';

const ShiftTypeFilter = (***REMOVED*** value, onChange ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** shiftsByDate, shiftRanges ***REMOVED*** = useApp();
  const colors = useThemeColors();
  
  // Get available shift types dynamically
  const shiftTypes = getAvailableShiftTypes(shiftsByDate, shiftRanges, ***REMOVED*** base: colors.primary ***REMOVED***);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Clock size=***REMOVED***16***REMOVED*** className="inline mr-2" />
        Shift type
      </label>
      
      <div className="space-y-2">
        ***REMOVED***shiftTypes.map(type => ***REMOVED***
          const Icon = type.icon;
          const isSelected = value === type.id;
          
          return (
            <button
              key=***REMOVED***type.id***REMOVED***
              onClick=***REMOVED***() => onChange(type.id)***REMOVED***
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:scale-[1.02] hover:shadow-sm"
              style=***REMOVED******REMOVED***
                backgroundColor: isSelected 
                  ? `$***REMOVED***type.color***REMOVED***15`
                  : 'transparent',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: isSelected 
                  ? type.color 
                  : '#E5E7EB',
                color: isSelected 
                  ? type.color 
                  : '#6B7280'
              ***REMOVED******REMOVED***
            >
              <Icon size=***REMOVED***16***REMOVED*** style=***REMOVED******REMOVED*** color: type.color ***REMOVED******REMOVED*** />
              <span className="flex-1 text-left">***REMOVED***type.label***REMOVED***</span>
              
              ***REMOVED***/* Selection indicator */***REMOVED***
              ***REMOVED***isSelected && (
                <div 
                  className="w-2 h-2 rounded-full"
                  style=***REMOVED******REMOVED*** backgroundColor: type.color ***REMOVED******REMOVED***
                />
              )***REMOVED***
            </button>
          );
        ***REMOVED***)***REMOVED***
      </div>
      
      ***REMOVED***/* Show selected type */***REMOVED***
      ***REMOVED***value !== 'all' && (
        <div className="mt-2 text-xs text-gray-600">
          <Clock size=***REMOVED***12***REMOVED*** className="inline mr-1" />
          Filtered by: ***REMOVED***shiftTypes.find(t => t.id === value)?.label***REMOVED***
        </div>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default ShiftTypeFilter;