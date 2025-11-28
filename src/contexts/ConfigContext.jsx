import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import * as firebaseService from '../services/firebaseService';
import { generateColorVariations } from '../utils/colorUtils';

const ConfigContext = createContext();

export const useConfigContext = () => {
  return useContext(ConfigContext);
};

export const ConfigProvider = ({ children }) => {
  const { currentUser } = useAuth();

  // Estados de preferencias de personalizacion y configuracion
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [primaryColor, setPrimaryColor] = useState('#EC4899');
  const [userEmoji, setUserEmoji] = useState('😊');
  const [defaultDiscount, setDefaultDiscount] = useState(15);
  const [weeklyHoursGoal, setWeeklyHoursGoal] = useState(null);
  const [deliveryEnabled, setDeliveryEnabled] = useState(false);
  const [smokoEnabled, setSmokoEnabled] = useState(false);
  const [smokoMinutes, setSmokoMinutes] = useState(30);
  const [shiftRanges, setShiftRanges] = useState({
    dayStart: 6,
    dayEnd: 14,
    afternoonStart: 14,
    afternoonEnd: 20,
    nightStart: 20
  });

  // Cargar la configuracion inicial del usuario desde Firebase
  useEffect(() => {
    const loadConfig = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          const settings = await firebaseService.ensureUserDocument(currentUser);
          if (settings) {
            setPrimaryColor(settings.colorPrincipal);
            setUserEmoji(settings.emojiUsuario);
            setDefaultDiscount(settings.descuentoDefault);
            setWeeklyHoursGoal(settings.metaHorasSemanales);
            setDeliveryEnabled(settings.deliveryEnabled);
            setSmokoEnabled(settings.smokoEnabled || false);
            setSmokoMinutes(settings.smokoMinutes || 30);
            setShiftRanges(settings.rangosTurnos);
          }
        } catch (err) {
          console.error("Error cargando la configuración del usuario:", err);
          setError("Error al cargar la configuración: " + err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    loadConfig();
  }, [currentUser]);

  // Genera variaciones de color basadas en el color principal
  const thematicColors = useMemo(() => {
    return generateColorVariations(primaryColor);
  }, [primaryColor]);

  // Guardar preferencias de usuario
  const savePreferences = useCallback(async (preferences) => {
    if (!currentUser) throw new Error("Usuario no autenticado");
    try {
      // Optimistic update
      if (preferences.colorPrincipal !== undefined) setPrimaryColor(preferences.colorPrincipal);
      if (preferences.emojiUsuario !== undefined) setUserEmoji(preferences.emojiUsuario);
      if (preferences.descuentoDefault !== undefined) setDefaultDiscount(preferences.descuentoDefault);
      if (preferences.rangosTurnos !== undefined) setShiftRanges(preferences.rangosTurnos);
      if (preferences.deliveryEnabled !== undefined) setDeliveryEnabled(preferences.deliveryEnabled);
      if (preferences.metaHorasSemanales !== undefined) setWeeklyHoursGoal(preferences.metaHorasSemanales);
      if (preferences.smokoEnabled !== undefined) setSmokoEnabled(preferences.smokoEnabled);
      if (preferences.smokoMinutes !== undefined) setSmokoMinutes(preferences.smokoMinutes);
      
      await firebaseService.savePreferences(currentUser.uid, preferences);
    } catch (err) {
      console.error("Error guardando preferencias:", err);
      setError("Error al guardar preferencias: " + err.message);
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
    weeklyHoursGoal,
    deliveryEnabled,
    smokoEnabled,
    smokoMinutes,
    shiftRanges,
    thematicColors,
    savePreferences,
    // Note: updateWeeklyHoursGoal can be merged into savePreferences
    updateWeeklyHoursGoal: (goal) => savePreferences({ metaHorasSemanales: goal }),
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};