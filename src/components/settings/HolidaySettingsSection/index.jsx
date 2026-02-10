// src/components/settings/HolidaySettingsSection/index.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Check, MapPin, Loader } from 'lucide-react';
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
    useAutoHolidays,
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

  const handleSave = async () => {
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

        {/* Country and Region Selectors - Same line */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={loading || !hasChanges}
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
