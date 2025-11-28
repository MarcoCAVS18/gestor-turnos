// src/services/firebaseService.js
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
  where,
***REMOVED*** from 'firebase/firestore';
import ***REMOVED*** db ***REMOVED*** from './firebase';
import ***REMOVED*** createSafeDate ***REMOVED*** from '../utils/time';

// --- HELPERS ---

const getUserSubcollections = (userUid) => ***REMOVED***
  if (!userUid) return null;
  return ***REMOVED***
    trabajosRef: collection(db, 'usuarios', userUid, 'trabajos'),
    turnosRef: collection(db, 'usuarios', userUid, 'turnos'),
    trabajosDeliveryRef: collection(db, 'usuarios', userUid, 'trabajos-delivery'),
    turnosDeliveryRef: collection(db, 'usuarios', userUid, 'turnos-delivery'),
    userDocRef: doc(db, 'usuarios', userUid),
  ***REMOVED***;
***REMOVED***;

// --- USER & SETTINGS ---

export const ensureUserDocument = async (user) => ***REMOVED***
  if (!user) return null;

  const userDocRef = doc(db, 'usuarios', user.uid);
  const userDocSnapshot = await getDoc(userDocRef);

  const defaultSettings = ***REMOVED***
    colorPrincipal: '#EC4899',
    emojiUsuario: '😊',
    descuentoDefault: 15,
    metaHorasSemanales: null,
    deliveryEnabled: false,
    smokoEnabled: false,
    smokoMinutes: 30,
    rangosTurnos: ***REMOVED***
      diurnoInicio: 6,
      diurnoFin: 14,
      tardeInicio: 14,
      tardeFin: 20,
      nocheInicio: 20,
    ***REMOVED***,
  ***REMOVED***;

  if (userDocSnapshot.exists()) ***REMOVED***
    const userData = userDocSnapshot.data();
    return ***REMOVED*** ...defaultSettings, ...(userData.ajustes || ***REMOVED******REMOVED***) ***REMOVED***;
  ***REMOVED*** else ***REMOVED***
    const defaultUserData = ***REMOVED***
      email: user.email,
      displayName: user.displayName || 'Usuario',
      fechaCreacion: new Date(),
      ajustes: defaultSettings,
    ***REMOVED***;
    await setDoc(userDocRef, defaultUserData);
    return defaultSettings;
  ***REMOVED***
***REMOVED***;

export const savePreferences = async (userUid, preferences) => ***REMOVED***
    const userDocRef = doc(db, 'usuarios', userUid);
    const updatedData = ***REMOVED*** fechaActualizacion: new Date() ***REMOVED***;

    const prefMap = ***REMOVED***
        colorPrincipal: 'ajustes.colorPrincipal',
        emojiUsuario: 'ajustes.emojiUsuario',
        descuentoDefault: 'ajustes.descuentoDefault',
        rangosTurnos: 'ajustes.rangosTurnos',
        deliveryEnabled: 'ajustes.deliveryEnabled',
        metaHorasSemanales: 'ajustes.metaHorasSemanales',
        smokoEnabled: 'ajustes.smokoEnabled',
        smokoMinutes: 'ajustes.smokoMinutes',
    ***REMOVED***;

    for (const key in preferences) ***REMOVED***
        if (Object.prototype.hasOwnProperty.call(prefMap, key)) ***REMOVED***
            updatedData[prefMap[key]] = preferences[key];
        ***REMOVED***
    ***REMOVED***

    if (Object.keys(updatedData).length > 1) ***REMOVED***
        await updateDoc(userDocRef, updatedData);
    ***REMOVED***
***REMOVED***;

export const updateWeeklyHoursGoal = (userUid, newGoal) => ***REMOVED***
    const userDocRef = doc(db, 'usuarios', userUid);
    return updateDoc(userDocRef, ***REMOVED***
        'ajustes.metaHorasSemanales': newGoal,
        fechaActualizacion: new Date()
    ***REMOVED***);
***REMOVED***;


// --- DATA SUBSCRIPTIONS ---

