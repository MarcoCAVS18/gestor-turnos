// src/components/settings/TurnRangeSection/index.jsx

import { useState, useEffect } from 'react';
import { Clock, Sun, Sunset, Moon, Check, Radio } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useLiveModeContext } from '../../../contexts/LiveModeContext';
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
        style={{ '--tw-ring-color': colors.primary }}
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

const ShiftRangeSection = ({ id, onError, onSuccess, className }) => {
  const { t } = useTranslation();
  const { shiftRanges, savePreferences } = useApp();
  const colors = useThemeColors();
  const { isActive: isLiveModeActive } = useLiveModeContext();
  const [shiftRangesState, setShiftRangesState] = useState(shiftRanges || {
    dayStart: 6, dayEnd: 14, afternoonStart: 14, afternoonEnd: 20, nightStart: 20
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (shiftRanges) setShiftRangesState(shiftRanges);
  }, [shiftRanges]);

  useEffect(() => {
    if (!shiftRanges) return;
    const hasChanged =
      shiftRangesState.dayStart !== shiftRanges.dayStart ||
      shiftRangesState.dayEnd !== shiftRanges.dayEnd ||
      shiftRangesState.afternoonStart !== shiftRanges.afternoonStart ||
      shiftRangesState.afternoonEnd !== shiftRanges.afternoonEnd ||
      shiftRangesState.nightStart !== shiftRanges.nightStart;

    setHasChanges(hasChanged);
    if (hasChanged && showSuccess) setShowSuccess(false);
  }, [shiftRangesState, shiftRanges, showSuccess]);

  const validateRanges = (ranges) => {
    if (ranges.dayStart >= ranges.dayEnd) return t('settings.turnRange.validationDay');
    if (ranges.afternoonStart >= ranges.afternoonEnd) return t('settings.turnRange.validationAfternoon');
    if (ranges.dayEnd > ranges.afternoonStart) return t('settings.turnRange.validationAfternoonAfterDay');
    if (ranges.afternoonEnd > ranges.nightStart) return t('settings.turnRange.validationNightAfterAfternoon');
    return null;
  };

  const handleSave = async () => {
    if (isLiveModeActive) {
      onError?.('Live Mode is active. Stop the session before changing shift ranges.');
      return;
    }
    try {
      setLoading(true);
      const validationError = validateRanges(shiftRangesState);
      if (validationError) { onError?.(validationError); return; }

      await savePreferences({ shiftRanges: shiftRangesState });
      setShowSuccess(true);
      setHasChanges(false);
      onSuccess?.('Shift ranges saved successfully.');
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      onError?.('Error saving ranges: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateRange = (key, value) => {
    setShiftRangesState(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SettingsSection id={id} icon={Clock} title={t('settings.turnRange.title')} className={className}>
      <p className="text-sm text-gray-600 mb-4">
        {t('settings.turnRange.description')}
      </p>

      {isLiveModeActive && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300">
          <Radio size={15} className="flex-shrink-0 animate-pulse" />
          <p className="text-xs font-medium">{t('settings.turnRange.liveModeWarning')}</p>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <TurnRange title={t('settings.turnRange.dayShift')} icon={Sun} iconColor="#F59E0B" colors={colors}>
          <div className="grid grid-cols-2 gap-4">
            <TimeSelect label={t('settings.turnRange.startTime')} value={shiftRangesState.dayStart} onChange={(v) => updateRange('dayStart', v)} colors={colors} />
            <TimeSelect label={t('settings.turnRange.endTime')} value={shiftRangesState.dayEnd} onChange={(v) => updateRange('dayEnd', v)} colors={colors} />
          </div>
        </TurnRange>

        <TurnRange title={t('settings.turnRange.afternoonShift')} icon={Sunset} iconColor="#F97316" colors={colors}>
          <div className="grid grid-cols-2 gap-4">
            <TimeSelect label={t('settings.turnRange.startTime')} value={shiftRangesState.afternoonStart} onChange={(v) => updateRange('afternoonStart', v)} colors={colors} />
            <TimeSelect label={t('settings.turnRange.endTime')} value={shiftRangesState.afternoonEnd} onChange={(v) => updateRange('afternoonEnd', v)} colors={colors} />
          </div>
        </TurnRange>

        <TurnRange title={t('settings.turnRange.nightShift')} icon={Moon} iconColor="#6366F1" colors={colors}>
          <TimeSelect label={t('settings.turnRange.startTime')} value={shiftRangesState.nightStart} onChange={(v) => updateRange('nightStart', v)} colors={colors} />
          <p className="text-xs text-gray-500 mt-1">{t('settings.turnRange.nightNote')}</p>
        </TurnRange>
      </div>

      <Button
        onClick={handleSave}
        disabled={loading || !hasChanges || isLiveModeActive}
        loading={loading}
        className="w-full relative"
        themeColor={colors.primary}
        icon={showSuccess ? Check : isLiveModeActive ? Radio : undefined}
      >
        {loading ? t('common.saving') :
         isLiveModeActive ? t('settings.turnRange.blockedByLive') :
         showSuccess ? t('common.saved') :
         hasChanges ? t('settings.turnRange.save') : t('common.noChanges')}
      </Button>
    </SettingsSection>
  );
};

export default ShiftRangeSection;
