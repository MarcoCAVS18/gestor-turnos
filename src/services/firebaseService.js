// src/services/firebaseService.js
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
  where,
} from 'firebase/firestore';
import { db } from './firebase';
import { createSafeDate } from '../utils/time';

// --- HELPERS ---

const getUserSubcollections = (userUid) => {
  if (!userUid) return null;
  return {
    trabajosRef: collection(db, 'usuarios', userUid, 'trabajos'),
    turnosRef: collection(db, 'usuarios', userUid, 'turnos'),
    trabajosDeliveryRef: collection(db, 'usuarios', userUid, 'trabajos-delivery'),
    turnosDeliveryRef: collection(db, 'usuarios', userUid, 'turnos-delivery'),
    userDocRef: doc(db, 'usuarios', userUid),
  };
};

// --- USER & SETTINGS ---

export const ensureUserDocument = async (user) => {
  if (!user) return null;

  const userDocRef = doc(db, 'usuarios', user.uid);
  const userDocSnapshot = await getDoc(userDocRef);

  const defaultSettings = {
    colorPrincipal: '#EC4899',
    emojiUsuario: '😊',
    descuentoDefault: 15,
    metaHorasSemanales: null,
    deliveryEnabled: false,
    smokoEnabled: false,
    smokoMinutes: 30,
    rangosTurnos: {
      diurnoInicio: 6,
      diurnoFin: 14,
      tardeInicio: 14,
      tardeFin: 20,
      nocheInicio: 20,
    },
  };

  if (userDocSnapshot.exists()) {
    const userData = userDocSnapshot.data();
    return { ...defaultSettings, ...(userData.ajustes || {}) };
  } else {
    const defaultUserData = {
      email: user.email,
      displayName: user.displayName || 'Usuario',
      fechaCreacion: new Date(),
      ajustes: defaultSettings,
    };
    await setDoc(userDocRef, defaultUserData);
    return defaultSettings;
  }
};

export const savePreferences = async (userUid, preferences) => {
    const userDocRef = doc(db, 'usuarios', userUid);
    const updatedData = { fechaActualizacion: new Date() };

    const prefMap = {
        colorPrincipal: 'ajustes.colorPrincipal',
        emojiUsuario: 'ajustes.emojiUsuario',
        descuentoDefault: 'ajustes.descuentoDefault',
        rangosTurnos: 'ajustes.rangosTurnos',
        deliveryEnabled: 'ajustes.deliveryEnabled',
        metaHorasSemanales: 'ajustes.metaHorasSemanales',
        smokoEnabled: 'ajustes.smokoEnabled',
        smokoMinutes: 'ajustes.smokoMinutes',
    };

    for (const key in preferences) {
        if (Object.prototype.hasOwnProperty.call(prefMap, key)) {
            updatedData[prefMap[key]] = preferences[key];
        }
    }

    if (Object.keys(updatedData).length > 1) {
        await updateDoc(userDocRef, updatedData);
    }
};

export const updateWeeklyHoursGoal = (userUid, newGoal) => {
    const userDocRef = doc(db, 'usuarios', userUid);
    return updateDoc(userDocRef, {
        'ajustes.metaHorasSemanales': newGoal,
        fechaActualizacion: new Date()
    });
};


// --- DATA SUBSCRIPTIONS ---

export const subscribeToNormalData = (userUid, { setTrabajos, setTurnos, setError }) => {
  const collections = getUserSubcollections(userUid);
  if (!collections) return () => {};
  const unsubscribes = [];

  const trabajosQuery = query(collections.trabajosRef, orderBy('nombre', 'asc'));
  unsubscribes.push(onSnapshot(trabajosQuery, { includeMetadataChanges: true }, snapshot => {
      setTrabajos(currentTrabajos => {
          let updatedTrabajos = [...currentTrabajos];
          snapshot.docChanges().forEach(change => {
              const docData = { id: change.doc.id, ...change.doc.data() };
              const index = updatedTrabajos.findIndex(t => t.id === docData.id);
              if (change.type === 'added') {
                  if (index === -1) updatedTrabajos.push(docData);
              } else if (change.type === 'modified') {
                  if (index !== -1) updatedTrabajos[index] = docData;
              } else if (change.type === 'removed') {
                  updatedTrabajos = updatedTrabajos.filter(t => t.id !== change.doc.id);
              }
          });
          return updatedTrabajos.sort((a, b) => a.nombre.localeCompare(b.nombre));
      });
  }, err => setError('Error al cargar trabajos: ' + err.message)));

  const turnosQuery = query(collections.turnosRef, orderBy('fechaCreacion', 'desc'));
  unsubscribes.push(onSnapshot(turnosQuery, snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => new Date(b.fechaInicio || b.fecha) - new Date(a.fechaInicio || a.fecha));
      setTurnos(data);
  }, err => setError('Error al cargar turnos: ' + err.message)));

  return () => unsubscribes.forEach(unsub => unsub());
};

