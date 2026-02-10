// src/components/forms/shift/BulkShiftOptions/index.jsx
// Simple toggle component for enabling bulk shift creation

import React from 'react';
import { Repeat, Sparkles } from 'lucide-react';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import Switch from '../../../ui/Switch';
import New from '../../../ui/New';

const BulkShiftOptions = ({ isEnabled, onToggle }) => {
  const colors = useThemeColors();

  return (
    <div className="mt-4 pt-4 border-t" style={{ borderColor: colors.border }}>
      {/* Info banner */}
      <div
        className="mb-3 p-3 rounded-lg flex items-start gap-2"
        style={{
          backgroundColor: colors.surface2,
          border: `1px solid ${colors.border}`
        }}
      >
        <Sparkles size={16} style={{ color: colors.primary }} className="flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold" style={{ color: colors.text }}>
              Create Multiple Shifts at Once
            </span>
            <New size="xs">NEW</New>
          </div>
          <p className="text-xs" style={{ color: colors.textSecondary }}>
            Save time by creating shifts for multiple days in a single step. Select your pattern in the next screen.
          </p>
        </div>
      </div>

      {/* Toggle control */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Repeat size={18} style={{ color: colors.primary }} />
          <label
            htmlFor="bulk-shift-toggle"
            className="text-sm font-medium cursor-pointer"
            style={{ color: colors.text }}
          >
            Enable bulk creation
          </label>
        </div>
        <Switch
          id="bulk-shift-toggle"
          checked={isEnabled}
          onChange={onToggle}
        />
      </div>
    </div>
  );
};

export default BulkShiftOptions;
