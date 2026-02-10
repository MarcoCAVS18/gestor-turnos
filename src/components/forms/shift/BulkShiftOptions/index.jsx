// src/components/forms/shift/BulkShiftOptions/index.jsx
// Simple toggle component for enabling bulk shift creation

import React from 'react';
import { Repeat } from 'lucide-react';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import Switch from '../../../ui/Switch';

const BulkShiftOptions = ({ isEnabled, onToggle }) => {
  const colors = useThemeColors();

  return (
    <div className="mt-4 pt-4 border-t" style={{ borderColor: colors.border }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Repeat size={18} style={{ color: colors.primary }} />
          <label
            htmlFor="bulk-shift-toggle"
            className="text-sm font-medium cursor-pointer"
            style={{ color: colors.text }}
          >
            Create multiple shifts
          </label>
        </div>
        <Switch
          id="bulk-shift-toggle"
          checked={isEnabled}
          onChange={onToggle}
        />
      </div>
      {isEnabled && (
        <p className="text-xs mt-2 ml-6" style={{ color: colors.textSecondary }}>
          You'll configure the pattern in the next step
        </p>
      )}
    </div>
  );
};

export default BulkShiftOptions;
