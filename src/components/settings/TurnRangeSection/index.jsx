// src/components/settings/TurnRangeSection/index.jsx

import React, { useState, useEffect } from 'react';
import { Clock, Sun, Sunset, Moon, Check } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';

const TimeSelect = ({ label, value, onChange, icon: Icon, iconColor, colors }) => {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1 flex items-center">
        {Icon && <Icon className="h-4 w-4 mr-1" style={{ color: iconColor }} />}
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 transition-colors"
        style={{ 
          '--tw-ring-color': colors.primary
        }}
      >
        {Array.from({length: 24}, (_, i) => (
          <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
        ))}
      </select>
    </div>
  );
};

const TurnRange = ({ title, icon: Icon, iconColor, children, colors }) => {
  return (
    <div 
      className="border rounded-lg p-4"
      style={{ borderColor: colors.transparent20 }}
    >
      <div className="flex items-center mb-3">
        <Icon className="h-5 w-5 mr-2" style={{ color: iconColor }} />
        <h3 className="font-medium">{title}</h3>
      </div>
      {children}
    </div>
  );
};

const ShiftRangeSection = ({ onError, onSuccess, className }) => {
  const { 
    shiftRanges,
    savePreferences
  } = useApp();
  
  const colors = useThemeColors();
  const [shiftRangesState, setShiftRangesState] = useState(shiftRanges || {
    dayStart: 6,
    dayEnd: 14,
    afternoonStart: 14,
    afternoonEnd: 20,
    nightStart: 20
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (shiftRanges) {
      setShiftRangesState(shiftRanges);
    }
  }, [shiftRanges]);

  // Detect changes to enable/disable the button
  useEffect(() => {
    if (!shiftRanges) return;
    
    const hasChanged = 
      shiftRangesState.dayStart !== shiftRanges.dayStart ||
      shiftRangesState.dayEnd !== shiftRanges.dayEnd ||
      shiftRangesState.afternoonStart !== shiftRanges.afternoonStart ||
      shiftRangesState.afternoonEnd !== shiftRanges.afternoonEnd ||
      shiftRangesState.nightStart !== shiftRanges.nightStart;
    
    setHasChanges(hasChanged);
    
    // Hide success icon if there are new changes
    if (hasChanged && showSuccess) {
      setShowSuccess(false);
    }
  }, [shiftRangesState, shiftRanges, showSuccess]);

  const validateRanges = (ranges) => {
    if (ranges.dayStart >= ranges.dayEnd) {
      return 'The day shift start time must be earlier than the end time';
    }
    if (ranges.afternoonStart >= ranges.afternoonEnd) {
      return 'The afternoon shift start time must be earlier than the end time';
    }
    if (ranges.dayEnd > ranges.afternoonStart) {
      return 'The afternoon shift must start after or at the same time the day shift ends';
    }
    if (ranges.afternoonEnd > ranges.nightStart) {
      return 'The night shift must start after or at the same time the afternoon shift ends';
    }
    return null;
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      const validationError = validateRanges(shiftRangesState);
      if (validationError) {
        onError?.(validationError);
        return;
      }
      
      await savePreferences({ shiftRanges: shiftRangesState });
      
      // Show success and hide after a while
      setShowSuccess(true);
      setHasChanges(false);
      onSuccess?.('Shift ranges saved successfully.');
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
    } catch (error) {
      onError?.('Error saving ranges: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to update ranges
  const updateRange = (key, value) => {
    setShiftRangesState(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <SettingsSection icon={Clock} title="Shift Ranges" className={className}>
      <p className="text-sm text-gray-600 mb-4">
        Configure the time ranges for automatic shift type detection.
        Existing shift tags will be updated automatically.
      </p>
      
      <div className="space-y-4 mb-6">
        {/* Day Shift */}
        <TurnRange title="Day Shift" icon={Sun} iconColor="#F59E0B" colors={colors}>
          <div className="grid grid-cols-2 gap-4">
            <TimeSelect
              label="Start time"
              value={shiftRangesState.dayStart}
              onChange={(value) => updateRange('dayStart', value)}
              colors={colors}
            />
            <TimeSelect
              label="End time"
              value={shiftRangesState.dayEnd}
              onChange={(value) => updateRange('dayEnd', value)}
              colors={colors}
            />
          </div>
        </TurnRange>
        
        {/* Afternoon Shift */}
        <TurnRange title="Afternoon Shift" icon={Sunset} iconColor="#F97316" colors={colors}>
          <div className="grid grid-cols-2 gap-4">
            <TimeSelect
              label="Start time"
              value={shiftRangesState.afternoonStart}
              onChange={(value) => updateRange('afternoonStart', value)}
              colors={colors}
            />
            <TimeSelect
              label="End time"
              value={shiftRangesState.afternoonEnd}
              onChange={(value) => updateRange('afternoonEnd', value)}
              colors={colors}
            />
          </div>
        </TurnRange>
        
        {/* Night Shift */}
        <TurnRange title="Night Shift" icon={Moon} iconColor="#6366F1" colors={colors}>
          <TimeSelect
            label="Start time"
            value={shiftRangesState.nightStart}
            onChange={(value) => updateRange('nightStart', value)}
            colors={colors}
          />
          <p className="text-xs text-gray-500 mt-1">
            The night shift extends until the end of the day
          </p>
        </TurnRange>
      </div>

      <Button
        onClick={handleSave}
        disabled={loading || !hasChanges}
        loading={loading}
        className="w-full relative"
        themeColor={colors.primary}
        icon={showSuccess ? Check : undefined}
      >
        {loading ? 'Saving...' : 
         showSuccess ? 'Saved correctly' :
         hasChanges ? 'Save shift ranges' : 'No changes'}
      </Button>
    </SettingsSection>
  );
};

export default ShiftRangeSection;