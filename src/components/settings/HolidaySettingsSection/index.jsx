// src/components/settings/HolidaySettingsSection/index.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Check, MapPin, Loader } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';
import Toggle from '../../ui/Toggle';
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
    useAutoHolidays,
    savePreferences
  } = useApp();

  const colors = useThemeColors();

  // Data states
  const [autoDetect, setAutoDetect] = useState(useAutoHolidays || false);
  const [selectedCountry, setSelectedCountry] = useState(holidayCountry || '');
  const [selectedRegion, setSelectedRegion] = useState(holidayRegion || '');

  // UI/Feedback states
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  // Get available countries and regions
  const countries = useMemo(() => getAvailableCountries(), []);
  const regions = useMemo(() => {
    if (!selectedCountry) return [];
    return getAvailableRegions(selectedCountry);
  }, [selectedCountry]);

  // Initialize local state when context changes
  useEffect(() => {
    setAutoDetect(useAutoHolidays || false);
    setSelectedCountry(holidayCountry || '');
    setSelectedRegion(holidayRegion || '');
  }, [useAutoHolidays, holidayCountry, holidayRegion]);

  // Detect changes
  useEffect(() => {
    const autoDetectChanged = autoDetect !== (useAutoHolidays || false);
    const countryChanged = selectedCountry !== (holidayCountry || '');
    const regionChanged = selectedRegion !== (holidayRegion || '');

    const isDirty = autoDetectChanged || countryChanged || regionChanged;
    setHasChanges(isDirty);

    if (isDirty && showSuccess) {
      setShowSuccess(false);
    }
  }, [autoDetect, selectedCountry, selectedRegion, useAutoHolidays, holidayCountry, holidayRegion, showSuccess]);

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

  const handleAutoDetectChange = (value) => {
    setAutoDetect(value);
    // If turning off auto-detect, clear country and region
    if (!value) {
      setSelectedCountry('');
      setSelectedRegion('');
    }
  };

  const handleUseLocation = async () => {
    try {
      setDetectingLocation(true);
      const location = await detectUserLocation();

      if (location.country && isCountrySupported(location.country)) {
        setSelectedCountry(location.country);
        setAutoDetect(true);
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

  const handleSave = async () => {
    // Validate that if auto-detect is enabled, a country is selected
    if (autoDetect && !selectedCountry) {
      onError?.('Please select a country to enable automatic holiday detection');
      return;
    }

    try {
      setLoading(true);
      await savePreferences({
        useAutoHolidays: autoDetect,
        holidayCountry: autoDetect ? selectedCountry : null,
        holidayRegion: autoDetect && selectedRegion ? selectedRegion : null,
      });

      setShowSuccess(true);
      setHasChanges(false);
      onSuccess?.('Holiday settings saved successfully');

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Error saving holiday settings:', error);
      onError?.('Error saving settings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsSection icon={Calendar} title="Holiday Detection" className={className}>
      <div className="space-y-4">

        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[rgba(255,255,255,0.05)] rounded-lg">
          <div className="flex-1 pr-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Automatic Holiday Detection
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Automatically apply holiday rates on public holidays
            </p>
          </div>
          <Toggle
            checked={autoDetect}
            onChange={handleAutoDetectChange}
            disabled={loading}
          />
        </div>

        {autoDetect && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">

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

            {/* Country Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Country *
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
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Select your country to detect public holidays
              </p>
            </div>

            {/* Region Selector (only if country has regions) */}
            {selectedCountry && regions.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  State / Province (Optional)
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                  style={{ '--tw-ring-color': colors.primary }}
                  disabled={loading}
                >
                  <option value="">No specific region</option>
                  {regions.map((region) => (
                    <option key={region.code} value={region.code}>
                      {region.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Some regions have specific holidays
                </p>
              </div>
            )}

            {/* Info message */}
            {selectedCountry && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Holiday rates will be automatically applied when you work on public holidays in{' '}
                  <strong>{countries.find(c => c.code === selectedCountry)?.name}</strong>
                  {selectedRegion && regions.find(r => r.code === selectedRegion) && (
                    <>, {regions.find(r => r.code === selectedRegion)?.name}</>
                  )}
                  .
                </p>
              </div>
            )}
          </div>
        )}

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={loading || !hasChanges || (autoDetect && !selectedCountry)}
          loading={loading}
          className="w-full mt-4"
          themeColor={colors.primary}
          icon={showSuccess ? Check : undefined}
        >
          {loading ? 'Saving...' :
           showSuccess ? 'Saved correctly' :
           hasChanges ? 'Save holiday settings' : 'No changes'}
        </Button>
      </div>
    </SettingsSection>
  );
};

export default HolidaySettingsSection;
