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

const createIncrementalSubscription = (query, setData, errorCallback, sortComparator) => ***REMOVED***
    return onSnapshot(query, ***REMOVED*** includeMetadataChanges: true ***REMOVED***, (snapshot) => ***REMOVED***
        setData((currentData) => ***REMOVED***
            let updatedData = [...(currentData || [])];
            snapshot.docChanges().forEach((change) => ***REMOVED***
                const docData = ***REMOVED*** id: change.doc.id, ...change.doc.data() ***REMOVED***;
                const index = updatedData.findIndex((t) => t.id === docData.id);

                if (change.type === 'added') ***REMOVED***
                    if (index === -1) updatedData.push(docData);
                ***REMOVED*** else if (change.type === 'modified') ***REMOVED***
                    if (index !== -1) updatedData[index] = docData;
                ***REMOVED*** else if (change.type === 'removed') ***REMOVED***
                    updatedData = updatedData.filter((t) => t.id !== change.doc.id);
                ***REMOVED***
            ***REMOVED***);
            return updatedData.sort(sortComparator);
        ***REMOVED***);
    ***REMOVED***, (err) => errorCallback('Error al cargar datos: ' + err.message));
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
  unsubscribes.push(
    createIncrementalSubscription(
      trabajosQuery,
      setTrabajos,
      (error) => setError(error),
      (a, b) => a.nombre.localeCompare(b.nombre)
    )
  );

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
    unsubscribes.push(
    createIncrementalSubscription(
      trabajosDeliveryQuery,
      setTrabajosDelivery,
      (error) => setError(error),
      (a, b) => b.fechaCreacion - a.fechaCreacion
    )
  );

  const turnosDeliveryQuery = query(collections.turnosDeliveryRef, orderBy('fecha', 'desc'));
  unsubscribes.push(onSnapshot(turnosDeliveryQuery, snapshot => ***REMOVED***
      const data = snapshot.docs.map(doc => (***REMOVED*** id: doc.id, ...doc.data(), type: 'delivery' ***REMOVED***));
      setTurnosDelivery(data);
  ***REMOVED***, err => setError('Error al cargar turnos de delivery: ' + err.message)));

  return () => unsubscribes.forEach(unsub => unsub());
***REMOVED***;

// --- TRABAJOS (JOBS) ---

export const addJob = async (userUid, newJob, isDelivery = false) => ***REMOVED***
  const ***REMOVED*** trabajosRef, trabajosDeliveryRef ***REMOVED*** = getUserSubcollections(userUid);
  const targetRef = isDelivery ? trabajosDeliveryRef : trabajosRef;

  let jobData = ***REMOVED***
    ...newJob,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date(),
  ***REMOVED***;

  if (isDelivery) ***REMOVED***
    jobData = ***REMOVED***
      ...jobData,
      tipo: 'delivery',
      plataforma: newJob.plataforma || '',
      vehiculo: newJob.vehiculo || '',
      colorAvatar: newJob.colorAvatar || '#10B981',
      estadisticas: ***REMOVED*** /* default stats */ ***REMOVED***
    ***REMOVED***;
  ***REMOVED*** else ***REMOVED***
    if (!newJob.nombre || !newJob.nombre.trim()) throw new Error('El nombre del trabajo es requerido');
    jobData = ***REMOVED***
      ...jobData,
      activo: true
    ***REMOVED***;
  ***REMOVED***

  const docRef = await addDoc(targetRef, jobData);
  return ***REMOVED*** ...jobData, id: docRef.id ***REMOVED***;
***REMOVED***;

export const editJob = (userUid, id, updatedData, isDelivery = false) => ***REMOVED***
  const ***REMOVED*** trabajosRef, trabajosDeliveryRef ***REMOVED*** = getUserSubcollections(userUid);
  const targetRef = isDelivery ? trabajosDeliveryRef : trabajosRef;
  const dataWithMetadata = ***REMOVED*** ...updatedData, fechaActualizacion: new Date() ***REMOVED***;
  return updateDoc(doc(targetRef, id), dataWithMetadata);
***REMOVED***;

export const deleteJob = async (userUid, id, isDelivery = false) => ***REMOVED***
  const ***REMOVED*** trabajosRef, turnosRef, trabajosDeliveryRef, turnosDeliveryRef ***REMOVED*** = getUserSubcollections(userUid);
  const jobRef = isDelivery ? doc(trabajosDeliveryRef, id) : doc(trabajosRef, id);
  const shiftsCollectionRef = isDelivery ? turnosDeliveryRef : turnosRef;

  const shiftsQuery = query(shiftsCollectionRef, where('trabajoId', '==', id));
  const shiftsSnapshot = await getDocs(shiftsQuery);
  const deletePromises = shiftsSnapshot.docs.map(d => deleteDoc(d.ref));
  await Promise.all(deletePromises);

  await deleteDoc(jobRef);
