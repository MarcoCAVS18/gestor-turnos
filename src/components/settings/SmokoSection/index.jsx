// src/components/settings/SmokoSection/index.jsx

import React, { useState, useEffect } from 'react';
import { Coffee } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import Flex from '../../ui/Flex';
import Switch from '../../ui/Switch';

const SmokoSection = ({ onError, onSuccess, className }) => {
  const { t } = useTranslation();
  const {
    smokoEnabled = false,
    smokoMinutes = 30,
    savePreferences
  } = useApp();

  const colors = useThemeColors();
  const [enabled, setEnabled] = useState(smokoEnabled);
  const [minutes, setMinutes] = useState(smokoMinutes);

  useEffect(() => {
    setEnabled(smokoEnabled);
    setMinutes(smokoMinutes);
  }, [smokoEnabled, smokoMinutes]);

  const handleSave = async (newEnabled, newMinutes) => {
    try {
      await savePreferences({
        smokoEnabled: newEnabled,
        smokoMinutes: newEnabled ? newMinutes : 0
      });
    } catch (error) {
      onError?.('Error saving break settings: ' + error.message);
    }
  };

  const handleToggle = (newEnabled) => {
    setEnabled(newEnabled);
    handleSave(newEnabled, minutes);
  };

  const handleMinutesChange = (val) => {
    const newMinutes = Math.max(5, Math.min(120, parseInt(val) || 0));
    setMinutes(newMinutes);
    handleSave(enabled, newMinutes);
  };

  const formatTime = (mins) => {
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    const remainingMinutes = mins % 60;
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <SettingsSection
      icon={Coffee}
      title={t('settings.smoko.title')}
      className={className}
    >
      <div className="space-y-6">
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: colors.transparent5 }}
        >
          <p className="text-sm" style={{ color: colors.primary }}>
            <strong>{t('settings.smoko.whatIsThis')}</strong> {t('settings.smoko.description')}
          </p>
        </div>

        <Flex variant="between">
          <div className="flex-1 pr-4">
            <p className="font-medium text-gray-900">{t('settings.smoko.enableDeduction')}</p>
            <p className="text-sm text-gray-500">
              {t('settings.smoko.autoDeduct')}
            </p>
          </div>

          <Switch
            checked={enabled}
            onChange={handleToggle}
          />
        </Flex>

        {enabled && (
          <div className="space-y-4 pt-4 border-t border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('settings.smoko.breakDuration')}
              </label>

              {/* RESPONSIVE GRID: 2 columns on mobile, 4 on desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[15, 30, 45].map(min => (
                  <button
                    key={min}
                    type="button"
                    onClick={() => handleMinutesChange(min)}
                    className={`
                      relative h-12 w-full text-sm font-medium rounded-lg border transition-all
                      flex items-center justify-center
                      ${minutes === min
                        ? 'border-2 text-white shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                    style={{
                      backgroundColor: minutes === min ? colors.primary : 'transparent',
                      borderColor: minutes === min ? colors.primary : undefined
                    }}
                  >
                    {formatTime(min)}
                  </button>
                ))}

                {/* CUSTOM INPUT */}
                <div className="relative h-12 w-full">
                  <input
                    type="number"
                    value={minutes}
                    onChange={(e) => handleMinutesChange(e.target.value)}
                    className="block w-full h-full px-2 pt-1 pb-4 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors bg-white font-medium text-gray-900"
                    style={{
                      borderColor: [15, 30, 45].includes(minutes) ? '#E5E7EB' : colors.primary,
                      '--tw-ring-color': colors.primary
                    }}
                    min="5"
                    max="120"
                    placeholder="--"
                  />
                  <span className="absolute bottom-1.5 left-0 right-0 text-[10px] font-medium text-gray-400 text-center pointer-events-none uppercase tracking-wide">
                    {t('settings.smoko.minutes')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SettingsSection>
  );
};

export default SmokoSection;
