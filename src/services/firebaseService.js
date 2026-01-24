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
    worksRef: collection(db, 'users', userUid, 'works'),
    shiftsRef: collection(db, 'users', userUid, 'shifts'),
    deliveryWorksRef: collection(db, 'users', userUid, 'works-delivery'),
    deliveryShiftsRef: collection(db, 'users', userUid, 'shifts-delivery'),
    userDocRef: doc(db, 'users', userUid),
  ***REMOVED***;
***REMOVED***;

const createIncrementalSubscription = (query, setData, errorCallback, sortComparator, dataTransform = (d) => d) => ***REMOVED***
    return onSnapshot(query, ***REMOVED*** includeMetadataChanges: true ***REMOVED***, (snapshot) => ***REMOVED***
        setData((currentData) => ***REMOVED***
            let updatedData = [...(currentData || [])];
            snapshot.docChanges().forEach((change) => ***REMOVED***
                const docData = dataTransform(***REMOVED*** id: change.doc.id, ...change.doc.data() ***REMOVED***);
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
    ***REMOVED***, (err) => errorCallback('Error loading data: ' + err.message));
***REMOVED***;

// --- USER & SETTINGS ---

export const ensureUserDocument = async (user) => ***REMOVED***
  if (!user) return null;

  const userDocRef = doc(db, 'users', user.uid);
  const userDocSnapshot = await getDoc(userDocRef);

  const defaultSettings = ***REMOVED***
    primaryColor: '#EC4899',
    userEmoji: '😊',
    defaultDiscount: 15,
    weeklyHoursGoal: null,
    deliveryEnabled: false,
    smokoEnabled: false,
    smokoMinutes: 30,
    shiftRanges: ***REMOVED***
      dayStart: 6,
      dayEnd: 14,
      afternoonStart: 14,
      afternoonEnd: 20,
      nightStart: 20,
    ***REMOVED***,
  ***REMOVED***;

  if (userDocSnapshot.exists()) ***REMOVED***
    const userData = userDocSnapshot.data();
    return ***REMOVED*** ...defaultSettings, ...(userData.settings || ***REMOVED******REMOVED***) ***REMOVED***;
  ***REMOVED*** else ***REMOVED***
    const defaultUserData = ***REMOVED***
      email: user.email,
      displayName: user.displayName || 'User',
      createdAt: new Date(),
      settings: defaultSettings,
    ***REMOVED***;
    await setDoc(userDocRef, defaultUserData);
    return defaultSettings;
  ***REMOVED***
***REMOVED***;

export const savePreferences = async (userUid, preferences) => ***REMOVED***
    const userDocRef = doc(db, 'users', userUid);
    const updatedData = ***REMOVED*** updatedAt: new Date() ***REMOVED***;

    const prefMap = ***REMOVED***
        primaryColor: 'settings.primaryColor',
        userEmoji: 'settings.userEmoji',
        defaultDiscount: 'settings.defaultDiscount',
        shiftRanges: 'settings.shiftRanges',
        deliveryEnabled: 'settings.deliveryEnabled',
        weeklyHoursGoal: 'settings.weeklyHoursGoal',
        smokoEnabled: 'settings.smokoEnabled',
        smokoMinutes: 'settings.smokoMinutes',
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
    const userDocRef = doc(db, 'users', userUid);
    return updateDoc(userDocRef, ***REMOVED***
        'settings.weeklyHoursGoal': newGoal,
        updatedAt: new Date()
    ***REMOVED***);
***REMOVED***;


// --- DATA SUBSCRIPTIONS ---

export const subscribeToNormalData = (userUid, ***REMOVED*** setWorks, setShifts, setError ***REMOVED***) => ***REMOVED***
  const collections = getUserSubcollections(userUid);
  if (!collections) return () => ***REMOVED******REMOVED***;
  const unsubscribes = [];

  const worksQuery = query(collections.worksRef, orderBy('name', 'asc'));
  unsubscribes.push(
    createIncrementalSubscription(
      worksQuery,
      setWorks,
      (error) => setError(error),
      (a, b) => a.name.localeCompare(b.name)
    )
  );

  const shiftsQuery = query(collections.shiftsRef, orderBy('createdAt', 'desc'));
  unsubscribes.push(
    createIncrementalSubscription(
      shiftsQuery,
      setShifts,
      (error) => setError(error),
      (a, b) => new Date(b.startDate || b.date) - new Date(a.startDate || a.date)
    )
  );

  return () => unsubscribes.forEach(unsub => unsub());
***REMOVED***;

export const subscribeToDeliveryData = (userUid, ***REMOVED*** setDeliveryWorks, setDeliveryShifts, setError ***REMOVED***) => ***REMOVED***
  const collections = getUserSubcollections(userUid);
  if (!collections) return () => ***REMOVED******REMOVED***;
  const unsubscribes = [];

  const deliveryWorksQuery = query(collections.deliveryWorksRef, orderBy('createdAt', 'desc'));
    unsubscribes.push(
    createIncrementalSubscription(
      deliveryWorksQuery,
      setDeliveryWorks,
      (error) => setError(error),
      (a, b) => b.createdAt - a.createdAt
    )
  );

  const deliveryShiftsQuery = query(collections.deliveryShiftsRef, orderBy('date', 'desc'));
  unsubscribes.push(
    createIncrementalSubscription(
      deliveryShiftsQuery,
      setDeliveryShifts,
      (error) => setError(error),
      (a, b) => new Date(b.date) - new Date(a.date),
      (d) => (***REMOVED*** ...d, type: 'delivery' ***REMOVED***)
    )
  );

  return () => unsubscribes.forEach(unsub => unsub());
***REMOVED***;

// --- WORKS ---

export const addJob = async (userUid, newJob, isDelivery = false) => ***REMOVED***
  const ***REMOVED*** worksRef, deliveryWorksRef ***REMOVED*** = getUserSubcollections(userUid);
  const targetRef = isDelivery ? deliveryWorksRef : worksRef;

  let jobData = ***REMOVED***
    ...newJob,
    createdAt: new Date(),
    updatedAt: new Date(),
  ***REMOVED***;

  if (isDelivery) ***REMOVED***
    jobData = ***REMOVED***
      ...jobData,
      type: 'delivery',
      platform: newJob.platform || '',
      vehicle: newJob.vehicle || '',
      avatarColor: newJob.avatarColor || '#10B981',
      statistics: ***REMOVED*** /* default stats */ ***REMOVED***
    ***REMOVED***;
  ***REMOVED*** else ***REMOVED***
    if (!newJob.name || !newJob.name.trim()) throw new Error('Work name is required');
    jobData = ***REMOVED***
      ...jobData,
      active: true
    ***REMOVED***;
  ***REMOVED***

  const docRef = await addDoc(targetRef, jobData);
  return ***REMOVED*** ...jobData, id: docRef.id ***REMOVED***;
***REMOVED***;

export const editJob = (userUid, id, updatedData, isDelivery = false) => ***REMOVED***
  const ***REMOVED*** worksRef, deliveryWorksRef ***REMOVED*** = getUserSubcollections(userUid);
  const targetRef = isDelivery ? deliveryWorksRef : worksRef;
  const dataWithMetadata = ***REMOVED*** ...updatedData, updatedAt: new Date() ***REMOVED***;
  return updateDoc(doc(targetRef, id), dataWithMetadata);
***REMOVED***;

export const deleteJob = async (userUid, id, isDelivery = false) => ***REMOVED***
  const ***REMOVED*** worksRef, shiftsRef, deliveryWorksRef, deliveryShiftsRef ***REMOVED*** = getUserSubcollections(userUid);
  const jobRef = isDelivery ? doc(deliveryWorksRef, id) : doc(worksRef, id);
  const shiftsCollectionRef = isDelivery ? deliveryShiftsRef : shiftsRef;

  const shiftsQuery = query(shiftsCollectionRef, where('workId', '==', id));
  const shiftsSnapshot = await getDocs(shiftsQuery);
  const deletePromises = shiftsSnapshot.docs.map(d => deleteDoc(d.ref));
  await Promise.all(deletePromises);

  await deleteDoc(jobRef);
***REMOVED***;

// --- SHIFTS ---

export const addShift = async (userUid, newShift, isDelivery = false) => ***REMOVED***
  const ***REMOVED*** shiftsRef, deliveryShiftsRef ***REMOVED*** = getUserSubcollections(userUid);
  const targetRef = isDelivery ? deliveryShiftsRef : shiftsRef;
  
  const crossesMidnight = newShift.crossesMidnight || (newShift.startTime && newShift.endTime && newShift.startTime.split(':')[0] > newShift.endTime.split(':')[0]);
  let endDate = newShift.endDate;
  if (!endDate && crossesMidnight) ***REMOVED***
    const startDate = createSafeDate(newShift.startDate || newShift.date);
    endDate = new Date(startDate.setDate(startDate.getDate() + 1)).toISOString().split('T')[0];
  ***REMOVED***

  let shiftData = ***REMOVED***
    ...newShift,
    createdAt: new Date(),
    updatedAt: new Date(),
    date: newShift.startDate || newShift.date,
    startDate: newShift.startDate || newShift.date,
    endDate: endDate || newShift.startDate || newShift.date,
    crossesMidnight,
  ***REMOVED***;

  if (isDelivery) ***REMOVED***
    const baseEarnings = newShift.baseEarnings || 0;
    const tips = newShift.tips || 0;
    const totalEarnings = baseEarnings + tips;
    const fuelExpense = newShift.fuelExpense || 0;
    
    shiftData = ***REMOVED***
      ...shiftData,
      type: 'delivery',
      baseEarnings: baseEarnings,
      tips: tips,
      totalEarnings: totalEarnings,
      netEarnings: totalEarnings - fuelExpense,
    ***REMOVED***;
  ***REMOVED***

  const docRef = await addDoc(targetRef, shiftData);
  return ***REMOVED*** ...shiftData, id: docRef.id ***REMOVED***;
***REMOVED***;

export const editShift = (userUid, id, updatedData, isDelivery = false) => ***REMOVED***
  const ***REMOVED*** shiftsRef, deliveryShiftsRef ***REMOVED*** = getUserSubcollections(userUid);
  const targetRef = isDelivery ? deliveryShiftsRef : shiftsRef;

  const crossesMidnight = updatedData.crossesMidnight || (updatedData.startTime && updatedData.endTime && updatedData.startTime.split(':')[0] > updatedData.endTime.split(':')[0]);
  let endDate = updatedData.endDate;
  if (!endDate && crossesMidnight) ***REMOVED***
    const startDate = createSafeDate(updatedData.startDate || updatedData.date);
    endDate = new Date(startDate.setDate(startDate.getDate() + 1)).toISOString().split('T')[0];
  ***REMOVED***

  let dataWithMetadata = ***REMOVED***
    ...updatedData,
    updatedAt: new Date(),
    date: updatedData.startDate || updatedData.date,
    endDate: endDate || updatedData.startDate || updatedData.date,
    crossesMidnight,
  ***REMOVED***;

  if (isDelivery) ***REMOVED***
    const baseEarnings = updatedData.baseEarnings || 0;
    const tips = updatedData.tips || 0;
    const totalEarnings = baseEarnings + tips;
    const fuelExpense = updatedData.fuelExpense || 0;

    dataWithMetadata = ***REMOVED***
      ...dataWithMetadata,
      baseEarnings: baseEarnings,
      tips: tips,
      totalEarnings: totalEarnings,
      netEarnings: totalEarnings - fuelExpense,
    ***REMOVED***;
  ***REMOVED***

  return updateDoc(doc(targetRef, id), dataWithMetadata);
***REMOVED***;

export const deleteShift = (userUid, id, isDelivery = false) => ***REMOVED***
  const ***REMOVED*** shiftsRef, deliveryShiftsRef ***REMOVED*** = getUserSubcollections(userUid);
  const targetRef = isDelivery ? deliveryShiftsRef : shiftsRef;
  return deleteDoc(doc(targetRef, id));
***REMOVED***;