export const subscribeToNormalData = (userUid, ***REMOVED*** setTrabajos, setTurnos, setError ***REMOVED***) => ***REMOVED***
  const collections = getUserSubcollections(userUid);
  if (!collections) return () => ***REMOVED******REMOVED***;
  const unsubscribes = [];

  const trabajosQuery = query(collections.trabajosRef, orderBy('nombre', 'asc'));
  unsubscribes.push(onSnapshot(trabajosQuery, ***REMOVED*** includeMetadataChanges: true ***REMOVED***, snapshot => ***REMOVED***
      setTrabajos(currentTrabajos => ***REMOVED***
          let updatedTrabajos = [...currentTrabajos];
          snapshot.docChanges().forEach(change => ***REMOVED***
              const docData = ***REMOVED*** id: change.doc.id, ...change.doc.data() ***REMOVED***;
              const index = updatedTrabajos.findIndex(t => t.id === docData.id);
              if (change.type === 'added') ***REMOVED***
                  if (index === -1) updatedTrabajos.push(docData);
              ***REMOVED*** else if (change.type === 'modified') ***REMOVED***
                  if (index !== -1) updatedTrabajos[index] = docData;
              ***REMOVED*** else if (change.type === 'removed') ***REMOVED***
                  updatedTrabajos = updatedTrabajos.filter(t => t.id !== change.doc.id);
              ***REMOVED***
          ***REMOVED***);
          return updatedTrabajos.sort((a, b) => a.nombre.localeCompare(b.nombre));
      ***REMOVED***);
  ***REMOVED***, err => setError('Error al cargar trabajos: ' + err.message)));

  const turnosQuery = query(collections.turnosRef, orderBy('fechaCreacion', 'desc'));
  unsubscribes.push(onSnapshot(turnosQuery, snapshot => ***REMOVED***
      const data = snapshot.docs.map(doc => (***REMOVED*** id: doc.id, ...doc.data() ***REMOVED***));
      data.sort((a, b) => new Date(b.fechaInicio || b.fecha) - new Date(a.fechaInicio || a.fecha));
      setTurnos(data);
  ***REMOVED***, err => setError('Error al cargar turnos: ' + err.message)));

  return () => unsubscribes.forEach(unsub => unsub());
***REMOVED***;

export const subscribeToDeliveryData = (userUid, ***REMOVED*** setTrabajosDelivery, setTurnosDelivery, setError ***REMOVED***) => ***REMOVED***
  const collections = getUserSubcollections(userUid);
  if (!collections) return () => ***REMOVED******REMOVED***;
  const unsubscribes = [];

  const trabajosDeliveryQuery = query(collections.trabajosDeliveryRef, orderBy('fechaCreacion', 'desc'));
  unsubscribes.push(onSnapshot(trabajosDeliveryQuery, snapshot => ***REMOVED***
      const data = snapshot.docs.map(doc => (***REMOVED*** id: doc.id, ...doc.data() ***REMOVED***));
      setTrabajosDelivery(data);
  ***REMOVED***, err => setError('Error al cargar trabajos de delivery: ' + err.message)));

  const turnosDeliveryQuery = query(collections.turnosDeliveryRef, orderBy('fecha', 'desc'));
  unsubscribes.push(onSnapshot(turnosDeliveryQuery, snapshot => ***REMOVED***
      const data = snapshot.docs.map(doc => (***REMOVED*** id: doc.id, ...doc.data(), type: 'delivery' ***REMOVED***));
      setTurnosDelivery(data);
  ***REMOVED***, err => setError('Error al cargar turnos de delivery: ' + err.message)));

  return () => unsubscribes.forEach(unsub => unsub());
***REMOVED***;


// --- TRABAJOS (NORMAL) ---

export const addJob = async (userUid, newJob) => ***REMOVED***
  if (!newJob.nombre || !newJob.nombre.trim()) throw new Error('El nombre del trabajo es requerido');
  const ***REMOVED*** trabajosRef ***REMOVED*** = getUserSubcollections(userUid);
  const jobWithMetadata = ***REMOVED***
    ...newJob,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date(),
    activo: true
  ***REMOVED***;
  const docRef = await addDoc(trabajosRef, jobWithMetadata);
  return ***REMOVED*** ...jobWithMetadata, id: docRef.id ***REMOVED***;
