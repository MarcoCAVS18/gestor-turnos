// src/contexts/AppContext.jsx

import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { 
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
      return null;
    }
    
    const refs = {
      trabajosRef: collection(db, 'usuarios', currentUser.uid, 'trabajos'),
      turnosRef: collection(db, 'usuarios', currentUser.uid, 'turnos')
    };
    
    return refs;
  }, [currentUser]);

  // Función para crear o verificar documento de usuario
  const ensureUserDocument = useCallback(async () => {
    if (!currentUser) {
      return;
    }
    
    try {
      const userDocRef = doc(db, 'usuarios', currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        
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
      setError('Error al configurar usuario: ' + error.message);
    }
  }, [currentUser]);

  // Cargar datos y preferencias del usuario
  useEffect(() => {
    let unsubscribeTrabajos = null;
    let unsubscribeTurnos = null;
    
    // Función para cargar datos reales del usuario desde Firebase
    const cargarDatosUsuario = async () => {
      if (!currentUser) {
        setCargando(false);
        setTrabajos([]);
        setTurnos([]);
        setError(null);
        return;
      }
      
      try {
        setCargando(true);
        setError(null);
        
        // Verificar/crear documento de usuario y cargar preferencias
        await ensureUserDocument();
        
        const subcollections = getUserSubcollections();
        if (!subcollections) {
          setCargando(false);
          return;
        }
        
        // Configurar listener para trabajos
        const trabajosQuery = query(
          subcollections.trabajosRef,
          orderBy('nombre', 'asc')
        );
        
        unsubscribeTrabajos = onSnapshot(trabajosQuery, (snapshot) => {
          if (snapshot.empty) {
            setTrabajos([]);
          } else {
            const trabajosData = [];
            snapshot.forEach(doc => {
              const data = { id: doc.id, ...doc.data() };
              trabajosData.push(data);
            });
            
            setTrabajos(trabajosData);
          }
        }, (error) => {
          setError('Error al cargar trabajos: ' + error.message);
        });
        
        // Configurar listener para turnos
        const turnosQuery = query(
          subcollections.turnosRef,
          orderBy('fecha', 'desc')
        );
        
        unsubscribeTurnos = onSnapshot(turnosQuery, (snapshot) => {
          if (snapshot.empty) {
            setTurnos([]);
          } else {
            const turnosData = [];
            snapshot.forEach(doc => {
              const data = { id: doc.id, ...doc.data() };
              turnosData.push(data);
            });
            
            setTurnos(turnosData);
          }
          
          setCargando(false);
        }, (error) => {
          setError('Error al cargar turnos: ' + error.message);
          setCargando(false);
        });
        
      } catch (error) {
        setError('Error crítico al cargar datos: ' + error.message);
        setCargando(false);
      }
    };

    cargarDatosUsuario();
    
    // Cleanup cuando el componente se desmonte o cambie el usuario
    return () => {
      if (unsubscribeTrabajos) {
        unsubscribeTrabajos();
      }
      if (unsubscribeTurnos) {
        unsubscribeTurnos();
      }
    };
  }, [currentUser, getUserSubcollections, ensureUserDocument]);
  
  // Funciones para gestionar trabajos usando subcolecciones
  const agregarTrabajo = useCallback(async (nuevoTrabajo) => {
    try {
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }
      
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
      
      // Guardar en la subcolección del usuario
      const docRef = await addDoc(subcollections.trabajosRef, trabajoConMetadata);
      
      const trabajoGuardado = { ...trabajoConMetadata, id: docRef.id };
      
      return trabajoGuardado;
    } catch (err) {
      setError('Error al agregar trabajo: ' + err.message);
      throw err;
    }
  }, [currentUser, getUserSubcollections]);
  
  const editarTrabajo = useCallback(async (id, datosActualizados) => {
    try {
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }
      
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
      
    } catch (err) {
      setError('Error al editar trabajo: ' + err.message);
      throw err;
    }
  }, [currentUser, getUserSubcollections]);
  
  const borrarTrabajo = useCallback(async (id) => {
    try {
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }
      
      const subcollections = getUserSubcollections();
      if (!subcollections) {
        throw new Error('No se pudieron obtener las referencias de las subcolecciones');
      }
      
      // Borrar trabajo de la subcolección
      await deleteDoc(doc(subcollections.trabajosRef, id));
      
      // Borrar turnos asociados de la subcolección
      const turnosAsociados = turnos.filter(turno => turno.trabajoId === id);
      
      const promesasBorrado = turnosAsociados.map(turno => 
        deleteDoc(doc(subcollections.turnosRef, turno.id))
      );
      
      await Promise.all(promesasBorrado);
      
    } catch (err) {
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
      
      // Guardar en la subcolección del usuario
      const docRef = await addDoc(subcollections.turnosRef, turnoConMetadata);
      
      const turnoGuardado = { ...turnoConMetadata, id: docRef.id };
      
      return turnoGuardado;
    } catch (err) {
      setError('Error al agregar turno: ' + err.message);
      throw err;
    }
  }, [currentUser, getUserSubcollections]);
  
  const editarTurno = useCallback(async (id, datosActualizados) => {
    try {
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }
      
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
      
    } catch (err) {
      setError('Error al editar turno: ' + err.message);
      throw err;
    }
  }, [currentUser, getUserSubcollections]);
  
  const borrarTurno = useCallback(async (id) => {
    try {
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }
      
      const subcollections = getUserSubcollections();
      if (!subcollections) {
        throw new Error('No se pudieron obtener las referencias de las subcolecciones');
      }
      
      // Borrar de la subcolección del usuario
      await deleteDoc(doc(subcollections.turnosRef, id));
      
    } catch (err) {
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
      }
      
      return true;
    } catch (err) {
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
    guardarPreferencias
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;