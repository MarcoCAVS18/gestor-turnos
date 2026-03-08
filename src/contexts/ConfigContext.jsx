// src/contexts/ConfigContext.jsx

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { usePremium } from './PremiumContext';
import * as firebaseService from '../services/firebaseService';
import { generateColorVariations } from '../utils/colorUtils';
import { DELIVERY_PLATFORMS_AUSTRALIA } from '../constants/delivery';
import { isCountrySupported } from '../services/holidayService';
import logger from '../utils/logger';
import i18n from '../i18n';

const ConfigContext = createContext();

export const useConfigContext = () => {
  return useContext(ConfigContext);
};

// Read cached value from localStorage (sync, no flash)
const getCachedValue = (key, fallback) => {
  try {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : fallback;
  } catch {
    return fallback;
  }
};

export const ConfigProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { isPremium, loading: premiumLoading } = usePremium();

  // Personalization preference and configuration states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [primaryColor, setPrimaryColor] = useState(() => getCachedValue('orary_primaryColor', '#EC4899'));
  const [language, setLanguage] = useState(() => getCachedValue('orary_language', 'en'));
  const [defaultDiscount, setDefaultDiscount] = useState(15);
  const [taxesPerWork, setTaxesPerWork] = useState({});
  const [weeklyHoursGoal, setWeeklyHoursGoal] = useState(null);
  const [deliveryEnabled, setDeliveryEnabled] = useState(false);
  const [smokoEnabled, setSmokoEnabled] = useState(false);
  const [smokoMinutes, setSmokoMinutes] = useState(30);
  const [themeMode, setThemeMode] = useState(() => getCachedValue('orary_themeMode', 'light'));
  const [deliveryPlatforms, setDeliveryPlatforms] = useState(DELIVERY_PLATFORMS_AUSTRALIA);
  const [defaultDeliveryPlatform, setDefaultDeliveryPlatform] = useState(null);
  const [shiftRanges, setShiftRanges] = useState({
    dayStart: 6,
    dayEnd: 14,
    afternoonStart: 14,
    afternoonEnd: 20,
    nightStart: 20
  });
  const [holidayCountry, setHolidayCountry] = useState(null);
  const [holidayRegion, setHolidayRegion] = useState(null);
  const [useAutoHolidays, setUseAutoHolidays] = useState(false);
  const [geoDetectionDone, setGeoDetectionDone] = useState(false);
  const [australia88VisaYear, setAustralia88VisaYear] = useState(1);
  const [australia88ManualDays, setAustralia88ManualDays] = useState(0);

  // Load initial user configuration from Firebase
  useEffect(() => {
    const loadConfig = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          const settings = await firebaseService.ensureUserDocument(currentUser);
          if (settings) {
            setPrimaryColor(settings.primaryColor);
            const lang = settings.language || 'en';
            setLanguage(lang);
            i18n.changeLanguage(lang);
            setDefaultDiscount(settings.defaultDiscount);
            setTaxesPerWork(settings.taxesPerWork || {});
            setWeeklyHoursGoal(settings.weeklyHoursGoal);
            setDeliveryEnabled(settings.deliveryEnabled);
            setSmokoEnabled(settings.smokoEnabled || false);
            setSmokoMinutes(settings.smokoMinutes || 30);
            setDeliveryPlatforms(settings.deliveryPlatforms?.length > 0 ? settings.deliveryPlatforms : DELIVERY_PLATFORMS_AUSTRALIA);
            setDefaultDeliveryPlatform(settings.defaultDeliveryPlatform || null);
            // Firebase wins over localStorage so that theme syncs across devices.
            // localStorage is kept as fallback for users whose themeMode was not yet persisted.
            const cachedTheme = getCachedValue('orary_themeMode', null);
            setThemeMode(settings.themeMode ?? cachedTheme ?? 'light');
            if (settings.shiftRanges) setShiftRanges(settings.shiftRanges);
            setHolidayCountry(settings.holidayCountry || null);
            setHolidayRegion(settings.holidayRegion || null);
            setUseAutoHolidays(settings.useAutoHolidays || false);
            setAustralia88VisaYear(settings.australia88VisaYear ?? 1);
            setAustralia88ManualDays(settings.australia88ManualDays ?? 0);
          }
        } catch (err) {
          logger.error("Error loading user configuration:", err);
          setError("Error loading configuration: " + err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    loadConfig();
  }, [currentUser]);

  // Cache primaryColor, themeMode, and language in localStorage to prevent flash on reload
  useEffect(() => {
    try { localStorage.setItem('orary_primaryColor', JSON.stringify(primaryColor)); } catch {}
  }, [primaryColor]);

  useEffect(() => {
    try { localStorage.setItem('orary_themeMode', JSON.stringify(themeMode)); } catch {}
  }, [themeMode]);

  useEffect(() => {
    try { localStorage.setItem('orary_language', JSON.stringify(language)); } catch {}
  }, [language]);

  // Apply theme mode to document body.
  // Dark mode is a premium feature — only add the class when user is verified premium.
  // Cleanup removes the dark class when ConfigProvider unmounts (user logs out).
  useEffect(() => {
    if (isPremium && themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, [themeMode, isPremium]);

  // When premium is confirmed lost (subscription expired/cancelled), reset dark mode.
  // Clears state, localStorage, and Firestore so it doesn't persist.
  useEffect(() => {
    if (premiumLoading) return;
    if (!isPremium && themeMode === 'dark') {
      setThemeMode('light');
      try { localStorage.setItem('orary_themeMode', JSON.stringify('light')); } catch {}
      if (currentUser) {
        firebaseService.savePreferences(currentUser.uid, { themeMode: 'light' }).catch(() => {});
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPremium, premiumLoading]);

  // Generates color variations based on the primary color
  const thematicColors = useMemo(() => {
    return generateColorVariations(primaryColor);
  }, [primaryColor]);

  // Save user preferences
  const savePreferences = useCallback(async (preferences) => {
    if (!currentUser) throw new Error("Unauthenticated user");
    try {
      // Optimistic update
      if (preferences.primaryColor !== undefined) setPrimaryColor(preferences.primaryColor);
      if (preferences.language !== undefined) {
        setLanguage(preferences.language);
        i18n.changeLanguage(preferences.language);
      }
      if (preferences.defaultDiscount !== undefined) setDefaultDiscount(preferences.defaultDiscount);
      if (preferences.taxesPerWork !== undefined) setTaxesPerWork(preferences.taxesPerWork);
      if (preferences.shiftRanges !== undefined) setShiftRanges(preferences.shiftRanges);
      if (preferences.deliveryEnabled !== undefined) setDeliveryEnabled(preferences.deliveryEnabled);
      if (preferences.weeklyHoursGoal !== undefined) setWeeklyHoursGoal(preferences.weeklyHoursGoal);
      if (preferences.smokoEnabled !== undefined) setSmokoEnabled(preferences.smokoEnabled);
      if (preferences.smokoMinutes !== undefined) setSmokoMinutes(preferences.smokoMinutes);
      if (preferences.themeMode !== undefined && (preferences.themeMode !== 'dark' || isPremium)) {
        setThemeMode(preferences.themeMode);
      }
      if (preferences.deliveryPlatforms !== undefined) setDeliveryPlatforms(preferences.deliveryPlatforms);
      if (preferences.defaultDeliveryPlatform !== undefined) setDefaultDeliveryPlatform(preferences.defaultDeliveryPlatform);
      if (preferences.holidayCountry !== undefined) setHolidayCountry(preferences.holidayCountry);
      if (preferences.holidayRegion !== undefined) setHolidayRegion(preferences.holidayRegion);
      if (preferences.useAutoHolidays !== undefined) setUseAutoHolidays(preferences.useAutoHolidays);
      if (preferences.australia88VisaYear !== undefined) setAustralia88VisaYear(preferences.australia88VisaYear);
      if (preferences.australia88ManualDays !== undefined) setAustralia88ManualDays(preferences.australia88ManualDays);

      const safePreferences = { ...preferences };
      if (safePreferences.themeMode === 'dark' && !isPremium) {
        delete safePreferences.themeMode;
      }
      await firebaseService.savePreferences(currentUser.uid, safePreferences);
    } catch (err) {
      logger.error("Error saving preferences:", err);
      setError("Error saving preferences: " + err.message);
      // TODO: Implement rollback logic for optimistic update
      throw err;
    }
  }, [currentUser, isPremium]);

  // Detects if user is in Australia via geolocation and sets holidayCountry = 'AU'.
  // Called once after the welcome demo is dismissed. Silently skipped if already set
  // or if the user denies geolocation permission.
  const requestAustraliaGeodetection = useCallback(async () => {
    if (holidayCountry || geoDetectionDone) return;
    setGeoDetectionDone(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 });
      });
      const { latitude, longitude } = position.coords;
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await res.json();
      const detectedCountry = data.countryCode || null;
      if (detectedCountry && isCountrySupported(detectedCountry)) {
        let detectedRegion = null;
        if (data.principalSubdivisionCode) {
          const prefix = `${detectedCountry}-`;
          detectedRegion = data.principalSubdivisionCode.startsWith(prefix)
            ? data.principalSubdivisionCode.slice(prefix.length)
            : data.principalSubdivisionCode;
        }
        await savePreferences({
          holidayCountry: detectedCountry,
          holidayRegion: detectedRegion || null,
        });
      }
    } catch {
      // User denied geolocation or network error — silently ignore
    }
  }, [holidayCountry, geoDetectionDone, savePreferences]);

  const value = {
    loading,
    error,
    primaryColor,
    language,
    defaultDiscount,
    taxesPerWork,
    weeklyHoursGoal,
    deliveryEnabled,
    smokoEnabled,
    smokoMinutes,
    themeMode,
    deliveryPlatforms,
    defaultDeliveryPlatform,
    shiftRanges,
    holidayCountry,
    holidayRegion,
    useAutoHolidays,
    australia88VisaYear,
    australia88ManualDays,
    thematicColors,
    savePreferences,
    requestAustraliaGeodetection,
    // Note: updateWeeklyHoursGoal can be merged into savePreferences
    updateWeeklyHoursGoal: (goal) => savePreferences({ weeklyHoursGoal: goal }),
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};
