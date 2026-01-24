// src/components/settings/GoalsSection/index.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** Target, Save, X ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';

import Flex from '../../ui/Flex';

const GoalsSection = (***REMOVED*** className ***REMOVED***) => ***REMOVED***
  // Use the correct variable name and function from the context
  const ***REMOVED*** weeklyHoursGoal, updateWeeklyHoursGoal ***REMOVED*** = useApp();
  const colors = useThemeColors();
  const [editing, setEditing] = useState(false);
  const [newGoal, setNewGoal] = useState(weeklyHoursGoal || '');

  const handleSave = async () => ***REMOVED***
    try ***REMOVED***
      const goal = parseFloat(newGoal);
      if (goal > 0 && goal <= 168) ***REMOVED***
        await updateWeeklyHoursGoal(goal);
        setEditing(false);
      ***REMOVED***
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error saving goal:', error);
    ***REMOVED***
  ***REMOVED***;

  const handleCancel = () => ***REMOVED***
    setNewGoal(weeklyHoursGoal || '');
    setEditing(false);
  ***REMOVED***;

  const handleDelete = async () => ***REMOVED***
    try ***REMOVED***
      await updateWeeklyHoursGoal(null);
      setNewGoal('');
      setEditing(false);
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error deleting goal:', error);
    ***REMOVED***
  ***REMOVED***;

  return (
    <SettingsSection icon=***REMOVED***Target***REMOVED*** title="Weekly Goals" className=***REMOVED***className***REMOVED***>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weekly hours goal
          </label>
          
          ***REMOVED***!editing ? (
            <Flex variant="between" className="p-3 bg-gray-50 rounded-lg">
              <div>
                ***REMOVED***weeklyHoursGoal ? (
                  <>
                    <span className="text-lg font-semibold" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                      ***REMOVED***weeklyHoursGoal***REMOVED*** hours
                    </span>
                    <p className="text-sm text-gray-500">
                      ~***REMOVED***(weeklyHoursGoal / 7).toFixed(1)***REMOVED*** hours per day
                    </p>
                  </>
                ) : (
                  <span className="text-gray-500">Not set</span>
                )***REMOVED***
              </div>
              <button
                onClick=***REMOVED***() => setEditing(true)***REMOVED***
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style=***REMOVED******REMOVED***
                  backgroundColor: colors.transparent10,
                  color: colors.primary
                ***REMOVED******REMOVED***
                onMouseEnter=***REMOVED***(e) => ***REMOVED***
                  e.target.style.backgroundColor = colors.transparent20;
                ***REMOVED******REMOVED***
                onMouseLeave=***REMOVED***(e) => ***REMOVED***
                  e.target.style.backgroundColor = colors.transparent10;
                ***REMOVED******REMOVED***
              >
                ***REMOVED***weeklyHoursGoal ? 'Edit' : 'Set up'***REMOVED***
              </button>
            </Flex>
          ) : (
            <div className="space-y-3">
              <Flex className="space-x-2">
                <input
                  type="number"
                  value=***REMOVED***newGoal***REMOVED***
                  onChange=***REMOVED***(e) => setNewGoal(e.target.value)***REMOVED***
                  placeholder="E.g: 40"
                  min="1"
                  max="168"
                  step="0.5"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                  style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
                />
                <span className="text-sm text-gray-500">hours</span>
              </Flex>
              
              <Flex className="space-x-2">
                <button
                  onClick=***REMOVED***handleSave***REMOVED***
                  disabled=***REMOVED***!newGoal || parseFloat(newGoal) <= 0***REMOVED***
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
                  style=***REMOVED******REMOVED*** backgroundColor: colors.primary ***REMOVED******REMOVED***
                  onMouseEnter=***REMOVED***(e) => ***REMOVED***
                    if (!e.target.disabled) ***REMOVED***
                      e.target.style.backgroundColor = colors.primaryDark;
                    ***REMOVED***
                  ***REMOVED******REMOVED***
                  onMouseLeave=***REMOVED***(e) => ***REMOVED***
                    if (!e.target.disabled) ***REMOVED***
                      e.target.style.backgroundColor = colors.primary;
                    ***REMOVED***
                  ***REMOVED******REMOVED***
                >
                  <Save size=***REMOVED***16***REMOVED*** className="mr-1" />
                  Save
                </button>
                
                <button
                  onClick=***REMOVED***handleCancel***REMOVED***
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style=***REMOVED******REMOVED***
                    backgroundColor: colors.transparent10,
                    color: colors.primary
                  ***REMOVED******REMOVED***
                  onMouseEnter=***REMOVED***(e) => ***REMOVED***
                    e.target.style.backgroundColor = colors.transparent20;
                  ***REMOVED******REMOVED***
                  onMouseLeave=***REMOVED***(e) => ***REMOVED***
                    e.target.style.backgroundColor = colors.transparent10;
                  ***REMOVED******REMOVED***
                >
                  <X size=***REMOVED***16***REMOVED*** className="mr-1" />
                  Cancel
                </button>

                ***REMOVED***weeklyHoursGoal && (
                  <button
                    onClick=***REMOVED***handleDelete***REMOVED***
                    className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 transition-colors hover:bg-red-100"
                  >
                    <X size=***REMOVED***16***REMOVED*** className="mr-1" />
                    Delete
                  </button>
                )***REMOVED***
              </Flex>
            </div>
          )***REMOVED***
        </div>

        <div 
          className="p-3 rounded-lg"
          style=***REMOVED******REMOVED*** backgroundColor: colors.transparent5 ***REMOVED******REMOVED***
        >
          <p className="text-sm" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
            <strong>Tip:</strong> Set a realistic goal to see your weekly progress 
            in the Statistics progress bar.
          </p>
        </div>
      </div>
    </SettingsSection>
  );
***REMOVED***;

export default GoalsSection;