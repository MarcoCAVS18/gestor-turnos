// src/components/settings/PreferencesSection/index.jsx

import { useState, useEffect, useMemo } from 'react';
import { Info, Receipt, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useWorks } from '../../../hooks/useWorks';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';
import Popover from '../../ui/Popover';
import WorkAvatar from '../../work/WorkAvatar';

const PreferencesSection = ({ id, onError, onSuccess, className }) => {
  const { t } = useTranslation();
  const {
    defaultDiscount,
    taxesPerWork,
    savePreferences
  } = useApp();
  const { allWorks } = useWorks();

  const colors = useThemeColors();

  const [defaultTax, setDefaultTax] = useState(defaultDiscount || 0);
  const [localTaxes, setLocalTaxes] = useState({});
  const [showMultiRate, setShowMultiRate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const traditionalWorks = useMemo(() =>
    (allWorks || []).filter(w => w.type === 'tradicional'),
    [allWorks]
  );

  useEffect(() => {
    setDefaultTax(defaultDiscount || 0);
  }, [defaultDiscount]);

  useEffect(() => {
    const initialTaxes = {};
    traditionalWorks.forEach(work => {
      initialTaxes[work.id] = taxesPerWork[work.id] ?? defaultDiscount ?? 0;
    });
    setLocalTaxes(initialTaxes);
  }, [traditionalWorks, taxesPerWork, defaultDiscount]);

  useEffect(() => {
    const defaultChanged = defaultTax !== (defaultDiscount || 0);
    const localTaxesChanged = traditionalWorks.some(work => {
      const originalValue = taxesPerWork[work.id] ?? defaultDiscount ?? 0;
      const currentValue = localTaxes[work.id];
      return originalValue !== currentValue;
    });

    const isDirty = defaultChanged || localTaxesChanged;
    setHasChanges(isDirty);

    if (isDirty && showSuccess) {
      setShowSuccess(false);
    }
  }, [defaultTax, localTaxes, defaultDiscount, taxesPerWork, traditionalWorks, showSuccess]);

  const handleLocalTaxChange = (jobId, value) => {
    setLocalTaxes(prev => ({
      ...prev,
      [jobId]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await savePreferences({
        defaultDiscount: defaultTax,
        taxesPerWork: localTaxes
      });

      setShowSuccess(true);
      setHasChanges(false);
      onSuccess?.('Tax settings saved successfully');

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

    } catch (error) {
      onError?.('Error saving settings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const popoverContent = (
    <div className="p-2 max-w-xs">
      <p className="text-sm text-gray-600 dark:text-slate-300 mb-2">
        {t('settings.preferences.taxPopover.description')}
      </p>
      <ul className="text-xs text-gray-500 dark:text-slate-400 list-disc pl-4 space-y-1">
        <li>{t('settings.preferences.taxPopover.taxes')}</li>
        <li>{t('settings.preferences.taxPopover.socialSecurity')}</li>
        <li>{t('settings.preferences.taxPopover.otherDeductions')}</li>
      </ul>
      <p className="text-xs text-gray-400 dark:text-slate-500 mt-3 border-t border-gray-100 dark:border-slate-600 pt-2">
        {t('settings.preferences.taxPopover.note')}
      </p>
    </div>
  );

  return (
    <SettingsSection id={id} icon={Receipt} title={t('settings.preferences.title')} className={className}>
      <div className="space-y-4">

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700">
              {t('settings.preferences.taxLabel')}
            </label>

            <Popover
              content={popoverContent}
              title={t('settings.preferences.taxHelp')}
              position="top"
              trigger="click"
            >
              <button className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors focus:outline-none">
                <Info size={14} />
                <span>{t('settings.preferences.taxHelpBtn')}</span>
              </button>
            </Popover>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex rounded-md shadow-sm w-28">
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={defaultTax}
                onChange={(e) => setDefaultTax(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all text-gray-900 font-medium text-center"
                style={{ '--tw-ring-color': colors.primary }}
                placeholder="15"
              />
              <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 font-medium">
                %
              </span>
            </div>
            <p className="text-xs text-gray-500 flex-1">
              {t('settings.preferences.taxDefault')}
            </p>
          </div>
        </div>

        {showMultiRate && traditionalWorks.length > 1 && (
          <div className="space-y-4 pt-4 border-t animate-in fade-in slide-in-from-top-2">
            <h3 className="text-md font-semibold text-gray-800">{t('settings.preferences.perJobRates')}</h3>
            {traditionalWorks.map(work => (
              <div key={work.id} className="flex items-center gap-4">
                <WorkAvatar name={work.name} color={work.color} size="md" />
                <div className="flex-1">
                  <span className="font-medium text-gray-700">{work.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={localTaxes[work.id] || 0}
                    onChange={(e) => handleLocalTaxChange(work.id, Number(e.target.value))}
                    className="w-24 px-2 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-center"
                    style={{'--tw-ring-color': colors.primary}}
                    placeholder="e.g.: 15"
                  />
                  <span className="text-gray-500 font-medium">%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {traditionalWorks.length > 1 && (
          <div className="pt-3">
            <Button
              onClick={() => setShowMultiRate(prev => !prev)}
              variant="outline"
              themeColor={colors.primary}
              size="sm"
            >
              {showMultiRate ? t('settings.preferences.hideRates') : t('settings.preferences.configureRates')}
            </Button>
          </div>
        )}

        <Button
          onClick={handleSave}
          disabled={loading || !hasChanges}
          loading={loading}
          className="w-full mt-4"
          themeColor={colors.primary}
          icon={showSuccess ? Check : undefined}
        >
          {loading ? t('common.saving') :
           showSuccess ? t('common.saved') :
           hasChanges ? t('settings.preferences.saveTax') : t('common.noChanges')}
        </Button>
      </div>
    </SettingsSection>
  );
};

export default PreferencesSection;
