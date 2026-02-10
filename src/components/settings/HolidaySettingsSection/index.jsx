// src/components/settings/HolidaySettingsSection/index.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Check, MapPin, Loader, ChevronDown } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';
import {
  getAvailableCountries,
  getAvailableRegions,
  detectUserLocation,
  isCountrySupported
} from '../../../services/holidayService';

const HolidaySettingsSection = ({ onError, onSuccess, className }) => {
  const {
    holidayCountry,
    holidayRegion,
    savePreferences
  } = useApp();

  const colors = useThemeColors();

  // Data states
  const [selectedCountry, setSelectedCountry] = useState(holidayCountry || '');
  const [selectedRegion, setSelectedRegion] = useState(holidayRegion || '');

  // UI/Feedback states
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [showManualInputs, setShowManualInputs] = useState(false);

  // Get available countries and regions
  const countries = useMemo(() => getAvailableCountries(), []);
  const regions = useMemo(() => {
    if (!selectedCountry) return [];
    return getAvailableRegions(selectedCountry);
  }, [selectedCountry]);

  // Initialize local state when context changes
  useEffect(() => {
    setSelectedCountry(holidayCountry || '');
    setSelectedRegion(holidayRegion || '');
    // Auto-expand if country is already selected
    if (holidayCountry) {
      setShowManualInputs(true);
    }
  }, [holidayCountry, holidayRegion]);

  // Detect changes
  useEffect(() => {
    const countryChanged = selectedCountry !== (holidayCountry || '');
    const regionChanged = selectedRegion !== (holidayRegion || '');

    const isDirty = countryChanged || regionChanged;
    setHasChanges(isDirty);

    if (isDirty && showSuccess) {
      setShowSuccess(false);
    }
  }, [selectedCountry, selectedRegion, holidayCountry, holidayRegion, showSuccess]);

  // When country changes, reset region if it's not valid for the new country
  useEffect(() => {
    if (selectedCountry && selectedRegion) {
      const validRegions = getAvailableRegions(selectedCountry);
      const isValidRegion = validRegions.some(r => r.code === selectedRegion);
      if (!isValidRegion) {
        setSelectedRegion('');
      }
    }
  }, [selectedCountry, selectedRegion]);

  // Auto-save when country or region changes
  useEffect(() => {
    const autoSave = async () => {
      // Only save if there are actual changes
      if (!hasChanges) return;

      try {
        setLoading(true);

        // Auto-detect is enabled if a country is selected
        const autoDetectEnabled = !!selectedCountry;

        await savePreferences({
          useAutoHolidays: autoDetectEnabled,
          holidayCountry: selectedCountry || null,
          holidayRegion: selectedRegion || null,
        });

        setShowSuccess(true);
        setHasChanges(false);

        setTimeout(() => {
          setShowSuccess(false);
        }, 2000);

      } catch (error) {
        console.error('Error saving holiday settings:', error);
        onError?.('Error saving settings: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    // Debounce auto-save to avoid too many writes
    const timeoutId = setTimeout(() => {
      autoSave();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [selectedCountry, selectedRegion, hasChanges, savePreferences, onError]);

  const handleUseLocation = async () => {
    try {
      setDetectingLocation(true);
      const location = await detectUserLocation();

      if (location.country && isCountrySupported(location.country)) {
        setSelectedCountry(location.country);
        onSuccess?.(`Location detected: ${location.country}`);
      } else {
        onError?.('Could not detect a supported country from your location');
      }
    } catch (error) {
      console.error('Error detecting location:', error);
      onError?.('Error accessing location. Please check browser permissions.');
    } finally {
      setDetectingLocation(false);
    }
  };

  return (
    <SettingsSection icon={Calendar} title="Holiday Detection" className={className}>
      <div className="space-y-4">

        {/* Location Button */}
        <Button
          onClick={handleUseLocation}
          disabled={detectingLocation || loading}
          loading={detectingLocation}
          variant="outline"
          className="w-full"
          icon={detectingLocation ? Loader : MapPin}
          themeColor={colors.primary}
        >
          {detectingLocation ? 'Detecting location...' : 'Use my location'}
        </Button>

        {/* Explanatory Text */}
        <p className="text-sm text-gray-400 dark:text-gray-400 text-center">
          We will use your location to determine holiday days and perform calculations correctly.
        </p>

        {/* Enter Manually Collapsible Button */}
        <button
          onClick={() => setShowManualInputs(!showManualInputs)}
          className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 pt-2 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <span>Enter manually</span>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-200 ${showManualInputs ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Country and Region Selectors - Collapsible */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden transition-all duration-300 ${
            showManualInputs ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {/* Country Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
              style={{ '--tw-ring-color': colors.primary }}
              disabled={loading}
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Region Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              State / Province
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
              style={{ '--tw-ring-color': colors.primary }}
              disabled={loading || !selectedCountry || regions.length === 0}
            >
              <option value="">No specific region</option>
              {regions.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Success Indicator */}
        {showSuccess && (
          <div className="flex items-center justify-center text-sm text-green-600 dark:text-green-400">
            <Check size={16} className="mr-1" />
            <span>Settings saved</span>
          </div>
        )}
      </div>
    </SettingsSection>
  );
};

export default HolidaySettingsSection;