export const subscribeToDeliveryData = (userUid, { setTrabajosDelivery, setTurnosDelivery, setError }) => {
  const collections = getUserSubcollections(userUid);
  if (!collections) return () => {};
  const unsubscribes = [];

  const trabajosDeliveryQuery = query(collections.trabajosDeliveryRef, orderBy('fechaCreacion', 'desc'));
  unsubscribes.push(onSnapshot(trabajosDeliveryQuery, snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTrabajosDelivery(data);
  }, err => setError('Error al cargar trabajos de delivery: ' + err.message)));

  const turnosDeliveryQuery = query(collections.turnosDeliveryRef, orderBy('fecha', 'desc'));
  unsubscribes.push(onSnapshot(turnosDeliveryQuery, snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'delivery' }));
      setTurnosDelivery(data);
  }, err => setError('Error al cargar turnos de delivery: ' + err.message)));

  return () => unsubscribes.forEach(unsub => unsub());
};


// --- TRABAJOS (NORMAL) ---

export const addJob = async (userUid, newJob) => {
  if (!newJob.nombre || !newJob.nombre.trim()) throw new Error('El nombre del trabajo es requerido');
  const { trabajosRef } = getUserSubcollections(userUid);
  const jobWithMetadata = {
    ...newJob,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date(),
    activo: true
  };
  const docRef = await addDoc(trabajosRef, jobWithMetadata);
  return { ...jobWithMetadata, id: docRef.id };
};

export const editJob = (userUid, id, updatedData) => {
  const { trabajosRef } = getUserSubcollections(userUid);
  const dataWithMetadata = { ...updatedData, fechaActualizacion: new Date() };
  return updateDoc(doc(trabajosRef, id), dataWithMetadata);
};

export const deleteJob = async (userUid, id) => {
    const { trabajosRef, turnosRef } = getUserSubcollections(userUid);
    const shiftsQuery = query(turnosRef, where('trabajoId', '==', id));
    const shiftsSnapshot = await getDocs(shiftsQuery);
    const deletePromises = shiftsSnapshot.docs.map(d => deleteDoc(d.ref));
    await Promise.all(deletePromises);
    await deleteDoc(doc(trabajosRef, id));
};


// --- TURNOS (NORMAL) ---

export const addShift = async (userUid, newShift) => {
  const { turnosRef } = getUserSubcollections(userUid);
  const cruzaMedianoche = newShift.cruzaMedianoche || (newShift.horaInicio && newShift.horaFin && newShift.horaInicio.split(':')[0] > newShift.horaFin.split(':')[0]);
  let fechaFin = newShift.fechaFin;
  if (!fechaFin && cruzaMedianoche) {
    const fechaInicio = createSafeDate(newShift.fechaInicio);
    fechaFin = new Date(fechaInicio.setDate(fechaInicio.getDate() + 1)).toISOString().split('T')[0];
  }
  const shiftWithMetadata = {
    ...newShift,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date(),
    fecha: newShift.fechaInicio,
    fechaFin: fechaFin || newShift.fechaInicio,
    cruzaMedianoche,
  };
  const docRef = await addDoc(turnosRef, shiftWithMetadata);
  return { ...shiftWithMetadata, id: docRef.id };
};

export const editShift = (userUid, id, updatedData) => {
    const { turnosRef } = getUserSubcollections(userUid);
    const cruzaMedianoche = updatedData.cruzaMedianoche || (updatedData.horaInicio && updatedData.horaFin && updatedData.horaInicio.split(':')[0] > updatedData.horaFin.split(':')[0]);
    let fechaFin = updatedData.fechaFin;
    if (!fechaFin && cruzaMedianoche) {
        const fechaInicio = createSafeDate(updatedData.fechaInicio);
        fechaFin = new Date(fechaInicio.setDate(fechaInicio.getDate() + 1)).toISOString().split('T')[0];
    }
    const dataWithMetadata = {
        ...updatedData,
        fechaActualizacion: new Date(),
        fecha: updatedData.fechaInicio,
        fechaFin: fechaFin || updatedData.fechaInicio,
        cruzaMedianoche,
    };
    return updateDoc(doc(turnosRef, id), dataWithMetadata);
};

