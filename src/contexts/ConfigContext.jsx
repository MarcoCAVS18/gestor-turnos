// src/contexts/ConfigContext.jsx

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import * as firebaseService from '../services/firebaseService';
import { generateColorVariations } from '../utils/colorUtils';
import { DELIVERY_PLATFORMS_AUSTRALIA } from '../constants/delivery';

const ConfigContext = createContext();

export const useConfigContext = () => {
  return useContext(ConfigContext);
};

export const ConfigProvider = ({ children }) => {
  const { currentUser } = useAuth();

  // Personalization preference and configuration states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [primaryColor, setPrimaryColor] = useState('#EC4899');
  const [userEmoji, setUserEmoji] = useState('😊');
  const [defaultDiscount, setDefaultDiscount] = useState(15);
  const [taxesPerWork, setTaxesPerWork] = useState({});
  const [weeklyHoursGoal, setWeeklyHoursGoal] = useState(null);
  const [deliveryEnabled, setDeliveryEnabled] = useState(false);
  const [smokoEnabled, setSmokoEnabled] = useState(false);
  const [smokoMinutes, setSmokoMinutes] = useState(30);
  const [deliveryPlatforms, setDeliveryPlatforms] = useState(DELIVERY_PLATFORMS_AUSTRALIA);
  const [defaultDeliveryPlatform, setDefaultDeliveryPlatform] = useState(null);
  const [shiftRanges, setShiftRanges] = useState({
    dayStart: 6,
    dayEnd: 14,
    afternoonStart: 14,
    afternoonEnd: 20,
    nightStart: 20
  });

  // Load initial user configuration from Firebase
  useEffect(() => {
    const loadConfig = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          const settings = await firebaseService.ensureUserDocument(currentUser);
          if (settings) {
            setPrimaryColor(settings.primaryColor);
            setUserEmoji(settings.userEmoji);
            setDefaultDiscount(settings.defaultDiscount);
            setTaxesPerWork(settings.taxesPerWork || {});
            setWeeklyHoursGoal(settings.weeklyHoursGoal);
            setDeliveryEnabled(settings.deliveryEnabled);
            setSmokoEnabled(settings.smokoEnabled || false);
            setSmokoMinutes(settings.smokoMinutes || 30);
            setDeliveryPlatforms(settings.deliveryPlatforms?.length > 0 ? settings.deliveryPlatforms : DELIVERY_PLATFORMS_AUSTRALIA);
            setDefaultDeliveryPlatform(settings.defaultDeliveryPlatform || null);
            setShiftRanges(settings.shiftRanges);
          }
        } catch (err) {
          console.error("Error loading user configuration:", err);
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
      if (preferences.userEmoji !== undefined) setUserEmoji(preferences.userEmoji);
      if (preferences.defaultDiscount !== undefined) setDefaultDiscount(preferences.defaultDiscount);
      if (preferences.taxesPerWork !== undefined) setTaxesPerWork(preferences.taxesPerWork);
      if (preferences.shiftRanges !== undefined) setShiftRanges(preferences.shiftRanges);
      if (preferences.deliveryEnabled !== undefined) setDeliveryEnabled(preferences.deliveryEnabled);
      if (preferences.weeklyHoursGoal !== undefined) setWeeklyHoursGoal(preferences.weeklyHoursGoal);
      if (preferences.smokoEnabled !== undefined) setSmokoEnabled(preferences.smokoEnabled);
      if (preferences.smokoMinutes !== undefined) setSmokoMinutes(preferences.smokoMinutes);
      if (preferences.deliveryPlatforms !== undefined) setDeliveryPlatforms(preferences.deliveryPlatforms);
      if (preferences.defaultDeliveryPlatform !== undefined) setDefaultDeliveryPlatform(preferences.defaultDeliveryPlatform);

      await firebaseService.savePreferences(currentUser.uid, preferences);
    } catch (err) {
      console.error("Error saving preferences:", err);
      setError("Error saving preferences: " + err.message);
      // TODO: Implement rollback logic for optimistic update
      throw err;
    }
  }, [currentUser]);

  const value = {
    loading,
    error,
    primaryColor,
    userEmoji,
    defaultDiscount,
    taxesPerWork,
    weeklyHoursGoal,
    deliveryEnabled,
    smokoEnabled,
    smokoMinutes,
    deliveryPlatforms,
    defaultDeliveryPlatform,
    shiftRanges,
    thematicColors,
    savePreferences,
    // Note: updateWeeklyHoursGoal can be merged into savePreferences
    updateWeeklyHoursGoal: (goal) => savePreferences({ weeklyHoursGoal: goal }),
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};