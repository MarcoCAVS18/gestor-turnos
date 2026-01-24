// src/components/settings/PreferencesSection/index.jsx

import React, ***REMOVED*** useState, useEffect, useMemo ***REMOVED*** from 'react';
import ***REMOVED*** Info, Receipt, Check ***REMOVED*** from 'lucide-react'; // Added Check
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** useWorks ***REMOVED*** from '../../../hooks/useWorks';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';
import Popover from '../../ui/Popover';
import WorkAvatar from '../../work/WorkAvatar';

const PreferencesSection = (***REMOVED*** onError, onSuccess, className ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** 
    defaultDiscount,
    taxesPerWork, // comes from context
    savePreferences
  ***REMOVED*** = useApp();
  const ***REMOVED*** allWorks ***REMOVED*** = useWorks(); // Changed from trabajos to allWorks
  
  const colors = useThemeColors();
  
  // Data states
  const [defaultTax, setDefaultTax] = useState(defaultDiscount || 0);
  const [localTaxes, setLocalTaxes] = useState(***REMOVED******REMOVED***);
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
  useEffect(() => ***REMOVED***
    setDefaultTax(defaultDiscount || 0);
  ***REMOVED***, [defaultDiscount]);
  
  useEffect(() => ***REMOVED***
    const initialTaxes = ***REMOVED******REMOVED***;
    traditionalWorks.forEach(work => ***REMOVED***
      // The initialization logic must be consistent
      initialTaxes[work.id] = taxesPerWork[work.id] ?? defaultDiscount ?? 0;
    ***REMOVED***);
    setLocalTaxes(initialTaxes);
  ***REMOVED***, [traditionalWorks, taxesPerWork, defaultDiscount]);

  // Effect to detect changes (Dirty Checking)
  useEffect(() => ***REMOVED***
    // 1. Check if default changed
    const defaultChanged = defaultTax !== (defaultDiscount || 0);

    // 2. Check if any specific tax changed
    const localTaxesChanged = traditionalWorks.some(work => ***REMOVED***
      const originalValue = taxesPerWork[work.id] ?? defaultDiscount ?? 0;
      const currentValue = localTaxes[work.id];
      // We compare values (we use == to be tolerant with strings/numbers if it happens, 
      // although here we force number in the input)
      return originalValue !== currentValue;
    ***REMOVED***);

    const isDirty = defaultChanged || localTaxesChanged;
    setHasChanges(isDirty);

    // If the user edits again, hide the success message
    if (isDirty && showSuccess) ***REMOVED***
      setShowSuccess(false);
    ***REMOVED***

  ***REMOVED***, [defaultTax, localTaxes, defaultDiscount, taxesPerWork, traditionalWorks, showSuccess]);

  const handleLocalTaxChange = (jobId, value) => ***REMOVED***
    setLocalTaxes(prev => (***REMOVED***
      ...prev,
      [jobId]: value,
    ***REMOVED***));
  ***REMOVED***;

  const handleSave = async () => ***REMOVED***
    try ***REMOVED***
      setLoading(true);
      await savePreferences(***REMOVED*** 
        defaultTax: defaultTax,
        taxesPerWork: localTaxes
      ***REMOVED***);
      
      // Show success
      setShowSuccess(true);
      setHasChanges(false); // Assume successful save
      onSuccess?.('Tax settings saved successfully');

      // Hide success message after 3s
      setTimeout(() => ***REMOVED***
        setShowSuccess(false);
      ***REMOVED***, 3000);

    ***REMOVED*** catch (error) ***REMOVED***
      onError?.('Error saving settings: ' + error.message);
    ***REMOVED*** finally ***REMOVED***
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;

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
    <SettingsSection icon=***REMOVED***Receipt***REMOVED*** title="Payment and Tax Settings" className=***REMOVED***className***REMOVED***>
      <div className="space-y-5">

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700">
              Tax / Deductions Percentage (Default)
            </label>
            
            <Popover 
              content=***REMOVED***popoverContent***REMOVED*** 
              title="What are these taxes?"
              position="top"
              trigger="click"
            >
              <button className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors focus:outline-none">
                <Info size=***REMOVED***14***REMOVED*** />
                <span>What should I put here?</span>
              </button>
            </Popover>
          </div>

          <div className="relative">
            <div className="flex rounded-md shadow-sm">
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value=***REMOVED***defaultTax***REMOVED***
                onChange=***REMOVED***(e) => setDefaultTax(Number(e.target.value))***REMOVED***
                className="flex-1 px-3 py-2.5 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all text-gray-900 font-medium"
                style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary, borderColor: loading ? 'transparent' : '' ***REMOVED******REMOVED***
                placeholder="e.g.: 15"
              />
              <span className="inline-flex items-center px-4 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 font-medium">
                %
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              This value will be applied by default if you do not specify one for a specific job.
            </p>
          </div>
        </div>

        ***REMOVED***showMultiRate && traditionalWorks.length > 1 && (
          <div className="space-y-4 pt-4 border-t animate-in fade-in slide-in-from-top-2">
            <h3 className="text-md font-semibold text-gray-800">Taxes per Job</h3>
            ***REMOVED***traditionalWorks.map(work => (
              <div key=***REMOVED***work.id***REMOVED*** className="flex items-center gap-4">
                <WorkAvatar name=***REMOVED***work.name***REMOVED*** color=***REMOVED***work.color***REMOVED*** size="md" />
                <div className="flex-1">
                  <span className="font-medium text-gray-700">***REMOVED***work.name***REMOVED***</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value=***REMOVED***localTaxes[work.id] || 0***REMOVED***
                    onChange=***REMOVED***(e) => handleLocalTaxChange(work.id, Number(e.target.value))***REMOVED***
                    className="w-24 px-2 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-center"
                    style=***REMOVED******REMOVED***'--tw-ring-color': colors.primary***REMOVED******REMOVED***
                    placeholder="e.g.: 15"
                  />
                  <span className="text-gray-500 font-medium">%</span>
                </div>
              </div>
            ))***REMOVED***
          </div>
        )***REMOVED***
        
        <div className="pt-4 flex flex-wrap items-center gap-4">
          <Button
            onClick=***REMOVED***handleSave***REMOVED***
            disabled=***REMOVED***loading || !hasChanges***REMOVED***
            loading=***REMOVED***loading***REMOVED***
            className="w-full sm:w-auto min-w-[180px]"
            themeColor=***REMOVED***colors.primary***REMOVED***
            icon=***REMOVED***showSuccess ? Check : undefined***REMOVED***
          >
            ***REMOVED***loading ? 'Saving...' : 
             showSuccess ? 'Saved successfully' :
             hasChanges ? 'Save Preferences' : 'No changes'***REMOVED***
          </Button>

          ***REMOVED***traditionalWorks.length > 1 && (
            <Button
              onClick=***REMOVED***() => setShowMultiRate(prev => !prev)***REMOVED***
              variant="outline"
              themeColor=***REMOVED***colors.primary***REMOVED***
              className="w-full sm:w-auto"
            >
              ***REMOVED***showMultiRate ? 'Hide per-job settings' : 'Adjust per job'***REMOVED***
            </Button>
          )***REMOVED***
        </div>
      </div>
    </SettingsSection>
  );
***REMOVED***;

export default PreferencesSection;