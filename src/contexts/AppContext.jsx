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
  const [trabajosDelivery, setTrabajosDelivery] = useState([]);
  const [turnosDelivery, setTurnosDelivery] = useState([]);
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

  const getUserDeliveryCollections = useCallback(() => ***REMOVED***
    if (!currentUser) ***REMOVED***
      return null;
    ***REMOVED***

    return ***REMOVED***
      trabajosDeliveryRef: collection(db, 'usuarios', currentUser.uid, 'trabajos-delivery'),
      turnosDeliveryRef: collection(db, 'usuarios', currentUser.uid, 'turnos-delivery')
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
    let finMinutos = horaFn * 60 + minFn;

    // Si el turno cruza medianoche
    if (finMinutos <= inicioMinutos) ***REMOVED***
      finMinutos += 24 * 60;
    ***REMOVED***

    return (finMinutos - inicioMinutos) / 60;
  ***REMOVED***, []);

  // Función mejorada para calcular el pago considerando rangos horarios múltiples
  const calcularPago = useCallback((turno) => ***REMOVED***
    // Combine both traditional and delivery jobs for lookup
    const allJobs = [...trabajos, ...trabajosDelivery];
    const trabajo = allJobs.find(t => t.id === turno.trabajoId);

    if (!trabajo) return ***REMOVED*** total: 0, totalConDescuento: 0, horas: 0, propinas: 0, esDelivery: false ***REMOVED***;

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
      horas,
      propinas: 0, 
      esDelivery: false
    ***REMOVED***;
  ***REMOVED***, [trabajos, trabajosDelivery, rangosTurnos, descuentoDefault, calcularHoras]);

  // Funciones CRUD para trabajos delivery (definidas fuera del useEffect)
  const agregarTrabajoDelivery = useCallback(async (nuevoTrabajo) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) throw new Error('Usuario no autenticado');

      const deliveryCollections = getUserDeliveryCollections();
      if (!deliveryCollections) throw new Error('No se pudieron obtener las referencias');

      const trabajoDeliveryData = ***REMOVED***
        ...nuevoTrabajo,
        tipo: 'delivery',
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        // Campos específicos de delivery
        plataforma: nuevoTrabajo.plataforma || '',
        vehiculo: nuevoTrabajo.vehiculo || '',
        colorAvatar: nuevoTrabajo.colorAvatar || '#10B981',
        // Estadísticas iniciales
        estadisticas: ***REMOVED***
          totalTurnos: 0,
          totalPedidos: 0,
          totalKilometros: 0,
          totalGanancias: 0,
          totalPropinas: 0,
          totalGastosCombustible: 0
        ***REMOVED***
      ***REMOVED***;

      console.log("Intentando guardar trabajo delivery en la ruta:", deliveryCollections.trabajosDeliveryRef.path);

      const docRef = await addDoc(deliveryCollections.trabajosDeliveryRef, trabajoDeliveryData);

      return ***REMOVED*** ...trabajoDeliveryData, id: docRef.id ***REMOVED***;
    ***REMOVED*** catch (err) ***REMOVED***
      console.error('Error al agregar trabajo delivery:', err);
      setError('Error al agregar trabajo delivery: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserDeliveryCollections]);

  const editarTrabajoDelivery = useCallback(async (id, datosActualizados) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) throw new Error('Usuario no autenticado');

      const deliveryCollections = getUserDeliveryCollections();
      if (!deliveryCollections) throw new Error('No se pudieron obtener las referencias');

      const datosConMetadata = ***REMOVED***
        ...datosActualizados,
        fechaActualizacion: new Date()
      ***REMOVED***;

      const docRef = doc(deliveryCollections.trabajosDeliveryRef, id);
      await updateDoc(docRef, datosConMetadata);

    ***REMOVED*** catch (err) ***REMOVED***
      console.error('Error al editar trabajo delivery:', err);
      setError('Error al editar trabajo delivery: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserDeliveryCollections]);

  const borrarTrabajoDelivery = useCallback(async (id) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) throw new Error('Usuario no autenticado');

      const deliveryCollections = getUserDeliveryCollections();
      if (!deliveryCollections) throw new Error('No se pudieron obtener las referencias');

      // Primero, eliminar todos los turnos asociados
      const turnosQuery = query(
        deliveryCollections.turnosDeliveryRef,
        where('trabajoId', '==', id)
      );

      const turnosSnapshot = await getDocs(turnosQuery);
      const deletePromises = turnosSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Luego eliminar el trabajo
      await deleteDoc(doc(deliveryCollections.trabajosDeliveryRef, id));

    ***REMOVED*** catch (err) ***REMOVED***
      console.error('Error al eliminar trabajo delivery:', err);
      setError('Error al eliminar trabajo delivery: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserDeliveryCollections]);

  // Funciones CRUD para turnos delivery
  const agregarTurnoDelivery = useCallback(async (nuevoTurno) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) throw new Error('Usuario no autenticado');

      const deliveryCollections = getUserDeliveryCollections();
      if (!deliveryCollections) throw new Error('No se pudieron obtener las referencias');

      const turnoDeliveryData = ***REMOVED***
        ...nuevoTurno,
        tipo: 'delivery',
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        // Campos específicos de delivery con valores por defecto
        numeroPedidos: nuevoTurno.numeroPedidos || 0,
        gananciaTotal: nuevoTurno.gananciaTotal || 0,
        propinas: nuevoTurno.propinas || 0,
        kilometros: nuevoTurno.kilometros || 0,
        gastoCombustible: nuevoTurno.gastoCombustible || 0,
        // Cálculos automáticos
        gananciaBase: (nuevoTurno.gananciaTotal || 0) - (nuevoTurno.propinas || 0),
        gananciaNeta: (nuevoTurno.gananciaTotal || 0) - (nuevoTurno.gastoCombustible || 0)
      ***REMOVED***;

      const docRef = await addDoc(deliveryCollections.turnosDeliveryRef, turnoDeliveryData);

      return ***REMOVED*** ...turnoDeliveryData, id: docRef.id ***REMOVED***;
    ***REMOVED*** catch (err) ***REMOVED***
      console.error('Error al agregar turno delivery:', err);
      setError('Error al agregar turno delivery: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserDeliveryCollections]);


  const cargandoTrabajosDelivery = useCallback(() => ***REMOVED***
    if (!currentUser) return () => ***REMOVED*** ***REMOVED***;
    const deliveryCollections = getUserDeliveryCollections();
    if (!deliveryCollections) return () => ***REMOVED*** ***REMOVED***;

    const q = query(
      deliveryCollections.trabajosDeliveryRef,
      orderBy('fechaCreacion', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => ***REMOVED***
      const loadedTrabajos = snapshot.docs.map(doc => ***REMOVED***
        // AÑADE ESTOS CONSOLE.LOGS TEMPORALMENTE
        console.log(`Trabajo Delivery detectado en FireStore. ID: $***REMOVED***doc.id***REMOVED***, Ruta: $***REMOVED***doc.ref.path***REMOVED***, Datos:`, doc.data());
        return ***REMOVED*** id: doc.id, ...doc.data() ***REMOVED***;
      ***REMOVED***);
      setTrabajosDelivery(loadedTrabajos);
      console.log('Trabajos delivery cargados:', loadedTrabajos.length); 
    ***REMOVED***, (error) => ***REMOVED***
      console.error("Error al cargar trabajos de delivery:", error);
      setError("Error al cargar trabajos de delivery: " + error.message);
    ***REMOVED***);

    return unsubscribe;
  ***REMOVED***, [currentUser, getUserDeliveryCollections]);


  const editarTurnoDelivery = useCallback(async (id, datosActualizados) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) throw new Error('Usuario no autenticado');

      const deliveryCollections = getUserDeliveryCollections();
      if (!deliveryCollections) throw new Error('No se pudieron obtener las referencias');

      const datosConMetadata = ***REMOVED***
        ...datosActualizados,
        fechaActualizacion: new Date(),

        gananciaBase: (datosActualizados.gananciaTotal || 0) - (datosActualizados.propinas || 0),
        gananciaNeta: (datosActualizados.gananciaTotal || 0) - (datosActualizados.gastoCombustible || 0)
      ***REMOVED***;

      const docRef = doc(deliveryCollections.turnosDeliveryRef, id);
      await updateDoc(docRef, datosConMetadata);

      console.log('Turno delivery actualizado:', id);
    ***REMOVED*** catch (err) ***REMOVED***
      console.error('Error al editar turno delivery:', err);
      setError('Error al editar turno delivery: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserDeliveryCollections]);

  const borrarTurnoDelivery = useCallback(async (id) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) throw new Error('Usuario no autenticado');

      const deliveryCollections = getUserDeliveryCollections();
      if (!deliveryCollections) throw new Error('No se pudieron obtener las referencias');

      await deleteDoc(doc(deliveryCollections.turnosDeliveryRef, id));

      console.log('Turno delivery eliminado:', id);
    ***REMOVED*** catch (err) ***REMOVED***
      console.error('Error al eliminar turno delivery:', err);
      setError('Error al eliminar turno delivery: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserDeliveryCollections]);

  const actualizarMetaHorasSemanales = useCallback(async (nuevaMeta) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) throw new Error('Usuario no autenticado');

      setMetaHorasSemanales(nuevaMeta); 

      // Persistir en localStorage
      if (nuevaMeta) ***REMOVED***
        localStorage.setItem('metaHorasSemanales', nuevaMeta.toString());
      ***REMOVED*** else ***REMOVED***
        localStorage.removeItem('metaHorasSemanales');
      ***REMOVED***

      // Persistir en Firestore
      const userDocRef = doc(db, 'usuarios', currentUser.uid);
      await updateDoc(userDocRef, ***REMOVED***
        'ajustes.metaHorasSemanales': nuevaMeta,
        fechaActualizacion: new Date()
      ***REMOVED***);
      return true;
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al actualizar meta de horas semanales: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  // Cargar datos y preferencias del usuario
  useEffect(() => ***REMOVED***
    let unsubscribeTrabajos = null;
    let unsubscribeTurnos = null;
    let unsubscribeTrabajosDelivery = null;
    let unsubscribeTurnosDelivery = null;

    const cargarDatosUsuario = async () => ***REMOVED***
      if (!currentUser) ***REMOVED***
        setCargando(false);
        setTrabajos([]);
        setTurnos([]);
        setTrabajosDelivery([]);
        setTurnosDelivery([]);
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
          (error) => ***REMOVED***
            console.error('Error en listener de trabajos:', error);
            setError('Error al cargar trabajos: ' + error.message);
          ***REMOVED***
        );

        // Llama a la función cargandoTrabajosDelivery
        unsubscribeTrabajosDelivery = cargandoTrabajosDelivery();


        // Listener para turnos delivery
        const deliveryCollections = getUserDeliveryCollections();
        if (deliveryCollections) ***REMOVED***
          const turnosDeliveryQuery = query(
            deliveryCollections.turnosDeliveryRef,
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
                  tipo: 'delivery'
                ***REMOVED***);
              ***REMOVED***);
              setTurnosDelivery(turnosDeliveryData);
              console.log('Turnos delivery cargados:', turnosDeliveryData.length);
            ***REMOVED***,
            (error) => ***REMOVED***
              console.error('Error al cargar turnos delivery:', error);
            ***REMOVED***
          );
        ***REMOVED***

        // Listener para turnos tradicionales
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
      if (unsubscribeTrabajosDelivery) unsubscribeTrabajosDelivery();
      if (unsubscribeTurnosDelivery) unsubscribeTurnosDelivery();
    ***REMOVED***;
  ***REMOVED***, [currentUser, getUserSubcollections, getUserDeliveryCollections, ensureUserDocument, cargandoTrabajosDelivery]);

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
    trabajos,
    turnos,
    turnosPorFecha: useMemo(() => ***REMOVED***
      const allTurnos = [...turnos, ...turnosDelivery];
      return allTurnos.reduce((acc, turno) => ***REMOVED***
        if (!acc[turno.fecha]) ***REMOVED***
          acc[turno.fecha] = [];
        ***REMOVED***
        acc[turno.fecha].push(turno);
        return acc;
      ***REMOVED***, ***REMOVED******REMOVED***);
    ***REMOVED***, [turnos, turnosDelivery]),
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
    agregarTrabajo: useCallback(async (nuevoTrabajo) => ***REMOVED***
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
          activo: true
        ***REMOVED***;
        const docRef = await addDoc(subcollections.trabajosRef, trabajoConMetadata);
        return ***REMOVED*** ...trabajoConMetadata, id: docRef.id ***REMOVED***;
      ***REMOVED*** catch (err) ***REMOVED***
        setError('Error al agregar trabajo: ' + err.message);
        throw err;
      ***REMOVED***
    ***REMOVED***, [currentUser, getUserSubcollections]),

    editarTrabajo: useCallback(async (id, datosActualizados) => ***REMOVED***
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
    ***REMOVED***, [currentUser, getUserSubcollections]),

    borrarTrabajo: useCallback(async (id) => ***REMOVED***
      try ***REMOVED***
        if (!currentUser) throw new Error('Usuario no autenticado');
        const subcollections = getUserSubcollections();
        if (!subcollections) throw new Error('No se pudieron obtener las referencias de las subcolecciones');
        const trabajoRef = doc(db, 'usuarios', currentUser.uid, 'trabajos', id);
        const trabajoDoc = await getDoc(trabajoRef);
        if (!trabajoDoc.exists()) ***REMOVED***
          setTrabajos(prev => prev.filter(t => t.id !== id));
          return;
        ***REMOVED***
        const turnosAsociados = turnos.filter(turno => turno.trabajoId === id);
        setTurnos(prev => prev.filter(turno => turno.trabajoId !== id));
        const promesasBorradoTurnos = turnosAsociados.map(turno =>
          deleteDoc(doc(subcollections.turnosRef, turno.id))
        );
        await Promise.all(promesasBorradoTurnos);
        await deleteDoc(trabajoRef);
        console.log(`Trabajo eliminado: $***REMOVED***id***REMOVED***`);
      ***REMOVED*** catch (err) ***REMOVED***
        console.error('Error al eliminar trabajo:', err);
        setError('Error al eliminar trabajo: ' + err.message);
        throw err;
      ***REMOVED***
    ***REMOVED***, [currentUser, getUserSubcollections, turnos]),

    // Trabajos delivery
    trabajosDelivery,
    agregarTrabajoDelivery,
    editarTrabajoDelivery,
    borrarTrabajoDelivery,

    // Funciones CRUD para turnos
    turnosDelivery,
    agregarTurno: useCallback(async (nuevoTurno) => ***REMOVED***
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
    ***REMOVED***, [currentUser, getUserSubcollections]),

    editarTurno: useCallback(async (id, datosActualizados) => ***REMOVED***
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
    ***REMOVED***, [currentUser, getUserSubcollections]),

    borrarTurno: useCallback(async (id) => ***REMOVED***
      try ***REMOVED***
        if (!currentUser) throw new Error('Usuario no autenticado');
        const subcollections = getUserSubcollections();
        if (!subcollections) throw new Error('No se pudieron obtener las referencias de las subcolecciones');
        await deleteDoc(doc(subcollections.turnosRef, id));
      ***REMOVED*** catch (err) ***REMOVED***
        setError('Error al eliminar turno: ' + err.message);
        throw err;
      ***REMOVED***
    ***REMOVED***, [currentUser, getUserSubcollections]),

    agregarTurnoDelivery,
    editarTurnoDelivery,
    borrarTurnoDelivery,

    // Funciones de cálculo
    calcularHoras,
    calcularPago,
    calcularTotalDia: useCallback((turnosDia) => ***REMOVED***
      return turnosDia.reduce((total, turno) => ***REMOVED***
        if (turno.tipo === 'delivery') ***REMOVED***
          const gananciaNeta = (turno.gananciaTotal || 0) - (turno.gastoCombustible || 0);
          return ***REMOVED***
            horas: total.horas,
            total: total.total + gananciaNeta
          ***REMOVED***;
        ***REMOVED*** else ***REMOVED***
          const resultado = calcularPago(turno);
          return ***REMOVED***
            horas: total.horas + resultado.horas,
            total: total.total + resultado.total
          ***REMOVED***;
        ***REMOVED***
      ***REMOVED***, ***REMOVED*** horas: 0, total: 0 ***REMOVED***);
    ***REMOVED***, [calcularPago]), 
    formatearFecha,
    actualizarMetaHorasSemanales, 


    // Funciones de configuración
    guardarPreferencias: useCallback(async (preferencias) => ***REMOVED***
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

        // Actualizar estados locales si los valores son proporcionados
        if (nuevoColor !== undefined) setColorPrincipal(nuevoColor);
        if (nuevoEmoji !== undefined) setEmojiUsuario(nuevoEmoji);
        if (nuevoDescuento !== undefined) setDescuentoDefault(nuevoDescuento);
        if (nuevosRangos !== undefined) setRangosTurnos(nuevosRangos);
        if (nuevoDelivery !== undefined) setDeliveryEnabled(nuevoDelivery);

        if (nuevaMeta !== undefined) ***REMOVED***
          setMetaHorasSemanales(nuevaMeta);
          if (nuevaMeta) ***REMOVED***
            localStorage.setItem('metaHorasSemanales', nuevaMeta.toString());
          ***REMOVED*** else ***REMOVED***
            localStorage.removeItem('metaHorasSemanales');
          ***REMOVED***
        ***REMOVED***

        if (nuevoColor !== undefined) localStorage.setItem('colorPrincipal', nuevoColor);
        if (nuevoEmoji !== undefined) localStorage.setItem('emojiUsuario', nuevoEmoji);
        if (nuevoDescuento !== undefined) localStorage.setItem('descuentoDefault', nuevoDescuento.toString());
        if (nuevosRangos !== undefined) localStorage.setItem('rangosTurnos', JSON.stringify(nuevosRangos));
        if (nuevoDelivery !== undefined) localStorage.setItem('deliveryEnabled', nuevoDelivery.toString());


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
    ***REMOVED***, [currentUser]),
  ***REMOVED***;

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

  return (
    <AppContext.Provider value=***REMOVED***contextValue***REMOVED***>
      ***REMOVED***children***REMOVED***
    </AppContext.Provider>
  );
***REMOVED***;