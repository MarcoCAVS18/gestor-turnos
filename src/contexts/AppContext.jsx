// src/contexts/AppContext.jsx - VERSIÓN COMPLETA Y ACTUALIZADA

import React, ***REMOVED*** createContext, useState, useEffect, useContext, useCallback, useMemo ***REMOVED*** from 'react';
import ***REMOVED*** 
  doc, 
  getDoc, 
  getDocs,
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
  const [colorPrincipal, setColorPrincipal] = useState('#EC4899'); // pink-600
  const [emojiUsuario, setEmojiUsuario] = useState('😊');
  const [descuentoDefault, setDescuentoDefault] = useState(15); // 15%
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
      console.log('⚠️ No hay usuario para obtener subcolecciones');
      return null;
    ***REMOVED***
    
    const refs = ***REMOVED***
      trabajosRef: collection(db, 'usuarios', currentUser.uid, 'trabajos'),
      turnosRef: collection(db, 'usuarios', currentUser.uid, 'turnos')
    ***REMOVED***;
    
    console.log('📁 Referencias obtenidas para usuario:', currentUser.uid);
    console.log('🔧 Trabajos path:', refs.trabajosRef.path);
    console.log('⏰ Turnos path:', refs.turnosRef.path);
    
    return refs;
  ***REMOVED***, [currentUser]);

  // Función para crear o verificar documento de usuario
  const ensureUserDocument = useCallback(async () => ***REMOVED***
    if (!currentUser) ***REMOVED***
      console.log('⚠️ No hay usuario para verificar documento');
      return;
    ***REMOVED***
    
    try ***REMOVED***
      console.log('🔍 Verificando documento de usuario:', currentUser.uid);
      const userDocRef = doc(db, 'usuarios', currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      
      if (userDocSnapshot.exists()) ***REMOVED***
        const userData = userDocSnapshot.data();
        console.log('✅ Documento de usuario encontrado');
        console.log('⚙️ Ajustes del usuario:', userData.ajustes);
        
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
        console.log('⚠️ Documento de usuario no encontrado, creando uno nuevo...');
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
        console.log('✅ Documento de usuario creado');
        
        // Establecer valores por defecto
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
      console.error('❌ Error al verificar/crear documento de usuario:', error);
      setError('Error al configurar usuario: ' + error.message);
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  // Función de debugging para verificar manualmente los datos
  const debugFirestore = useCallback(async () => ***REMOVED***
    if (!currentUser) ***REMOVED***
      console.log('🚫 No hay usuario autenticado para debugging');
      return;
    ***REMOVED***
    
    try ***REMOVED***
      console.log('🔍 === DEBUGGING FIRESTORE COMPLETO ===');
      console.log('👤 Usuario actual:', currentUser.uid);
      console.log('📧 Email:', currentUser.email);
      console.log('🕐 Timestamp:', new Date().toISOString());
      
      const subcollections = getUserSubcollections();
      if (!subcollections) ***REMOVED***
        console.log('❌ No se pudieron obtener las subcolecciones');
        return;
      ***REMOVED***
      
      console.log('📁 Referencias de subcolecciones configuradas:');
      console.log('🔧 Trabajos ref path:', subcollections.trabajosRef.path);
      console.log('⏰ Turnos ref path:', subcollections.turnosRef.path);
      
      // Verificar trabajos usando getDocs (lectura directa sin listener)
      console.log('🔍 Verificando trabajos con getDocs...');
      const trabajosSnapshot = await getDocs(subcollections.trabajosRef);
      console.log('📊 Trabajos encontrados en Firestore:', trabajosSnapshot.size);
      
      if (trabajosSnapshot.empty) ***REMOVED***
        console.log('📊 La subcolección de trabajos está vacía');
      ***REMOVED*** else ***REMOVED***
        trabajosSnapshot.forEach((doc, index) => ***REMOVED***
          const data = doc.data();
          console.log(`🔧 Trabajo $***REMOVED***index + 1***REMOVED***:`, ***REMOVED***
            id: doc.id,
            nombre: data.nombre,
            color: data.color,
            tarifaBase: data.tarifaBase,
            fechaCreacion: data.fechaCreacion
          ***REMOVED***);
        ***REMOVED***);
      ***REMOVED***
      
      // Verificar turnos usando getDocs
      console.log('🔍 Verificando turnos con getDocs...');
      const turnosSnapshot = await getDocs(subcollections.turnosRef);
      console.log('📅 Turnos encontrados en Firestore:', turnosSnapshot.size);
      
      if (turnosSnapshot.empty) ***REMOVED***
        console.log('📅 La subcolección de turnos está vacía');
      ***REMOVED*** else ***REMOVED***
        turnosSnapshot.forEach((doc, index) => ***REMOVED***
          const data = doc.data();
          console.log(`⏰ Turno $***REMOVED***index + 1***REMOVED***:`, ***REMOVED***
            id: doc.id,
            fecha: data.fecha,
            trabajoId: data.trabajoId,
            horaInicio: data.horaInicio,
            horaFin: data.horaFin,
            tipo: data.tipo
          ***REMOVED***);
        ***REMOVED***);
      ***REMOVED***
      
      // Estado actual en React
      console.log('🔍 Estado actual en React:');
      console.log('📊 Trabajos en estado:', trabajos.length);
      console.log('📅 Turnos en estado:', turnos.length);
      console.log('⏳ Cargando:', cargando);
      console.log('❌ Error:', error);
      
      console.log('🔍 === FIN DEBUGGING FIRESTORE ===');
      
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('❌ Error crítico en debugging:', error);
      console.error('❌ Código:', error.code);
      console.error('❌ Mensaje:', error.message);
      console.error('❌ Stack:', error.stack);
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserSubcollections, trabajos.length, turnos.length, cargando, error]);

  // Cargar datos y preferencias del usuario
  useEffect(() => ***REMOVED***
    let unsubscribeTrabajos = null;
    let unsubscribeTurnos = null;
    
    // Función para cargar datos reales del usuario desde Firebase
    const cargarDatosUsuario = async () => ***REMOVED***
      if (!currentUser) ***REMOVED***
        console.log('🚫 No hay usuario autenticado, limpiando estados');
        setCargando(false);
        setTrabajos([]);
        setTurnos([]);
        setError(null);
        return;
      ***REMOVED***
      
      try ***REMOVED***
        console.log('🔄 Iniciando carga de datos para usuario:', currentUser.uid);
        setCargando(true);
        setError(null);
        
        // Verificar/crear documento de usuario y cargar preferencias
        await ensureUserDocument();
        
        const subcollections = getUserSubcollections();
        if (!subcollections) ***REMOVED***
          console.log('❌ No se pudieron obtener subcolecciones');
          setCargando(false);
          return;
        ***REMOVED***
        
        // Configurar listener para trabajos
        console.log('🔍 Configurando listener de trabajos...');
        const trabajosQuery = query(
          subcollections.trabajosRef,
          orderBy('nombre', 'asc')
        );
        
        unsubscribeTrabajos = onSnapshot(trabajosQuery, (snapshot) => ***REMOVED***
          console.log('📊 === SNAPSHOT DE TRABAJOS ===');
          console.log('📊 Snapshot metadata:', ***REMOVED***
            size: snapshot.size,
            empty: snapshot.empty,
            hasPendingWrites: snapshot.metadata.hasPendingWrites,
            isFromCache: snapshot.metadata.fromCache
          ***REMOVED***);
          
          if (snapshot.empty) ***REMOVED***
            console.log('📊 Snapshot de trabajos está vacío');
            setTrabajos([]);
          ***REMOVED*** else ***REMOVED***
            const trabajosData = [];
            snapshot.forEach(doc => ***REMOVED***
              const data = ***REMOVED*** id: doc.id, ...doc.data() ***REMOVED***;
              console.log('🔧 Trabajo procesado:', data.nombre, data.id);
              trabajosData.push(data);
            ***REMOVED***);
            
            console.log('📊 Total trabajos a establecer en estado:', trabajosData.length);
            console.log('📊 Lista de nombres:', trabajosData.map(t => t.nombre));
            
            setTrabajos(trabajosData);
          ***REMOVED***
        ***REMOVED***, (error) => ***REMOVED***
          console.error('❌ Error en listener de trabajos:', error);
          console.error('❌ Código:', error.code);
          console.error('❌ Mensaje:', error.message);
          setError('Error al cargar trabajos: ' + error.message);
        ***REMOVED***);
        
        // Configurar listener para turnos
        console.log('🔍 Configurando listener de turnos...');
        const turnosQuery = query(
          subcollections.turnosRef,
          orderBy('fecha', 'desc')
        );
        
        unsubscribeTurnos = onSnapshot(turnosQuery, (snapshot) => ***REMOVED***
          console.log('📅 === SNAPSHOT DE TURNOS ===');
          console.log('📅 Snapshot metadata:', ***REMOVED***
            size: snapshot.size,
            empty: snapshot.empty,
            hasPendingWrites: snapshot.metadata.hasPendingWrites,
            isFromCache: snapshot.metadata.fromCache
          ***REMOVED***);
          
          if (snapshot.empty) ***REMOVED***
            console.log('📅 Snapshot de turnos está vacío');
            setTurnos([]);
          ***REMOVED*** else ***REMOVED***
            const turnosData = [];
            snapshot.forEach(doc => ***REMOVED***
              const data = ***REMOVED*** id: doc.id, ...doc.data() ***REMOVED***;
              console.log('⏰ Turno procesado:', data.fecha, data.id);
              turnosData.push(data);
            ***REMOVED***);
            
            console.log('📅 Total turnos a establecer en estado:', turnosData.length);
            console.log('📅 Lista de fechas:', turnosData.map(t => t.fecha));
            
            setTurnos(turnosData);
          ***REMOVED***
          
          setCargando(false);
          console.log('✅ Carga inicial completada');
        ***REMOVED***, (error) => ***REMOVED***
          console.error('❌ Error en listener de turnos:', error);
          console.error('❌ Código:', error.code);
          console.error('❌ Mensaje:', error.message);
          setError('Error al cargar turnos: ' + error.message);
          setCargando(false);
        ***REMOVED***);
        
        console.log('✅ Listeners configurados exitosamente');
        
      ***REMOVED*** catch (error) ***REMOVED***
        console.error('❌ Error crítico al cargar datos del usuario:', error);
        console.error('❌ Código:', error.code);
        console.error('❌ Mensaje:', error.message);
        setError('Error crítico al cargar datos: ' + error.message);
        setCargando(false);
      ***REMOVED***
    ***REMOVED***;

    cargarDatosUsuario();
    
    // Cleanup cuando el componente se desmonte o cambie el usuario
    return () => ***REMOVED***
      console.log('🧹 Limpiando listeners...');
      if (unsubscribeTrabajos) ***REMOVED***
        unsubscribeTrabajos();
        console.log('🧹 Listener de trabajos desconectado');
      ***REMOVED***
      if (unsubscribeTurnos) ***REMOVED***
        unsubscribeTurnos();
        console.log('🧹 Listener de turnos desconectado');
      ***REMOVED***
    ***REMOVED***;
  ***REMOVED***, [currentUser, getUserSubcollections, ensureUserDocument]);
  
  // Funciones para gestionar trabajos usando subcolecciones
  const agregarTrabajo = useCallback(async (nuevoTrabajo) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) ***REMOVED***
        throw new Error('Usuario no autenticado');
      ***REMOVED***
      
      console.log('➕ Agregando trabajo:', nuevoTrabajo.nombre, 'para usuario:', currentUser.uid);
      
      const subcollections = getUserSubcollections();
      if (!subcollections) ***REMOVED***
        throw new Error('No se pudieron obtener las referencias de las subcolecciones');
      ***REMOVED***
      
      // Validar datos del trabajo
      if (!nuevoTrabajo.nombre || !nuevoTrabajo.nombre.trim()) ***REMOVED***
        throw new Error('El nombre del trabajo es requerido');
      ***REMOVED***
      
      // Añadir metadata (sin userId porque ya está en la subcolección)
      const trabajoConMetadata = ***REMOVED***
        ...nuevoTrabajo,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      ***REMOVED***;
      
      console.log('📤 Datos a guardar:', trabajoConMetadata);
      
      // Guardar en la subcolección del usuario
      const docRef = await addDoc(subcollections.trabajosRef, trabajoConMetadata);
      console.log('✅ Trabajo guardado con ID:', docRef.id);
      
      const trabajoGuardado = ***REMOVED*** ...trabajoConMetadata, id: docRef.id ***REMOVED***;
      
      // Nota: No actualizamos el estado manualmente porque onSnapshot lo hará automáticamente
      console.log('✅ Trabajo procesado, esperando actualización de onSnapshot...');
      
      return trabajoGuardado;
    ***REMOVED*** catch (err) ***REMOVED***
      console.error('❌ Error al agregar trabajo:', err);
      setError('Error al agregar trabajo: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserSubcollections]);
  
  const editarTrabajo = useCallback(async (id, datosActualizados) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) ***REMOVED***
        throw new Error('Usuario no autenticado');
      ***REMOVED***
      
      console.log('✏️ Editando trabajo:', id);
      
      const subcollections = getUserSubcollections();
      if (!subcollections) ***REMOVED***
        throw new Error('No se pudieron obtener las referencias de las subcolecciones');
      ***REMOVED***
      
      // Añadir metadata
      const datosConMetadata = ***REMOVED***
        ...datosActualizados,
        fechaActualizacion: new Date()
      ***REMOVED***;
      
      // Actualizar en la subcolección del usuario
      const docRef = doc(subcollections.trabajosRef, id);
      await updateDoc(docRef, datosConMetadata);
      console.log('✅ Trabajo actualizado:', id);
      
    ***REMOVED*** catch (err) ***REMOVED***
      console.error('❌ Error al editar trabajo:', err);
      setError('Error al editar trabajo: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserSubcollections]);
  
  const borrarTrabajo = useCallback(async (id) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) ***REMOVED***
        throw new Error('Usuario no autenticado');
      ***REMOVED***
      
      console.log('🗑️ Borrando trabajo:', id);
      
      const subcollections = getUserSubcollections();
      if (!subcollections) ***REMOVED***
        throw new Error('No se pudieron obtener las referencias de las subcolecciones');
      ***REMOVED***
      
      // Borrar trabajo de la subcolección
      await deleteDoc(doc(subcollections.trabajosRef, id));
      
      // Borrar turnos asociados de la subcolección
      const turnosAsociados = turnos.filter(turno => turno.trabajoId === id);
      console.log('🗑️ Borrando turnos asociados:', turnosAsociados.length);
      
      const promesasBorrado = turnosAsociados.map(turno => 
        deleteDoc(doc(subcollections.turnosRef, turno.id))
      );
      
      await Promise.all(promesasBorrado);
      console.log('✅ Trabajo y turnos asociados borrados:', id);
      
    ***REMOVED*** catch (err) ***REMOVED***
      console.error('❌ Error al eliminar trabajo:', err);
      setError('Error al eliminar trabajo: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserSubcollections, turnos]);
  
  // Funciones para gestionar turnos usando subcolecciones
  const agregarTurno = useCallback(async (nuevoTurno) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) ***REMOVED***
        throw new Error('Usuario no autenticado');
      ***REMOVED***
      
      console.log('➕ Agregando turno:', nuevoTurno.fecha, 'para usuario:', currentUser.uid);
      
      const subcollections = getUserSubcollections();
      if (!subcollections) ***REMOVED***
        throw new Error('No se pudieron obtener las referencias de las subcolecciones');
      ***REMOVED***
      
      // Validar datos del turno
      if (!nuevoTurno.trabajoId || !nuevoTurno.fecha || !nuevoTurno.horaInicio || !nuevoTurno.horaFin) ***REMOVED***
        throw new Error('Todos los campos del turno son requeridos');
      ***REMOVED***
      
      // Añadir metadata (sin userId porque ya está en la subcolección)
      const turnoConMetadata = ***REMOVED***
        ...nuevoTurno,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      ***REMOVED***;
      
      console.log('📤 Datos del turno a guardar:', turnoConMetadata);
      
      // Guardar en la subcolección del usuario
      const docRef = await addDoc(subcollections.turnosRef, turnoConMetadata);
      console.log('✅ Turno guardado con ID:', docRef.id);
      
      const turnoGuardado = ***REMOVED*** ...turnoConMetadata, id: docRef.id ***REMOVED***;
      
      // Nota: No actualizamos el estado manualmente porque onSnapshot lo hará automáticamente
      console.log('✅ Turno procesado, esperando actualización de onSnapshot...');
      
      return turnoGuardado;
    ***REMOVED*** catch (err) ***REMOVED***
      console.error('❌ Error al agregar turno:', err);
      setError('Error al agregar turno: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserSubcollections]);
  
  const editarTurno = useCallback(async (id, datosActualizados) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) ***REMOVED***
        throw new Error('Usuario no autenticado');
      ***REMOVED***
      
      console.log('✏️ Editando turno:', id);
      
      const subcollections = getUserSubcollections();
      if (!subcollections) ***REMOVED***
        throw new Error('No se pudieron obtener las referencias de las subcolecciones');
      ***REMOVED***
      
      // Añadir metadata
      const datosConMetadata = ***REMOVED***
        ...datosActualizados,
        fechaActualizacion: new Date()
      ***REMOVED***;
      
      // Actualizar en la subcolección del usuario
      const docRef = doc(subcollections.turnosRef, id);
      await updateDoc(docRef, datosConMetadata);
      console.log('✅ Turno actualizado:', id);
      
    ***REMOVED*** catch (err) ***REMOVED***
      console.error('❌ Error al editar turno:', err);
      setError('Error al editar turno: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserSubcollections]);
  
  const borrarTurno = useCallback(async (id) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) ***REMOVED***
        throw new Error('Usuario no autenticado');
      ***REMOVED***
      
      console.log('🗑️ Borrando turno:', id);
      
      const subcollections = getUserSubcollections();
      if (!subcollections) ***REMOVED***
        throw new Error('No se pudieron obtener las referencias de las subcolecciones');
      ***REMOVED***
      
      // Borrar de la subcolección del usuario
      await deleteDoc(doc(subcollections.turnosRef, id));
      console.log('✅ Turno borrado:', id);
      
    ***REMOVED*** catch (err) ***REMOVED***
      console.error('❌ Error al eliminar turno:', err);
      setError('Error al eliminar turno: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser, getUserSubcollections]);
  
  // Función para guardar preferencias de usuario
  const guardarPreferencias = useCallback(async (preferencias) => ***REMOVED***
    try ***REMOVED***
      if (!currentUser) ***REMOVED***
        throw new Error('Usuario no autenticado');
      ***REMOVED***
      
      console.log('💾 Guardando preferencias:', preferencias);
      
      const ***REMOVED*** 
        colorPrincipal: nuevoColor, 
        emojiUsuario: nuevoEmoji, 
        descuentoDefault: nuevoDescuento,
        rangosTurnos: nuevosRangos
      ***REMOVED*** = preferencias;
      
      // Actualizar estados locales inmediatamente
      if (nuevoColor !== undefined) setColorPrincipal(nuevoColor);
      if (nuevoEmoji !== undefined) setEmojiUsuario(nuevoEmoji);
      if (nuevoDescuento !== undefined) setDescuentoDefault(nuevoDescuento);
      if (nuevosRangos !== undefined) setRangosTurnos(nuevosRangos);
      
      // Guardar en localStorage para persistencia local
      if (nuevoColor !== undefined) localStorage.setItem('colorPrincipal', nuevoColor);
      if (nuevoEmoji !== undefined) localStorage.setItem('emojiUsuario', nuevoEmoji);
      if (nuevoDescuento !== undefined) localStorage.setItem('descuentoDefault', nuevoDescuento.toString());
      if (nuevosRangos !== undefined) localStorage.setItem('rangosTurnos', JSON.stringify(nuevosRangos));
      
      // Guardar en Firebase
      const userDocRef = doc(db, 'usuarios', currentUser.uid);
      
      // Crear un objeto con solo las propiedades que se están actualizando
      const datosActualizados = ***REMOVED******REMOVED***;
      
      if (nuevoColor !== undefined) datosActualizados['ajustes.colorPrincipal'] = nuevoColor;
      if (nuevoEmoji !== undefined) datosActualizados['ajustes.emojiUsuario'] = nuevoEmoji;
      if (nuevoDescuento !== undefined) datosActualizados['ajustes.descuentoDefault'] = nuevoDescuento;
      if (nuevosRangos !== undefined) datosActualizados['ajustes.rangosTurnos'] = nuevosRangos;
      datosActualizados['fechaActualizacion'] = new Date();
      
      // Solo actualizar en Firebase si hay algo que actualizar
      if (Object.keys(datosActualizados).length > 1) ***REMOVED*** // Más de 1 porque siempre incluye fechaActualizacion
        await updateDoc(userDocRef, datosActualizados);
        console.log('✅ Preferencias guardadas en Firebase');
      ***REMOVED***
      
      return true;
    ***REMOVED*** catch (err) ***REMOVED***
      console.error('❌ Error al guardar preferencias:', err);
      setError('Error al guardar preferencias: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);
  
  // Agrupar turnos por fecha
  const turnosPorFecha = turnos.reduce((acc, turno) => ***REMOVED***
    if (!acc[turno.fecha]) ***REMOVED***
      acc[turno.fecha] = [];
    ***REMOVED***
    acc[turno.fecha].push(turno);
    return acc;
  ***REMOVED***, ***REMOVED******REMOVED***);
  
  // Calcular horas trabajadas
  const calcularHoras = useCallback((inicio, fin) => ***REMOVED***
    const [horaInicio, minInicio] = inicio.split(':').map(n => parseInt(n));
    const [horaFin, minFin] = fin.split(':').map(n => parseInt(n));
    
    const inicioMinutos = horaInicio * 60 + minInicio;
    const finMinutos = horaFin * 60 + minFin;
    
    return (finMinutos - inicioMinutos) / 60;
  ***REMOVED***, []);
  
  // Calcular el pago de un turno
  const calcularPago = useCallback((turno) => ***REMOVED***
    const trabajo = trabajos.find(t => t.id === turno.trabajoId);
    if (!trabajo) return ***REMOVED*** total: 0, totalConDescuento: 0, horas: 0 ***REMOVED***;
    
    const horas = calcularHoras(turno.horaInicio, turno.horaFin);
    let tarifa = trabajo.tarifaBase;
    
    switch (turno.tipo) ***REMOVED***
      case 'diurno':
        tarifa = trabajo.tarifas.diurno;
        break;
      case 'tarde':
        tarifa = trabajo.tarifas.tarde;
        break;
      case 'noche':
        tarifa = trabajo.tarifas.noche;
        break;
      case 'sabado':
        tarifa = trabajo.tarifas.sabado;
        break;
      case 'domingo':
        tarifa = trabajo.tarifas.domingo;
        break;
      default:
        tarifa = trabajo.tarifaBase;
    ***REMOVED***
    
    const total = horas * tarifa;
    const totalConDescuento = total * (1 - descuentoDefault / 100); 
    
    return ***REMOVED***
      total,
      totalConDescuento,
      horas
    ***REMOVED***;
  ***REMOVED***, [trabajos, calcularHoras, descuentoDefault]);
  
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
    const fecha = new Date(fechaStr);
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
    guardarPreferencias,
    
    // Función de debugging
    debugFirestore
  ***REMOVED***;
  
  return (
    <AppContext.Provider value=***REMOVED***contextValue***REMOVED***>
      ***REMOVED***children***REMOVED***
    </AppContext.Provider>
  );
***REMOVED***;

export default AppContext;