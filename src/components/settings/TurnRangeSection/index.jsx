// src/components/settings/TurnRangeSection/index.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** Clock, Sun, Sunset, Moon, Check ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';

const TimeSelect = (***REMOVED*** label, value, onChange, icon: Icon, iconColor, colors ***REMOVED***) => ***REMOVED***
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1 flex items-center">
        ***REMOVED***Icon && <Icon className="h-4 w-4 mr-1" style=***REMOVED******REMOVED*** color: iconColor ***REMOVED******REMOVED*** />***REMOVED***
        ***REMOVED***label***REMOVED***
      </label>
      <select
        value=***REMOVED***value***REMOVED***
        onChange=***REMOVED***(e) => onChange(parseInt(e.target.value))***REMOVED***
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 transition-colors"
        style=***REMOVED******REMOVED*** 
          '--tw-ring-color': colors.primary
        ***REMOVED******REMOVED***
      >
        ***REMOVED***Array.from(***REMOVED***length: 24***REMOVED***, (_, i) => (
          <option key=***REMOVED***i***REMOVED*** value=***REMOVED***i***REMOVED***>***REMOVED***i.toString().padStart(2, '0')***REMOVED***:00</option>
        ))***REMOVED***
      </select>
    </div>
  );
***REMOVED***;

const TurnRange = (***REMOVED*** title, icon: Icon, iconColor, children, colors ***REMOVED***) => ***REMOVED***
  return (
    <div 
      className="border rounded-lg p-4"
      style=***REMOVED******REMOVED*** borderColor: colors.transparent20 ***REMOVED******REMOVED***
    >
      <div className="flex items-center mb-3">
        <Icon className="h-5 w-5 mr-2" style=***REMOVED******REMOVED*** color: iconColor ***REMOVED******REMOVED*** />
        <h3 className="font-medium">***REMOVED***title***REMOVED***</h3>
      </div>
      ***REMOVED***children***REMOVED***
    </div>
  );
***REMOVED***;

