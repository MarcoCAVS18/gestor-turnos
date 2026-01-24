// src/components/filters/ShiftTypeFilter/index.jsx 

import React from 'react';
import { Clock } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { getAvailableShiftTypes } from '../../../utils/shiftTypesConfig';

const ShiftTypeFilter = ({ value, onChange }) => {
  const { shiftsByDate, shiftRanges } = useApp();
  const colors = useThemeColors();
  
  // Get available shift types dynamically
  const shiftTypes = getAvailableShiftTypes(shiftsByDate, shiftRanges, { base: colors.primary });

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Clock size={16} className="inline mr-2" />
        Shift type
      </label>
      
      <div className="space-y-2">
        {shiftTypes.map(type => {
          const Icon = type.icon;
          const isSelected = value === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => onChange(type.id)}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:scale-[1.02] hover:shadow-sm"
              style={{
                backgroundColor: isSelected 
                  ? `${type.color}15`
                  : 'transparent',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: isSelected 
                  ? type.color 
                  : '#E5E7EB',
                color: isSelected 
                  ? type.color 
                  : '#6B7280'
              }}
            >
              <Icon size={16} style={{ color: type.color }} />
              <span className="flex-1 text-left">{type.label}</span>
              
              {/* Selection indicator */}
              {isSelected && (
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: type.color }}
                />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Show selected type */}
      {value !== 'all' && (
        <div className="mt-2 text-xs text-gray-600">
          <Clock size={12} className="inline mr-1" />
          Filtered by: {shiftTypes.find(t => t.id === value)?.label}
        </div>
      )}
    </div>
  );
};

export default ShiftTypeFilter;