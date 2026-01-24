// src/components/settings/GoalsSection/index.jsx

import React, { useState } from 'react';
import { Target, Save, X } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';

import Flex from '../../ui/Flex';

const GoalsSection = ({ className }) => {
  // Use the correct variable name and function from the context
  const { weeklyHoursGoal, updateWeeklyHoursGoal } = useApp();
  const colors = useThemeColors();
  const [editing, setEditing] = useState(false);
  const [newGoal, setNewGoal] = useState(weeklyHoursGoal || '');

  const handleSave = async () => {
    try {
      const goal = parseFloat(newGoal);
      if (goal > 0 && goal <= 168) {
        await updateWeeklyHoursGoal(goal);
        setEditing(false);
      }
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const handleCancel = () => {
    setNewGoal(weeklyHoursGoal || '');
    setEditing(false);
  };

  const handleDelete = async () => {
    try {
      await updateWeeklyHoursGoal(null);
      setNewGoal('');
      setEditing(false);
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  return (
    <SettingsSection icon={Target} title="Weekly Goals" className={className}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weekly hours goal
          </label>
          
          {!editing ? (
            <Flex variant="between" className="p-3 bg-gray-50 rounded-lg">
              <div>
                {weeklyHoursGoal ? (
                  <>
                    <span className="text-lg font-semibold" style={{ color: colors.primary }}>
                      {weeklyHoursGoal} hours
                    </span>
                    <p className="text-sm text-gray-500">
                      ~{(weeklyHoursGoal / 7).toFixed(1)} hours per day
                    </p>
                  </>
                ) : (
                  <span className="text-gray-500">Not set</span>
                )}
              </div>
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: colors.transparent10,
                  color: colors.primary
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = colors.transparent20;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = colors.transparent10;
                }}
              >
                {weeklyHoursGoal ? 'Edit' : 'Set up'}
              </button>
            </Flex>
          ) : (
            <div className="space-y-3">
              <Flex className="space-x-2">
                <input
                  type="number"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="E.g: 40"
                  min="1"
                  max="168"
                  step="0.5"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                  style={{ '--tw-ring-color': colors.primary }}
                />
                <span className="text-sm text-gray-500">hours</span>
              </Flex>
              
              <Flex className="space-x-2">
                <button
                  onClick={handleSave}
                  disabled={!newGoal || parseFloat(newGoal) <= 0}
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
                  style={{ backgroundColor: colors.primary }}
                  onMouseEnter={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.backgroundColor = colors.primaryDark;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.backgroundColor = colors.primary;
                    }
                  }}
                >
                  <Save size={16} className="mr-1" />
                  Save
                </button>
                
                <button
                  onClick={handleCancel}
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: colors.transparent10,
                    color: colors.primary
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = colors.transparent20;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = colors.transparent10;
                  }}
                >
                  <X size={16} className="mr-1" />
                  Cancel
                </button>

                {weeklyHoursGoal && (
                  <button
                    onClick={handleDelete}
                    className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 transition-colors hover:bg-red-100"
                  >
                    <X size={16} className="mr-1" />
                    Delete
                  </button>
                )}
              </Flex>
            </div>
          )}
        </div>

        <div 
          className="p-3 rounded-lg"
          style={{ backgroundColor: colors.transparent5 }}
        >
          <p className="text-sm" style={{ color: colors.primary }}>
            <strong>Tip:</strong> Set a realistic goal to see your weekly progress 
            in the Statistics progress bar.
          </p>
        </div>
      </div>
    </SettingsSection>
  );
};

export default GoalsSection;