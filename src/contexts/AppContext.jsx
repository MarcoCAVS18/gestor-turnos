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
  const [colorPrincipal, setColorPrincipal] = useState('#EC4899');
  const [emojiUsuario, setEmojiUsuario] = useState('😊');
  const [descuentoDefault, setDescuentoDefault] = useState(15);
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
    
    return {
      trabajosRef: collection(db, 'usuarios', currentUser.uid, 'trabajos'),
      turnosRef: collection(db, 'usuarios', currentUser.uid, 'turnos')
    };
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

  // Función mejorada para calcular horas trabajadas
  const calcularHoras = useCallback((inicio, fin) => {
    const [horaIni, minIni] = inicio.split(':').map(n => parseInt(n));
    const [horaFn, minFn] = fin.split(':').map(n => parseInt(n));
    
    let inicioMinutos = horaIni * 60 + minIni;
    let finMinutos = horaFn * 60 + minFn;
    
    // Si el turno cruza medianoche
    if (finMinutos <= inicioMinutos) {
      finMinutos += 24 * 60;
    }
    
    return (finMinutos - inicioMinutos) / 60;
  }, []);

  // Función mejorada para calcular el pago considerando rangos horarios múltiples
  const calcularPago = useCallback((turno) => {
    const trabajo = trabajos.find(t => t.id === turno.trabajoId);
    if (!trabajo) return { total: 0, totalConDescuento: 0, horas: 0 };
    
    const { horaInicio, horaFin } = turno;
    
    // Convertir horas a minutos
    const [horaIni, minIni] = horaInicio.split(':').map(n => parseInt(n));
    const [horaFn, minFn] = horaFin.split(':').map(n => parseInt(n));
    
    let inicioMinutos = horaIni * 60 + minIni;
    let finMinutos = horaFn * 60 + minFn;
    
    // Si el turno cruza medianoche
    if (finMinutos <= inicioMinutos) {
      finMinutos += 24 * 60;
    }
    
    const totalMinutos = finMinutos - inicioMinutos;
    const horas = totalMinutos / 60;
    
    // Verificar si es fin de semana
    const [year, month, day] = turno.fecha.split('-');
    const fecha = new Date(year, month - 1, day);
    const diaSemana = fecha.getDay();
    
    let total = 0;
    
    if (diaSemana === 0) {
      // Domingo - toda la tarifa de domingo
      total = horas * trabajo.tarifas.domingo;
    } else if (diaSemana === 6) {
      // Sábado - toda la tarifa de sábado
      total = horas * trabajo.tarifas.sabado;
    } else {
      // Día de semana - calcular por rangos horarios
      const rangos = rangosTurnos || {
        diurnoInicio: 6, diurnoFin: 14,
        tardeInicio: 14, tardeFin: 20,
        nocheInicio: 20
      };
      
      // Convertir rangos a minutos
      const diurnoInicioMin = rangos.diurnoInicio * 60;
      const diurnoFinMin = rangos.diurnoFin * 60;
      const tardeInicioMin = rangos.tardeInicio * 60;
      const tardeFinMin = rangos.tardeFin * 60;
      
      // Calcular minuto por minuto para manejar cambios de tarifa
      for (let minuto = inicioMinutos; minuto < finMinutos; minuto++) {
        const horaActual = minuto % (24 * 60); // Manejar cruce de medianoche
        let tarifa = trabajo.tarifaBase;
        
        // Determinar tarifa según la hora
        if (horaActual >= diurnoInicioMin && horaActual < diurnoFinMin) {
          tarifa = trabajo.tarifas.diurno;
        } else if (horaActual >= tardeInicioMin && horaActual < tardeFinMin) {
          tarifa = trabajo.tarifas.tarde;
        } else {
          tarifa = trabajo.tarifas.noche;
        }
        
        // Agregar pago por este minuto (tarifa / 60 para convertir a minuto)
        total += tarifa / 60;
      }
    }
    
    const totalConDescuento = total * (1 - descuentoDefault / 100);
    
    return {
      total,
      totalConDescuento,
      horas
    };
  }, [trabajos, rangosTurnos, descuentoDefault]);

  // Cargar datos y preferencias del usuario
  useEffect(() => {
    let unsubscribeTrabajos = null;
    let unsubscribeTurnos = null;
    
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
              trabajosData.push({ id: doc.id, ...doc.data() });
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
              turnosData.push({ id: doc.id, ...doc.data() });
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
    
    return () => {
      if (unsubscribeTrabajos) unsubscribeTrabajos();
      if (unsubscribeTurnos) unsubscribeTurnos();
    };
  }, [currentUser, getUserSubcollections, ensureUserDocument]);
  
  // Funciones CRUD para trabajos
  const agregarTrabajo = useCallback(async (nuevoTrabajo) => {
    try {
      if (!currentUser) throw new Error('Usuario no autenticado');
      
      const subcollections = getUserSubcollections();
      if (!subcollections) throw new Error('No se pudieron obtener las referencias de las subcolecciones');
      
      if (!nuevoTrabajo.nombre || !nuevoTrabajo.nombre.trim()) {
        throw new Error('El nombre del trabajo es requerido');
      }
      
      const trabajoConMetadata = {
        ...nuevoTrabajo,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      };
      
      const docRef = await addDoc(subcollections.trabajosRef, trabajoConMetadata);
      return { ...trabajoConMetadata, id: docRef.id };
    } catch (err) {
      setError('Error al agregar trabajo: ' + err.message);
      throw err;
    }
  }, [currentUser, getUserSubcollections]);
  
  const editarTrabajo = useCallback(async (id, datosActualizados) => {
    try {
      if (!currentUser) throw new Error('Usuario no autenticado');
      
      const subcollections = getUserSubcollections();
      if (!subcollections) throw new Error('No se pudieron obtener las referencias de las subcolecciones');
      
      const datosConMetadata = {
        ...datosActualizados,
        fechaActualizacion: new Date()
      };
      
      const docRef = doc(subcollections.trabajosRef, id);
      await updateDoc(docRef, datosConMetadata);
    } catch (err) {
      setError('Error al editar trabajo: ' + err.message);
      throw err;
    }
  }, [currentUser, getUserSubcollections]);
  
  const borrarTrabajo = useCallback(async (id) => {
    try {
      if (!currentUser) throw new Error('Usuario no autenticado');
      
      const subcollections = getUserSubcollections();
      if (!subcollections) throw new Error('No se pudieron obtener las referencias de las subcolecciones');
      
      await deleteDoc(doc(subcollections.trabajosRef, id));
      
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
  
  // Funciones CRUD para turnos
  const agregarTurno = useCallback(async (nuevoTurno) => {
    try {
      if (!currentUser) throw new Error('Usuario no autenticado');
      
      const subcollections = getUserSubcollections();
      if (!subcollections) throw new Error('No se pudieron obtener las referencias de las subcolecciones');
      
      if (!nuevoTurno.trabajoId || !nuevoTurno.fecha || !nuevoTurno.horaInicio || !nuevoTurno.horaFin) {
        throw new Error('Todos los campos del turno son requeridos');
      }
      
      const turnoConMetadata = {
        ...nuevoTurno,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      };
      
      const docRef = await addDoc(subcollections.turnosRef, turnoConMetadata);
      return { ...turnoConMetadata, id: docRef.id };
    } catch (err) {
      setError('Error al agregar turno: ' + err.message);
      throw err;
    }
  }, [currentUser, getUserSubcollections]);
  
  const editarTurno = useCallback(async (id, datosActualizados) => {
    try {
      if (!currentUser) throw new Error('Usuario no autenticado');
      
      const subcollections = getUserSubcollections();
      if (!subcollections) throw new Error('No se pudieron obtener las referencias de las subcolecciones');
      
      const datosConMetadata = {
        ...datosActualizados,
        fechaActualizacion: new Date()
      };
      
      const docRef = doc(subcollections.turnosRef, id);
      await updateDoc(docRef, datosConMetadata);
    } catch (err) {
      setError('Error al editar turno: ' + err.message);
      throw err;
    }
  }, [currentUser, getUserSubcollections]);
  
  const borrarTurno = useCallback(async (id) => {
    try {
      if (!currentUser) throw new Error('Usuario no autenticado');
      
      const subcollections = getUserSubcollections();
      if (!subcollections) throw new Error('No se pudieron obtener las referencias de las subcolecciones');
      
      await deleteDoc(doc(subcollections.turnosRef, id));
    } catch (err) {
      setError('Error al eliminar turno: ' + err.message);
      throw err;
    }
  }, [currentUser, getUserSubcollections]);
  
  // Función para guardar preferencias de usuario
  const guardarPreferencias = useCallback(async (preferencias) => {
    try {
      if (!currentUser) throw new Error('Usuario no autenticado');
      
      const { 
        colorPrincipal: nuevoColor, 
        emojiUsuario: nuevoEmoji, 
        descuentoDefault: nuevoDescuento,
        rangosTurnos: nuevosRangos
      } = preferencias;
      
      if (nuevoColor !== undefined) setColorPrincipal(nuevoColor);
      if (nuevoEmoji !== undefined) setEmojiUsuario(nuevoEmoji);
      if (nuevoDescuento !== undefined) setDescuentoDefault(nuevoDescuento);
      if (nuevosRangos !== undefined) setRangosTurnos(nuevosRangos);
      
      if (nuevoColor !== undefined) localStorage.setItem('colorPrincipal', nuevoColor);
      if (nuevoEmoji !== undefined) localStorage.setItem('emojiUsuario', nuevoEmoji);
      if (nuevoDescuento !== undefined) localStorage.setItem('descuentoDefault', nuevoDescuento.toString());
      if (nuevosRangos !== undefined) localStorage.setItem('rangosTurnos', JSON.stringify(nuevosRangos));
      
      const userDocRef = doc(db, 'usuarios', currentUser.uid);
      const datosActualizados = {};
      
      if (nuevoColor !== undefined) datosActualizados['ajustes.colorPrincipal'] = nuevoColor;
      if (nuevoEmoji !== undefined) datosActualizados['ajustes.emojiUsuario'] = nuevoEmoji;
      if (nuevoDescuento !== undefined) datosActualizados['ajustes.descuentoDefault'] = nuevoDescuento;
      if (nuevosRangos !== undefined) datosActualizados['ajustes.rangosTurnos'] = nuevosRangos;
      datosActualizados['fechaActualizacion'] = new Date();
      
      if (Object.keys(datosActualizados).length > 1) {
        await updateDoc(userDocRef, datosActualizados);
      }
      
      return true;
    } catch (err) {
      setError('Error al guardar preferencias: ' + err.message);
      throw err;
    }
  }, [currentUser]);
  
  // Agrupar turnos por fecha
  const turnosPorFecha = useMemo(() => {
    return turnos.reduce((acc, turno) => {
      if (!acc[turno.fecha]) {
        acc[turno.fecha] = [];
      }
      acc[turno.fecha].push(turno);
      return acc;
    }, {});
  }, [turnos]);
  
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
    const fecha = new Date(fechaStr + 'T00:00:00');
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