***REMOVED***;

export const editJob = (userUid, id, updatedData) => ***REMOVED***
  const ***REMOVED*** trabajosRef ***REMOVED*** = getUserSubcollections(userUid);
  const dataWithMetadata = ***REMOVED*** ...updatedData, fechaActualizacion: new Date() ***REMOVED***;
  return updateDoc(doc(trabajosRef, id), dataWithMetadata);
***REMOVED***;

export const deleteJob = async (userUid, id) => ***REMOVED***
    const ***REMOVED*** trabajosRef, turnosRef ***REMOVED*** = getUserSubcollections(userUid);
    const shiftsQuery = query(turnosRef, where('trabajoId', '==', id));
    const shiftsSnapshot = await getDocs(shiftsQuery);
    const deletePromises = shiftsSnapshot.docs.map(d => deleteDoc(d.ref));
    await Promise.all(deletePromises);
    await deleteDoc(doc(trabajosRef, id));
***REMOVED***;


// --- TURNOS (NORMAL) ---

export const addShift = async (userUid, newShift) => ***REMOVED***
  const ***REMOVED*** turnosRef ***REMOVED*** = getUserSubcollections(userUid);
  const cruzaMedianoche = newShift.cruzaMedianoche || (newShift.horaInicio && newShift.horaFin && newShift.horaInicio.split(':')[0] > newShift.horaFin.split(':')[0]);
  let fechaFin = newShift.fechaFin;
  if (!fechaFin && cruzaMedianoche) ***REMOVED***
    const fechaInicio = createSafeDate(newShift.fechaInicio);
    fechaFin = new Date(fechaInicio.setDate(fechaInicio.getDate() + 1)).toISOString().split('T')[0];
  ***REMOVED***
  const shiftWithMetadata = ***REMOVED***
    ...newShift,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date(),
    fecha: newShift.fechaInicio,
    fechaFin: fechaFin || newShift.fechaInicio,
    cruzaMedianoche,
  ***REMOVED***;
  const docRef = await addDoc(turnosRef, shiftWithMetadata);
  return ***REMOVED*** ...shiftWithMetadata, id: docRef.id ***REMOVED***;
***REMOVED***;

export const editShift = (userUid, id, updatedData) => ***REMOVED***
    const ***REMOVED*** turnosRef ***REMOVED*** = getUserSubcollections(userUid);
    const cruzaMedianoche = updatedData.cruzaMedianoche || (updatedData.horaInicio && updatedData.horaFin && updatedData.horaInicio.split(':')[0] > updatedData.horaFin.split(':')[0]);
    let fechaFin = updatedData.fechaFin;
    if (!fechaFin && cruzaMedianoche) ***REMOVED***
        const fechaInicio = createSafeDate(updatedData.fechaInicio);
        fechaFin = new Date(fechaInicio.setDate(fechaInicio.getDate() + 1)).toISOString().split('T')[0];
    ***REMOVED***
    const dataWithMetadata = ***REMOVED***
        ...updatedData,
        fechaActualizacion: new Date(),
        fecha: updatedData.fechaInicio,
        fechaFin: fechaFin || updatedData.fechaInicio,
        cruzaMedianoche,
    ***REMOVED***;
    return updateDoc(doc(turnosRef, id), dataWithMetadata);
***REMOVED***;

export const deleteShift = (userUid, id) => ***REMOVED***
    const ***REMOVED*** turnosRef ***REMOVED*** = getUserSubcollections(userUid);
    return deleteDoc(doc(turnosRef, id));
***REMOVED***;

// --- TRABAJOS (DELIVERY) ---

export const addDeliveryJob = async (userUid, newJob) => ***REMOVED***
    const ***REMOVED*** trabajosDeliveryRef ***REMOVED*** = getUserSubcollections(userUid);
    const jobData = ***REMOVED***
      ...newJob,
      tipo: 'delivery',
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      plataforma: newJob.plataforma || '',
      vehiculo: newJob.vehiculo || '',
      colorAvatar: newJob.colorAvatar || '#10B981',
      estadisticas: ***REMOVED*** /* default stats */ ***REMOVED***
    ***REMOVED***;
    const docRef = await addDoc(trabajosDeliveryRef, jobData);
    return ***REMOVED*** ...jobData, id: docRef.id ***REMOVED***;
