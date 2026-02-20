// src/components/settings/GoalsSection/index.jsx

import React, { useState } from 'react';
import { Target, Save, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import logger from '../../../utils/logger';

const PRESETS = [
  { label: 'Part-time', hours: 20 },
  { label: 'Standard', hours: 38 },
  { label: 'Full-time', hours: 40 },
  { label: 'Extended', hours: 50 },
];

// Circular progress ring
const ProgressRing = ({ percentage, color, size = 64, strokeWidth = 5 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-gray-100 dark:text-slate-700"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </svg>
  );
};

const GoalsSection = ({ className }) => {
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
      logger.error('Error saving goal:', error);
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
      logger.error('Error deleting goal:', error);
    }
  };

  const handlePresetClick = (hours) => {
    setNewGoal(hours);
  };

  const dailyAvg = weeklyHoursGoal ? (weeklyHoursGoal / 7).toFixed(1) : 0;
  const weekdayAvg = weeklyHoursGoal ? (weeklyHoursGoal / 5).toFixed(1) : 0;

  return (
    <SettingsSection icon={Target} title="Weekly Goals" className={className}>
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {!editing ? (
            <motion.div
              key="display"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {weeklyHoursGoal ? (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800">
                  <div className="flex items-center gap-4">
                    {/* Progress ring */}
                    <div className="relative flex-shrink-0">
                      <ProgressRing
                        percentage={100}
                        color={colors.primary}
                        size={64}
                        strokeWidth={5}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Target size={20} style={{ color: colors.primary }} />
                      </div>
                    </div>

                    {/* Goal info */}
                    <div className="flex-1">
                      <span className="text-2xl font-bold dark:text-white" style={{ color: colors.primary }}>
                        {weeklyHoursGoal}h
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/ week</span>
                      <div className="flex gap-3 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ~{dailyAvg}h/day
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">|</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ~{weekdayAvg}h on weekdays
                        </span>
                      </div>
                    </div>

                    {/* Edit button */}
                    <button
                      onClick={() => setEditing(true)}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: colors.transparent10,
                        color: colors.primary
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="w-full p-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 transition-colors group"
                >
                  <div className="flex flex-col items-center gap-2 py-2">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                      style={{ backgroundColor: colors.transparent10 }}
                    >
                      <Target size={20} style={{ color: colors.primary }} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Set a weekly goal</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Track your progress in Statistics</p>
                    </div>
                  </div>
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="editing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-3"
            >
              {/* Preset buttons */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Quick presets
                </label>
                <div className="flex gap-2">
                  {PRESETS.map((preset) => {
                    const isSelected = parseFloat(newGoal) === preset.hours;
                    return (
                      <button
                        key={preset.hours}
                        onClick={() => handlePresetClick(preset.hours)}
                        className="flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all border-2"
                        style={{
                          borderColor: isSelected ? colors.primary : 'transparent',
                          backgroundColor: isSelected ? colors.transparent10 : 'rgb(249 250 251)',
                          color: isSelected ? colors.primary : '#6b7280',
                        }}
                      >
                        <div className="font-bold text-sm">{preset.hours}h</div>
                        <div className="opacity-70">{preset.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom input */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Or enter custom hours
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="E.g: 40"
                    min="1"
                    max="168"
                    step="0.5"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:border-transparent transition-colors bg-white dark:bg-slate-700 dark:text-white"
                    style={{ '--tw-ring-color': colors.primary }}
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400">hours/week</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleSave}
                  disabled={!newGoal || parseFloat(newGoal) <= 0}
                  className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Save size={14} className="mr-1.5" />
                  Save
                </button>

                <button
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <X size={14} className="mr-1.5" />
                  Cancel
                </button>

                {weeklyHoursGoal && (
                  <button
                    onClick={handleDelete}
                    className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 transition-colors hover:bg-red-100 dark:hover:bg-red-900/30 ml-auto"
                  >
                    <Trash2 size={14} className="mr-1.5" />
                    Remove
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