***REMOVED***;

// --- TURNOS (SHIFTS) ---

export const addShift = async (userUid, newShift, isDelivery = false) => ***REMOVED***
  const ***REMOVED*** turnosRef, turnosDeliveryRef ***REMOVED*** = getUserSubcollections(userUid);
  const targetRef = isDelivery ? turnosDeliveryRef : turnosRef;
  
  const cruzaMedianoche = newShift.cruzaMedianoche || (newShift.horaInicio && newShift.horaFin && newShift.horaInicio.split(':')[0] > newShift.horaFin.split(':')[0]);
  let fechaFin = newShift.fechaFin;
  if (!fechaFin && cruzaMedianoche) ***REMOVED***
    const fechaInicio = createSafeDate(newShift.fechaInicio || newShift.fecha);
    fechaFin = new Date(fechaInicio.setDate(fechaInicio.getDate() + 1)).toISOString().split('T')[0];
  ***REMOVED***

  let shiftData = ***REMOVED***
    ...newShift,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date(),
    fecha: newShift.fechaInicio || newShift.fecha,
    fechaInicio: newShift.fechaInicio || newShift.fecha,
    fechaFin: fechaFin || newShift.fechaInicio || newShift.fecha,
    cruzaMedianoche,
  ***REMOVED***;

  if (isDelivery) ***REMOVED***
    const gananciaBase = newShift.gananciaBase || 0;
    const propinas = newShift.propinas || 0;
    const gananciaTotal = gananciaBase + propinas;
    const gastoCombustible = newShift.gastoCombustible || 0;
    
    shiftData = ***REMOVED***
      ...shiftData,
      tipo: 'delivery',
      gananciaBase: gananciaBase,
      propinas: propinas,
      gananciaTotal: gananciaTotal,
      gananciaNeta: gananciaTotal - gastoCombustible,
    ***REMOVED***;
  ***REMOVED***

  const docRef = await addDoc(targetRef, shiftData);
  return ***REMOVED*** ...shiftData, id: docRef.id ***REMOVED***;
***REMOVED***;

export const editShift = (userUid, id, updatedData, isDelivery = false) => ***REMOVED***
  const ***REMOVED*** turnosRef, turnosDeliveryRef ***REMOVED*** = getUserSubcollections(userUid);
  const targetRef = isDelivery ? turnosDeliveryRef : turnosRef;

  const cruzaMedianoche = updatedData.cruzaMedianoche || (updatedData.horaInicio && updatedData.horaFin && updatedData.horaInicio.split(':')[0] > updatedData.horaFin.split(':')[0]);
  let fechaFin = updatedData.fechaFin;
  if (!fechaFin && cruzaMedianoche) ***REMOVED***
    const fechaInicio = createSafeDate(updatedData.fechaInicio || updatedData.fecha);
    fechaFin = new Date(fechaInicio.setDate(fechaInicio.getDate() + 1)).toISOString().split('T')[0];
  ***REMOVED***

  let dataWithMetadata = ***REMOVED***
    ...updatedData,
    fechaActualizacion: new Date(),
    fecha: updatedData.fechaInicio || updatedData.fecha,
    fechaFin: fechaFin || updatedData.fechaInicio || updatedData.fecha,
    cruzaMedianoche,
  ***REMOVED***;

  if (isDelivery) ***REMOVED***
    const gananciaBase = updatedData.gananciaBase || 0;
    const propinas = updatedData.propinas || 0;
    const gananciaTotal = gananciaBase + propinas;
    const gastoCombustible = updatedData.gastoCombustible || 0;

    dataWithMetadata = ***REMOVED***
      ...dataWithMetadata,
      gananciaBase: gananciaBase,
      propinas: propinas,
      gananciaTotal: gananciaTotal,
      gananciaNeta: gananciaTotal - gastoCombustible,
    ***REMOVED***;
  ***REMOVED***

  return updateDoc(doc(targetRef, id), dataWithMetadata);
***REMOVED***;

export const deleteShift = (userUid, id, isDelivery = false) => ***REMOVED***
  const ***REMOVED*** turnosRef, turnosDeliveryRef ***REMOVED*** = getUserSubcollections(userUid);
  const targetRef = isDelivery ? turnosDeliveryRef : turnosRef;
  return deleteDoc(doc(targetRef, id));
***REMOVED***;
