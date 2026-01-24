// src/services/firebaseService.js
// RESTRUCTURED FOR OPTIMIZED KPI ANALYTICS

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

// ============================================================================
// COLLECTION REFERENCES
// ============================================================================

const getCollections = () => {
  return {
    usersRef: collection(db, 'users'),
    worksRef: collection(db, 'works'),
    shiftsRef: collection(db, 'shifts'),
    statsRef: collection(db, 'stats'),
  };
};

const getUserDocRef = (userUid) => {
  return doc(db, 'users', userUid);
};

// ============================================================================
// SUBSCRIPTION HELPERS
// ============================================================================

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

// ============================================================================
// USER & SETTINGS
// ============================================================================

export const ensureUserDocument = async (user) => {
  if (!user) return null;

  const userDocRef = getUserDocRef(user.uid);
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
  const userDocRef = getUserDocRef(userUid);
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
  const userDocRef = getUserDocRef(userUid);
  return updateDoc(userDocRef, {
    'settings.weeklyHoursGoal': newGoal,
    updatedAt: new Date()
  });
};

// ============================================================================
// DATA SUBSCRIPTIONS (NEW STRUCTURE)
// ============================================================================

export const subscribeToNormalData = (userUid, { setWorks, setShifts, setError }) => {
  const { worksRef, shiftsRef } = getCollections();

  if (!userUid) return () => {};

  const unsubscribes = [];

  const worksQuery = query(worksRef, where('userId', '==', userUid), where('type', '==', 'regular'), orderBy('name', 'asc'));
  unsubscribes.push(
    createIncrementalSubscription(
      worksQuery,
      setWorks,
      (error) => setError(error),
      (a, b) => a.name.localeCompare(b.name)
    )
  );

  const shiftsQuery = query(shiftsRef, where('userId', '==', userUid), where('type', '==', 'regular'), orderBy('date', 'desc'));
  unsubscribes.push(
    createIncrementalSubscription(
      shiftsQuery,
      setShifts,
      (error) => setError(error),
      (a, b) => new Date(b.date) - new Date(a.date)
    )
  );

  return () => unsubscribes.forEach(unsub => unsub());
};

export const subscribeToDeliveryData = (userUid, { setDeliveryWorks, setDeliveryShifts, setError }) => {
  const { worksRef, shiftsRef } = getCollections();

  if (!userUid) return () => {};

  const unsubscribes = [];

  const deliveryWorksQuery = query(worksRef, where('userId', '==', userUid), where('type', '==', 'delivery'), orderBy('createdAt', 'desc'));
  unsubscribes.push(
    createIncrementalSubscription(
      deliveryWorksQuery,
      setDeliveryWorks,
      (error) => setError(error),
      (a, b) => b.createdAt - a.createdAt
    )
  );

  const deliveryShiftsQuery = query(shiftsRef, where('userId', '==', userUid), where('type', '==', 'delivery'), orderBy('date', 'desc'));
  unsubscribes.push(
    createIncrementalSubscription(
      deliveryShiftsQuery,
      setDeliveryShifts,
      (error) => setError(error),
      (a, b) => new Date(b.date) - new Date(a.date)
    )
  );

  return () => unsubscribes.forEach(unsub => unsub());
};

// ============================================================================
// WORKS (NEW STRUCTURE)
// ============================================================================

export const addJob = async (userUid, newJob, isDelivery = false) => {
  const { worksRef } = getCollections();

  let jobData = {
    userId: userUid,
    name: newJob.name,
    type: isDelivery ? 'delivery' : 'regular',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (isDelivery) {
    jobData = {
      ...jobData,
      platform: newJob.platform || '',
      vehicle: newJob.vehicle || '',
      avatarColor: newJob.avatarColor || '#10B981',
    };
  }

  if (!isDelivery && (!jobData.name || !jobData.name.trim())) {
    throw new Error('Work name is required');
  }

  const docRef = await addDoc(worksRef, jobData);
  return { ...jobData, id: docRef.id };
};

export const editJob = async (userUid, id, updatedData, isDelivery = false) => {
  const { worksRef } = getCollections();
  const jobRef = doc(worksRef, id);

  const dataWithMetadata = {
    ...updatedData,
    updatedAt: new Date(),
  };

  if (isDelivery) {
    dataWithMetadata.platform = updatedData.platform || '';
    dataWithMetadata.vehicle = updatedData.vehicle || '';
    dataWithMetadata.avatarColor = updatedData.avatarColor || '#10B981';
  }

  return updateDoc(jobRef, dataWithMetadata);
};

export const deleteJob = async (userUid, id, isDelivery = false) => {
  const { worksRef, shiftsRef } = getCollections();

  const jobRef = doc(worksRef, id);

  const shiftsQuery = query(shiftsRef, where('userId', '==', userUid), where('workId', '==', id));
  const shiftsSnapshot = await getDocs(shiftsQuery);
  const deletePromises = shiftsSnapshot.docs.map(d => deleteDoc(d.ref));
  await Promise.all(deletePromises);

  await deleteDoc(jobRef);
};

// ============================================================================
// SHIFTS (NEW STRUCTURE)
// ============================================================================

export const addShift = async (userUid, newShift, isDelivery = false) => {
  const { shiftsRef } = getCollections();

  const crossesMidnight = newShift.crossesMidnight || (newShift.startTime && newShift.endTime && newShift.startTime.split(':')[0] > newShift.endTime.split(':')[0]);
  let endDate = newShift.endDate;
  if (!endDate && crossesMidnight) {
    const startDate = createSafeDate(newShift.startDate || newShift.date);
    endDate = new Date(startDate.setDate(startDate.getDate() + 1)).toISOString().split('T')[0];
  }

  let shiftData = {
    userId: userUid,
    workId: newShift.workId || null,
    type: isDelivery ? 'delivery' : 'regular',
    date: newShift.startDate || newShift.date,
    startDate: newShift.startDate || newShift.date,
    endDate: endDate || newShift.startDate || newShift.date,
    startTime: newShift.startTime || null,
    endTime: newShift.endTime || null,
    crossesMidnight,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (isDelivery) {
    const baseEarnings = newShift.baseEarnings || 0;
    const tips = newShift.tips || 0;
    const totalEarnings = baseEarnings + tips;
    const fuelExpense = newShift.fuelExpense || 0;

    shiftData = {
      ...shiftData,
      baseEarnings,
      tips,
      totalEarnings,
      netEarnings: totalEarnings - fuelExpense,
      fuelExpense,
      platform: newShift.platform || '',
      vehicle: newShift.vehicle || '',
    };
  }

  const docRef = await addDoc(shiftsRef, shiftData);
  return { ...shiftData, id: docRef.id };
};

export const editShift = async (userUid, id, updatedData, isDelivery = false) => {
  const { shiftsRef } = getCollections();
  const shiftRef = doc(shiftsRef, id);

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
      baseEarnings,
      tips,
      totalEarnings,
      netEarnings: totalEarnings - fuelExpense,
      fuelExpense,
      platform: updatedData.platform || '',
      vehicle: updatedData.vehicle || '',
    };
  }

  return updateDoc(shiftRef, dataWithMetadata);
};

