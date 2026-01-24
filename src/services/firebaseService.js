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
    worksRef: collection(db, 'users', userUid, 'works'),
    shiftsRef: collection(db, 'users', userUid, 'shifts'),
    deliveryWorksRef: collection(db, 'users', userUid, 'works-delivery'),
    deliveryShiftsRef: collection(db, 'users', userUid, 'shifts-delivery'),
    userDocRef: doc(db, 'users', userUid),
  };
};

const createIncrementalSubscription = (query, setData, errorCallback, sortComparator, dataTransform = (d) => d) => {
    return onSnapshot(query, { includeMetadataChanges: true }, (snapshot) => {
        setData((currentData) => {
            let updatedData = [...(currentData || [])];
            snapshot.docChanges().forEach((change) => {
                const docData = dataTransform({ id: change.doc.id, ...change.doc.data() });
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
    }, (err) => errorCallback('Error loading data: ' + err.message));
};

// --- USER & SETTINGS ---

export const ensureUserDocument = async (user) => {
  if (!user) return null;

  const userDocRef = doc(db, 'users', user.uid);
  const userDocSnapshot = await getDoc(userDocRef);

  const defaultSettings = {
    primaryColor: '#EC4899',
    userEmoji: '😊',
    defaultDiscount: 15,
    weeklyHoursGoal: null,
    deliveryEnabled: false,
    smokoEnabled: false,
    smokoMinutes: 30,
    shiftRanges: {
      dayStart: 6,
      dayEnd: 14,
      afternoonStart: 14,
      afternoonEnd: 20,
      nightStart: 20,
    },
  };

  if (userDocSnapshot.exists()) {
    const userData = userDocSnapshot.data();
    return { ...defaultSettings, ...(userData.settings || {}) };
  } else {
    const defaultUserData = {
      email: user.email,
      displayName: user.displayName || 'User',
      createdAt: new Date(),
      settings: defaultSettings,
    };
    await setDoc(userDocRef, defaultUserData);
    return defaultSettings;
  }
};

export const savePreferences = async (userUid, preferences) => {
    const userDocRef = doc(db, 'users', userUid);
    const updatedData = { updatedAt: new Date() };

    const prefMap = {
        primaryColor: 'settings.primaryColor',
        userEmoji: 'settings.userEmoji',
        defaultDiscount: 'settings.defaultDiscount',
        shiftRanges: 'settings.shiftRanges',
        deliveryEnabled: 'settings.deliveryEnabled',
        weeklyHoursGoal: 'settings.weeklyHoursGoal',
        smokoEnabled: 'settings.smokoEnabled',
        smokoMinutes: 'settings.smokoMinutes',
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
    const userDocRef = doc(db, 'users', userUid);
    return updateDoc(userDocRef, {
        'settings.weeklyHoursGoal': newGoal,
        updatedAt: new Date()
    });
};


// --- DATA SUBSCRIPTIONS ---

export const subscribeToNormalData = (userUid, { setWorks, setShifts, setError }) => {
  const collections = getUserSubcollections(userUid);
  if (!collections) return () => {};
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
};

export const subscribeToDeliveryData = (userUid, { setDeliveryWorks, setDeliveryShifts, setError }) => {
  const collections = getUserSubcollections(userUid);
  if (!collections) return () => {};
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
      (d) => ({ ...d, type: 'delivery' })
    )
  );

  return () => unsubscribes.forEach(unsub => unsub());
};

// --- WORKS ---

export const addJob = async (userUid, newJob, isDelivery = false) => {
  const { worksRef, deliveryWorksRef } = getUserSubcollections(userUid);
  const targetRef = isDelivery ? deliveryWorksRef : worksRef;

  let jobData = {
    ...newJob,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (isDelivery) {
    jobData = {
      ...jobData,
      type: 'delivery',
      platform: newJob.platform || '',
      vehicle: newJob.vehicle || '',
      avatarColor: newJob.avatarColor || '#10B981',
      statistics: { /* default stats */ }
    };
  } else {
    if (!newJob.name || !newJob.name.trim()) throw new Error('Work name is required');
    jobData = {
      ...jobData,
      active: true
    };
  }

  const docRef = await addDoc(targetRef, jobData);
  return { ...jobData, id: docRef.id };
};

export const editJob = (userUid, id, updatedData, isDelivery = false) => {
  const { worksRef, deliveryWorksRef } = getUserSubcollections(userUid);
  const targetRef = isDelivery ? deliveryWorksRef : worksRef;
  const dataWithMetadata = { ...updatedData, updatedAt: new Date() };
  return updateDoc(doc(targetRef, id), dataWithMetadata);
};

export const deleteJob = async (userUid, id, isDelivery = false) => {
  const { worksRef, shiftsRef, deliveryWorksRef, deliveryShiftsRef } = getUserSubcollections(userUid);
  const jobRef = isDelivery ? doc(deliveryWorksRef, id) : doc(worksRef, id);
  const shiftsCollectionRef = isDelivery ? deliveryShiftsRef : shiftsRef;

  const shiftsQuery = query(shiftsCollectionRef, where('workId', '==', id));
  const shiftsSnapshot = await getDocs(shiftsQuery);
  const deletePromises = shiftsSnapshot.docs.map(d => deleteDoc(d.ref));
  await Promise.all(deletePromises);

  await deleteDoc(jobRef);
};

// --- SHIFTS ---

export const addShift = async (userUid, newShift, isDelivery = false) => {
  const { shiftsRef, deliveryShiftsRef } = getUserSubcollections(userUid);
  const targetRef = isDelivery ? deliveryShiftsRef : shiftsRef;
  
  const crossesMidnight = newShift.crossesMidnight || (newShift.startTime && newShift.endTime && newShift.startTime.split(':')[0] > newShift.endTime.split(':')[0]);
  let endDate = newShift.endDate;
  if (!endDate && crossesMidnight) {
    const startDate = createSafeDate(newShift.startDate || newShift.date);
    endDate = new Date(startDate.setDate(startDate.getDate() + 1)).toISOString().split('T')[0];
  }

  let shiftData = {
    ...newShift,
    createdAt: new Date(),
    updatedAt: new Date(),
    date: newShift.startDate || newShift.date,
    startDate: newShift.startDate || newShift.date,
    endDate: endDate || newShift.startDate || newShift.date,
    crossesMidnight,
  };

  if (isDelivery) {
    const baseEarnings = newShift.baseEarnings || 0;
    const tips = newShift.tips || 0;
    const totalEarnings = baseEarnings + tips;
    const fuelExpense = newShift.fuelExpense || 0;
    
    shiftData = {
      ...shiftData,
      type: 'delivery',
      baseEarnings: baseEarnings,
      tips: tips,
      totalEarnings: totalEarnings,
      netEarnings: totalEarnings - fuelExpense,
    };
  }

  const docRef = await addDoc(targetRef, shiftData);
  return { ...shiftData, id: docRef.id };
};

export const editShift = (userUid, id, updatedData, isDelivery = false) => {
  const { shiftsRef, deliveryShiftsRef } = getUserSubcollections(userUid);
  const targetRef = isDelivery ? deliveryShiftsRef : shiftsRef;

  const crossesMidnight = updatedData.crossesMidnight || (updatedData.startTime && updatedData.endTime && updatedData.startTime.split(':')[0] > updatedData.endTime.split(':')[0]);
  let endDate = updatedData.endDate;
  if (!endDate && crossesMidnight) {
    const startDate = createSafeDate(updatedData.startDate || updatedData.date);
    endDate = new Date(startDate.setDate(startDate.getDate() + 1)).toISOString().split('T')[0];
  }

  let dataWithMetadata = {
    ...updatedData,
    updatedAt: new Date(),
    date: updatedData.startDate || updatedData.date,
    endDate: endDate || updatedData.startDate || updatedData.date,
    crossesMidnight,
  };

  if (isDelivery) {
    const baseEarnings = updatedData.baseEarnings || 0;
    const tips = updatedData.tips || 0;
    const totalEarnings = baseEarnings + tips;
    const fuelExpense = updatedData.fuelExpense || 0;

    dataWithMetadata = {
      ...dataWithMetadata,
      baseEarnings: baseEarnings,
      tips: tips,
      totalEarnings: totalEarnings,
      netEarnings: totalEarnings - fuelExpense,
    };
  }

  return updateDoc(doc(targetRef, id), dataWithMetadata);
};

export const deleteShift = (userUid, id, isDelivery = false) => {
  const { shiftsRef, deliveryShiftsRef } = getUserSubcollections(userUid);
  const targetRef = isDelivery ? deliveryShiftsRef : shiftsRef;
  return deleteDoc(doc(targetRef, id));
};