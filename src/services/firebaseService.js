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

// Generic subscription helper that accepts any state setter name
const createIncrementalSubscription = (query, stateSetter, errorCallback, sortComparator, dataTransform = (d) => d) => {
  return onSnapshot(query, { includeMetadataChanges: true }, (snapshot) => {
    stateSetter((currentData) => {
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
    themeMode: 'light', // 'light' or 'dark' (dark is premium only)
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

export const subscribeToDeliveryData = (userUid, { setDeliveryWork, setDeliveryShifts, setError }) => {
  const { worksRef, shiftsRef } = getCollections();

  if (!userUid) return () => {};

  const unsubscribes = [];

  const deliveryWorksQuery = query(worksRef, where('userId', '==', userUid), where('type', '==', 'delivery'), orderBy('createdAt', 'desc'));
  unsubscribes.push(
    createIncrementalSubscription(
      deliveryWorksQuery,
      setDeliveryWork,
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
  } else {
    // For regular jobs, add all fields
    if (newJob.rates) {
      jobData.rates = newJob.rates;
    }
    if (newJob.baseRate !== undefined) {
      jobData.baseRate = newJob.baseRate;
    }
    if (newJob.color) {
      jobData.color = newJob.color;
    }
    if (newJob.description) {
      jobData.description = newJob.description;
    }
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
  } else {
    // For regular jobs, ensure rates are updated if provided
    if (updatedData.rates) {
      dataWithMetadata.rates = updatedData.rates;
    }
  }

  await updateDoc(jobRef, dataWithMetadata);
};

export const deleteJob = async (userUid, id, isDelivery = false) => {
  if (!id || !id.trim()) {
    throw new Error('Work ID is required for deletion');
  }

  const { worksRef, shiftsRef } = getCollections();
  const jobRef = doc(worksRef, id);

  // Delete all shifts associated with this job
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

  // Add Live Mode fields if present
  if (newShift.isLive) {
    shiftData.isLive = true;
    shiftData.liveSessionId = newShift.liveSessionId || null;
  }

  // Add break/smoko fields if present
  if (newShift.hadBreak !== undefined) {
    shiftData.hadBreak = newShift.hadBreak;
    shiftData.breakMinutes = newShift.breakMinutes || 0;
  }

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
      orderCount: newShift.orderCount || 0,
      kilometers: newShift.kilometers || 0,
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
      orderCount: updatedData.orderCount || 0,
      kilometers: updatedData.kilometers || 0,
      platform: updatedData.platform || '',
      vehicle: updatedData.vehicle || '',
    };
  }

  await updateDoc(shiftRef, dataWithMetadata);
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

// ============================================================================
// ACCOUNT MANAGEMENT
// ============================================================================

export const clearUserData = async (userUid) => {
  if (!userUid) {
    throw new Error('User ID is required');
  }

  const { worksRef, shiftsRef } = getCollections();

  // Delete all shifts for this user
  const shiftsQuery = query(shiftsRef, where('userId', '==', userUid));
  const shiftsSnapshot = await getDocs(shiftsQuery);

  const shiftDeletePromises = shiftsSnapshot.docs.map(d => deleteDoc(d.ref));
  await Promise.all(shiftDeletePromises);

  // Delete all works for this user
  const worksQuery = query(worksRef, where('userId', '==', userUid));
  const worksSnapshot = await getDocs(worksQuery);

  const workDeletePromises = worksSnapshot.docs.map(d => deleteDoc(d.ref));
  await Promise.all(workDeletePromises);

  // Update user document to mark data as cleared
  // Also reset Google Calendar connection, Live Mode usage, and other integration settings
  // Using setDoc with merge to handle cases where user doc doesn't exist
  const userDocRef = getUserDocRef(userUid);
  await setDoc(userDocRef, {
    dataCleared: true,
    dataClearedAt: new Date(),
    updatedAt: new Date(),
    // Reset integrations
    googleCalendarConnected: false,
    googleCalendarTokens: null,
    // Reset Live Mode usage (give back free uses)
    liveModeUsage: {
      monthlyCount: 0,
      lastResetDate: new Date(),
    },
    // Reset subscription if user wants fresh start
    subscription: {
      isPremium: false,
      plan: 'free',
      status: 'inactive',
      startDate: null,
      expiryDate: null,
      paymentMethod: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
    },
  }, { merge: true });

  return {
    shiftsDeleted: shiftsSnapshot.size,
    worksDeleted: worksSnapshot.size,
  };
};