***REMOVED***;

export const editDeliveryJob = (userUid, id, updatedData) => ***REMOVED***
    const ***REMOVED*** trabajosDeliveryRef ***REMOVED*** = getUserSubcollections(userUid);
    const dataWithMetadata = ***REMOVED*** ...updatedData, fechaActualizacion: new Date() ***REMOVED***;
    return updateDoc(doc(trabajosDeliveryRef, id), dataWithMetadata);
***REMOVED***;

export const deleteDeliveryJob = async (userUid, id) => ***REMOVED***
    const ***REMOVED*** trabajosDeliveryRef, turnosDeliveryRef ***REMOVED*** = getUserSubcollections(userUid);
    const shiftsQuery = query(turnosDeliveryRef, where('trabajoId', '==', id));
    const shiftsSnapshot = await getDocs(shiftsQuery);
    const deletePromises = shiftsSnapshot.docs.map(d => deleteDoc(d.ref));
    await Promise.all(deletePromises);
    await deleteDoc(doc(trabajosDeliveryRef, id));
***REMOVED***;

// --- TURNOS (DELIVERY) ---

export const addDeliveryShift = async (userUid, newShift) => ***REMOVED***
    const ***REMOVED*** turnosDeliveryRef ***REMOVED*** = getUserSubcollections(userUid);
    let fechaFin = newShift.fechaFin;
    if (!fechaFin && newShift.cruzaMedianoche) ***REMOVED***
        const fechaInicio = createSafeDate(newShift.fechaInicio);
        fechaFin = new Date(fechaInicio.setDate(fechaInicio.getDate() + 1)).toISOString().split('T')[0];
    ***REMOVED***
    const shiftData = ***REMOVED***
      ...newShift,
      tipo: 'delivery',
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      fecha: newShift.fechaInicio || newShift.fecha,
      fechaInicio: newShift.fechaInicio || newShift.fecha,
      fechaFin: fechaFin || newShift.fechaInicio || newShift.fecha,
      gananciaBase: (newShift.gananciaTotal || 0) - (newShift.propinas || 0),
      gananciaNeta: (newShift.gananciaTotal || 0) - (newShift.gastoCombustible || 0),
    ***REMOVED***;
    const docRef = await addDoc(turnosDeliveryRef, shiftData);
    return ***REMOVED*** ...shiftData, id: docRef.id ***REMOVED***;
***REMOVED***;

export const editDeliveryShift = (userUid, id, updatedData) => ***REMOVED***
    const ***REMOVED*** turnosDeliveryRef ***REMOVED*** = getUserSubcollections(userUid);
    let fechaFin = updatedData.fechaFin;
    if (!fechaFin && updatedData.cruzaMedianoche) ***REMOVED***
        const fechaInicio = createSafeDate(updatedData.fechaInicio || updatedData.fecha);
        fechaFin = new Date(fechaInicio.setDate(fechaInicio.getDate() + 1)).toISOString().split('T')[0];
    ***REMOVED***
    const dataWithMetadata = ***REMOVED***
      ...updatedData,
      fechaActualizacion: new Date(),
      fecha: updatedData.fechaInicio || updatedData.fecha,
      fechaFin: fechaFin || updatedData.fechaInicio || updatedData.fecha,
      gananciaBase: (updatedData.gananciaTotal || 0) - (updatedData.propinas || 0),
      gananciaNeta: (updatedData.gananciaTotal || 0) - (updatedData.gastoCombustible || 0),
    ***REMOVED***;
    return updateDoc(doc(turnosDeliveryRef, id), dataWithMetadata);
***REMOVED***;

export const deleteDeliveryShift = (userUid, id) => ***REMOVED***
    const ***REMOVED*** turnosDeliveryRef ***REMOVED*** = getUserSubcollections(userUid);
    return deleteDoc(doc(turnosDeliveryRef, id));
***REMOVED***;
