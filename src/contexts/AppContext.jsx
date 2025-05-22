// src/contexts/AppContext.jsx - VERSIÓN COMPLETA Y ACTUALIZADA

import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { 
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
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';
import { generateColorVariations } from '../utils/colorUtils';

// Crear el contexto
export const AppContext = createContext();

// Hook personalizado para usar el contexto
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de un AppProvider');
  }
  return context;
};

// Proveedor del contexto
export const AppProvider = ({ children }) => {
  const { currentUser } = useAuth();
  
  // Estados para los datos principales
  const [trabajos, setTrabajos] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para preferencias de personalización
  const [colorPrincipal, setColorPrincipal] = useState('#EC4899'); // pink-600
  const [emojiUsuario, setEmojiUsuario] = useState('😊');
  const [descuentoDefault, setDescuentoDefault] = useState(15); // 15%
  const [rangosTurnos, setRangosTurnos] = useState({
    diurnoInicio: 6,
    diurnoFin: 14,
    tardeInicio: 14,
    tardeFin: 20,
    nocheInicio: 20
  });

  // Generar variaciones de color basadas en el color principal
  const coloresTemáticos = useMemo(() => {
    return generateColorVariations(colorPrincipal);
  }, [colorPrincipal]);

  // Función para obtener las referencias de las subcolecciones del usuario
  const getUserSubcollections = useCallback(() => {
    if (!currentUser) {
      console.log('⚠️ No hay usuario para obtener subcolecciones');
      return null;
    }
    
    const refs = {
      trabajosRef: collection(db, 'usuarios', currentUser.uid, 'trabajos'),
      turnosRef: collection(db, 'usuarios', currentUser.uid, 'turnos')
    };
    
    console.log('📁 Referencias obtenidas para usuario:', currentUser.uid);
    console.log('🔧 Trabajos path:', refs.trabajosRef.path);
    console.log('⏰ Turnos path:', refs.turnosRef.path);
    
    return refs;
  }, [currentUser]);

  // Función para crear o verificar documento de usuario
  const ensureUserDocument = useCallback(async () => {
    if (!currentUser) {
      console.log('⚠️ No hay usuario para verificar documento');
      return;
    }
    
    try {
      console.log('🔍 Verificando documento de usuario:', currentUser.uid);
      const userDocRef = doc(db, 'usuarios', currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        console.log('✅ Documento de usuario encontrado');
        console.log('⚙️ Ajustes del usuario:', userData.ajustes);
        
        if (userData.ajustes) {
          setColorPrincipal(userData.ajustes.colorPrincipal || '#EC4899');
          setEmojiUsuario(userData.ajustes.emojiUsuario || '😊');
          setDescuentoDefault(userData.ajustes.descuentoDefault || 15);
          setRangosTurnos(userData.ajustes.rangosTurnos || {
            diurnoInicio: 6,
            diurnoFin: 14,
            tardeInicio: 14,
            tardeFin: 20,
            nocheInicio: 20
          });
        }
      } else {
        console.log('⚠️ Documento de usuario no encontrado, creando uno nuevo...');
        const defaultUserData = {
          email: currentUser.email,
          displayName: currentUser.displayName || 'Usuario',
          fechaCreacion: new Date(),
          ajustes: {
            colorPrincipal: '#EC4899',
            emojiUsuario: '😊',
            descuentoDefault: 15,
            rangosTurnos: {
              diurnoInicio: 6,
              diurnoFin: 14,
              tardeInicio: 14,
              tardeFin: 20,
              nocheInicio: 20
            }
          }
        };
        
        await setDoc(userDocRef, defaultUserData);
        console.log('✅ Documento de usuario creado');
        
        // Establecer valores por defecto
        setColorPrincipal('#EC4899');
        setEmojiUsuario('😊');
        setDescuentoDefault(15);
        setRangosTurnos({
          diurnoInicio: 6,
          diurnoFin: 14,
          tardeInicio: 14,
          tardeFin: 20,
          nocheInicio: 20
        });
      }
    } catch (error) {
      console.error('❌ Error al verificar/crear documento de usuario:', error);
      setError('Error al configurar usuario: ' + error.message);
    }
  }, [currentUser]);

  // Función de debugging para verificar manualmente los datos
  const debugFirestore = useCallback(async () => {
    if (!currentUser) {
      console.log('🚫 No hay usuario autenticado para debugging');
      return;
    }
    
    try {
      console.log('🔍 === DEBUGGING FIRESTORE COMPLETO ===');
      console.log('👤 Usuario actual:', currentUser.uid);
      console.log('📧 Email:', currentUser.email);
      console.log('🕐 Timestamp:', new Date().toISOString());
      
      const subcollections = getUserSubcollections();
      if (!subcollections) {
        console.log('❌ No se pudieron obtener las subcolecciones');
        return;
      }
      
      console.log('📁 Referencias de subcolecciones configuradas:');
      console.log('🔧 Trabajos ref path:', subcollections.trabajosRef.path);
      console.log('⏰ Turnos ref path:', subcollections.turnosRef.path);
      
      // Verificar trabajos usando getDocs (lectura directa sin listener)
      console.log('🔍 Verificando trabajos con getDocs...');
      const trabajosSnapshot = await getDocs(subcollections.trabajosRef);
      console.log('📊 Trabajos encontrados en Firestore:', trabajosSnapshot.size);
      
      if (trabajosSnapshot.empty) {
        console.log('📊 La subcolección de trabajos está vacía');
      } else {
        trabajosSnapshot.forEach((doc, index) => {
          const data = doc.data();
          console.log(`🔧 Trabajo ${index + 1}:`, {
            id: doc.id,
            nombre: data.nombre,
            color: data.color,
            tarifaBase: data.tarifaBase,
            fechaCreacion: data.fechaCreacion
          });
        });
      }
      
      // Verificar turnos usando getDocs
      console.log('🔍 Verificando turnos con getDocs...');
      const turnosSnapshot = await getDocs(subcollections.turnosRef);
      console.log('📅 Turnos encontrados en Firestore:', turnosSnapshot.size);
      
      if (turnosSnapshot.empty) {
        console.log('📅 La subcolección de turnos está vacía');
      } else {
        turnosSnapshot.forEach((doc, index) => {
          const data = doc.data();
          console.log(`⏰ Turno ${index + 1}:`, {
            id: doc.id,
            fecha: data.fecha,
            trabajoId: data.trabajoId,
            horaInicio: data.horaInicio,
            horaFin: data.horaFin,
            tipo: data.tipo
          });
        });
      }
      
      // Estado actual en React
      console.log('🔍 Estado actual en React:');
      console.log('📊 Trabajos en estado:', trabajos.length);
      console.log('📅 Turnos en estado:', turnos.length);
      console.log('⏳ Cargando:', cargando);
      console.log('❌ Error:', error);
      
      console.log('🔍 === FIN DEBUGGING FIRESTORE ===');
      
    } catch (error) {
      console.error('❌ Error crítico en debugging:', error);
      console.error('❌ Código:', error.code);
      console.error('❌ Mensaje:', error.message);
      console.error('❌ Stack:', error.stack);
    }
  }, [currentUser, getUserSubcollections, trabajos.length, turnos.length, cargando, error]);

  // Cargar datos y preferencias del usuario
  useEffect(() => {
    let unsubscribeTrabajos = null;
    let unsubscribeTurnos = null;
    
    // Función para cargar datos reales del usuario desde Firebase
    const cargarDatosUsuario = async () => {
      if (!currentUser) {
        console.log('🚫 No hay usuario autenticado, limpiando estados');
        setCargando(false);
        setTrabajos([]);
        setTurnos([]);
        setError(null);
        return;
      }
      
      try {
        console.log('🔄 Iniciando carga de datos para usuario:', currentUser.uid);
        setCargando(true);
        setError(null);
        
        // Verificar/crear documento de usuario y cargar preferencias
        await ensureUserDocument();
        
        const subcollections = getUserSubcollections();
        if (!subcollections) {
          console.log('❌ No se pudieron obtener subcolecciones');
          setCargando(false);
          return;
        }
        
        // Configurar listener para trabajos
        console.log('🔍 Configurando listener de trabajos...');
        const trabajosQuery = query(
          subcollections.trabajosRef,
          orderBy('nombre', 'asc')
        );
        
        unsubscribeTrabajos = onSnapshot(trabajosQuery, (snapshot) => {
          console.log('📊 === SNAPSHOT DE TRABAJOS ===');
          console.log('📊 Snapshot metadata:', {
            size: snapshot.size,
            empty: snapshot.empty,
            hasPendingWrites: snapshot.metadata.hasPendingWrites,
            isFromCache: snapshot.metadata.fromCache
          });
          
          if (snapshot.empty) {
            console.log('📊 Snapshot de trabajos está vacío');
            setTrabajos([]);
          } else {
            const trabajosData = [];
            snapshot.forEach(doc => {
              const data = { id: doc.id, ...doc.data() };
              console.log('🔧 Trabajo procesado:', data.nombre, data.id);
              trabajosData.push(data);
            });
            
            console.log('📊 Total trabajos a establecer en estado:', trabajosData.length);
            console.log('📊 Lista de nombres:', trabajosData.map(t => t.nombre));
            
            setTrabajos(trabajosData);
          }
        }, (error) => {
          console.error('❌ Error en listener de trabajos:', error);
          console.error('❌ Código:', error.code);
          console.error('❌ Mensaje:', error.message);
          setError('Error al cargar trabajos: ' + error.message);
        });
        
        // Configurar listener para turnos
        console.log('🔍 Configurando listener de turnos...');
        const turnosQuery = query(
          subcollections.turnosRef,
          orderBy('fecha', 'desc')
        );
        
        unsubscribeTurnos = onSnapshot(turnosQuery, (snapshot) => {
          console.log('📅 === SNAPSHOT DE TURNOS ===');
          console.log('📅 Snapshot metadata:', {
            size: snapshot.size,
            empty: snapshot.empty,
            hasPendingWrites: snapshot.metadata.hasPendingWrites,
            isFromCache: snapshot.metadata.fromCache
          });
          
          if (snapshot.empty) {
            console.log('📅 Snapshot de turnos está vacío');
            setTurnos([]);
          } else {
            const turnosData = [];
            snapshot.forEach(doc => {
              const data = { id: doc.id, ...doc.data() };
              console.log('⏰ Turno procesado:', data.fecha, data.id);
              turnosData.push(data);
            });
            
            console.log('📅 Total turnos a establecer en estado:', turnosData.length);
            console.log('📅 Lista de fechas:', turnosData.map(t => t.fecha));
            
            setTurnos(turnosData);
          }
          
          setCargando(false);
          console.log('✅ Carga inicial completada');
        }, (error) => {
          console.error('❌ Error en listener de turnos:', error);
          console.error('❌ Código:', error.code);
          console.error('❌ Mensaje:', error.message);
          setError('Error al cargar turnos: ' + error.message);
          setCargando(false);
        });
        
        console.log('✅ Listeners configurados exitosamente');
        
      } catch (error) {
        console.error('❌ Error crítico al cargar datos del usuario:', error);
        console.error('❌ Código:', error.code);
        console.error('❌ Mensaje:', error.message);
        setError('Error crítico al cargar datos: ' + error.message);
        setCargando(false);
      }
    };

    cargarDatosUsuario();
    
    // Cleanup cuando el componente se desmonte o cambie el usuario
    return () => {
      console.log('🧹 Limpiando listeners...');
      if (unsubscribeTrabajos) {
        unsubscribeTrabajos();
        console.log('🧹 Listener de trabajos desconectado');
      }
      if (unsubscribeTurnos) {
        unsubscribeTurnos();
        console.log('🧹 Listener de turnos desconectado');
      }
    };
  }, [currentUser, getUserSubcollections, ensureUserDocument]);
  
  // Funciones para gestionar trabajos usando subcolecciones
  const agregarTrabajo = useCallback(async (nuevoTrabajo) => {
    try {
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }
      
      console.log('➕ Agregando trabajo:', nuevoTrabajo.nombre, 'para usuario:', currentUser.uid);
      
      const subcollections = getUserSubcollections();
      if (!subcollections) {
        throw new Error('No se pudieron obtener las referencias de las subcolecciones');
      }
      
      // Validar datos del trabajo
      if (!nuevoTrabajo.nombre || !nuevoTrabajo.nombre.trim()) {
        throw new Error('El nombre del trabajo es requerido');
      }
      
      // Añadir metadata (sin userId porque ya está en la subcolección)
      const trabajoConMetadata = {
        ...nuevoTrabajo,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      };
      
      console.log('📤 Datos a guardar:', trabajoConMetadata);
      
      // Guardar en la subcolección del usuario
      const docRef = await addDoc(subcollections.trabajosRef, trabajoConMetadata);
      console.log('✅ Trabajo guardado con ID:', docRef.id);
      
      const trabajoGuardado = { ...trabajoConMetadata, id: docRef.id };
      
      // Nota: No actualizamos el estado manualmente porque onSnapshot lo hará automáticamente
      console.log('✅ Trabajo procesado, esperando actualización de onSnapshot...');
      
      return trabajoGuardado;
    } catch (err) {
      console.error('❌ Error al agregar trabajo:', err);
      setError('Error al agregar trabajo: ' + err.message);
      throw err;
    }
  }, [currentUser, getUserSubcollections]);
  
  const editarTrabajo = useCallback(async (id, datosActualizados) => {
    try {
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }
      
      console.log('✏️ Editando trabajo:', id);
      
      const subcollections = getUserSubcollections();
      if (!subcollections) {
        throw new Error('No se pudieron obtener las referencias de las subcolecciones');
      }
      
      // Añadir metadata
      const datosConMetadata = {
        ...datosActualizados,
        fechaActualizacion: new Date()
      };
      
      // Actualizar en la subcolección del usuario
      const docRef = doc(subcollections.trabajosRef, id);
      await updateDoc(docRef, datosConMetadata);
      console.log('✅ Trabajo actualizado:', id);
      
    } catch (err) {
      console.error('❌ Error al editar trabajo:', err);
      setError('Error al editar trabajo: ' + err.message);
      throw err;
    }
  }, [currentUser, getUserSubcollections]);
  
  const borrarTrabajo = useCallback(async (id) => {
    try {
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }
      
      console.log('🗑️ Borrando trabajo:', id);
      
      const subcollections = getUserSubcollections();
      if (!subcollections) {
        throw new Error('No se pudieron obtener las referencias de las subcolecciones');
      }
      
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
      
    } catch (err) {
      console.error('❌ Error al eliminar trabajo:', err);
      setError('Error al eliminar trabajo: ' + err.message);
      throw err;
    }
  }, [currentUser, getUserSubcollections, turnos]);
  
  // Funciones para gestionar turnos usando subcolecciones
  const agregarTurno = useCallback(async (nuevoTurno) => {
    try {
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }
      
      console.log('➕ Agregando turno:', nuevoTurno.fecha, 'para usuario:', currentUser.uid);
      
      const subcollections = getUserSubcollections();
      if (!subcollections) {
        throw new Error('No se pudieron obtener las referencias de las subcolecciones');
      }
      
      // Validar datos del turno
      if (!nuevoTurno.trabajoId || !nuevoTurno.fecha || !nuevoTurno.horaInicio || !nuevoTurno.horaFin) {
        throw new Error('Todos los campos del turno son requeridos');
      }
      
      // Añadir metadata (sin userId porque ya está en la subcolección)
      const turnoConMetadata = {
        ...nuevoTurno,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      };
      
      console.log('📤 Datos del turno a guardar:', turnoConMetadata);
      
      // Guardar en la subcolección del usuario
      const docRef = await addDoc(subcollections.turnosRef, turnoConMetadata);
      console.log('✅ Turno guardado con ID:', docRef.id);
      
      const turnoGuardado = { ...turnoConMetadata, id: docRef.id };
      
      // Nota: No actualizamos el estado manualmente porque onSnapshot lo hará automáticamente
      console.log('✅ Turno procesado, esperando actualización de onSnapshot...');
      
      return turnoGuardado;
    } catch (err) {
      console.error('❌ Error al agregar turno:', err);
      setError('Error al agregar turno: ' + err.message);
      throw err;
    }
  }, [currentUser, getUserSubcollections]);
  
  const editarTurno = useCallback(async (id, datosActualizados) => {
    try {
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }
      
      console.log('✏️ Editando turno:', id);
      
      const subcollections = getUserSubcollections();
      if (!subcollections) {
        throw new Error('No se pudieron obtener las referencias de las subcolecciones');
      }
      
      // Añadir metadata
      const datosConMetadata = {
        ...datosActualizados,
        fechaActualizacion: new Date()
      };
      
      // Actualizar en la subcolección del usuario
      const docRef = doc(subcollections.turnosRef, id);
      await updateDoc(docRef, datosConMetadata);
      console.log('✅ Turno actualizado:', id);
      
    } catch (err) {
      console.error('❌ Error al editar turno:', err);
      setError('Error al editar turno: ' + err.message);
      throw err;
    }
  }, [currentUser, getUserSubcollections]);
  
  const borrarTurno = useCallback(async (id) => {
    try {
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }
      
      console.log('🗑️ Borrando turno:', id);
      
      const subcollections = getUserSubcollections();
      if (!subcollections) {
        throw new Error('No se pudieron obtener las referencias de las subcolecciones');
      }
      
      // Borrar de la subcolección del usuario
      await deleteDoc(doc(subcollections.turnosRef, id));
      console.log('✅ Turno borrado:', id);
      
    } catch (err) {
      console.error('❌ Error al eliminar turno:', err);
      setError('Error al eliminar turno: ' + err.message);
      throw err;
    }
  }, [currentUser, getUserSubcollections]);
  
  // Función para guardar preferencias de usuario
  const guardarPreferencias = useCallback(async (preferencias) => {
    try {
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }
      
      console.log('💾 Guardando preferencias:', preferencias);
      
      const { 
        colorPrincipal: nuevoColor, 
        emojiUsuario: nuevoEmoji, 
        descuentoDefault: nuevoDescuento,
        rangosTurnos: nuevosRangos
      } = preferencias;
      
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
      const datosActualizados = {};
      
      if (nuevoColor !== undefined) datosActualizados['ajustes.colorPrincipal'] = nuevoColor;
      if (nuevoEmoji !== undefined) datosActualizados['ajustes.emojiUsuario'] = nuevoEmoji;
      if (nuevoDescuento !== undefined) datosActualizados['ajustes.descuentoDefault'] = nuevoDescuento;
      if (nuevosRangos !== undefined) datosActualizados['ajustes.rangosTurnos'] = nuevosRangos;
      datosActualizados['fechaActualizacion'] = new Date();
      
      // Solo actualizar en Firebase si hay algo que actualizar
      if (Object.keys(datosActualizados).length > 1) { // Más de 1 porque siempre incluye fechaActualizacion
        await updateDoc(userDocRef, datosActualizados);
        console.log('✅ Preferencias guardadas en Firebase');
      }
      
      return true;
    } catch (err) {
      console.error('❌ Error al guardar preferencias:', err);
      setError('Error al guardar preferencias: ' + err.message);
      throw err;
    }
  }, [currentUser]);
  
  // Agrupar turnos por fecha
  const turnosPorFecha = turnos.reduce((acc, turno) => {
    if (!acc[turno.fecha]) {
      acc[turno.fecha] = [];
    }
    acc[turno.fecha].push(turno);
    return acc;
  }, {});
  
  // Calcular horas trabajadas
  const calcularHoras = useCallback((inicio, fin) => {
    const [horaInicio, minInicio] = inicio.split(':').map(n => parseInt(n));
    const [horaFin, minFin] = fin.split(':').map(n => parseInt(n));
    
    const inicioMinutos = horaInicio * 60 + minInicio;
    const finMinutos = horaFin * 60 + minFin;
    
    return (finMinutos - inicioMinutos) / 60;
  }, []);
  
  // Calcular el pago de un turno
  const calcularPago = useCallback((turno) => {
    const trabajo = trabajos.find(t => t.id === turno.trabajoId);
    if (!trabajo) return { total: 0, totalConDescuento: 0, horas: 0 };
    
    const horas = calcularHoras(turno.horaInicio, turno.horaFin);
    let tarifa = trabajo.tarifaBase;
    
    switch (turno.tipo) {
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
    }
    
    const total = horas * tarifa;
    const totalConDescuento = total * (1 - descuentoDefault / 100); 
    
    return {
      total,
      totalConDescuento,
      horas
    };
  }, [trabajos, calcularHoras, descuentoDefault]);
  
  // Calcular total del día
  const calcularTotalDia = useCallback((turnosDia) => {
    let total = 0;
    turnosDia.forEach(turno => {
      const { totalConDescuento } = calcularPago(turno);
      total += totalConDescuento;
    });
    return total;
  }, [calcularPago]);
  
  // Formatear fecha
  const formatearFecha = useCallback((fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }, []);
  
  // Valor del contexto
  const contextValue = {
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
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;