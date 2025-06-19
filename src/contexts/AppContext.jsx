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
  const [metaHorasSemanales, setMetaHorasSemanales] = useState(null);
  const [deliveryEnabled, setDeliveryEnabled] = useState(false);

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
          setMetaHorasSemanales(userData.ajustes.metaHorasSemanales || null);
          setDeliveryEnabled(userData.ajustes.deliveryEnabled || false);
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
            metaHorasSemanales: null,
            deliveryEnabled: false,
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
        setMetaHorasSemanales(null);
        setDeliveryEnabled(false);
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
    let finMinutos = horaFn * 60 + minFn; // Corregido: Usar minFn

    // Si el turno cruza medianoche
    if (finMinutos <= inicioMinutos) ***REMOVED***
      finMinutos += 24 * 60;
    ***REMOVED***

    return (finMinutos - inicioMinutos) / 60;
  ***REMOVED***, []);

  // Función mejorada para calcular el pago considerando rangos horarios múltiples
  const calcularPago = useCallback((turno) => ***REMOVED***
    const trabajo = trabajos.find(t => t.id === turno.trabajoId);
    if (!trabajo) return ***REMOVED*** total: 0, totalConDescuento: 0, horas: 0 ***REMOVED***;

    // Si es un turno de delivery, retornar directamente la ganancia
    if (turno.tipo === 'delivery') ***REMOVED***
      const horas = calcularHoras(turno.horaInicio, turno.horaFin);
      return ***REMOVED***
        total: turno.gananciaTotal || 0,
        totalConDescuento: turno.gananciaTotal || 0,
        horas,
        propinas: turno.propinas || 0,
        esDelivery: true
      ***REMOVED***;
    ***REMOVED***

    const ***REMOVED*** horaInicio, horaFin ***REMOVED*** = turno;

    // Convertir horas a minutos
    const [horaIni, minIni] = horaInicio.split(':').map(n => parseInt(n));
    const [horaFn, minFn] = horaFin.split(':').map(n => parseInt(n));

    let inicioMinutos = horaIni * 60 + minIni;
    let finMinutos = horaFn * 60 + minFn; // Corregido: Usar minFn

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
      // Día de semana
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
  ***REMOVED***, [trabajos, rangosTurnos, descuentoDefault, calcularHoras]);

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
        
        const trabajosQuery = query(
          subcollections.trabajosRef,
          orderBy('nombre', 'asc')
        );

        // *** CAMBIO CLAVE AQUÍ: Manejar cambios de tipo explicitamente ***
        unsubscribeTrabajos = onSnapshot(
          trabajosQuery, 
          ***REMOVED*** includeMetadataChanges: true ***REMOVED***, // Mantener esto para saber si es de caché
          (snapshot) => ***REMOVED***
            // No ignorar si es de caché, solo úsalo como información.
            // La lógica clave es procesar los `docChanges`.
            
            // Si el snapshot inicial está vacío, establecer trabajos a un array vacío.
            if (snapshot.empty && !snapshot.docChanges().length) ***REMOVED***
              setTrabajos([]);
              console.log('Trabajos: Snapshot inicial vacío.');
              return;
            ***REMOVED***

            setTrabajos(currentTrabajos => ***REMOVED***
              let updatedTrabajos = [...currentTrabajos];

              snapshot.docChanges().forEach(change => ***REMOVED***
                const docData = ***REMOVED*** id: change.doc.id, ...change.doc.data() ***REMOVED***;
                
                if (change.type === 'added') ***REMOVED***
                  // Solo añadir si no existe ya para evitar duplicados si se procesa múltiples veces
                  if (!updatedTrabajos.some(t => t.id === docData.id)) ***REMOVED***
                    updatedTrabajos.push(docData);
                  ***REMOVED***
                ***REMOVED*** else if (change.type === 'modified') ***REMOVED***
                  updatedTrabajos = updatedTrabajos.map(t => 
                    t.id === docData.id ? docData : t
                  );
                ***REMOVED*** else if (change.type === 'removed') ***REMOVED***
                  updatedTrabajos = updatedTrabajos.filter(t => t.id !== change.doc.id);
                  console.log(`Trabajo eliminado (tipo 'removed'): $***REMOVED***change.doc.id***REMOVED***`);
                ***REMOVED***
              ***REMOVED***);

              // Asegurarse de que los trabajos estén ordenados después de los cambios
              updatedTrabajos.sort((a, b) => a.nombre.localeCompare(b.nombre));
              
              console.log('Trabajos actualizados desde listener (total):', updatedTrabajos.length);
              return updatedTrabajos;
            ***REMOVED***);
          ***REMOVED***, 
          (error) => ***REMOVED***
            console.error('Error en listener de trabajos:', error);
            setError('Error al cargar trabajos: ' + error.message);
          ***REMOVED***
        );

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
      fechaActualizacion: new Date(),
      activo: true // Campo para marcar trabajos activos
    ***REMOVED***;

    // Crear el documento
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

    // 1. Obtener referencia del documento
    const trabajoRef = doc(subcollections.trabajosRef, id);
    
    // 2. Verificar que existe antes de eliminar
    const trabajoDoc = await getDoc(trabajoRef);
    if (!trabajoDoc.exists()) ***REMOVED***
      console.warn('El trabajo ya no existe en Firestore. Posiblemente ya fue eliminado por otra sesión o caché.');
      // Si no existe en Firestore, simplemente filtramos el estado local si aún estuviera ahí.
      setTrabajos(prev => prev.filter(t => t.id !== id));
      return;
    ***REMOVED***

    // 3. Eliminar turnos asociados del estado Y de Firestore ANTES de borrar el trabajo principal
    // Esto asegura consistencia y permite que el listener de trabajos haga su trabajo.
    const turnosAsociados = turnos.filter(turno => turno.trabajoId === id);
    // Optimistic UI update para turnos
    setTurnos(prev => prev.filter(turno => turno.trabajoId !== id));

    const promesasBorradoTurnos = turnosAsociados.map(turno =>
      deleteDoc(doc(subcollections.turnosRef, turno.id))
    );
    await Promise.all(promesasBorradoTurnos);
    
    // 4. Eliminar el trabajo de Firestore
    // El listener de onSnapshot para 'trabajos' ahora debería capturar este cambio de 'removed'.
    await deleteDoc(trabajoRef);
    console.log(`Solicitud de eliminación de trabajo enviada para ID: $***REMOVED***id***REMOVED***`);


    // La actualización del estado local de 'trabajos' se manejará principalmente por el listener de onSnapshot
    // en el useEffect principal, el cual ahora procesa `change.type === 'removed'`.
    // Por lo tanto, no necesitamos un setTrabajos optimista aquí para el trabajo en sí.
    // setTrabajos(prev => prev.filter(t => t.id !== id)); // Este se vuelve redundante o menos crítico

    // Eliminar la recarga de la página, el listener debe manejarlo.
    // if ('caches' in window) ***REMOVED*** ... ***REMOVED***
    // window.location.reload(); 

  ***REMOVED*** catch (err) ***REMOVED***
    console.error('Error al eliminar trabajo:', err);
    setError('Error al eliminar trabajo: ' + err.message);
    // En caso de error, podríamos considerar una estrategia de reintento o notificar al usuario
    // para que recargue la página si el problema persiste.
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
        rangosTurnos: nuevosRangos,
        deliveryEnabled: nuevoDelivery,
        metaHorasSemanales: nuevaMeta,
      ***REMOVED*** = preferencias;

      if (nuevoColor !== undefined) setColorPrincipal(nuevoColor);
      if (nuevoEmoji !== undefined) setEmojiUsuario(nuevoEmoji);
      if (nuevoDescuento !== undefined) setDescuentoDefault(nuevoDescuento);
      if (nuevosRangos !== undefined) setRangosTurnos(nuevosRangos);
      if (nuevoDelivery !== undefined) setDeliveryEnabled(nuevoDelivery);
      if (nuevaMeta !== undefined) setMetaHorasSemanales(nuevaMeta);

      if (nuevoColor !== undefined) localStorage.setItem('colorPrincipal', nuevoColor);
      if (nuevoEmoji !== undefined) localStorage.setItem('emojiUsuario', nuevoEmoji);
      if (nuevoDescuento !== undefined) localStorage.setItem('descuentoDefault', nuevoDescuento.toString());
      if (nuevosRangos !== undefined) localStorage.setItem('rangosTurnos', JSON.stringify(nuevosRangos));
      if (nuevoDelivery !== undefined) localStorage.setItem('deliveryEnabled', nuevoDelivery.toString());
      if (nuevaMeta !== undefined) ***REMOVED***
        if (nuevaMeta) ***REMOVED***
          localStorage.setItem('metaHorasSemanales', nuevaMeta.toString());
        ***REMOVED*** else ***REMOVED***
          localStorage.removeItem('metaHorasSemanales');
        ***REMOVED***
      ***REMOVED***

      const userDocRef = doc(db, 'usuarios', currentUser.uid);
      const datosActualizados = ***REMOVED******REMOVED***;

      if (nuevoColor !== undefined) datosActualizados['ajustes.colorPrincipal'] = nuevoColor;
      if (nuevoEmoji !== undefined) datosActualizados['ajustes.emojiUsuario'] = nuevoEmoji;
      if (nuevoDescuento !== undefined) datosActualizados['ajustes.descuentoDefault'] = nuevoDescuento;
      if (nuevosRangos !== undefined) datosActualizados['ajustes.rangosTurnos'] = nuevosRangos;
      if (nuevoDelivery !== undefined) datosActualizados['ajustes.deliveryEnabled'] = nuevoDelivery;
      if (nuevaMeta !== undefined) datosActualizados['ajustes.metaHorasSemanales'] = nuevaMeta;

      // Agregar fecha de actualización
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

  // Agrega un useEffect para cargar desde localStorage (después del useEffect principal)
  useEffect(() => ***REMOVED***
    // Cargar preferencias de localStorage al iniciar
    const savedColor = localStorage.getItem('colorPrincipal');
    const savedEmoji = localStorage.getItem('emojiUsuario');
    const savedDescuento = localStorage.getItem('descuentoDefault');
    const savedRangos = localStorage.getItem('rangosTurnos');
    const savedMeta = localStorage.getItem('metaHorasSemanales');
    const savedDelivery = localStorage.getItem('deliveryEnabled');

    if (savedColor) setColorPrincipal(savedColor);
    if (savedEmoji) setEmojiUsuario(savedEmoji);
    if (savedDescuento) setDescuentoDefault(parseInt(savedDescuento));
    if (savedRangos) setRangosTurnos(JSON.parse(savedRangos));
    if (savedMeta) setMetaHorasSemanales(savedMeta === 'null' ? null : parseInt(savedMeta));
    if (savedDelivery !== null) setDeliveryEnabled(savedDelivery === 'true');
  ***REMOVED***, []);

  const actualizarMetaHorasSemanales = useCallback(async (meta) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) throw new Error('Usuario no autenticado');

      const metaValida = meta && !isNaN(meta) && meta > 0 ? Number(meta) : null;
      setMetaHorasSemanales(metaValida);

      // Guardar en localStorage
      if (metaValida) ***REMOVED***
        localStorage.setItem('metaHorasSemanales', metaValida.toString());
      ***REMOVED*** else ***REMOVED***
        localStorage.removeItem('metaHorasSemanales');
      ***REMOVED***

      // Guardar en Firestore
      const userDocRef = doc(db, 'usuarios', currentUser.uid);
      await updateDoc(userDocRef, ***REMOVED***
        'ajustes.metaHorasSemanales': metaValida,
        'fechaActualizacion': new Date()
      ***REMOVED***);

      return true;
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al actualizar meta de horas: ' + err.message);
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
  const calcularTotalDia = (turnosDia) => ***REMOVED***
    return turnosDia.reduce((total, turno) => ***REMOVED***
      if (turno.tipo === 'delivery') ***REMOVED***
        // Para turnos de delivery, usar la ganancia neta (ganancia total - combustible)
        const gananciaNeta = turno.gananciaTotal - (turno.gastoCombustible || 0);
        return ***REMOVED***
          horas: total.horas, // No sumar horas para delivery
          total: total.total + gananciaNeta
        ***REMOVED***;
      ***REMOVED*** else ***REMOVED***
        // Para turnos tradicionales, calcular según tarifa
        const resultado = calcularPago(turno);
        return ***REMOVED***
          horas: total.horas + resultado.horas,
          total: total.total + resultado.total
        ***REMOVED***;
      ***REMOVED***
    ***REMOVED***, ***REMOVED*** horas: 0, total: 0 ***REMOVED***);
  ***REMOVED***;

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
    metaHorasSemanales,
    deliveryEnabled,

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
    actualizarMetaHorasSemanales,


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