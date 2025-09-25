// src/contexts/AppContext.jsx

import React, ***REMOVED*** createContext, useState, useEffect, useContext, useCallback, useMemo ***REMOVED*** from 'react';
import ***REMOVED***
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  where
***REMOVED*** from 'firebase/firestore';
import ***REMOVED*** db ***REMOVED*** from '../services/firebase';
import ***REMOVED*** useAuth ***REMOVED*** from './AuthContext';
import ***REMOVED*** generateColorVariations ***REMOVED*** from '../utils/colorUtils';

// Crea el contexto
export const AppContext = createContext();

// Hook personalizado para usar el contexto
export const useApp = () => ***REMOVED***
  const context = useContext(AppContext);
  if (!context) ***REMOVED***
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  ***REMOVED***
  return context;
***REMOVED***;

// Proveedor de contexto
export const AppProvider = (***REMOVED*** children ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** currentUser ***REMOVED*** = useAuth();

  // Estados de datos principales
  const [trabajos, setTrabajos] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [trabajosDelivery, setTrabajosDelivery] = useState([]);
  const [turnosDelivery, setTurnosDelivery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weeklyHoursGoal, setWeeklyHoursGoal] = useState(null);
  const [deliveryEnabled, setDeliveryEnabled] = useState(false);
  const [smokoEnabled, setSmokoEnabled] = useState(false);
  const [smokoMinutes, setSmokoMinutes] = useState(30);

  // Estados de preferencias de personalizacion
  const [primaryColor, setPrimaryColor] = useState('#EC4899');
  const [userEmoji, setUserEmoji] = useState('😊');
  const [defaultDiscount, setDefaultDiscount] = useState(15);
  const [shiftRanges, setShiftRanges] = useState(***REMOVED***
    dayStart: 6,
    dayEnd: 14,
    afternoonStart: 14,
    afternoonEnd: 20,
    nightStart: 20
  ***REMOVED***);

  // Genera variaciones de color basadas en el color principal
  const thematicColors = useMemo(() => ***REMOVED***
    return generateColorVariations(primaryColor);
  ***REMOVED***, [primaryColor]);

  // Funcion para obtener referencias de subcolecciones de usuario
  const getUserSubcollections = useCallback(() => ***REMOVED***
    if (!currentUser) ***REMOVED***
      return null;
    ***REMOVED***
    const userUid = currentUser.uid;
    return ***REMOVED***
      trabajosRef: collection(db, 'usuarios', userUid, 'trabajos'),
      turnosRef: collection(db, 'usuarios', userUid, 'turnos'),
      trabajosDeliveryRef: collection(db, 'usuarios', userUid, 'trabajos-delivery'),
      turnosDeliveryRef: collection(db, 'usuarios', userUid, 'turnos-delivery')
    ***REMOVED***;
  ***REMOVED***, [currentUser]);

  // Asegura que el documento del usuario exista y carga la configuracion
  const ensureUserDocument = useCallback(async () => ***REMOVED***
    if (!currentUser) ***REMOVED***
      return;
    ***REMOVED***

    try ***REMOVED***
      const userDocRef = doc(db, 'usuarios', currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      const defaultSettings = ***REMOVED***
        colorPrincipal: '#EC4899',
        emojiUsuario: '😊',
        descuentoDefault: 15,
        metaHorasSemanales: null,
        deliveryEnabled: false,
        smokoEnabled: false,
        smokoMinutes: 30,
        rangosTurnos: ***REMOVED***
          diurnoInicio: 6,
          diurnoFin: 14,
          tardeInicio: 14,
          tardeFin: 20,
          nocheInicio: 20
        ***REMOVED***
      ***REMOVED***;

      if (userDocSnapshot.exists()) ***REMOVED***
        const userData = userDocSnapshot.data();
        const settings = userData.ajustes || defaultSettings;

        setPrimaryColor(settings.colorPrincipal);
        setUserEmoji(settings.emojiUsuario);
        setDefaultDiscount(settings.descuentoDefault);
        setWeeklyHoursGoal(settings.metaHorasSemanales);
        setDeliveryEnabled(settings.deliveryEnabled);
        setSmokoEnabled(settings.smokoEnabled || false); // NUEVO
        setSmokoMinutes(settings.smokoMinutes || 30);    // NUEVO
        setShiftRanges(settings.rangosTurnos);
      ***REMOVED*** else ***REMOVED***
        const defaultUserData = ***REMOVED***
          email: currentUser.email,
          displayName: currentUser.displayName || 'Usuario',
          fechaCreacion: new Date(),
          ajustes: defaultSettings
        ***REMOVED***;
        await setDoc(userDocRef, defaultUserData);

        setPrimaryColor(defaultSettings.colorPrincipal);
        setUserEmoji(defaultSettings.emojiUsuario);
        setDefaultDiscount(defaultSettings.descuentoDefault);
        setWeeklyHoursGoal(defaultSettings.metaHorasSemanales);
        setDeliveryEnabled(defaultSettings.deliveryEnabled);
        setSmokoEnabled(defaultSettings.smokoEnabled);
        setSmokoMinutes(defaultSettings.smokoMinutes);
        setShiftRanges(defaultSettings.rangosTurnos);
      ***REMOVED***
    ***REMOVED*** catch (err) ***REMOVED***
      console.error('Error al configurar documento de usuario:', err);
      setError('Error al configurar usuario: ' + err.message);
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  // Funcion para calcular horas trabajadas
  const calculateHours = useCallback((start, end) => ***REMOVED***
    const [startHour, startMin] = start.split(':').map(n => parseInt(n));
    const [endHour, endMin] = end.split(':').map(n => parseInt(n));

    let startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;

    // Si el turno cruza la medianoche
    if (endMinutes <= startMinutes) ***REMOVED***
      endMinutes += 24 * 60;
    ***REMOVED***

    return (endMinutes - startMinutes) / 60;
  ***REMOVED***, []);

  // Funcion para calcular el pago considerando multiples rangos de tiempo
  const calculatePayment = useCallback((shift) => ***REMOVED***
    const allJobs = [...trabajos, ...trabajosDelivery];
    const job = allJobs.find(j => j.id === shift.trabajoId);

    if (!job) return ***REMOVED***
      total: 0,
      totalWithDiscount: 0,
      hours: 0,
      tips: 0,
      isDelivery: false,
      breakdown: ***REMOVED*** diurno: 0, tarde: 0, noche: 0, sabado: 0, domingo: 0 ***REMOVED***
    ***REMOVED***;

    // Si es un turno de delivery, devuelve las ganancias totales directamente
    if (shift.type === 'delivery' || shift.tipo === 'delivery') ***REMOVED***
      const hours = calculateHours(shift.horaInicio, shift.horaFin);
      return ***REMOVED***
        total: shift.gananciaTotal || 0,
        totalWithDiscount: shift.gananciaTotal || 0,
        hours,
        tips: shift.propinas || 0,
        isDelivery: true,
        breakdown: ***REMOVED*** delivery: shift.gananciaTotal || 0 ***REMOVED***
      ***REMOVED***;
    ***REMOVED***

    const ***REMOVED*** horaInicio, horaFin, fechaInicio, cruzaMedianoche = false, tuvoDescanso = true ***REMOVED*** = shift;

    if (!horaInicio || !horaFin || !fechaInicio) ***REMOVED***
      return ***REMOVED*** total: 0, totalWithDiscount: 0, hours: 0, tips: 0, isDelivery: false ***REMOVED***;
    ***REMOVED***

    const [startHour, startMin] = horaInicio.split(':').map(n => parseInt(n));
    const [endHour, endMin] = horaFin.split(':').map(n => parseInt(n));

    let startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;

    // Si cruza medianoche, agregar 24 horas al final
    if (cruzaMedianoche) ***REMOVED***
      endMinutes += 24 * 60;
    ***REMOVED*** else if (endMinutes <= startMinutes) ***REMOVED***
      // Fallback para turnos antiguos sin la propiedad cruzaMedianoche
      endMinutes += 24 * 60;
    ***REMOVED***



    const totalMinutes = endMinutes - startMinutes;
    let workingMinutes = totalMinutes;
    if (smokoEnabled && tuvoDescanso && totalMinutes > smokoMinutes) ***REMOVED***
      workingMinutes = totalMinutes - smokoMinutes;
    ***REMOVED***

    const hours = workingMinutes / 60;

    // Determinar si es fin de semana
    const date = new Date(fechaInicio + 'T00:00:00');
    const dayOfWeek = date.getDay();

    let total = 0;
    let breakdown = ***REMOVED*** diurno: 0, tarde: 0, noche: 0, sabado: 0, domingo: 0 ***REMOVED***;

    if (dayOfWeek === 0) ***REMOVED*** // Domingo
      total = hours * job.tarifas.domingo;
      breakdown.domingo = total;
    ***REMOVED*** else if (dayOfWeek === 6) ***REMOVED*** // Sábado
      total = hours * job.tarifas.sabado;
      breakdown.sabado = total;
    ***REMOVED*** else ***REMOVED***
      // Día de semana - calcular por rangos horarios minuto a minuto
      const ranges = shiftRanges || ***REMOVED***
        dayStart: 6, dayEnd: 14,
        afternoonStart: 14, afternoonEnd: 20,
        nightStart: 20
      ***REMOVED***;

      const dayStartMin = ranges.dayStart * 60;        // ej: 6*60 = 360 (06:00)
      const dayEndMin = ranges.dayEnd * 60;            // ej: 14*60 = 840 (14:00)
      const afternoonStartMin = ranges.afternoonStart * 60; // ej: 14*60 = 840 (14:00)
      const afternoonEndMin = ranges.afternoonEnd * 60;     // ej: 20*60 = 1200 (20:00)

      const minutesToProcess = Math.min(workingMinutes, totalMinutes);


      // Calcular minuto por minuto para manejar correctamente los rangos
      for (let minute = 0; minute < minutesToProcess; minute++) ***REMOVED***
        const actualMinute = startMinutes + (minute * totalMinutes / workingMinutes);
        const currentMinuteInDay = Math.floor(actualMinute) % (24 * 60);
        let rate = job.tarifaBase;
        let rateType = 'noche';

        if (currentMinuteInDay >= dayStartMin && currentMinuteInDay < dayEndMin) ***REMOVED***
          rate = job.tarifas.diurno;
          rateType = 'diurno';
        ***REMOVED*** else if (currentMinuteInDay >= afternoonStartMin && currentMinuteInDay < afternoonEndMin) ***REMOVED***
          rate = job.tarifas.tarde;
          rateType = 'tarde';
        ***REMOVED*** else ***REMOVED***
          rate = job.tarifas.noche;
          rateType = 'noche';
        ***REMOVED***

        const ratePerMinute = rate / 60;
        total += ratePerMinute;
        breakdown[rateType] += ratePerMinute;
      ***REMOVED***
    ***REMOVED***

    const totalWithDiscount = total * (1 - defaultDiscount / 100);

    return ***REMOVED***
      total,
      totalWithDiscount,
      hours,
      tips: 0,
      isDelivery: false,
      breakdown,
      isNightShift: cruzaMedianoche || false,
      smokoApplied: smokoEnabled && tuvoDescanso && totalMinutes > smokoMinutes,
      smokoMinutes: smokoEnabled && tuvoDescanso ? smokoMinutes : 0,
      totalMinutesWorked: workingMinutes,
      totalMinutesScheduled: totalMinutes
    ***REMOVED***;
  ***REMOVED***, [trabajos, trabajosDelivery, shiftRanges, defaultDiscount, calculateHours, smokoEnabled, smokoMinutes]);

  // Funciones CRUD para trabajos de delivery
  const addDeliveryJob = useCallback(async (newJob) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) throw new Error('Usuario no autenticado');
      const subcollections = getUserSubcollections();
      if (!subcollections || !subcollections.trabajosDeliveryRef) ***REMOVED***
        throw new Error('No se pudieron obtener las referencias de la colección');
      ***REMOVED***

      const jobData = ***REMOVED***
        ...newJob,
        tipo: 'delivery',
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        plataforma: newJob.plataforma || '',
        vehiculo: newJob.vehiculo || '',
        colorAvatar: newJob.colorAvatar || '#10B981',
        estadisticas: ***REMOVED***
          totalTurnos: 0,
          totalPedidos: 0,
          totalKilometros: 0,
          totalGanancias: 0,
          totalPropinas: 0,
          totalGastosCombustible: 0
        ***REMOVED***
      ***REMOVED***;

      const docRef = await addDoc(subcollections.trabajosDeliveryRef, jobData);
      return ***REMOVED*** ...jobData, id: docRef.id ***REMOVED***;
    ***REMOVED*** catch (err) ***REMOVED***
      console.error('Error al agregar trabajo de delivery:', err);
      setError('Error al agregar trabajo delivery: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserSubcollections]);

  const editDeliveryJob = useCallback(async (id, updatedData) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) throw new Error('Usuario no autenticado');
      const subcollections = getUserSubcollections();
      if (!subcollections || !subcollections.trabajosDeliveryRef) throw new Error('No se pudieron obtener las referencias de la coleccion');

      const dataWithMetadata = ***REMOVED***
        ...updatedData,
        fechaActualizacion: new Date()
      ***REMOVED***;

      const docRef = doc(subcollections.trabajosDeliveryRef, id);
      await updateDoc(docRef, dataWithMetadata);
    ***REMOVED*** catch (err) ***REMOVED***
      console.error('Error al editar trabajo de delivery:', err);
      setError('Error al editar trabajo delivery: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserSubcollections]);

  const deleteDeliveryJob = useCallback(async (id) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) throw new Error('Usuario no autenticado');
      const subcollections = getUserSubcollections();
      if (!subcollections || !subcollections.trabajosDeliveryRef || !subcollections.turnosDeliveryRef) ***REMOVED***
        throw new Error('No se pudieron obtener las referencias de la coleccion');
      ***REMOVED***

      // Primero, elimina todos los turnos de delivery asociados
      const shiftsQuery = query(
        subcollections.turnosDeliveryRef,
        where('trabajoId', '==', id)
      );

      const shiftsSnapshot = await getDocs(shiftsQuery);
      const deletePromises = shiftsSnapshot.docs.map(d => deleteDoc(d.ref));
      await Promise.all(deletePromises);

      // Luego elimina el trabajo de delivery
      await deleteDoc(doc(subcollections.trabajosDeliveryRef, id));
    ***REMOVED*** catch (err) ***REMOVED***
      console.error('Error al eliminar trabajo de delivery:', err);
      setError('Error al eliminar trabajo delivery: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserSubcollections]);

  // addDeliveryShift para manejar turnos nocturnos
  const addDeliveryShift = useCallback(async (newShift) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) throw new Error('Usuario no autenticado');
      const subcollections = getUserSubcollections();
      if (!subcollections || !subcollections.turnosDeliveryRef) ***REMOVED***
        throw new Error('No se pudieron obtener las referencias de la colección');
      ***REMOVED***

      // Calcular fechaFin automáticamente si no se proporciona
      let fechaFin = newShift.fechaFin;
      if (!fechaFin && newShift.cruzaMedianoche) ***REMOVED***
        const fechaInicio = new Date(newShift.fechaInicio + 'T00:00:00');
        const fechaFinCalculada = new Date(fechaInicio);
        fechaFinCalculada.setDate(fechaFinCalculada.getDate() + 1);
        fechaFin = fechaFinCalculada.toISOString().split('T')[0];
      ***REMOVED***

      const shiftData = ***REMOVED***
        ...newShift,
        tipo: 'delivery',
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        // Mantener compatibilidad con campo fecha existente
        fecha: newShift.fechaInicio || newShift.fecha,
        fechaInicio: newShift.fechaInicio || newShift.fecha,
        fechaFin: fechaFin || newShift.fechaInicio || newShift.fecha,
        numeroPedidos: newShift.numeroPedidos || 0,
        gananciaTotal: newShift.gananciaTotal || 0,
        propinas: newShift.propinas || 0,
        kilometros: newShift.kilometros || 0,
        gastoCombustible: newShift.gastoCombustible || 0,
        gananciaBase: (newShift.gananciaTotal || 0) - (newShift.propinas || 0),
        gananciaNeta: (newShift.gananciaTotal || 0) - (newShift.gastoCombustible || 0),
        cruzaMedianoche: newShift.cruzaMedianoche || false
      ***REMOVED***;

      const docRef = await addDoc(subcollections.turnosDeliveryRef, shiftData);
      return ***REMOVED*** ...shiftData, id: docRef.id ***REMOVED***;
    ***REMOVED*** catch (err) ***REMOVED***
      console.error('Error al agregar turno de delivery:', err);
      setError('Error al agregar turno delivery: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserSubcollections]);

  // editDeliveryShift para manejar turnos nocturnos
  const editDeliveryShift = useCallback(async (id, updatedData) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) throw new Error('Usuario no autenticado');
      const subcollections = getUserSubcollections();
      if (!subcollections || !subcollections.turnosDeliveryRef) throw new Error('No se pudieron obtener las referencias de la coleccion');

      // Calcular fechaFin automáticamente si no se proporciona
      let fechaFin = updatedData.fechaFin;
      if (!fechaFin && updatedData.cruzaMedianoche) ***REMOVED***
        const fechaInicio = new Date((updatedData.fechaInicio || updatedData.fecha) + 'T00:00:00');
        const fechaFinCalculada = new Date(fechaInicio);
        fechaFinCalculada.setDate(fechaFinCalculada.getDate() + 1);
        fechaFin = fechaFinCalculada.toISOString().split('T')[0];
      ***REMOVED***

      const dataWithMetadata = ***REMOVED***
        ...updatedData,
        fechaActualizacion: new Date(),
        // Mantener compatibilidad
        fecha: updatedData.fechaInicio || updatedData.fecha,
        fechaInicio: updatedData.fechaInicio || updatedData.fecha,
        fechaFin: fechaFin || updatedData.fechaInicio || updatedData.fecha,
        gananciaBase: (updatedData.gananciaTotal || 0) - (updatedData.propinas || 0),
        gananciaNeta: (updatedData.gananciaTotal || 0) - (updatedData.gastoCombustible || 0),
        cruzaMedianoche: updatedData.cruzaMedianoche || false
      ***REMOVED***;

      const docRef = doc(subcollections.turnosDeliveryRef, id);
      await updateDoc(docRef, dataWithMetadata);
    ***REMOVED*** catch (err) ***REMOVED***
      console.error('Error al editar turno de delivery:', err);
      setError('Error al editar turno delivery: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserSubcollections]);

  const deleteDeliveryShift = useCallback(async (id) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) throw new Error('Usuario no autenticado');
      const subcollections = getUserSubcollections();
      if (!subcollections || !subcollections.turnosDeliveryRef) throw new Error('No se pudieron obtener las referencias de la coleccion');

      await deleteDoc(doc(subcollections.turnosDeliveryRef, id));
    ***REMOVED*** catch (err) ***REMOVED***
      console.error('Error al eliminar turno de delivery:', err);
      setError('Error al eliminar turno delivery: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserSubcollections]);

  // addShift para turnos tradicionales nocturnos
  const addShift = useCallback(async (newShift) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) throw new Error('Usuario no autenticado');
      const subcollections = getUserSubcollections();
      if (!newShift.trabajoId || !newShift.fechaInicio || !newShift.horaInicio || !newShift.horaFin) ***REMOVED***
        throw new Error('Todos los campos del turno son requeridos');
      ***REMOVED***

      // Detectar turnos nocturnos de manera más robusta y asegurar que se guarden correctamente
      const cruzaMedianoche = newShift.cruzaMedianoche ||
        (newShift.horaInicio && newShift.horaFin &&
          newShift.horaInicio.split(':')[0] > newShift.horaFin.split(':')[0]);

      // Usar fechaFin proporcionada o calcularla
      let fechaFin = newShift.fechaFin;
      if (!fechaFin && cruzaMedianoche) ***REMOVED***
        const fechaInicio = new Date(newShift.fechaInicio + 'T00:00:00');
        const fechaFinCalculada = new Date(fechaInicio);
        fechaFinCalculada.setDate(fechaFinCalculada.getDate() + 1);
        fechaFin = fechaFinCalculada.toISOString().split('T')[0];
      ***REMOVED***

      const shiftWithMetadata = ***REMOVED***
        ...newShift,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        // Mantener compatibilidad con campo fecha existente
        fecha: newShift.fechaInicio,
        fechaFin: fechaFin || newShift.fechaInicio,
        cruzaMedianoche: cruzaMedianoche
      ***REMOVED***;

      const docRef = await addDoc(subcollections.turnosRef, shiftWithMetadata);
      return ***REMOVED*** ...shiftWithMetadata, id: docRef.id ***REMOVED***;
    ***REMOVED*** catch (err) ***REMOVED***
      console.error("Error al guardar turno:", err);
      setError('Error al guardar turno: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserSubcollections]);

  // editShift para turnos tradicionales nocturnos
  const editShift = useCallback(async (id, updatedData) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) throw new Error('Usuario no autenticado');
      const subcollections = getUserSubcollections();
      if (!subcollections || !subcollections.turnosRef) throw new Error('No se pudieron obtener las referencias de la subcoleccion');

      // Detectar turnos nocturnos de manera más robusta
      const cruzaMedianoche = updatedData.cruzaMedianoche ||
        (updatedData.horaInicio && updatedData.horaFin &&
          updatedData.horaInicio.split(':')[0] > updatedData.horaFin.split(':')[0]);

      // Usar fechaFin proporcionada o calcularla
      let fechaFin = updatedData.fechaFin;
      if (!fechaFin && cruzaMedianoche) ***REMOVED***
        const fechaInicio = new Date(updatedData.fechaInicio + 'T00:00:00');
        const fechaFinCalculada = new Date(fechaInicio);
        fechaFinCalculada.setDate(fechaFinCalculada.getDate() + 1);
        fechaFin = fechaFinCalculada.toISOString().split('T')[0];
      ***REMOVED***

      const dataWithMetadata = ***REMOVED***
        ...updatedData,
        fechaActualizacion: new Date(),
        // Mantener compatibilidad con campo fecha existente
        fecha: updatedData.fechaInicio,
        fechaFin: fechaFin || updatedData.fechaInicio,
        cruzaMedianoche: cruzaMedianoche
      ***REMOVED***;

      const docRef = doc(subcollections.turnosRef, id);
      await updateDoc(docRef, dataWithMetadata);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al editar turno: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserSubcollections]);

  // Función para eliminar turnos tradicionales
  const deleteShift = useCallback(async (id) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) throw new Error('Usuario no autenticado');
      const subcollections = getUserSubcollections();

      if (!subcollections || !subcollections.turnosRef) throw new Error('No se pudieron obtener las referencias de la subcoleccion');

      await deleteDoc(doc(subcollections.turnosRef, id));

    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al eliminar turno: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserSubcollections]);

  const updateWeeklyHoursGoal = useCallback(async (newGoal) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) throw new Error('Usuario no autenticado');

      setWeeklyHoursGoal(newGoal);

      if (newGoal) ***REMOVED***
        localStorage.setItem('weeklyHoursGoal', newGoal.toString());
      ***REMOVED*** else ***REMOVED***
        localStorage.removeItem('weeklyHoursGoal');
      ***REMOVED***

      const userDocRef = doc(db, 'usuarios', currentUser.uid);
      await updateDoc(userDocRef, ***REMOVED***
        'ajustes.metaHorasSemanales': newGoal,
        fechaActualizacion: new Date()
      ***REMOVED***);
      return true;
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al actualizar meta de horas semanales: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  // Cargar datos de usuario y preferencias
  useEffect(() => ***REMOVED***
    let unsubscribeTrabajos = null;
    let unsubscribeTurnos = null;
    let unsubscribeTrabajosDelivery = null;
    let unsubscribeTurnosDelivery = null;

    const loadUserData = async () => ***REMOVED***
      if (!currentUser) ***REMOVED***
        setLoading(false);
        setTrabajos([]);
        setTurnos([]);
        setTrabajosDelivery([]);
        setTurnosDelivery([]);
        setError(null);
        return;
      ***REMOVED***

      try ***REMOVED***
        setLoading(true);
        setError(null);

        await ensureUserDocument();

        const subcollections = getUserSubcollections();
        if (!subcollections) ***REMOVED***
          setLoading(false);
          return;
        ***REMOVED***

        // Listener para trabajos tradicionales
        const trabajosQuery = query(
          subcollections.trabajosRef,
          orderBy('nombre', 'asc')
        );

        unsubscribeTrabajos = onSnapshot(
          trabajosQuery,
          ***REMOVED*** includeMetadataChanges: true ***REMOVED***,
          (snapshot) => ***REMOVED***
            if (snapshot.empty && !snapshot.docChanges().length) ***REMOVED***
              setTrabajos([]);
              return;
            ***REMOVED***

            setTrabajos(currentTrabajos => ***REMOVED***
              let updatedTrabajos = [...currentTrabajos];

              snapshot.docChanges().forEach(change => ***REMOVED***
                const docData = ***REMOVED*** id: change.doc.id, ...change.doc.data() ***REMOVED***;

                if (change.type === 'added') ***REMOVED***
                  if (!updatedTrabajos.some(t => t.id === docData.id)) ***REMOVED***
                    updatedTrabajos.push(docData);
                  ***REMOVED***
                ***REMOVED*** else if (change.type === 'modified') ***REMOVED***
                  updatedTrabajos = updatedTrabajos.map(t =>
                    t.id === docData.id ? docData : t
                  );
                ***REMOVED*** else if (change.type === 'removed') ***REMOVED***
                  updatedTrabajos = updatedTrabajos.filter(t => t.id !== change.doc.id);
                ***REMOVED***
              ***REMOVED***);

              updatedTrabajos.sort((a, b) => a.nombre.localeCompare(b.nombre));
              return updatedTrabajos;
            ***REMOVED***);
          ***REMOVED***,
          (err) => ***REMOVED***
            console.error('Error en el listener de trabajos tradicionales:', err);
            setError('Error al cargar trabajos: ' + err.message);
          ***REMOVED***
        );

        // Listener para trabajos de delivery
        const trabajosDeliveryQuery = query(
          subcollections.trabajosDeliveryRef,
          orderBy('fechaCreacion', 'desc')
        );

        unsubscribeTrabajosDelivery = onSnapshot(
          trabajosDeliveryQuery,
          (snapshot) => ***REMOVED***
            const loadedTrabajosDelivery = snapshot.docs.map(doc => ***REMOVED***
              return ***REMOVED*** id: doc.id, ...doc.data() ***REMOVED***;
            ***REMOVED***);
            setTrabajosDelivery(loadedTrabajosDelivery);
          ***REMOVED***,
          (err) => ***REMOVED***
            console.error("Error al cargar trabajos de delivery:", err);
            setError("Error al cargar trabajos de delivery: " + err.message);
          ***REMOVED***
        );

        // Listener para turnos de delivery
        const turnosDeliveryQuery = query(
          subcollections.turnosDeliveryRef,
          orderBy('fecha', 'desc')
        );

        unsubscribeTurnosDelivery = onSnapshot(
          turnosDeliveryQuery,
          (snapshot) => ***REMOVED***
            const turnosDeliveryData = [];
            snapshot.forEach(doc => ***REMOVED***
              turnosDeliveryData.push(***REMOVED***
                id: doc.id,
                ...doc.data(),
                type: 'delivery' // Asegura que el tipo este configurado
              ***REMOVED***);
            ***REMOVED***);
            setTurnosDelivery(turnosDeliveryData);
          ***REMOVED***,
          (err) => ***REMOVED***
            console.error('Error al cargar turnos de delivery:', err);
            setError('Error al cargar turnos delivery: ' + err.message);
          ***REMOVED***
        );

        // Listener para turnos tradicionales
        const turnosQuery = query(
          subcollections.turnosRef,
          orderBy('fechaCreacion', 'desc')
        );

        unsubscribeTurnos = onSnapshot(turnosQuery, (snapshot) => ***REMOVED***
          const turnosData = [];
          snapshot.forEach(doc => ***REMOVED***
            turnosData.push(***REMOVED*** id: doc.id, ...doc.data() ***REMOVED***);
          ***REMOVED***);

          turnosData.sort((a, b) => ***REMOVED***
            const fechaA = new Date(a.fechaInicio || a.fecha);
            const fechaB = new Date(b.fechaInicio || b.fecha);
            return fechaB - fechaA;
          ***REMOVED***);

          setTurnos(turnosData);
          setLoading(false);
        ***REMOVED***, (err) => ***REMOVED***
          console.error('Error al cargar turnos tradicionales:', err);
          setError('Error al cargar turnos: ' + err.message);
          setLoading(false);
        ***REMOVED***);

      ***REMOVED*** catch (err) ***REMOVED***
        console.error('Error critico al cargar datos:', err);
        setError('Error critico al cargar datos: ' + err.message);
        setLoading(false);
      ***REMOVED***
    ***REMOVED***;

    loadUserData();

    // Funcion de limpieza
    return () => ***REMOVED***
      if (unsubscribeTrabajos) unsubscribeTrabajos();
      if (unsubscribeTurnos) unsubscribeTurnos();
      if (unsubscribeTrabajosDelivery) unsubscribeTrabajosDelivery();
      if (unsubscribeTurnosDelivery) unsubscribeTurnosDelivery();
    ***REMOVED***;
  ***REMOVED***, [currentUser, getUserSubcollections, ensureUserDocument]);

  // Formato de fecha
  const formatDate = useCallback((dateStr) => ***REMOVED***
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-ES', ***REMOVED***
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    ***REMOVED***);
  ***REMOVED***, []);

  const contextValue = ***REMOVED***
    trabajos,
    turnos,
    // turnosPorFecha para manejar turnos nocturnos
    turnosPorFecha: useMemo(() => ***REMOVED***
      const allTurnos = [...turnos, ...turnosDelivery];
      const turnosPorFecha = ***REMOVED******REMOVED***;

      allTurnos.forEach(turno => ***REMOVED***
        // Fecha principal (siempre debe existir)
        const fechaPrincipal = turno.fechaInicio || turno.fecha;
        if (fechaPrincipal) ***REMOVED***
          if (!turnosPorFecha[fechaPrincipal]) ***REMOVED***
            turnosPorFecha[fechaPrincipal] = [];
          ***REMOVED***
          turnosPorFecha[fechaPrincipal].push(turno);
        ***REMOVED***

        // Detectar turnos nocturnos de manera más robusta
        const esNocturno = turno.cruzaMedianoche ||
          (turno.horaInicio && turno.horaFin &&
            turno.horaInicio.split(':')[0] > turno.horaFin.split(':')[0]);

        // Si es nocturno, agregarlo también al día siguiente
        if (esNocturno && fechaPrincipal) ***REMOVED***
          let fechaFin = turno.fechaFin;

          // Si no tiene fechaFin, calcularla
          if (!fechaFin) ***REMOVED***
            const fechaInicio = new Date(fechaPrincipal + 'T00:00:00');
            const fechaFinCalculada = new Date(fechaInicio);
            fechaFinCalculada.setDate(fechaFinCalculada.getDate() + 1);
            fechaFin = fechaFinCalculada.toISOString().split('T')[0];
          ***REMOVED***

          // Agregar al día siguiente si es diferente al día principal
          if (fechaFin && fechaFin !== fechaPrincipal) ***REMOVED***
            if (!turnosPorFecha[fechaFin]) ***REMOVED***
              turnosPorFecha[fechaFin] = [];
            ***REMOVED***
            // Evitar duplicados
            const yaExiste = turnosPorFecha[fechaFin].some(t => t.id === turno.id);
            if (!yaExiste) ***REMOVED***
              turnosPorFecha[fechaFin].push(turno);
            ***REMOVED***
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***);

      return turnosPorFecha;
    ***REMOVED***, [turnos, turnosDelivery]),
    loading,
    error,
    smokoEnabled,
    smokoMinutes,

    // Combinar todos los trabajos
    todosLosTrabajos: useMemo(() => ***REMOVED***
      return [...trabajos, ...trabajosDelivery];
    ***REMOVED***, [trabajos, trabajosDelivery]),

    // Preferencias de usuario
    primaryColor,
    thematicColors,
    userEmoji,
    defaultDiscount,
    shiftRanges,
    rangosTurnos: shiftRanges,
    weeklyHoursGoal,
    deliveryEnabled,

    // Funciones CRUD para trabajos tradicionales
    addJob: useCallback(async (newJob) => ***REMOVED***
      try ***REMOVED***
        if (!currentUser) throw new Error('Usuario no autenticado');
        const subcollections = getUserSubcollections();
        if (!subcollections || !subcollections.trabajosRef) throw new Error('No se pudieron obtener las referencias de la subcoleccion');
        if (!newJob.nombre || !newJob.nombre.trim()) ***REMOVED***
          throw new Error('El nombre del trabajo es requerido');
        ***REMOVED***
        const jobWithMetadata = ***REMOVED***
          ...newJob,
          fechaCreacion: new Date(),
          fechaActualizacion: new Date(),
          activo: true
        ***REMOVED***;
        const docRef = await addDoc(subcollections.trabajosRef, jobWithMetadata);
        return ***REMOVED*** ...jobWithMetadata, id: docRef.id ***REMOVED***;
      ***REMOVED*** catch (err) ***REMOVED***
        setError('Error al agregar trabajo: ' + err.message);
        throw err;
      ***REMOVED***
    ***REMOVED***, [currentUser, getUserSubcollections]),

    editJob: useCallback(async (id, updatedData) => ***REMOVED***
      try ***REMOVED***
        if (!currentUser) throw new Error('Usuario no autenticado');
        const subcollections = getUserSubcollections();
        if (!subcollections || !subcollections.trabajosRef) throw new Error('No se pudieron obtener las referencias de la subcoleccion');
        const dataWithMetadata = ***REMOVED***
          ...updatedData,
          fechaActualizacion: new Date()
        ***REMOVED***;
        const docRef = doc(subcollections.trabajosRef, id);
        await updateDoc(docRef, dataWithMetadata);
      ***REMOVED*** catch (err) ***REMOVED***
        setError('Error al editar trabajo: ' + err.message);
        throw err;
      ***REMOVED***
    ***REMOVED***, [currentUser, getUserSubcollections]),

    deleteJob: useCallback(async (id) => ***REMOVED***
      try ***REMOVED***
        if (!currentUser) throw new Error('Usuario no autenticado');
        const subcollections = getUserSubcollections();
        if (!subcollections || !subcollections.trabajosRef || !subcollections.turnosRef) ***REMOVED***
          throw new Error('No se pudieron obtener las referencias de la subcoleccion');
        ***REMOVED***
        const jobRef = doc(db, 'usuarios', currentUser.uid, 'trabajos', id);
        const jobDoc = await getDoc(jobRef);
        if (!jobDoc.exists()) ***REMOVED***
          setTrabajos(prev => prev.filter(t => t.id !== id));
          return;
        ***REMOVED***
        const associatedShifts = turnos.filter(shift => shift.trabajoId === id);
        setTurnos(prev => prev.filter(shift => shift.trabajoId !== id));
        const deleteShiftPromises = associatedShifts.map(shift =>
          deleteDoc(doc(subcollections.turnosRef, shift.id))
        );
        await Promise.all(deleteShiftPromises);
        await deleteDoc(jobRef);
      ***REMOVED*** catch (err) ***REMOVED***
        console.error('Error al eliminar trabajo:', err);
        setError('Error al eliminar trabajo: ' + err.message);
        throw err;
      ***REMOVED***
    ***REMOVED***, [currentUser, getUserSubcollections, turnos]),

    // Trabajos de delivery
    trabajosDelivery,
    addDeliveryJob,
    editDeliveryJob,
    deleteDeliveryJob,

    // Funciones CRUD para turnos tradicionales
    addShift,
    editShift,
    deleteShift,

    // Turnos de delivery
    turnosDelivery,
    addDeliveryShift,
    editDeliveryShift,
    deleteDeliveryShift,

    // Funciones de calculo
    calculateHours,
    calculatePayment,
    calculateDailyTotal: useCallback((dailyShifts) => ***REMOVED***
      return dailyShifts.reduce((total, shift) => ***REMOVED***
        if (shift.type === 'delivery') ***REMOVED***
          const netEarnings = (shift.gananciaTotal || 0) - (shift.gastoCombustible || 0);
          return ***REMOVED***
            hours: total.hours,
            total: total.total + netEarnings
          ***REMOVED***;
        ***REMOVED*** else ***REMOVED***
          const result = calculatePayment(shift);
          return ***REMOVED***
            hours: total.hours + result.hours,
            total: total.total + result.total
          ***REMOVED***;
        ***REMOVED***
      ***REMOVED***, ***REMOVED*** hours: 0, total: 0 ***REMOVED***);
    ***REMOVED***, [calculatePayment]),
    formatDate,
    updateWeeklyHoursGoal,

    savePreferences: useCallback(async (preferences) => ***REMOVED***
      try ***REMOVED***
        if (!currentUser) throw new Error('Usuario no autenticado');

        const ***REMOVED***
          colorPrincipal: newColor,
          emojiUsuario: newEmoji,
          descuentoDefault: newDiscount,
          rangosTurnos: newRanges,
          deliveryEnabled: newDelivery,
          metaHorasSemanales: newGoal,
          smokoEnabled: newSmokoEnabled,
          smokoMinutes: newSmokoMinutes,
        ***REMOVED*** = preferences;

        // Actualizar estados locales si se proporcionan valores
        if (newColor !== undefined) setPrimaryColor(newColor);
        if (newEmoji !== undefined) setUserEmoji(newEmoji);
        if (newDiscount !== undefined) setDefaultDiscount(newDiscount);
        if (newRanges !== undefined) setShiftRanges(newRanges);
        if (newDelivery !== undefined) ***REMOVED***
          setDeliveryEnabled(newDelivery);
        ***REMOVED***
        if (newGoal !== undefined) setWeeklyHoursGoal(newGoal);

        if (newSmokoEnabled !== undefined) setSmokoEnabled(newSmokoEnabled);
        if (newSmokoMinutes !== undefined) setSmokoMinutes(newSmokoMinutes);

        // Persistir en localStorage
        if (newColor !== undefined) localStorage.setItem('primaryColor', newColor);
        if (newEmoji !== undefined) localStorage.setItem('userEmoji', newEmoji);
        if (newDiscount !== undefined) localStorage.setItem('defaultDiscount', newDiscount.toString());
        if (newRanges !== undefined) localStorage.setItem('shiftRanges', JSON.stringify(newRanges));
        if (newDelivery !== undefined) ***REMOVED***
          localStorage.setItem('deliveryEnabled', newDelivery.toString());
        ***REMOVED***
        if (newGoal !== undefined) localStorage.setItem('weeklyHoursGoal', newGoal === null ? 'null' : newGoal.toString());
        if (newSmokoEnabled !== undefined) localStorage.setItem('smokoEnabled', newSmokoEnabled.toString());
        if (newSmokoMinutes !== undefined) localStorage.setItem('smokoMinutes', newSmokoMinutes.toString());

        // Actualizar Firestore
        const userDocRef = doc(db, 'usuarios', currentUser.uid);
        const updatedData = ***REMOVED******REMOVED***;

        if (newColor !== undefined) updatedData['ajustes.colorPrincipal'] = newColor;
        if (newEmoji !== undefined) updatedData['ajustes.emojiUsuario'] = newEmoji;
        if (newDiscount !== undefined) updatedData['ajustes.descuentoDefault'] = newDiscount;
        if (newRanges !== undefined) updatedData['ajustes.rangosTurnos'] = newRanges;
        if (newDelivery !== undefined) ***REMOVED***
          updatedData['ajustes.deliveryEnabled'] = newDelivery;
        ***REMOVED***
        if (newGoal !== undefined) updatedData['ajustes.metaHorasSemanales'] = newGoal;
        if (newSmokoEnabled !== undefined) updatedData['ajustes.smokoEnabled'] = newSmokoEnabled;
        if (newSmokoMinutes !== undefined) updatedData['ajustes.smokoMinutes'] = newSmokoMinutes;

        updatedData['fechaActualizacion'] = new Date();

        if (Object.keys(updatedData).length > 1) ***REMOVED*** // Verificar si hay datos reales para actualizar mas alla de la marca de tiempo
          await updateDoc(userDocRef, updatedData);
        ***REMOVED***

        return true;
      ***REMOVED*** catch (err) ***REMOVED***
        console.error('Error en savePreferences:', err);
        setError('Error al guardar preferencias: ' + err.message);
        throw err;
      ***REMOVED***
    ***REMOVED***, [currentUser]),
  ***REMOVED***;

  // Cargar preferencias de localStorage en el renderizado inicial
  useEffect(() => ***REMOVED***
    const savedColor = localStorage.getItem('primaryColor');
    const savedEmoji = localStorage.getItem('userEmoji');
    const savedDescuento = localStorage.getItem('defaultDiscount');
    const savedRangos = localStorage.getItem('shiftRanges');
    const savedMeta = localStorage.getItem('weeklyHoursGoal');
    const savedDelivery = localStorage.getItem('deliveryEnabled');
    const savedSmokoEnabled = localStorage.getItem('smokoEnabled');
    const savedSmokoMinutes = localStorage.getItem('smokoMinutes');

    if (savedColor) setPrimaryColor(savedColor);
    if (savedEmoji) setUserEmoji(savedEmoji);
    if (savedDescuento) setDefaultDiscount(parseInt(savedDescuento));
    if (savedRangos) setShiftRanges(JSON.parse(savedRangos));
    if (savedMeta) setWeeklyHoursGoal(savedMeta === 'null' ? null : parseInt(savedMeta));
    if (savedDelivery !== null) setDeliveryEnabled(savedDelivery === 'true');
    if (savedSmokoEnabled !== null) setSmokoEnabled(savedSmokoEnabled === 'true');
    if (savedSmokoMinutes) setSmokoMinutes(parseInt(savedSmokoMinutes));
  ***REMOVED***, []);

  return (
    <AppContext.Provider value=***REMOVED***contextValue***REMOVED***>
      ***REMOVED***children***REMOVED***
    </AppContext.Provider>
  );
***REMOVED***;