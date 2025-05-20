// src/contexts/AppContext.jsx
import React, ***REMOVED*** createContext, useState, useEffect, useContext ***REMOVED*** from 'react';
import ***REMOVED*** 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy 
***REMOVED*** from 'firebase/firestore';
import ***REMOVED*** db ***REMOVED*** from '../services/firebase';
import ***REMOVED*** useAuth ***REMOVED*** from './AuthContext';

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
  const [colorPrincipal, setColorPrincipal] = useState('#EC4899'); // pink-600 por defecto
  const [emojiUsuario, setEmojiUsuario] = useState('😊'); // emoji predeterminado
  const [descuentoDefault, setDescuentoDefault] = useState(15); // 15% por defecto
  
  // Estado para uso local vs desarrollo
  const [modoDesarrollo, setModoDesarrollo] = useState(true);
  
  // Cargar datos y preferencias del usuario
  useEffect(() => ***REMOVED***
    // Función para cargar datos de desarrollo (modo demo)
    const cargarDatosDeDesarrollo = () => ***REMOVED***
      const trabajosData = [
        ***REMOVED***
          id: 'trabajo-1',
          nombre: 'SunCorp Stadium',
          color: '#FFC107',
          tarifaBase: 30.13,
          tarifas: ***REMOVED***
            diurno: 30.13,
            tarde: 33.14,
            noche: 36.16,
            sabado: 45.20,
            domingo: 60.26
          ***REMOVED***
        ***REMOVED***,
        ***REMOVED***
          id: 'trabajo-2',
          nombre: 'StaffLink',
          color: '#4CAF50',
          tarifaBase: 28.50,
          tarifas: ***REMOVED***
            diurno: 28.50,
            tarde: 31.35,
            noche: 34.20,
            sabado: 42.75,
            domingo: 57.00
          ***REMOVED***
        ***REMOVED***
      ];

      const turnosData = [
        ***REMOVED***
          id: 'turno-1',
          trabajoId: 'trabajo-1',
          fecha: '2025-05-19',
          horaInicio: '17:00',
          horaFin: '23:30',
          tipo: 'tarde'
        ***REMOVED***,
        ***REMOVED***
          id: 'turno-2',
          trabajoId: 'trabajo-2',
          fecha: '2025-05-19',
          horaInicio: '08:00',
          horaFin: '11:30',
          tipo: 'diurno'
        ***REMOVED***
      ];
      
      setTrabajos(trabajosData);
      setTurnos(turnosData);
      
      // Cargar preferencias almacenadas en localStorage (si existen)
      const colorGuardado = localStorage.getItem('colorPrincipal');
      const emojiGuardado = localStorage.getItem('emojiUsuario');
      const descuentoGuardado = localStorage.getItem('descuentoDefault');
      
      if (colorGuardado) setColorPrincipal(colorGuardado);
      if (emojiGuardado) setEmojiUsuario(emojiGuardado);
      if (descuentoGuardado) setDescuentoDefault(Number(descuentoGuardado));
    ***REMOVED***;
    
    // Función para cargar datos reales del usuario desde Firebase
    const cargarDatosUsuario = async () => ***REMOVED***
      if (!currentUser) return;
      
      try ***REMOVED***
        // Cargar trabajos del usuario
        const trabajosRef = collection(db, 'trabajos');
        const trabajosQuery = query(
          trabajosRef,
          where('userId', '==', currentUser.uid),
          orderBy('nombre', 'asc')
        );
        
        const trabajosSnapshot = await getDocs(trabajosQuery);
        const trabajosData = trabajosSnapshot.docs.map(doc => (***REMOVED***
          id: doc.id,
          ...doc.data()
        ***REMOVED***));
        
        // Cargar turnos del usuario
        const turnosRef = collection(db, 'turnos');
        const turnosQuery = query(
          turnosRef,
          where('userId', '==', currentUser.uid),
          orderBy('fecha', 'desc')
        );
        
        const turnosSnapshot = await getDocs(turnosQuery);
        const turnosData = turnosSnapshot.docs.map(doc => (***REMOVED***
          id: doc.id,
          ...doc.data()
        ***REMOVED***));
        
        // Cargar preferencias del usuario
        const userDocRef = doc(db, 'usuarios', currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        
        if (userDocSnapshot.exists()) ***REMOVED***
          const userData = userDocSnapshot.data();
          if (userData.ajustes) ***REMOVED***
            // Establecer preferencias si existen
            setColorPrincipal(userData.ajustes.colorPrincipal || '#EC4899');
            setEmojiUsuario(userData.ajustes.emojiUsuario || '😊');
            setDescuentoDefault(userData.ajustes.descuentoDefault || 15);
          ***REMOVED***
        ***REMOVED***
        
        // Actualizar estados
        setTrabajos(trabajosData);
        setTurnos(turnosData);
      ***REMOVED*** catch (error) ***REMOVED***
        console.error('Error al cargar datos del usuario:', error);
        throw error;
      ***REMOVED***
    ***REMOVED***;

    // Función principal que decide qué datos cargar
    const cargarDatos = async () => ***REMOVED***
      if (!currentUser) ***REMOVED***
        // Si no hay usuario logueado, usar datos de desarrollo
        cargarDatosDeDesarrollo();
        return;
      ***REMOVED***
      
      try ***REMOVED***
        setCargando(true);
        
        if (modoDesarrollo) ***REMOVED***
          cargarDatosDeDesarrollo();
        ***REMOVED*** else ***REMOVED***
          // Cargar datos reales desde Firebase
          await cargarDatosUsuario();
        ***REMOVED***
        
        setCargando(false);
      ***REMOVED*** catch (err) ***REMOVED***
        setError('Error al cargar datos: ' + err.message);
        setCargando(false);
      ***REMOVED***
    ***REMOVED***;
    
    cargarDatos();
  ***REMOVED***, [currentUser, modoDesarrollo]); // Dependencias reducidas
  
  // Funciones para gestionar trabajos
  const agregarTrabajo = async (nuevoTrabajo) => ***REMOVED***
    try ***REMOVED***
      let trabajoGuardado;
      
      if (modoDesarrollo) ***REMOVED***
        trabajoGuardado = ***REMOVED***
          ...nuevoTrabajo,
          id: `trabajo-$***REMOVED***Date.now()***REMOVED***`
        ***REMOVED***;
      ***REMOVED*** else ***REMOVED***
        // Añadir userId y timestamps
        const trabajoConMetadata = ***REMOVED***
          ...nuevoTrabajo,
          userId: currentUser.uid,
          fechaCreacion: new Date(),
          fechaActualizacion: new Date()
        ***REMOVED***;
        
        // Guardar en Firebase
        const docRef = await addDoc(collection(db, 'trabajos'), trabajoConMetadata);
        trabajoGuardado = ***REMOVED*** ...trabajoConMetadata, id: docRef.id ***REMOVED***;
      ***REMOVED***
      
      setTrabajos([...trabajos, trabajoGuardado]);
      return trabajoGuardado;
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al agregar trabajo: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***;
  
  const editarTrabajo = async (id, datosActualizados) => ***REMOVED***
    try ***REMOVED***
      if (!modoDesarrollo) ***REMOVED***
        // Añadir metadata
        const datosConMetadata = ***REMOVED***
          ...datosActualizados,
          fechaActualizacion: new Date()
        ***REMOVED***;
        
        // Actualizar en Firebase
        const docRef = doc(db, 'trabajos', id);
        await updateDoc(docRef, datosConMetadata);
      ***REMOVED***
      
      // Actualizar estado local
      setTrabajos(trabajos.map(trabajo => 
        trabajo.id === id ? ***REMOVED*** ...trabajo, ...datosActualizados ***REMOVED*** : trabajo
      ));
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al editar trabajo: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***;
  
  const borrarTrabajo = async (id) => ***REMOVED***
    try ***REMOVED***
      if (!modoDesarrollo) ***REMOVED***
        // Borrar de Firebase
        await deleteDoc(doc(db, 'trabajos', id));
        
        // También borrar los turnos asociados
        const turnosRef = collection(db, 'turnos');
        const turnosQuery = query(
          turnosRef,
          where('userId', '==', currentUser.uid),
          where('trabajoId', '==', id)
        );
        
        const turnosSnapshot = await getDocs(turnosQuery);
        const batch = [];
        
        turnosSnapshot.forEach(doc => ***REMOVED***
          batch.push(deleteDoc(doc.ref));
        ***REMOVED***);
        
        await Promise.all(batch);
      ***REMOVED***
      
      // Actualizar estados locales
      setTrabajos(trabajos.filter(trabajo => trabajo.id !== id));
      setTurnos(turnos.filter(turno => turno.trabajoId !== id));
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al eliminar trabajo: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***;
  
  // Funciones para gestionar turnos
  const agregarTurno = async (nuevoTurno) => ***REMOVED***
    try ***REMOVED***
      let turnoGuardado;
      
      if (modoDesarrollo) ***REMOVED***
        turnoGuardado = ***REMOVED***
          ...nuevoTurno,
          id: `turno-$***REMOVED***Date.now()***REMOVED***`
        ***REMOVED***;
      ***REMOVED*** else ***REMOVED***
        // Añadir userId y timestamps
        const turnoConMetadata = ***REMOVED***
          ...nuevoTurno,
          userId: currentUser.uid,
          fechaCreacion: new Date(),
          fechaActualizacion: new Date()
        ***REMOVED***;
        
        // Guardar en Firebase
        const docRef = await addDoc(collection(db, 'turnos'), turnoConMetadata);
        turnoGuardado = ***REMOVED*** ...turnoConMetadata, id: docRef.id ***REMOVED***;
      ***REMOVED***
      
      setTurnos([...turnos, turnoGuardado]);
      return turnoGuardado;
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al agregar turno: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***;
  
  const editarTurno = async (id, datosActualizados) => ***REMOVED***
    try ***REMOVED***
      if (!modoDesarrollo) ***REMOVED***
        // Añadir metadata
        const datosConMetadata = ***REMOVED***
          ...datosActualizados,
          fechaActualizacion: new Date()
        ***REMOVED***;
        
        // Actualizar en Firebase
        const docRef = doc(db, 'turnos', id);
        await updateDoc(docRef, datosConMetadata);
      ***REMOVED***
      
      // Actualizar estado local
      setTurnos(turnos.map(turno => 
        turno.id === id ? ***REMOVED*** ...turno, ...datosActualizados ***REMOVED*** : turno
      ));
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al editar turno: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***;
  
  const borrarTurno = async (id) => ***REMOVED***
    try ***REMOVED***
      if (!modoDesarrollo) ***REMOVED***
        // Borrar de Firebase
        await deleteDoc(doc(db, 'turnos', id));
      ***REMOVED***
      
      // Actualizar estado local
      setTurnos(turnos.filter(turno => turno.id !== id));
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al eliminar turno: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***;
  
  // Función para guardar preferencias de usuario
  const guardarPreferencias = async (preferencias) => ***REMOVED***
    try ***REMOVED***
      const ***REMOVED*** colorPrincipal: nuevoColor, emojiUsuario: nuevoEmoji, descuentoDefault: nuevoDescuento ***REMOVED*** = preferencias;
      
      // Actualizar estados locales inmediatamente
      if (nuevoColor !== undefined) setColorPrincipal(nuevoColor);
      if (nuevoEmoji !== undefined) setEmojiUsuario(nuevoEmoji);
      if (nuevoDescuento !== undefined) setDescuentoDefault(nuevoDescuento);
      
      // Guardar en localStorage para persistencia local
      if (nuevoColor !== undefined) localStorage.setItem('colorPrincipal', nuevoColor);
      if (nuevoEmoji !== undefined) localStorage.setItem('emojiUsuario', nuevoEmoji);
      if (nuevoDescuento !== undefined) localStorage.setItem('descuentoDefault', nuevoDescuento.toString());
      
      // Si no estamos en modo desarrollo y hay un usuario logueado, guardar en Firebase
      if (!modoDesarrollo && currentUser) ***REMOVED***
        const userDocRef = doc(db, 'usuarios', currentUser.uid);
        
        // Crear un objeto con solo las propiedades que se están actualizando
        const datosActualizados = ***REMOVED******REMOVED***;
        
        if (nuevoColor !== undefined) datosActualizados['ajustes.colorPrincipal'] = nuevoColor;
        if (nuevoEmoji !== undefined) datosActualizados['ajustes.emojiUsuario'] = nuevoEmoji;
        if (nuevoDescuento !== undefined) datosActualizados['ajustes.descuentoDefault'] = nuevoDescuento;
        datosActualizados['fechaActualizacion'] = new Date();
        
        // Solo actualizar en Firebase si hay algo que actualizar
        if (Object.keys(datosActualizados).length > 1) ***REMOVED*** // Más de 1 porque siempre incluye fechaActualizacion
          await updateDoc(userDocRef, datosActualizados);
        ***REMOVED***
      ***REMOVED***
      
      return true;
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al guardar preferencias: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***;
  
  // Función para cambiar entre modo desarrollo y producción
  const toggleModoDesarrollo = () => ***REMOVED***
    setModoDesarrollo(!modoDesarrollo);
  ***REMOVED***;
  
  // Agrupar turnos por fecha
  const turnosPorFecha = turnos.reduce((acc, turno) => ***REMOVED***
    if (!acc[turno.fecha]) ***REMOVED***
      acc[turno.fecha] = [];
    ***REMOVED***
    acc[turno.fecha].push(turno);
    return acc;
  ***REMOVED***, ***REMOVED******REMOVED***);
  
  // Calcular horas trabajadas
  const calcularHoras = (inicio, fin) => ***REMOVED***
    const [horaInicio, minInicio] = inicio.split(':').map(n => parseInt(n));
    const [horaFin, minFin] = fin.split(':').map(n => parseInt(n));
    
    const inicioMinutos = horaInicio * 60 + minInicio;
    const finMinutos = horaFin * 60 + minFin;
    
    return (finMinutos - inicioMinutos) / 60;
  ***REMOVED***;
  
  // Calcular el pago de un turno
  const calcularPago = (turno) => ***REMOVED***
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
  ***REMOVED***;
  
  // Calcular total del día
  const calcularTotalDia = (turnosDia) => ***REMOVED***
    let total = 0;
    turnosDia.forEach(turno => ***REMOVED***
      const ***REMOVED*** totalConDescuento ***REMOVED*** = calcularPago(turno);
      total += totalConDescuento;
    ***REMOVED***);
    return total;
  ***REMOVED***;
  
  // Formatear fecha
  const formatearFecha = (fechaStr) => ***REMOVED***
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', ***REMOVED*** 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    ***REMOVED***);
  ***REMOVED***;
  
  // Valor del contexto
  const contextValue = ***REMOVED***
    trabajos,
    turnos,
    turnosPorFecha,
    cargando,
    error,
    modoDesarrollo,
    colorPrincipal,
    emojiUsuario,
    descuentoDefault,
    toggleModoDesarrollo,
    agregarTrabajo,
    editarTrabajo,
    borrarTrabajo,
    agregarTurno,
    editarTurno,
    borrarTurno,
    calcularHoras,
    calcularPago,
    calcularTotalDia,
    formatearFecha,
    guardarPreferencias
  ***REMOVED***;
  
  return (
    <AppContext.Provider value=***REMOVED***contextValue***REMOVED***>
      ***REMOVED***children***REMOVED***
    </AppContext.Provider>
  );
***REMOVED***;

export default AppContext;