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
  onSnapshot
***REMOVED*** from 'firebase/firestore';
import ***REMOVED*** db ***REMOVED*** from '../services/firebase';
import ***REMOVED*** useAuth ***REMOVED*** from './AuthContext';
import ***REMOVED*** generateColorVariations ***REMOVED*** from '../utils/colorUtils';

// Crear el contexto
export const AppContext = createContext();

// Hook personalizado para usar el contexto
export const useApp = () => ***REMOVED***
  const context = useContext(AppContext);
  if (!context) ***REMOVED***
    throw new Error('useApp debe usarse dentro de un AppProvider');
  ***REMOVED***
  return context;
***REMOVED***;

// Proveedor del contexto
export const AppProvider = (***REMOVED*** children ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** currentUser ***REMOVED*** = useAuth();

  // Estados para los datos principales
  const [trabajos, setTrabajos] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Estados para preferencias de personalización
  const [colorPrincipal, setColorPrincipal] = useState('#EC4899');
  const [emojiUsuario, setEmojiUsuario] = useState('😊');
  const [descuentoDefault, setDescuentoDefault] = useState(15);
  const [rangosTurnos, setRangosTurnos] = useState(***REMOVED***
    diurnoInicio: 6,
    diurnoFin: 14,
    tardeInicio: 14,
    tardeFin: 20,
    nocheInicio: 20
  ***REMOVED***);

  // Generar variaciones de color basadas en el color principal
  const coloresTemáticos = useMemo(() => ***REMOVED***
    return generateColorVariations(colorPrincipal);
  ***REMOVED***, [colorPrincipal]);

  // Función para obtener las referencias de las subcolecciones del usuario
  const getUserSubcollections = useCallback(() => ***REMOVED***
    if (!currentUser) ***REMOVED***
      return null;
    ***REMOVED***

    return ***REMOVED***
      trabajosRef: collection(db, 'usuarios', currentUser.uid, 'trabajos'),
      turnosRef: collection(db, 'usuarios', currentUser.uid, 'turnos')
    ***REMOVED***;
  ***REMOVED***, [currentUser]);

  // Función para crear o verificar documento de usuario
  const ensureUserDocument = useCallback(async () => ***REMOVED***
    if (!currentUser) ***REMOVED***
      return;
    ***REMOVED***

    try ***REMOVED***
      const userDocRef = doc(db, 'usuarios', currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) ***REMOVED***
        const userData = userDocSnapshot.data();

        if (userData.ajustes) ***REMOVED***
          setColorPrincipal(userData.ajustes.colorPrincipal || '#EC4899');
          setEmojiUsuario(userData.ajustes.emojiUsuario || '😊');
          setDescuentoDefault(userData.ajustes.descuentoDefault || 15);
          setRangosTurnos(userData.ajustes.rangosTurnos || ***REMOVED***
            diurnoInicio: 6,
            diurnoFin: 14,
            tardeInicio: 14,
            tardeFin: 20,
            nocheInicio: 20
          ***REMOVED***);
        ***REMOVED***
      ***REMOVED*** else ***REMOVED***
        const defaultUserData = ***REMOVED***
          email: currentUser.email,
          displayName: currentUser.displayName || 'Usuario',
          fechaCreacion: new Date(),
          ajustes: ***REMOVED***
            colorPrincipal: '#EC4899',
            emojiUsuario: '😊',
            descuentoDefault: 15,
            rangosTurnos: ***REMOVED***
              diurnoInicio: 6,
              diurnoFin: 14,
              tardeInicio: 14,
              tardeFin: 20,
              nocheInicio: 20
            ***REMOVED***
          ***REMOVED***
        ***REMOVED***;

        await setDoc(userDocRef, defaultUserData);

        setColorPrincipal('#EC4899');
        setEmojiUsuario('😊');
        setDescuentoDefault(15);
        setRangosTurnos(***REMOVED***
          diurnoInicio: 6,
          diurnoFin: 14,
          tardeInicio: 14,
          tardeFin: 20,
          nocheInicio: 20
        ***REMOVED***);
      ***REMOVED***
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error al configurar usuario: ' + error.message);
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  // Función mejorada para calcular horas trabajadas
  const calcularHoras = useCallback((inicio, fin) => ***REMOVED***
    const [horaIni, minIni] = inicio.split(':').map(n => parseInt(n));
    const [horaFn, minFn] = fin.split(':').map(n => parseInt(n));

    let inicioMinutos = horaIni * 60 + minIni;
    let finMinutos = horaFn * 60 + minFn;

    // Si el turno cruza medianoche
    if (finMinutos <= inicioMinutos) ***REMOVED***
      finMinutos += 24 * 60;
    ***REMOVED***

    return (finMinutos - inicioMinutos) / 60;
  ***REMOVED***, []);

  // Función mejorada para calcular el pago considerando rangos horarios múltiples
  // Función mejorada para calcular el pago considerando rangos horarios múltiples
  const calcularPago = useCallback((turno) => ***REMOVED***
    const trabajo = trabajos.find(t => t.id === turno.trabajoId);
    if (!trabajo) return ***REMOVED*** total: 0, totalConDescuento: 0, horas: 0 ***REMOVED***;

    const ***REMOVED*** horaInicio, horaFin ***REMOVED*** = turno;

    // Convertir horas a minutos
    const [horaIni, minIni] = horaInicio.split(':').map(n => parseInt(n));
    const [horaFn, minFn] = horaFin.split(':').map(n => parseInt(n));

    let inicioMinutos = horaIni * 60 + minIni;
    let finMinutos = horaFn * 60 + minFn;

    // Si el turno cruza medianoche
    if (finMinutos <= inicioMinutos) ***REMOVED***
      finMinutos += 24 * 60;
    ***REMOVED***

    const totalMinutos = finMinutos - inicioMinutos;
    const horas = totalMinutos / 60;

    // Verificar si es fin de semana
    const [year, month, day] = turno.fecha.split('-');
    const fecha = new Date(year, month - 1, day);
    const diaSemana = fecha.getDay();

    let total = 0;

    if (diaSemana === 0) ***REMOVED***
      // Domingo - toda la tarifa de domingo
      total = horas * trabajo.tarifas.domingo;
    ***REMOVED*** else if (diaSemana === 6) ***REMOVED***
      // Sábado - toda la tarifa de sábado
      total = horas * trabajo.tarifas.sabado;
    ***REMOVED*** else ***REMOVED***
      // Día de semana - calcular por rangos horarios INTELIGENTE
      const rangos = rangosTurnos || ***REMOVED***
        diurnoInicio: 6, diurnoFin: 14,
        tardeInicio: 14, tardeFin: 20,
        nocheInicio: 20
      ***REMOVED***;

      // Convertir rangos a minutos
      const diurnoInicioMin = rangos.diurnoInicio * 60;
      const diurnoFinMin = rangos.diurnoFin * 60;
      const tardeInicioMin = rangos.tardeInicio * 60;
      const tardeFinMin = rangos.tardeFin * 60;

      // Calcular minuto por minuto para manejar cambios de tarifa
      for (let minuto = inicioMinutos; minuto < finMinutos; minuto++) ***REMOVED***
        const horaActual = minuto % (24 * 60); // Manejar cruce de medianoche
        let tarifa = trabajo.tarifaBase;

        // Determinar tarifa según la hora ACTUAL del minuto
        if (horaActual >= diurnoInicioMin && horaActual < diurnoFinMin) ***REMOVED***
          tarifa = trabajo.tarifas.diurno;
        ***REMOVED*** else if (horaActual >= tardeInicioMin && horaActual < tardeFinMin) ***REMOVED***
          tarifa = trabajo.tarifas.tarde;
        ***REMOVED*** else ***REMOVED***
          // Todo lo que no sea diurno o tarde es nocturno
          tarifa = trabajo.tarifas.noche;
        ***REMOVED***

        // Agregar pago por este minuto (tarifa / 60 para convertir a minuto)
        total += tarifa / 60;
      ***REMOVED***
    ***REMOVED***

    const totalConDescuento = total * (1 - descuentoDefault / 100);

    return ***REMOVED***
      total,
      totalConDescuento,
      horas
    ***REMOVED***;
  ***REMOVED***, [trabajos, rangosTurnos, descuentoDefault]);

  // Cargar datos y preferencias del usuario
  useEffect(() => ***REMOVED***
    let unsubscribeTrabajos = null;
    let unsubscribeTurnos = null;

    const cargarDatosUsuario = async () => ***REMOVED***
      if (!currentUser) ***REMOVED***
        setCargando(false);
        setTrabajos([]);
        setTurnos([]);
        setError(null);
        return;
      ***REMOVED***

      try ***REMOVED***
        setCargando(true);
        setError(null);

        await ensureUserDocument();

        const subcollections = getUserSubcollections();
        if (!subcollections) ***REMOVED***
          setCargando(false);
          return;
        ***REMOVED***

        // Configurar listener para trabajos
        const trabajosQuery = query(
          subcollections.trabajosRef,
          orderBy('nombre', 'asc')
        );

        unsubscribeTrabajos = onSnapshot(trabajosQuery, (snapshot) => ***REMOVED***
          if (snapshot.empty) ***REMOVED***
            setTrabajos([]);
          ***REMOVED*** else ***REMOVED***
            const trabajosData = [];
            snapshot.forEach(doc => ***REMOVED***
              trabajosData.push(***REMOVED*** id: doc.id, ...doc.data() ***REMOVED***);
            ***REMOVED***);
            setTrabajos(trabajosData);
          ***REMOVED***
        ***REMOVED***, (error) => ***REMOVED***
          setError('Error al cargar trabajos: ' + error.message);
        ***REMOVED***);

        // Configurar listener para turnos
        const turnosQuery = query(
          subcollections.turnosRef,
          orderBy('fecha', 'desc')
        );

        unsubscribeTurnos = onSnapshot(turnosQuery, (snapshot) => ***REMOVED***
          if (snapshot.empty) ***REMOVED***
            setTurnos([]);
          ***REMOVED*** else ***REMOVED***
            const turnosData = [];
            snapshot.forEach(doc => ***REMOVED***
              turnosData.push(***REMOVED*** id: doc.id, ...doc.data() ***REMOVED***);
            ***REMOVED***);
            setTurnos(turnosData);
          ***REMOVED***
          setCargando(false);
        ***REMOVED***, (error) => ***REMOVED***
          setError('Error al cargar turnos: ' + error.message);
          setCargando(false);
        ***REMOVED***);

      ***REMOVED*** catch (error) ***REMOVED***
        setError('Error crítico al cargar datos: ' + error.message);
        setCargando(false);
      ***REMOVED***
    ***REMOVED***;

    cargarDatosUsuario();

    return () => ***REMOVED***
      if (unsubscribeTrabajos) unsubscribeTrabajos();
      if (unsubscribeTurnos) unsubscribeTurnos();
    ***REMOVED***;
  ***REMOVED***, [currentUser, getUserSubcollections, ensureUserDocument]);

  // Funciones CRUD para trabajos
  const agregarTrabajo = useCallback(async (nuevoTrabajo) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) throw new Error('Usuario no autenticado');

      const subcollections = getUserSubcollections();
      if (!subcollections) throw new Error('No se pudieron obtener las referencias de las subcolecciones');

      if (!nuevoTrabajo.nombre || !nuevoTrabajo.nombre.trim()) ***REMOVED***
        throw new Error('El nombre del trabajo es requerido');
      ***REMOVED***

      const trabajoConMetadata = ***REMOVED***
        ...nuevoTrabajo,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      ***REMOVED***;

      const docRef = await addDoc(subcollections.trabajosRef, trabajoConMetadata);
      return ***REMOVED*** ...trabajoConMetadata, id: docRef.id ***REMOVED***;
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al agregar trabajo: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserSubcollections]);

  const editarTrabajo = useCallback(async (id, datosActualizados) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) throw new Error('Usuario no autenticado');

      const subcollections = getUserSubcollections();
      if (!subcollections) throw new Error('No se pudieron obtener las referencias de las subcolecciones');

      const datosConMetadata = ***REMOVED***
        ...datosActualizados,
        fechaActualizacion: new Date()
      ***REMOVED***;

      const docRef = doc(subcollections.trabajosRef, id);
      await updateDoc(docRef, datosConMetadata);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al editar trabajo: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserSubcollections]);

  const borrarTrabajo = useCallback(async (id) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) throw new Error('Usuario no autenticado');

      const subcollections = getUserSubcollections();
      if (!subcollections) throw new Error('No se pudieron obtener las referencias de las subcolecciones');

      await deleteDoc(doc(subcollections.trabajosRef, id));

      const turnosAsociados = turnos.filter(turno => turno.trabajoId === id);
      const promesasBorrado = turnosAsociados.map(turno =>
        deleteDoc(doc(subcollections.turnosRef, turno.id))
      );

      await Promise.all(promesasBorrado);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al eliminar trabajo: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserSubcollections, turnos]);

  // Funciones CRUD para turnos
  const agregarTurno = useCallback(async (nuevoTurno) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) throw new Error('Usuario no autenticado');

      const subcollections = getUserSubcollections();
      if (!subcollections) throw new Error('No se pudieron obtener las referencias de las subcolecciones');

      if (!nuevoTurno.trabajoId || !nuevoTurno.fecha || !nuevoTurno.horaInicio || !nuevoTurno.horaFin) ***REMOVED***
        throw new Error('Todos los campos del turno son requeridos');
      ***REMOVED***

      const turnoConMetadata = ***REMOVED***
        ...nuevoTurno,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      ***REMOVED***;

      const docRef = await addDoc(subcollections.turnosRef, turnoConMetadata);
      return ***REMOVED*** ...turnoConMetadata, id: docRef.id ***REMOVED***;
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al agregar turno: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserSubcollections]);

  const editarTurno = useCallback(async (id, datosActualizados) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) throw new Error('Usuario no autenticado');

      const subcollections = getUserSubcollections();
      if (!subcollections) throw new Error('No se pudieron obtener las referencias de las subcolecciones');

      const datosConMetadata = ***REMOVED***
        ...datosActualizados,
        fechaActualizacion: new Date()
      ***REMOVED***;

      const docRef = doc(subcollections.turnosRef, id);
      await updateDoc(docRef, datosConMetadata);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al editar turno: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserSubcollections]);

  const borrarTurno = useCallback(async (id) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) throw new Error('Usuario no autenticado');

      const subcollections = getUserSubcollections();
      if (!subcollections) throw new Error('No se pudieron obtener las referencias de las subcolecciones');

      await deleteDoc(doc(subcollections.turnosRef, id));
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al eliminar turno: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserSubcollections]);

  // Función para guardar preferencias de usuario
  const guardarPreferencias = useCallback(async (preferencias) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) throw new Error('Usuario no autenticado');

      const ***REMOVED***
        colorPrincipal: nuevoColor,
        emojiUsuario: nuevoEmoji,
        descuentoDefault: nuevoDescuento,
        rangosTurnos: nuevosRangos
      ***REMOVED*** = preferencias;

      if (nuevoColor !== undefined) setColorPrincipal(nuevoColor);
      if (nuevoEmoji !== undefined) setEmojiUsuario(nuevoEmoji);
      if (nuevoDescuento !== undefined) setDescuentoDefault(nuevoDescuento);
      if (nuevosRangos !== undefined) setRangosTurnos(nuevosRangos);

      if (nuevoColor !== undefined) localStorage.setItem('colorPrincipal', nuevoColor);
      if (nuevoEmoji !== undefined) localStorage.setItem('emojiUsuario', nuevoEmoji);
      if (nuevoDescuento !== undefined) localStorage.setItem('descuentoDefault', nuevoDescuento.toString());
      if (nuevosRangos !== undefined) localStorage.setItem('rangosTurnos', JSON.stringify(nuevosRangos));

      const userDocRef = doc(db, 'usuarios', currentUser.uid);
      const datosActualizados = ***REMOVED******REMOVED***;

      if (nuevoColor !== undefined) datosActualizados['ajustes.colorPrincipal'] = nuevoColor;
      if (nuevoEmoji !== undefined) datosActualizados['ajustes.emojiUsuario'] = nuevoEmoji;
      if (nuevoDescuento !== undefined) datosActualizados['ajustes.descuentoDefault'] = nuevoDescuento;
      if (nuevosRangos !== undefined) datosActualizados['ajustes.rangosTurnos'] = nuevosRangos;
      datosActualizados['fechaActualizacion'] = new Date();

      if (Object.keys(datosActualizados).length > 1) ***REMOVED***
        await updateDoc(userDocRef, datosActualizados);
      ***REMOVED***

      return true;
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al guardar preferencias: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  // Agrupar turnos por fecha
  const turnosPorFecha = useMemo(() => ***REMOVED***
    return turnos.reduce((acc, turno) => ***REMOVED***
      if (!acc[turno.fecha]) ***REMOVED***
        acc[turno.fecha] = [];
      ***REMOVED***
      acc[turno.fecha].push(turno);
      return acc;
    ***REMOVED***, ***REMOVED******REMOVED***);
  ***REMOVED***, [turnos]);

  // Calcular total del día
  const calcularTotalDia = useCallback((turnosDia) => ***REMOVED***
    let total = 0;
    turnosDia.forEach(turno => ***REMOVED***
      const ***REMOVED*** totalConDescuento ***REMOVED*** = calcularPago(turno);
      total += totalConDescuento;
    ***REMOVED***);
    return total;
  ***REMOVED***, [calcularPago]);

  // Formatear fecha
  const formatearFecha = useCallback((fechaStr) => ***REMOVED***
    const fecha = new Date(fechaStr + 'T00:00:00');
    return fecha.toLocaleDateString('es-ES', ***REMOVED***
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    ***REMOVED***);
  ***REMOVED***, []);

  // Valor del contexto
  const contextValue = ***REMOVED***
    // Datos principales
    trabajos,
    turnos,
    turnosPorFecha,
    cargando,
    error,

    // Preferencias de usuario
    colorPrincipal,
    coloresTemáticos,
    emojiUsuario,
    descuentoDefault,
    rangosTurnos,

    // Funciones CRUD para trabajos
    agregarTrabajo,
    editarTrabajo,
    borrarTrabajo,

    // Funciones CRUD para turnos
    agregarTurno,
    editarTurno,
    borrarTurno,

    // Funciones de cálculo
    calcularHoras,
    calcularPago,
    calcularTotalDia,
    formatearFecha,

    // Funciones de configuración
    guardarPreferencias
  ***REMOVED***;

  return (
    <AppContext.Provider value=***REMOVED***contextValue***REMOVED***>
      ***REMOVED***children***REMOVED***
    </AppContext.Provider>
  );
***REMOVED***;

export default AppContext;