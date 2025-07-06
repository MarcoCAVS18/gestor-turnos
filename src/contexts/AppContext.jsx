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
  onSnapshot,
  getDocs,
  where
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';
import { generateColorVariations } from '../utils/colorUtils';

// Crea el contexto
export const AppContext = createContext();

// Hook personalizado para usar el contexto
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
};

// Proveedor de contexto
export const AppProvider = ({ children }) => {
  const { currentUser } = useAuth();

  // Estados de datos principales
  const [trabajos, setTrabajos] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [trabajosDelivery, setTrabajosDelivery] = useState([]);
  const [turnosDelivery, setTurnosDelivery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weeklyHoursGoal, setWeeklyHoursGoal] = useState(null);
  const [deliveryEnabled, setDeliveryEnabled] = useState(false);

  // Estados de preferencias de personalizacion
  const [primaryColor, setPrimaryColor] = useState('#EC4899');
  const [userEmoji, setUserEmoji] = useState('😊');
  const [defaultDiscount, setDefaultDiscount] = useState(15);
  const [shiftRanges, setShiftRanges] = useState({
    dayStart: 6,
    dayEnd: 14,
    afternoonStart: 14,
    afternoonEnd: 20,
    nightStart: 20
  });

  // Genera variaciones de color basadas en el color principal
  const thematicColors = useMemo(() => {
    return generateColorVariations(primaryColor);
  }, [primaryColor]);

  // Funcion para obtener referencias de subcolecciones de usuario
  const getUserSubcollections = useCallback(() => {
    if (!currentUser) {
      return null;
    }
    const userUid = currentUser.uid;
    return {
      trabajosRef: collection(db, 'usuarios', userUid, 'trabajos'),
      turnosRef: collection(db, 'usuarios', userUid, 'turnos'),
      trabajosDeliveryRef: collection(db, 'usuarios', userUid, 'trabajos-delivery'),
      turnosDeliveryRef: collection(db, 'usuarios', userUid, 'turnos-delivery')
    };
  }, [currentUser]);

  // Asegura que el documento del usuario exista y carga la configuracion
  const ensureUserDocument = useCallback(async () => {
    if (!currentUser) {
      return;
    }

    try {
      const userDocRef = doc(db, 'usuarios', currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      const defaultSettings = {
        colorPrincipal: '#EC4899',
        emojiUsuario: '😊',
        descuentoDefault: 15,
        metaHorasSemanales: null,
        deliveryEnabled: false,
        rangosTurnos: {
          diurnoInicio: 6,
          diurnoFin: 14,
          tardeInicio: 14,
          tardeFin: 20,
          nocheInicio: 20
        }
      };

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const settings = userData.ajustes || defaultSettings;

        setPrimaryColor(settings.colorPrincipal);
        setUserEmoji(settings.emojiUsuario);
        setDefaultDiscount(settings.descuentoDefault);
        setWeeklyHoursGoal(settings.metaHorasSemanales);
        setDeliveryEnabled(settings.deliveryEnabled);
        setShiftRanges(settings.rangosTurnos);
      } else {
        const defaultUserData = {
          email: currentUser.email,
          displayName: currentUser.displayName || 'Usuario',
          fechaCreacion: new Date(),
          ajustes: defaultSettings
        };
        await setDoc(userDocRef, defaultUserData);

        setPrimaryColor(defaultSettings.colorPrincipal);
        setUserEmoji(defaultSettings.emojiUsuario);
        setDefaultDiscount(defaultSettings.descuentoDefault);
        setWeeklyHoursGoal(defaultSettings.metaHorasSemanales);
        setDeliveryEnabled(defaultSettings.deliveryEnabled);
        setShiftRanges(defaultSettings.rangosTurnos);
      }
    } catch (err) {
      console.error('Error al configurar documento de usuario:', err);
      setError('Error al configurar usuario: ' + err.message);
    }
  }, [currentUser]);

  // Funcion para calcular horas trabajadas
  const calculateHours = useCallback((start, end) => {
    const [startHour, startMin] = start.split(':').map(n => parseInt(n));
    const [endHour, endMin] = end.split(':').map(n => parseInt(n));

    let startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;

    // Si el turno cruza la medianoche
    if (endMinutes <= startMinutes) {
      endMinutes += 24 * 60;
    }

    return (endMinutes - startMinutes) / 60;
  }, []);

  // Funcion para calcular el pago considerando multiples rangos de tiempo
  const calculatePayment = useCallback((shift) => {
    const allJobs = [...trabajos, ...trabajosDelivery];
    const job = allJobs.find(j => j.id === shift.trabajoId);

    if (!job) return {
      total: 0,
      totalWithDiscount: 0,
      hours: 0,
      tips: 0,
      isDelivery: false,
      breakdown: { diurno: 0, tarde: 0, noche: 0, sabado: 0, domingo: 0 }
    };

    // Si es un turno de delivery, devuelve las ganancias totales directamente
    if (shift.type === 'delivery' || shift.tipo === 'delivery') {
      const hours = calculateHours(shift.horaInicio, shift.horaFin);
      return {
        total: shift.gananciaTotal || 0,
        totalWithDiscount: shift.gananciaTotal || 0,
        hours,
        tips: shift.propinas || 0,
        isDelivery: true,
        breakdown: { delivery: shift.gananciaTotal || 0 }
      };
    }

    const { horaInicio, horaFin, fechaInicio, cruzaMedianoche = false } = shift;

    if (!horaInicio || !horaFin || !fechaInicio) {
      return { total: 0, totalWithDiscount: 0, hours: 0, tips: 0, isDelivery: false };
    }

    const [startHour, startMin] = horaInicio.split(':').map(n => parseInt(n));
    const [endHour, endMin] = horaFin.split(':').map(n => parseInt(n));

    let startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;

    // Si cruza medianoche, agregar 24 horas al final
    if (cruzaMedianoche) {
      endMinutes += 24 * 60;
    } else if (endMinutes <= startMinutes) {
      // Fallback para turnos antiguos sin la propiedad cruzaMedianoche
      endMinutes += 24 * 60;
    }

    const totalMinutes = endMinutes - startMinutes;
    const hours = totalMinutes / 60;

    // Determinar si es fin de semana
    const date = new Date(fechaInicio + 'T00:00:00');
    const dayOfWeek = date.getDay();

    let total = 0;
    let breakdown = { diurno: 0, tarde: 0, noche: 0, sabado: 0, domingo: 0 };

    if (dayOfWeek === 0) { // Domingo
      total = hours * job.tarifas.domingo;
      breakdown.domingo = total;
    } else if (dayOfWeek === 6) { // Sábado
      total = hours * job.tarifas.sabado;
      breakdown.sabado = total;
    } else {
      // Día de semana - calcular por rangos horarios minuto a minuto
      const ranges = shiftRanges || {
        dayStart: 6, dayEnd: 14,
        afternoonStart: 14, afternoonEnd: 20,
        nightStart: 20
      };

      const dayStartMin = ranges.dayStart * 60;        // ej: 6*60 = 360 (06:00)
      const dayEndMin = ranges.dayEnd * 60;            // ej: 14*60 = 840 (14:00)
      const afternoonStartMin = ranges.afternoonStart * 60; // ej: 14*60 = 840 (14:00)
      const afternoonEndMin = ranges.afternoonEnd * 60;     // ej: 20*60 = 1200 (20:00)


      // Calcular minuto por minuto para manejar correctamente los rangos
      for (let minute = startMinutes; minute < endMinutes; minute++) {
        // Normalizar los minutos para el ciclo de 24 horas
        const currentMinuteInDay = minute % (24 * 60);
        let rate = job.tarifaBase;
        let rateType = 'noche'; // Por defecto nocturno

        if (currentMinuteInDay >= dayStartMin && currentMinuteInDay < dayEndMin) {
          rate = job.tarifas.diurno;
          rateType = 'diurno';
        } else if (currentMinuteInDay >= afternoonStartMin && currentMinuteInDay < afternoonEndMin) {
          rate = job.tarifas.tarde;
          rateType = 'tarde';
        } else {
          rate = job.tarifas.noche;
          rateType = 'noche';
        }

        const ratePerMinute = rate / 60;
        total += ratePerMinute;
        breakdown[rateType] += ratePerMinute;
      }


    }

    const totalWithDiscount = total * (1 - defaultDiscount / 100);

    return {
      total,
      totalWithDiscount,
      hours,
      tips: 0,
      isDelivery: false,
      breakdown,
      isNightShift: cruzaMedianoche || false
    };
  }, [trabajos, trabajosDelivery, shiftRanges, defaultDiscount, calculateHours]);

  // Funciones CRUD para trabajos de delivery
  const addDeliveryJob = useCallback(async (newJob) => {
    try {
      if (!currentUser) throw new Error('Usuario no autenticado');
      const subcollections = getUserSubcollections();
      if (!subcollections || !subcollections.trabajosDeliveryRef) {
        throw new Error('No se pudieron obtener las referencias de la colección');
      }

      const jobData = {
        ...newJob,
        tipo: 'delivery',
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        plataforma: newJob.plataforma || '',
        vehiculo: newJob.vehiculo || '',
        colorAvatar: newJob.colorAvatar || '#10B981',
        estadisticas: {
          totalTurnos: 0,
          totalPedidos: 0,
          totalKilometros: 0,
          totalGanancias: 0,
          totalPropinas: 0,
          totalGastosCombustible: 0
        }
      };

      const docRef = await addDoc(subcollections.trabajosDeliveryRef, jobData);
      return { ...jobData, id: docRef.id };
    } catch (err) {
      console.error('Error al agregar trabajo de delivery:', err);
      setError('Error al agregar trabajo delivery: ' + err.message);
      throw err;
    }
  }, [currentUser, getUserSubcollections]);

  const editDeliveryJob = useCallback(async (id, updatedData) => {
    try {
      if (!currentUser) throw new Error('Usuario no autenticado');
      const subcollections = getUserSubcollections();
      if (!subcollections || !subcollections.trabajosDeliveryRef) throw new Error('No se pudieron obtener las referencias de la coleccion');

      const dataWithMetadata = {
        ...updatedData,
        fechaActualizacion: new Date()
      };

      const docRef = doc(subcollections.trabajosDeliveryRef, id);
      await updateDoc(docRef, dataWithMetadata);
    } catch (err) {
      console.error('Error al editar trabajo de delivery:', err);
      setError('Error al editar trabajo delivery: ' + err.message);
      throw err;
    }
  }, [currentUser, getUserSubcollections]);

  const deleteDeliveryJob = useCallback(async (id) => {
    try {
      if (!currentUser) throw new Error('Usuario no autenticado');
      const subcollections = getUserSubcollections();
      if (!subcollections || !subcollections.trabajosDeliveryRef || !subcollections.turnosDeliveryRef) {
        throw new Error('No se pudieron obtener las referencias de la coleccion');
      }

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
    } catch (err) {
      console.error('Error al eliminar trabajo de delivery:', err);
      setError('Error al eliminar trabajo delivery: ' + err.message);
      throw err;
    }
  }, [currentUser, getUserSubcollections]);

  // Funciones CRUD para turnos de delivery
  const addDeliveryShift = useCallback(async (newShift) => {
    try {
      if (!currentUser) throw new Error('Usuario no autenticado');
      const subcollections = getUserSubcollections();
      if (!subcollections || !subcollections.turnosDeliveryRef) {
        throw new Error('No se pudieron obtener las referencias de la colección');
      }

      const shiftData = {
        ...newShift,
        tipo: 'delivery',
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        numeroPedidos: newShift.numeroPedidos || 0,
        gananciaTotal: newShift.gananciaTotal || 0,
        propinas: newShift.propinas || 0,
        kilometros: newShift.kilometros || 0,
        gastoCombustible: newShift.gastoCombustible || 0,
        gananciaBase: (newShift.gananciaTotal || 0) - (newShift.propinas || 0),
        gananciaNeta: (newShift.gananciaTotal || 0) - (newShift.gastoCombustible || 0)
      };

      const docRef = await addDoc(subcollections.turnosDeliveryRef, shiftData);
      return { ...shiftData, id: docRef.id };
    } catch (err) {
      console.error('Error al agregar turno de delivery:', err);
      setError('Error al agregar turno delivery: ' + err.message);
      throw err;
    }
  }, [currentUser, getUserSubcollections]);

  const editDeliveryShift = useCallback(async (id, updatedData) => {
    try {
      if (!currentUser) throw new Error('Usuario no autenticado');
      const subcollections = getUserSubcollections();
      if (!subcollections || !subcollections.turnosDeliveryRef) throw new Error('No se pudieron obtener las referencias de la coleccion');

      const dataWithMetadata = {
        ...updatedData,
        fechaActualizacion: new Date(),
        gananciaBase: (updatedData.gananciaTotal || 0) - (updatedData.propinas || 0),
        gananciaNeta: (updatedData.gananciaTotal || 0) - (updatedData.gastoCombustible || 0)
      };

      const docRef = doc(subcollections.turnosDeliveryRef, id);
      await updateDoc(docRef, dataWithMetadata);
    } catch (err) {
      console.error('Error al editar turno de delivery:', err);
      setError('Error al editar turno delivery: ' + err.message);
      throw err;
    }
  }, [currentUser, getUserSubcollections]);

  const deleteDeliveryShift = useCallback(async (id) => {
    try {
      if (!currentUser) throw new Error('Usuario no autenticado');
      const subcollections = getUserSubcollections();
      if (!subcollections || !subcollections.turnosDeliveryRef) throw new Error('No se pudieron obtener las referencias de la coleccion');

      await deleteDoc(doc(subcollections.turnosDeliveryRef, id));
    } catch (err) {
      console.error('Error al eliminar turno de delivery:', err);
      setError('Error al eliminar turno delivery: ' + err.message);
      throw err;
    }
  }, [currentUser, getUserSubcollections]);

  // Función para eliminar turnos tradicionales
  const deleteShift = useCallback(async (id) => {
    try {
      if (!currentUser) throw new Error('Usuario no autenticado');
      const subcollections = getUserSubcollections();

      if (!subcollections || !subcollections.turnosRef) throw new Error('No se pudieron obtener las referencias de la subcoleccion');

      await deleteDoc(doc(subcollections.turnosRef, id));

    } catch (err) {
      setError('Error al eliminar turno: ' + err.message);
      throw err;
    }
  }, [currentUser, getUserSubcollections]);

  const updateWeeklyHoursGoal = useCallback(async (newGoal) => {
    try {
      if (!currentUser) throw new Error('Usuario no autenticado');

      setWeeklyHoursGoal(newGoal);

      if (newGoal) {
        localStorage.setItem('weeklyHoursGoal', newGoal.toString());
      } else {
        localStorage.removeItem('weeklyHoursGoal');
      }

      const userDocRef = doc(db, 'usuarios', currentUser.uid);
      await updateDoc(userDocRef, {
        'ajustes.metaHorasSemanales': newGoal,
        fechaActualizacion: new Date()
      });
      return true;
    } catch (err) {
      setError('Error al actualizar meta de horas semanales: ' + err.message);
      throw err;
    }
  }, [currentUser]);

  // Cargar datos de usuario y preferencias
  useEffect(() => {
    let unsubscribeTrabajos = null;
    let unsubscribeTurnos = null;
    let unsubscribeTrabajosDelivery = null;
    let unsubscribeTurnosDelivery = null;

    const loadUserData = async () => {
      if (!currentUser) {
        setLoading(false);
        setTrabajos([]);
        setTurnos([]);
        setTrabajosDelivery([]);
        setTurnosDelivery([]);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        await ensureUserDocument();

        const subcollections = getUserSubcollections();
        if (!subcollections) {
          setLoading(false);
          return;
        }

        // Listener para trabajos tradicionales
        const trabajosQuery = query(
          subcollections.trabajosRef,
          orderBy('nombre', 'asc')
        );

        unsubscribeTrabajos = onSnapshot(
          trabajosQuery,
          { includeMetadataChanges: true },
          (snapshot) => {
            if (snapshot.empty && !snapshot.docChanges().length) {
              setTrabajos([]);
              return;
            }

            setTrabajos(currentTrabajos => {
              let updatedTrabajos = [...currentTrabajos];

              snapshot.docChanges().forEach(change => {
                const docData = { id: change.doc.id, ...change.doc.data() };

                if (change.type === 'added') {
                  if (!updatedTrabajos.some(t => t.id === docData.id)) {
                    updatedTrabajos.push(docData);
                  }
                } else if (change.type === 'modified') {
                  updatedTrabajos = updatedTrabajos.map(t =>
                    t.id === docData.id ? docData : t
                  );
                } else if (change.type === 'removed') {
                  updatedTrabajos = updatedTrabajos.filter(t => t.id !== change.doc.id);
                }
              });

              updatedTrabajos.sort((a, b) => a.nombre.localeCompare(b.nombre));
              return updatedTrabajos;
            });
          },
          (err) => {
            console.error('Error en el listener de trabajos tradicionales:', err);
            setError('Error al cargar trabajos: ' + err.message);
          }
        );

        // Listener para trabajos de delivery
        const trabajosDeliveryQuery = query(
          subcollections.trabajosDeliveryRef,
          orderBy('fechaCreacion', 'desc')
        );

        unsubscribeTrabajosDelivery = onSnapshot(
          trabajosDeliveryQuery,
          (snapshot) => {
            const loadedTrabajosDelivery = snapshot.docs.map(doc => {
              return { id: doc.id, ...doc.data() };
            });
            setTrabajosDelivery(loadedTrabajosDelivery);
          },
          (err) => {
            console.error("Error al cargar trabajos de delivery:", err);
            setError("Error al cargar trabajos de delivery: " + err.message);
          }
        );

        // Listener para turnos de delivery
        const turnosDeliveryQuery = query(
          subcollections.turnosDeliveryRef,
          orderBy('fecha', 'desc')
        );

        unsubscribeTurnosDelivery = onSnapshot(
          turnosDeliveryQuery,
          (snapshot) => {
            const turnosDeliveryData = [];
            snapshot.forEach(doc => {
              turnosDeliveryData.push({
                id: doc.id,
                ...doc.data(),
                type: 'delivery' // Asegura que el tipo este configurado
              });
            });
            setTurnosDelivery(turnosDeliveryData);
          },
          (err) => {
            console.error('Error al cargar turnos de delivery:', err);
            setError('Error al cargar turnos delivery: ' + err.message);
          }
        );

        // Listener para turnos tradicionales
        const turnosQuery = query(
          subcollections.turnosRef,
          orderBy('fechaCreacion', 'desc')
        );

        unsubscribeTurnos = onSnapshot(turnosQuery, (snapshot) => {
          const turnosData = [];
          snapshot.forEach(doc => {
            turnosData.push({ id: doc.id, ...doc.data() });
          });

          turnosData.sort((a, b) => {
            const fechaA = new Date(a.fechaInicio || a.fecha);
            const fechaB = new Date(b.fechaInicio || b.fecha);
            return fechaB - fechaA;
          });

          setTurnos(turnosData);
          setLoading(false);
        }, (err) => {
          console.error('Error al cargar turnos tradicionales:', err);
          setError('Error al cargar turnos: ' + err.message);
          setLoading(false);
        });

      } catch (err) {
        console.error('Error critico al cargar datos:', err);
        setError('Error critico al cargar datos: ' + err.message);
        setLoading(false);
      }
    };

    loadUserData();

    // Funcion de limpieza
    return () => {
      if (unsubscribeTrabajos) unsubscribeTrabajos();
      if (unsubscribeTurnos) unsubscribeTurnos();
      if (unsubscribeTrabajosDelivery) unsubscribeTrabajosDelivery();
      if (unsubscribeTurnosDelivery) unsubscribeTurnosDelivery();
    };
  }, [currentUser, getUserSubcollections, ensureUserDocument]);

  // Formato de fecha
  const formatDate = useCallback((dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const contextValue = {
    trabajos,
    turnos,
    turnosPorFecha: useMemo(() => {
      const allTurnos = [...turnos, ...turnosDelivery];
      return allTurnos.reduce((acc, turno) => {
        const fechaClave = turno.fechaInicio || turno.fecha;
        if (!fechaClave) return acc;
        if (!acc[fechaClave]) acc[fechaClave] = [];
        acc[fechaClave].push(turno);
        return acc;
      }, {});
    }, [turnos, turnosDelivery]),
    loading,
    error,

    // Combinar todos los trabajos
    todosLosTrabajos: useMemo(() => {
      return [...trabajos, ...trabajosDelivery];
    }, [trabajos, trabajosDelivery]),

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
    addJob: useCallback(async (newJob) => {
      try {
        if (!currentUser) throw new Error('Usuario no autenticado');
        const subcollections = getUserSubcollections();
        if (!subcollections || !subcollections.trabajosRef) throw new Error('No se pudieron obtener las referencias de la subcoleccion');
        if (!newJob.nombre || !newJob.nombre.trim()) {
          throw new Error('El nombre del trabajo es requerido');
        }
        const jobWithMetadata = {
          ...newJob,
          fechaCreacion: new Date(),
          fechaActualizacion: new Date(),
          activo: true
        };
        const docRef = await addDoc(subcollections.trabajosRef, jobWithMetadata);
        return { ...jobWithMetadata, id: docRef.id };
      } catch (err) {
        setError('Error al agregar trabajo: ' + err.message);
        throw err;
      }
    }, [currentUser, getUserSubcollections]),

    editJob: useCallback(async (id, updatedData) => {
      try {
        if (!currentUser) throw new Error('Usuario no autenticado');
        const subcollections = getUserSubcollections();
        if (!subcollections || !subcollections.trabajosRef) throw new Error('No se pudieron obtener las referencias de la subcoleccion');
        const dataWithMetadata = {
          ...updatedData,
          fechaActualizacion: new Date()
        };
        const docRef = doc(subcollections.trabajosRef, id);
        await updateDoc(docRef, dataWithMetadata);
      } catch (err) {
        setError('Error al editar trabajo: ' + err.message);
        throw err;
      }
    }, [currentUser, getUserSubcollections]),

    deleteJob: useCallback(async (id) => {
      try {
        if (!currentUser) throw new Error('Usuario no autenticado');
        const subcollections = getUserSubcollections();
        if (!subcollections || !subcollections.trabajosRef || !subcollections.turnosRef) {
          throw new Error('No se pudieron obtener las referencias de la subcoleccion');
        }
        const jobRef = doc(db, 'usuarios', currentUser.uid, 'trabajos', id);
        const jobDoc = await getDoc(jobRef);
        if (!jobDoc.exists()) {
          setTrabajos(prev => prev.filter(t => t.id !== id));
          return;
        }
        const associatedShifts = turnos.filter(shift => shift.trabajoId === id);
        setTurnos(prev => prev.filter(shift => shift.trabajoId !== id));
        const deleteShiftPromises = associatedShifts.map(shift =>
          deleteDoc(doc(subcollections.turnosRef, shift.id))
        );
        await Promise.all(deleteShiftPromises);
        await deleteDoc(jobRef);
      } catch (err) {
        console.error('Error al eliminar trabajo:', err);
        setError('Error al eliminar trabajo: ' + err.message);
        throw err;
      }
    }, [currentUser, getUserSubcollections, turnos]),

    // Trabajos de delivery
    trabajosDelivery,
    addDeliveryJob,
    editDeliveryJob,
    deleteDeliveryJob,

    // Funciones CRUD para turnos tradicionales
    addShift: useCallback(async (newShift) => {
      try {
        if (!currentUser) throw new Error('Usuario no autenticado');
        const subcollections = getUserSubcollections();
        if (!newShift.trabajoId || !newShift.fechaInicio || !newShift.horaInicio || !newShift.horaFin) {
          throw new Error('Todos los campos del turno son requeridos');
        }
        const shiftWithMetadata = { ...newShift, fechaCreacion: new Date(), fechaActualizacion: new Date() };
        const docRef = await addDoc(subcollections.turnosRef, shiftWithMetadata);
        return { ...shiftWithMetadata, id: docRef.id };
      } catch (err) {
        console.error("Error al guardar turno:", err);
        setError('Error al guardar turno: ' + err.message);
        throw err;
      }
    }, [currentUser, getUserSubcollections]),

    editShift: useCallback(async (id, updatedData) => {
      try {
        if (!currentUser) throw new Error('Usuario no autenticado');
        const subcollections = getUserSubcollections();
        if (!subcollections || !subcollections.turnosRef) throw new Error('No se pudieron obtener las referencias de la subcoleccion');
        const dataWithMetadata = {
          ...updatedData,
          fechaActualizacion: new Date()
        };
        const docRef = doc(subcollections.turnosRef, id);
        await updateDoc(docRef, dataWithMetadata);
      } catch (err) {
        setError('Error al editar turno: ' + err.message);
        throw err;
      }
    }, [currentUser, getUserSubcollections]),

    deleteShift,

    // Turnos de delivery
    turnosDelivery,
    addDeliveryShift,
    editDeliveryShift,
    deleteDeliveryShift,

    // Funciones de calculo
    calculateHours,
    calculatePayment,
    calculateDailyTotal: useCallback((dailyShifts) => {
      return dailyShifts.reduce((total, shift) => {
        if (shift.type === 'delivery') {
          const netEarnings = (shift.gananciaTotal || 0) - (shift.gastoCombustible || 0);
          return {
            hours: total.hours,
            total: total.total + netEarnings
          };
        } else {
          const result = calculatePayment(shift);
          return {
            hours: total.hours + result.hours,
            total: total.total + result.total
          };
        }
      }, { hours: 0, total: 0 });
    }, [calculatePayment]),
    formatDate,
    updateWeeklyHoursGoal,

    savePreferences: useCallback(async (preferences) => {
      try {
        if (!currentUser) throw new Error('Usuario no autenticado');

        const {
          colorPrincipal: newColor,
          emojiUsuario: newEmoji,
          descuentoDefault: newDiscount,
          rangosTurnos: newRanges,
          deliveryEnabled: newDelivery,
          metaHorasSemanales: newGoal,
        } = preferences;

        // Actualizar estados locales si se proporcionan valores
        if (newColor !== undefined) setPrimaryColor(newColor);
        if (newEmoji !== undefined) setUserEmoji(newEmoji);
        if (newDiscount !== undefined) setDefaultDiscount(newDiscount);
        if (newRanges !== undefined) setShiftRanges(newRanges);
        if (newDelivery !== undefined) {
          setDeliveryEnabled(newDelivery);
        }
        if (newGoal !== undefined) setWeeklyHoursGoal(newGoal);

        // Persistir en localStorage
        if (newColor !== undefined) localStorage.setItem('primaryColor', newColor);
        if (newEmoji !== undefined) localStorage.setItem('userEmoji', newEmoji);
        if (newDiscount !== undefined) localStorage.setItem('defaultDiscount', newDiscount.toString());
        if (newRanges !== undefined) localStorage.setItem('shiftRanges', JSON.stringify(newRanges));
        if (newDelivery !== undefined) {
          localStorage.setItem('deliveryEnabled', newDelivery.toString());
        }
        if (newGoal !== undefined) localStorage.setItem('weeklyHoursGoal', newGoal === null ? 'null' : newGoal.toString());

        // Actualizar Firestore
        const userDocRef = doc(db, 'usuarios', currentUser.uid);
        const updatedData = {};

        if (newColor !== undefined) updatedData['ajustes.colorPrincipal'] = newColor;
        if (newEmoji !== undefined) updatedData['ajustes.emojiUsuario'] = newEmoji;
        if (newDiscount !== undefined) updatedData['ajustes.descuentoDefault'] = newDiscount;
        if (newRanges !== undefined) updatedData['ajustes.rangosTurnos'] = newRanges;
        if (newDelivery !== undefined) {
          updatedData['ajustes.deliveryEnabled'] = newDelivery;
        }
        if (newGoal !== undefined) updatedData['ajustes.metaHorasSemanales'] = newGoal;

        updatedData['fechaActualizacion'] = new Date();

        if (Object.keys(updatedData).length > 1) { // Verificar si hay datos reales para actualizar mas alla de la marca de tiempo
          await updateDoc(userDocRef, updatedData);
        }

        return true;
      } catch (err) {
        console.error('Error en savePreferences:', err);
        setError('Error al guardar preferencias: ' + err.message);
        throw err;
      }
    }, [currentUser]),
  };

  // Cargar preferencias de localStorage en el renderizado inicial
  useEffect(() => {
    const savedColor = localStorage.getItem('primaryColor');
    const savedEmoji = localStorage.getItem('userEmoji');
    const savedDescuento = localStorage.getItem('defaultDiscount');
    const savedRangos = localStorage.getItem('shiftRanges');
    const savedMeta = localStorage.getItem('weeklyHoursGoal');
    const savedDelivery = localStorage.getItem('deliveryEnabled');

    if (savedColor) setPrimaryColor(savedColor);
    if (savedEmoji) setUserEmoji(savedEmoji);
    if (savedDescuento) setDefaultDiscount(parseInt(savedDescuento));
    if (savedRangos) setShiftRanges(JSON.parse(savedRangos));
    if (savedMeta) setWeeklyHoursGoal(savedMeta === 'null' ? null : parseInt(savedMeta));
    if (savedDelivery !== null) setDeliveryEnabled(savedDelivery === 'true');
  }, []);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};