export const deleteShift = (userUid, id) => {
    const { turnosRef } = getUserSubcollections(userUid);
    return deleteDoc(doc(turnosRef, id));
};

// --- TRABAJOS (DELIVERY) ---

export const addDeliveryJob = async (userUid, newJob) => {
    const { trabajosDeliveryRef } = getUserSubcollections(userUid);
    const jobData = {
      ...newJob,
      tipo: 'delivery',
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      plataforma: newJob.plataforma || '',
      vehiculo: newJob.vehiculo || '',
      colorAvatar: newJob.colorAvatar || '#10B981',
      estadisticas: { /* default stats */ }
    };
    const docRef = await addDoc(trabajosDeliveryRef, jobData);
    return { ...jobData, id: docRef.id };
};

export const editDeliveryJob = (userUid, id, updatedData) => {
    const { trabajosDeliveryRef } = getUserSubcollections(userUid);
    const dataWithMetadata = { ...updatedData, fechaActualizacion: new Date() };
    return updateDoc(doc(trabajosDeliveryRef, id), dataWithMetadata);
};

export const deleteDeliveryJob = async (userUid, id) => {
    const { trabajosDeliveryRef, turnosDeliveryRef } = getUserSubcollections(userUid);
    const shiftsQuery = query(turnosDeliveryRef, where('trabajoId', '==', id));
    const shiftsSnapshot = await getDocs(shiftsQuery);
    const deletePromises = shiftsSnapshot.docs.map(d => deleteDoc(d.ref));
    await Promise.all(deletePromises);
    await deleteDoc(doc(trabajosDeliveryRef, id));
};

// --- TURNOS (DELIVERY) ---

export const addDeliveryShift = async (userUid, newShift) => {
    const { turnosDeliveryRef } = getUserSubcollections(userUid);
    let fechaFin = newShift.fechaFin;
    if (!fechaFin && newShift.cruzaMedianoche) {
        const fechaInicio = createSafeDate(newShift.fechaInicio);
        fechaFin = new Date(fechaInicio.setDate(fechaInicio.getDate() + 1)).toISOString().split('T')[0];
    }
    const shiftData = {
      ...newShift,
      tipo: 'delivery',
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      fecha: newShift.fechaInicio || newShift.fecha,
      fechaInicio: newShift.fechaInicio || newShift.fecha,
      fechaFin: fechaFin || newShift.fechaInicio || newShift.fecha,
      gananciaBase: (newShift.gananciaTotal || 0) - (newShift.propinas || 0),
      gananciaNeta: (newShift.gananciaTotal || 0) - (newShift.gastoCombustible || 0),
    };
    const docRef = await addDoc(turnosDeliveryRef, shiftData);
    return { ...shiftData, id: docRef.id };
};

export const editDeliveryShift = (userUid, id, updatedData) => {
    const { turnosDeliveryRef } = getUserSubcollections(userUid);
    let fechaFin = updatedData.fechaFin;
    if (!fechaFin && updatedData.cruzaMedianoche) {
        const fechaInicio = createSafeDate(updatedData.fechaInicio || updatedData.fecha);
        fechaFin = new Date(fechaInicio.setDate(fechaInicio.getDate() + 1)).toISOString().split('T')[0];
    }
    const dataWithMetadata = {
      ...updatedData,
      fechaActualizacion: new Date(),
      fecha: updatedData.fechaInicio || updatedData.fecha,
      fechaFin: fechaFin || updatedData.fechaInicio || updatedData.fecha,
      gananciaBase: (updatedData.gananciaTotal || 0) - (updatedData.propinas || 0),
      gananciaNeta: (updatedData.gananciaTotal || 0) - (updatedData.gastoCombustible || 0),
    };
    return updateDoc(doc(turnosDeliveryRef, id), dataWithMetadata);
};

export const deleteDeliveryShift = (userUid, id) => {
    const { turnosDeliveryRef } = getUserSubcollections(userUid);
    return deleteDoc(doc(turnosDeliveryRef, id));
};
