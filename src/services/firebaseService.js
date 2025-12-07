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

const createIncrementalSubscription = (query, setData, errorCallback, sortComparator) => {
    return onSnapshot(query, { includeMetadataChanges: true }, (snapshot) => {
        setData((currentData) => {
            let updatedData = [...(currentData || [])];
            snapshot.docChanges().forEach((change) => {
                const docData = { id: change.doc.id, ...change.doc.data() };
                const index = updatedData.findIndex((t) => t.id === docData.id);

                if (change.type === 'added') {
                    if (index === -1) updatedData.push(docData);
                } else if (change.type === 'modified') {
                    if (index !== -1) updatedData[index] = docData;
                } else if (change.type === 'removed') {
                    updatedData = updatedData.filter((t) => t.id !== change.doc.id);
                }
            });
            return updatedData.sort(sortComparator);
        });
    }, (err) => errorCallback('Error al cargar datos: ' + err.message));
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
  unsubscribes.push(
    createIncrementalSubscription(
      trabajosQuery,
      setTrabajos,
      (error) => setError(error),
      (a, b) => a.nombre.localeCompare(b.nombre)
    )
  );

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
    unsubscribes.push(
    createIncrementalSubscription(
      trabajosDeliveryQuery,
      setTrabajosDelivery,
      (error) => setError(error),
      (a, b) => b.fechaCreacion - a.fechaCreacion
    )
  );

  const turnosDeliveryQuery = query(collections.turnosDeliveryRef, orderBy('fecha', 'desc'));
  unsubscribes.push(onSnapshot(turnosDeliveryQuery, snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'delivery' }));
      setTurnosDelivery(data);
  }, err => setError('Error al cargar turnos de delivery: ' + err.message)));

  return () => unsubscribes.forEach(unsub => unsub());
};

// --- TRABAJOS (JOBS) ---

export const addJob = async (userUid, newJob, isDelivery = false) => {
  const { trabajosRef, trabajosDeliveryRef } = getUserSubcollections(userUid);
  const targetRef = isDelivery ? trabajosDeliveryRef : trabajosRef;

  let jobData = {
    ...newJob,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date(),
  };

  if (isDelivery) {
    jobData = {
      ...jobData,
      tipo: 'delivery',
      plataforma: newJob.plataforma || '',
      vehiculo: newJob.vehiculo || '',
      colorAvatar: newJob.colorAvatar || '#10B981',
      estadisticas: { /* default stats */ }
    };
  } else {
    if (!newJob.nombre || !newJob.nombre.trim()) throw new Error('El nombre del trabajo es requerido');
    jobData = {
      ...jobData,
      activo: true
    };
  }

  const docRef = await addDoc(targetRef, jobData);
  return { ...jobData, id: docRef.id };
};

export const editJob = (userUid, id, updatedData, isDelivery = false) => {
  const { trabajosRef, trabajosDeliveryRef } = getUserSubcollections(userUid);
  const targetRef = isDelivery ? trabajosDeliveryRef : trabajosRef;
  const dataWithMetadata = { ...updatedData, fechaActualizacion: new Date() };
  return updateDoc(doc(targetRef, id), dataWithMetadata);
};

export const deleteJob = async (userUid, id, isDelivery = false) => {
  const { trabajosRef, turnosRef, trabajosDeliveryRef, turnosDeliveryRef } = getUserSubcollections(userUid);
  const jobRef = isDelivery ? doc(trabajosDeliveryRef, id) : doc(trabajosRef, id);
  const shiftsCollectionRef = isDelivery ? turnosDeliveryRef : turnosRef;

  const shiftsQuery = query(shiftsCollectionRef, where('trabajoId', '==', id));
  const shiftsSnapshot = await getDocs(shiftsQuery);
  const deletePromises = shiftsSnapshot.docs.map(d => deleteDoc(d.ref));
  await Promise.all(deletePromises);

  await deleteDoc(jobRef);
};

// --- TURNOS (SHIFTS) ---

export const addShift = async (userUid, newShift, isDelivery = false) => {
  const { turnosRef, turnosDeliveryRef } = getUserSubcollections(userUid);
  const targetRef = isDelivery ? turnosDeliveryRef : turnosRef;
  
  const cruzaMedianoche = newShift.cruzaMedianoche || (newShift.horaInicio && newShift.horaFin && newShift.horaInicio.split(':')[0] > newShift.horaFin.split(':')[0]);
  let fechaFin = newShift.fechaFin;
  if (!fechaFin && cruzaMedianoche) {
    const fechaInicio = createSafeDate(newShift.fechaInicio || newShift.fecha);
    fechaFin = new Date(fechaInicio.setDate(fechaInicio.getDate() + 1)).toISOString().split('T')[0];
  }

  let shiftData = {
    ...newShift,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date(),
    fecha: newShift.fechaInicio || newShift.fecha,
    fechaInicio: newShift.fechaInicio || newShift.fecha,
    fechaFin: fechaFin || newShift.fechaInicio || newShift.fecha,
    cruzaMedianoche,
  };

  if (isDelivery) {
    shiftData = {
      ...shiftData,
      tipo: 'delivery',
      gananciaBase: (newShift.gananciaTotal || 0) - (newShift.propinas || 0),
      gananciaNeta: (newShift.gananciaTotal || 0) - (newShift.gastoCombustible || 0),
    };
  }

  const docRef = await addDoc(targetRef, shiftData);
  return { ...shiftData, id: docRef.id };
};

export const editShift = (userUid, id, updatedData, isDelivery = false) => {
  const { turnosRef, turnosDeliveryRef } = getUserSubcollections(userUid);
  const targetRef = isDelivery ? turnosDeliveryRef : turnosRef;

  const cruzaMedianoche = updatedData.cruzaMedianoche || (updatedData.horaInicio && updatedData.horaFin && updatedData.horaInicio.split(':')[0] > updatedData.horaFin.split(':')[0]);
  let fechaFin = updatedData.fechaFin;
  if (!fechaFin && cruzaMedianoche) {
    const fechaInicio = createSafeDate(updatedData.fechaInicio || updatedData.fecha);
    fechaFin = new Date(fechaInicio.setDate(fechaInicio.getDate() + 1)).toISOString().split('T')[0];
  }

  let dataWithMetadata = {
    ...updatedData,
    fechaActualizacion: new Date(),
    fecha: updatedData.fechaInicio || updatedData.fecha,
    fechaFin: fechaFin || updatedData.fechaInicio || updatedData.fecha,
    cruzaMedianoche,
  };

  if (isDelivery) {
    dataWithMetadata = {
      ...dataWithMetadata,
      gananciaBase: (updatedData.gananciaTotal || 0) - (updatedData.propinas || 0),
      gananciaNeta: (updatedData.gananciaTotal || 0) - (updatedData.gastoCombustible || 0),
    };
  }

  return updateDoc(doc(targetRef, id), dataWithMetadata);
};

export const deleteShift = (userUid, id, isDelivery = false) => {
  const { turnosRef, turnosDeliveryRef } = getUserSubcollections(userUid);
  const targetRef = isDelivery ? turnosDeliveryRef : turnosRef;
  return deleteDoc(doc(targetRef, id));
};
