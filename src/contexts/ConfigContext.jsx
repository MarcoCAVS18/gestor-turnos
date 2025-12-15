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

  // Estados de preferencias de personalizacion y configuracion
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [primaryColor, setPrimaryColor] = useState('#EC4899');
  const [userEmoji, setUserEmoji] = useState('😊');
  const [defaultDiscount, setDefaultDiscount] = useState(15);
  const [impuestosPorTrabajo, setImpuestosPorTrabajo] = useState(***REMOVED******REMOVED***);
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

  // Cargar la configuracion inicial del usuario desde Firebase
  useEffect(() => ***REMOVED***
    const loadConfig = async () => ***REMOVED***
      if (currentUser) ***REMOVED***
        try ***REMOVED***
          setLoading(true);
          const settings = await firebaseService.ensureUserDocument(currentUser);
          if (settings) ***REMOVED***
            setPrimaryColor(settings.colorPrincipal);
            setUserEmoji(settings.emojiUsuario);
            setDefaultDiscount(settings.descuentoDefault);
            setImpuestosPorTrabajo(settings.impuestosPorTrabajo || ***REMOVED******REMOVED***);
            setWeeklyHoursGoal(settings.metaHorasSemanales);
            setDeliveryEnabled(settings.deliveryEnabled);
            setSmokoEnabled(settings.smokoEnabled || false);
            setSmokoMinutes(settings.smokoMinutes || 30);
            setShiftRanges(settings.rangosTurnos);
          ***REMOVED***
        ***REMOVED*** catch (err) ***REMOVED***
          console.error("Error cargando la configuración del usuario:", err);
          setError("Error al cargar la configuración: " + err.message);
        ***REMOVED*** finally ***REMOVED***
          setLoading(false);
        ***REMOVED***
      ***REMOVED*** else ***REMOVED***
        setLoading(false);
      ***REMOVED***
    ***REMOVED***;
    loadConfig();
  ***REMOVED***, [currentUser]);

  // Genera variaciones de color basadas en el color principal
  const thematicColors = useMemo(() => ***REMOVED***
    return generateColorVariations(primaryColor);
  ***REMOVED***, [primaryColor]);

  // Guardar preferencias de usuario
  const savePreferences = useCallback(async (preferences) => ***REMOVED***
    if (!currentUser) throw new Error("Usuario no autenticado");
    try ***REMOVED***
      // Optimistic update
      if (preferences.colorPrincipal !== undefined) setPrimaryColor(preferences.colorPrincipal);
      if (preferences.emojiUsuario !== undefined) setUserEmoji(preferences.emojiUsuario);
      if (preferences.descuentoDefault !== undefined) setDefaultDiscount(preferences.descuentoDefault);
      if (preferences.impuestosPorTrabajo !== undefined) setImpuestosPorTrabajo(preferences.impuestosPorTrabajo);
      if (preferences.rangosTurnos !== undefined) setShiftRanges(preferences.rangosTurnos);
      if (preferences.deliveryEnabled !== undefined) setDeliveryEnabled(preferences.deliveryEnabled);
      if (preferences.metaHorasSemanales !== undefined) setWeeklyHoursGoal(preferences.metaHorasSemanales);
      if (preferences.smokoEnabled !== undefined) setSmokoEnabled(preferences.smokoEnabled);
      if (preferences.smokoMinutes !== undefined) setSmokoMinutes(preferences.smokoMinutes);
      
      await firebaseService.savePreferences(currentUser.uid, preferences);
    ***REMOVED*** catch (err) ***REMOVED***
      console.error("Error guardando preferencias:", err);
      setError("Error al guardar preferencias: " + err.message);
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
    impuestosPorTrabajo,
    weeklyHoursGoal,
    deliveryEnabled,
    smokoEnabled,
    smokoMinutes,
    shiftRanges,
    thematicColors,
    savePreferences,
    // Note: updateWeeklyHoursGoal can be merged into savePreferences
    updateWeeklyHoursGoal: (goal) => savePreferences(***REMOVED*** metaHorasSemanales: goal ***REMOVED***),
  ***REMOVED***;

  return <ConfigContext.Provider value=***REMOVED***value***REMOVED***>***REMOVED***children***REMOVED***</ConfigContext.Provider>;
***REMOVED***;