export const deleteShift = async (userUid, id, isDelivery = false) => {
  const { shiftsRef } = getCollections();
  const shiftRef = doc(shiftsRef, id);
  return deleteDoc(shiftRef);
};

// ============================================================================
// KPI ANALYTICS (NEW FUNCTIONALITY)
// ============================================================================

export const getKPIOverview = async (userUid = null) => {
  const { shiftsRef } = getCollections();

  let shiftsQuery;

  if (userUid) {
    shiftsQuery = query(shiftsRef, where('userId', '==', userUid));
  } else {
    shiftsQuery = query(shiftsRef);
  }

  const shiftsSnapshot = await getDocs(shiftsQuery);

  const stats = {
    totalShifts: shiftsSnapshot.size,
    regularShifts: 0,
    deliveryShifts: 0,
    totalEarnings: 0,
    totalNetEarnings: 0,
    totalFuelExpense: 0,
    byDate: {},
    byUser: {},
  };

  shiftsSnapshot.forEach((doc) => {
    const shift = doc.data();

    if (shift.type === 'regular') {
      stats.regularShifts++;
    } else if (shift.type === 'delivery') {
      stats.deliveryShifts++;
      stats.totalEarnings += shift.totalEarnings || 0;
      stats.totalNetEarnings += shift.netEarnings || 0;
      stats.totalFuelExpense += shift.fuelExpense || 0;
    }

    const date = shift.date || shift.startDate;
    if (date) {
      if (!stats.byDate[date]) {
        stats.byDate[date] = { count: 0, earnings: 0 };
      }
      stats.byDate[date].count++;
      stats.byDate[date].earnings += shift.totalEarnings || 0;
    }

    if (shift.userId) {
      if (!stats.byUser[shift.userId]) {
        stats.byUser[shift.userId] = { count: 0, earnings: 0 };
      }
      stats.byUser[shift.userId].count++;
      stats.byUser[shift.userId].earnings += shift.totalEarnings || 0;
    }
  });

  return stats;
};

export const getShiftsByDateRange = async (startDate, endDate, userUid = null) => {
  const { shiftsRef } = getCollections();

  let shiftsQuery;

  if (userUid) {
    shiftsQuery = query(
      shiftsRef,
      where('userId', '==', userUid),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );
  } else {
    shiftsQuery = query(
      shiftsRef,
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );
  }

  const shiftsSnapshot = await getDocs(shiftsQuery);

  const shifts = [];
  shiftsSnapshot.forEach((doc) => {
    shifts.push({ id: doc.id, ...doc.data() });
  });

  return shifts;
};

export const getWorksStatistics = async (userUid = null) => {
  const { worksRef, shiftsRef } = getCollections();

  let worksQuery;

  if (userUid) {
    worksQuery = query(worksRef, where('userId', '==', userUid));
  } else {
    worksQuery = query(worksRef);
  }

  const worksSnapshot = await getDocs(worksQuery);

  const workStats = [];

  for (const workDoc of worksSnapshot.docs) {
    const work = workDoc.data();
    const workId = workDoc.id;

    const shiftsQuery = query(shiftsRef, where('workId', '==', workId));
    const shiftsSnapshot = await getDocs(shiftsQuery);

    const workShifts = [];
    shiftsSnapshot.forEach((doc) => {
      workShifts.push(doc.data());
    });

    workStats.push({
      id: workId,
      name: work.name,
      type: work.type,
      totalShifts: workShifts.length,
      totalEarnings: workShifts.reduce((sum, s) => sum + (s.totalEarnings || 0), 0),
      totalNetEarnings: workShifts.reduce((sum, s) => sum + (s.netEarnings || 0), 0),
    });
  }

  return workStats;
};