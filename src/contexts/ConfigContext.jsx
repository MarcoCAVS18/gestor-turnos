// src/contexts/ConfigContext.jsx

import React, ***REMOVED*** createContext, useContext, useState, useEffect, useCallback, useMemo ***REMOVED*** from 'react';
import ***REMOVED*** useAuth ***REMOVED*** from './AuthContext';
import * as firebaseService from '../services/firebaseService';
import ***REMOVED*** generateColorVariations ***REMOVED*** from '../utils/colorUtils';

const ConfigContext = createContext();

export const useConfigContext = () => ***REMOVED***
  return useContext(ConfigContext);
***REMOVED***;

export const ConfigProvider = (***REMOVED*** children ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** currentUser ***REMOVED*** = useAuth();

  // Personalization preference and configuration states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [primaryColor, setPrimaryColor] = useState('#EC4899');
  const [userEmoji, setUserEmoji] = useState('😊');
  const [defaultDiscount, setDefaultDiscount] = useState(15);
  const [taxesPerWork, setTaxesPerWork] = useState(***REMOVED******REMOVED***);
  const [weeklyHoursGoal, setWeeklyHoursGoal] = useState(null);
  const [deliveryEnabled, setDeliveryEnabled] = useState(false);
  const [smokoEnabled, setSmokoEnabled] = useState(false);
  const [smokoMinutes, setSmokoMinutes] = useState(30);
  const [shiftRanges, setShiftRanges] = useState(***REMOVED***
    dayStart: 6,
    dayEnd: 14,
    afternoonStart: 14,
    afternoonEnd: 20,
    nightStart: 20
  ***REMOVED***);

  // Load initial user configuration from Firebase
  useEffect(() => ***REMOVED***
    const loadConfig = async () => ***REMOVED***
      if (currentUser) ***REMOVED***
        try ***REMOVED***
          setLoading(true);
          const settings = await firebaseService.ensureUserDocument(currentUser);
          if (settings) ***REMOVED***
            setPrimaryColor(settings.primaryColor);
            setUserEmoji(settings.userEmoji);
            setDefaultDiscount(settings.defaultDiscount);
            setTaxesPerWork(settings.taxesPerWork || ***REMOVED******REMOVED***);
            setWeeklyHoursGoal(settings.weeklyHoursGoal);
            setDeliveryEnabled(settings.deliveryEnabled);
            setSmokoEnabled(settings.smokoEnabled || false);
            setSmokoMinutes(settings.smokoMinutes || 30);
            setShiftRanges(settings.shiftRanges);
          ***REMOVED***
        ***REMOVED*** catch (err) ***REMOVED***
          console.error("Error loading user configuration:", err);
          setError("Error loading configuration: " + err.message);
        ***REMOVED*** finally ***REMOVED***
          setLoading(false);
        ***REMOVED***
      ***REMOVED*** else ***REMOVED***
        setLoading(false);
      ***REMOVED***
    ***REMOVED***;
    loadConfig();
  ***REMOVED***, [currentUser]);

  // Generates color variations based on the primary color
  const thematicColors = useMemo(() => ***REMOVED***
    return generateColorVariations(primaryColor);
  ***REMOVED***, [primaryColor]);

  // Save user preferences
  const savePreferences = useCallback(async (preferences) => ***REMOVED***
    if (!currentUser) throw new Error("Unauthenticated user");
    try ***REMOVED***
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
      
      await firebaseService.savePreferences(currentUser.uid, preferences);
    ***REMOVED*** catch (err) ***REMOVED***
      console.error("Error saving preferences:", err);
      setError("Error saving preferences: " + err.message);
      // TODO: Implement rollback logic for optimistic update
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  const value = ***REMOVED***
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
    shiftRanges,
    thematicColors,
    savePreferences,
    // Note: updateWeeklyHoursGoal can be merged into savePreferences
    updateWeeklyHoursGoal: (goal) => savePreferences(***REMOVED*** weeklyHoursGoal: goal ***REMOVED***),
  ***REMOVED***;

  return <ConfigContext.Provider value=***REMOVED***value***REMOVED***>***REMOVED***children***REMOVED***</ConfigContext.Provider>;
***REMOVED***;