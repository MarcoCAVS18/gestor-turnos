// src/components/settings/PreferencesSection/index.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Info, Receipt, Check } from 'lucide-react'; // Added Check
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useWorks } from '../../../hooks/useWorks';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';
import Popover from '../../ui/Popover';
import WorkAvatar from '../../work/WorkAvatar';

const PreferencesSection = ({ onError, onSuccess, className }) => {
  const { 
    defaultDiscount,
    taxesPerWork, // comes from context
    savePreferences
  } = useApp();
  const { allWorks } = useWorks(); // Changed from trabajos to allWorks
  
  const colors = useThemeColors();
  
  // Data states
  const [defaultTax, setDefaultTax] = useState(defaultDiscount || 0);
  const [localTaxes, setLocalTaxes] = useState({});
  const [showMultiRate, setShowMultiRate] = useState(false);

  // UI/Feedback states
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const traditionalWorks = useMemo(() => 
    (allWorks || []).filter(w => w.type === 'tradicional'),
    [allWorks]
  );

  // Initialize local state when context changes (initial load)
  useEffect(() => {
    setDefaultTax(defaultDiscount || 0);
  }, [defaultDiscount]);
  
  useEffect(() => {
    const initialTaxes = {};
    traditionalWorks.forEach(work => {
      // The initialization logic must be consistent
      initialTaxes[work.id] = taxesPerWork[work.id] ?? defaultDiscount ?? 0;
    });
    setLocalTaxes(initialTaxes);
  }, [traditionalWorks, taxesPerWork, defaultDiscount]);

  // Effect to detect changes (Dirty Checking)
  useEffect(() => {
    // 1. Check if default changed
    const defaultChanged = defaultTax !== (defaultDiscount || 0);

    // 2. Check if any specific tax changed
    const localTaxesChanged = traditionalWorks.some(work => {
      const originalValue = taxesPerWork[work.id] ?? defaultDiscount ?? 0;
      const currentValue = localTaxes[work.id];
      // We compare values (we use == to be tolerant with strings/numbers if it happens, 
      // although here we force number in the input)
      return originalValue !== currentValue;
    });

    const isDirty = defaultChanged || localTaxesChanged;
    setHasChanges(isDirty);

    // If the user edits again, hide the success message
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
        defaultTax: defaultTax,
        taxesPerWork: localTaxes
      });
      
      // Show success
      setShowSuccess(true);
      setHasChanges(false); // Assume successful save
      onSuccess?.('Tax settings saved successfully');

      // Hide success message after 3s
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
      <p className="text-sm text-gray-600 mb-2">
        This percentage represents the <strong>retention</strong> that the company deducts from your gross payment before depositing it.
      </p>
      <ul className="text-xs text-gray-500 list-disc pl-4 space-y-1">
        <li>Taxes (Tax)</li>
        <li>Social Security</li>
        <li>Other mandatory deductions</li>
      </ul>
      <p className="text-xs text-gray-400 mt-3 border-t pt-2">
        * 15% is a common value for casual contracts, but you should verify your specific case.
      </p>
    </div>
  );

  return (
    <SettingsSection icon={Receipt} title="Payment and Tax Settings" className={className}>
      <div className="space-y-4">

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700">
              Tax / Deductions (%)
            </label>

            <Popover
              content={popoverContent}
              title="What are these taxes?"
              position="top"
              trigger="click"
            >
              <button className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors focus:outline-none">
                <Info size={14} />
                <span>Help</span>
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
              Default value for all jobs without specific tax.
            </p>
          </div>
        </div>

        {showMultiRate && traditionalWorks.length > 1 && (
          <div className="space-y-4 pt-4 border-t animate-in fade-in slide-in-from-top-2">
            <h3 className="text-md font-semibold text-gray-800">Taxes per Job</h3>
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
        
        <div className="pt-3 flex flex-wrap items-center gap-3">
          {traditionalWorks.length > 1 && (
            <Button
              onClick={() => setShowMultiRate(prev => !prev)}
              variant="outline"
              themeColor={colors.primary}
              size="sm"
            >
              {showMultiRate ? 'Hide per-job' : 'Per job'}
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={loading || !hasChanges}
            loading={loading}
            themeColor={colors.primary}
            size="sm"
            icon={showSuccess ? Check : undefined}
          >
            {loading ? 'Saving...' :
             showSuccess ? 'Saved' :
             hasChanges ? 'Save' : 'No changes'}
          </Button>
        </div>
      </div>
    </SettingsSection>
  );
};

export default PreferencesSection;