const ShiftRangeSection = (***REMOVED*** onError, onSuccess, className ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** 
    shiftRanges,
    savePreferences
  ***REMOVED*** = useApp();
  
  const colors = useThemeColors();
  const [shiftRangesState, setShiftRangesState] = useState(shiftRanges || ***REMOVED***
    dayStart: 6,
    dayEnd: 14,
    afternoonStart: 14,
    afternoonEnd: 20,
    nightStart: 20
  ***REMOVED***);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => ***REMOVED***
    if (shiftRanges) ***REMOVED***
      setShiftRangesState(shiftRanges);
    ***REMOVED***
  ***REMOVED***, [shiftRanges]);

  // Detect changes to enable/disable the button
  useEffect(() => ***REMOVED***
    if (!shiftRanges) return;
    
    const hasChanged = 
      shiftRangesState.dayStart !== shiftRanges.dayStart ||
      shiftRangesState.dayEnd !== shiftRanges.dayEnd ||
      shiftRangesState.afternoonStart !== shiftRanges.afternoonStart ||
      shiftRangesState.afternoonEnd !== shiftRanges.afternoonEnd ||
      shiftRangesState.nightStart !== shiftRanges.nightStart;
    
    setHasChanges(hasChanged);
    
    // Hide success icon if there are new changes
    if (hasChanged && showSuccess) ***REMOVED***
      setShowSuccess(false);
    ***REMOVED***
  ***REMOVED***, [shiftRangesState, shiftRanges, showSuccess]);

  const validateRanges = (ranges) => ***REMOVED***
    if (ranges.dayStart >= ranges.dayEnd) ***REMOVED***
      return 'The day shift start time must be earlier than the end time';
    ***REMOVED***
    if (ranges.afternoonStart >= ranges.afternoonEnd) ***REMOVED***
      return 'The afternoon shift start time must be earlier than the end time';
    ***REMOVED***
    if (ranges.dayEnd > ranges.afternoonStart) ***REMOVED***
      return 'The afternoon shift must start after or at the same time the day shift ends';
    ***REMOVED***
    if (ranges.afternoonEnd > ranges.nightStart) ***REMOVED***
      return 'The night shift must start after or at the same time the afternoon shift ends';
    ***REMOVED***
    return null;
  ***REMOVED***;

  const handleSave = async () => ***REMOVED***
    try ***REMOVED***
      setLoading(true);
      
      const validationError = validateRanges(shiftRangesState);
      if (validationError) ***REMOVED***
        onError?.(validationError);
        return;
      ***REMOVED***
      
      await savePreferences(***REMOVED*** shiftRanges: shiftRangesState ***REMOVED***);
      
      // Show success and hide after a while
      setShowSuccess(true);
      setHasChanges(false);
      onSuccess?.('Shift ranges saved successfully.');
      
      setTimeout(() => ***REMOVED***
        setShowSuccess(false);
      ***REMOVED***, 3000);
      
    ***REMOVED*** catch (error) ***REMOVED***
      onError?.('Error saving ranges: ' + error.message);
    ***REMOVED*** finally ***REMOVED***
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;

  // Helper function to update ranges
  const updateRange = (key, value) => ***REMOVED***
    setShiftRangesState(prev => (***REMOVED***
      ...prev,
      [key]: value
    ***REMOVED***));
  ***REMOVED***;

  return (
    <SettingsSection icon=***REMOVED***Clock***REMOVED*** title="Shift Ranges" className=***REMOVED***className***REMOVED***>
      <p className="text-sm text-gray-600 mb-4">
        Configure the time ranges for automatic shift type detection.
        Existing shift tags will be updated automatically.
      </p>
      
      <div className="space-y-4 mb-6">
        ***REMOVED***/* Day Shift */***REMOVED***
        <TurnRange title="Day Shift" icon=***REMOVED***Sun***REMOVED*** iconColor="#F59E0B" colors=***REMOVED***colors***REMOVED***>
          <div className="grid grid-cols-2 gap-4">
            <TimeSelect
              label="Start time"
              value=***REMOVED***shiftRangesState.dayStart***REMOVED***
              onChange=***REMOVED***(value) => updateRange('dayStart', value)***REMOVED***
              colors=***REMOVED***colors***REMOVED***
            />
            <TimeSelect
              label="End time"
              value=***REMOVED***shiftRangesState.dayEnd***REMOVED***
              onChange=***REMOVED***(value) => updateRange('dayEnd', value)***REMOVED***
              colors=***REMOVED***colors***REMOVED***
            />
          </div>
        </TurnRange>
        
        ***REMOVED***/* Afternoon Shift */***REMOVED***
        <TurnRange title="Afternoon Shift" icon=***REMOVED***Sunset***REMOVED*** iconColor="#F97316" colors=***REMOVED***colors***REMOVED***>
          <div className="grid grid-cols-2 gap-4">
            <TimeSelect
              label="Start time"
              value=***REMOVED***shiftRangesState.afternoonStart***REMOVED***
              onChange=***REMOVED***(value) => updateRange('afternoonStart', value)***REMOVED***
              colors=***REMOVED***colors***REMOVED***
            />
            <TimeSelect
              label="End time"
              value=***REMOVED***shiftRangesState.afternoonEnd***REMOVED***
              onChange=***REMOVED***(value) => updateRange('afternoonEnd', value)***REMOVED***
              colors=***REMOVED***colors***REMOVED***
            />
          </div>
        </TurnRange>
        
        ***REMOVED***/* Night Shift */***REMOVED***
        <TurnRange title="Night Shift" icon=***REMOVED***Moon***REMOVED*** iconColor="#6366F1" colors=***REMOVED***colors***REMOVED***>
          <TimeSelect
            label="Start time"
            value=***REMOVED***shiftRangesState.nightStart***REMOVED***
            onChange=***REMOVED***(value) => updateRange('nightStart', value)***REMOVED***
            colors=***REMOVED***colors***REMOVED***
          />
          <p className="text-xs text-gray-500 mt-1">
            The night shift extends until the end of the day
          </p>
        </TurnRange>
      </div>

      <Button
        onClick=***REMOVED***handleSave***REMOVED***
        disabled=***REMOVED***loading || !hasChanges***REMOVED***
        loading=***REMOVED***loading***REMOVED***
        className="w-full relative"
        themeColor=***REMOVED***colors.primary***REMOVED***
        icon=***REMOVED***showSuccess ? Check : undefined***REMOVED***
      >
        ***REMOVED***loading ? 'Saving...' : 
         showSuccess ? 'Saved correctly' :
         hasChanges ? 'Save shift ranges' : 'No changes'***REMOVED***
      </Button>
    </SettingsSection>
  );
***REMOVED***;

export default ShiftRangeSection;