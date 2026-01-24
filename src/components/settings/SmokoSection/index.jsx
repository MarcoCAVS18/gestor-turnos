// src/components/settings/SmokoSection/index.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** Coffee ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import Flex from '../../ui/Flex';
import Switch from '../../ui/Switch';

const SmokoSection = (***REMOVED*** onError, onSuccess, className ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** 
    smokoEnabled = false, 
    smokoMinutes = 30,
    savePreferences 
  ***REMOVED*** = useApp();
  
  const colors = useThemeColors();
  const [enabled, setEnabled] = useState(smokoEnabled);
  const [minutes, setMinutes] = useState(smokoMinutes);

  useEffect(() => ***REMOVED***
    setEnabled(smokoEnabled);
    setMinutes(smokoMinutes);
  ***REMOVED***, [smokoEnabled, smokoMinutes]);

  const handleSave = async (newEnabled, newMinutes) => ***REMOVED***
    try ***REMOVED***
      await savePreferences(***REMOVED*** 
        smokoEnabled: newEnabled,
        smokoMinutes: newEnabled ? newMinutes : 0
      ***REMOVED***);
      // onSuccess removed to avoid spamming toast notifications on every change
    ***REMOVED*** catch (error) ***REMOVED***
      onError?.('Error saving break settings: ' + error.message);
    ***REMOVED***
  ***REMOVED***;

  const handleToggle = (newEnabled) => ***REMOVED***
    setEnabled(newEnabled);
    handleSave(newEnabled, minutes);
  ***REMOVED***;

  const handleMinutesChange = (val) => ***REMOVED***
    const newMinutes = Math.max(5, Math.min(120, parseInt(val) || 0));
    setMinutes(newMinutes);
    handleSave(enabled, newMinutes);
  ***REMOVED***;

  const formatTime = (mins) => ***REMOVED***
    if (mins < 60) return `$***REMOVED***mins***REMOVED***m`;
    const hours = Math.floor(mins / 60);
    const remainingMinutes = mins % 60;
    if (remainingMinutes === 0) return `$***REMOVED***hours***REMOVED***h`;
    return `$***REMOVED***hours***REMOVED***h $***REMOVED***remainingMinutes***REMOVED***m`;
  ***REMOVED***;

  return (
    <SettingsSection
      icon=***REMOVED***Coffee***REMOVED***
      title="Smoko (Breaks)"
      className=***REMOVED***className***REMOVED***
    >
      <div className="space-y-6">
        <div 
          className="p-3 rounded-lg"
          style=***REMOVED******REMOVED*** backgroundColor: colors.transparent5 ***REMOVED******REMOVED***
        >
          <p className="text-sm" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
            <strong>What is this?</strong> Configure the unpaid break time 
            that will be automatically deducted from your shifts.
          </p>
        </div>

        <Flex variant="between">
          <div className="flex-1 pr-4">
            <p className="font-medium text-gray-900">Enable deduction</p>
            <p className="text-sm text-gray-500">
              Automatically deduct break time
            </p>
          </div>
          
          ***REMOVED***/* Switch component replaced */***REMOVED***
          <Switch 
            checked=***REMOVED***enabled***REMOVED*** 
            onChange=***REMOVED***handleToggle***REMOVED*** 
          />
        </Flex>

        ***REMOVED***enabled && (
          <div className="space-y-4 pt-4 border-t border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Break duration
              </label>

              ***REMOVED***/* RESPONSIVE GRID: 2 columns on mobile, 4 on desktop */***REMOVED***
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                ***REMOVED***[15, 30, 45].map(min => (
                  <button
                    key=***REMOVED***min***REMOVED***
                    type="button"
                    onClick=***REMOVED***() => handleMinutesChange(min)***REMOVED***
                    // h-12 fixes the height to match the input
                    className=***REMOVED***`
                      relative h-12 w-full text-sm font-medium rounded-lg border transition-all
                      flex items-center justify-center
                      $***REMOVED***minutes === min
                        ? 'border-2 text-white shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      ***REMOVED***
                    `***REMOVED***
                    style=***REMOVED******REMOVED***
                      backgroundColor: minutes === min ? colors.primary : 'transparent',
                      borderColor: minutes === min ? colors.primary : undefined
                    ***REMOVED******REMOVED***
                  >
                    ***REMOVED***formatTime(min)***REMOVED***
                  </button>
                ))***REMOVED***

                ***REMOVED***/* CUSTOM INPUT */***REMOVED***
                <div className="relative h-12 w-full">
                  <input
                    type="number"
                    value=***REMOVED***minutes***REMOVED***
                    onChange=***REMOVED***(e) => handleMinutesChange(e.target.value)***REMOVED***
                    // pb-4 raises input text to leave space for "min" label below
                    className="block w-full h-full px-2 pt-1 pb-4 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors bg-white font-medium text-gray-900"
                    style=***REMOVED******REMOVED*** 
                      borderColor: [15, 30, 45].includes(minutes) ? '#E5E7EB' : colors.primary,
                      '--tw-ring-color': colors.primary 
                    ***REMOVED******REMOVED***
                    min="5"
                    max="120"
                    placeholder="--"
                  />
                  ***REMOVED***/* "min" label at the bottom */***REMOVED***
                  <span className="absolute bottom-1.5 left-0 right-0 text-[10px] font-medium text-gray-400 text-center pointer-events-none uppercase tracking-wide">
                    min
                  </span>
                </div>
              </div>
            </div>
          </div>
        )***REMOVED***
      </div>
    </SettingsSection>
  );
***REMOVED***;

export default SmokoSection;