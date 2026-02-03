// src/services/liveSessionService.js
// Service for managing Live Mode sessions in Firebase

import {
  doc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  getDocs,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// ============================================================================
// COLLECTION REFERENCE
// ============================================================================

const getLiveSessionsRef = () => collection(db, 'liveSessions');

// ============================================================================
// CREATE LIVE SESSION
// ============================================================================

export const createLiveSession = async (userId, workId) => {
  if (!userId) throw new Error('User ID is required');
  if (!workId) throw new Error('Work ID is required');

  // Check if there's already an active session
  const existingSession = await getActiveLiveSession(userId);
  if (existingSession) {
    throw new Error('There is already an active live session. Please finish it first.');
  }

  const liveSessionsRef = getLiveSessionsRef();

  const sessionData = {
    userId,
    workId,
    startedAt: Timestamp.now(),
    pausedAt: null,
    totalPauseDuration: 0, // in milliseconds
    status: 'active', // 'active' | 'paused' | 'completed'
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  console.log('🎬 Creating live session:', sessionData);
  const docRef = await addDoc(liveSessionsRef, sessionData);
  console.log('✅ Live session created with ID:', docRef.id);

  return {
    id: docRef.id,
    ...sessionData,
    startedAt: sessionData.startedAt.toDate(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// ============================================================================
// GET ACTIVE LIVE SESSION
// ============================================================================

export const getActiveLiveSession = async (userId) => {
  if (!userId) return null;

  const liveSessionsRef = getLiveSessionsRef();
  const activeQuery = query(
    liveSessionsRef,
    where('userId', '==', userId),
    where('status', 'in', ['active', 'paused'])
  );

  const snapshot = await getDocs(activeQuery);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  const data = doc.data();

  return {
    id: doc.id,
    ...data,
    startedAt: data.startedAt?.toDate() || new Date(),
    pausedAt: data.pausedAt?.toDate() || null,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};

// ============================================================================
// PAUSE LIVE SESSION
// ============================================================================

export const pauseLiveSession = async (sessionId) => {
  if (!sessionId) throw new Error('Session ID is required');

  const liveSessionsRef = getLiveSessionsRef();
  const sessionRef = doc(liveSessionsRef, sessionId);

  const updateData = {
    pausedAt: Timestamp.now(),
    status: 'paused',
    updatedAt: serverTimestamp(),
  };

  console.log('⏸️ Pausing live session:', sessionId);
  await updateDoc(sessionRef, updateData);
  console.log('✅ Live session paused');
};

// ============================================================================
// RESUME LIVE SESSION
// ============================================================================

export const resumeLiveSession = async (sessionId, currentPauseDuration) => {
  if (!sessionId) throw new Error('Session ID is required');

  const liveSessionsRef = getLiveSessionsRef();
  const sessionRef = doc(liveSessionsRef, sessionId);

  const updateData = {
    pausedAt: null,
    totalPauseDuration: currentPauseDuration || 0,
    status: 'active',
    updatedAt: serverTimestamp(),
  };

  console.log('▶️ Resuming live session:', sessionId, 'Total pause duration:', currentPauseDuration);
  await updateDoc(sessionRef, updateData);
  console.log('✅ Live session resumed');
};

// ============================================================================
// COMPLETE LIVE SESSION
// ============================================================================

export const completeLiveSession = async (sessionId, finalPauseDuration) => {
  if (!sessionId) throw new Error('Session ID is required');

  const liveSessionsRef = getLiveSessionsRef();
  const sessionRef = doc(liveSessionsRef, sessionId);

  const updateData = {
    status: 'completed',
    totalPauseDuration: finalPauseDuration || 0,
    completedAt: Timestamp.now(),
    updatedAt: serverTimestamp(),
  };

  console.log('🏁 Completing live session:', sessionId);
  await updateDoc(sessionRef, updateData);
  console.log('✅ Live session completed');
};

// ============================================================================
// DELETE LIVE SESSION
// ============================================================================

export const deleteLiveSession = async (sessionId) => {
  if (!sessionId) throw new Error('Session ID is required');

  const liveSessionsRef = getLiveSessionsRef();
  const sessionRef = doc(liveSessionsRef, sessionId);

  console.log('🗑️ Deleting live session:', sessionId);
  await deleteDoc(sessionRef);
  console.log('✅ Live session deleted');
};

// ============================================================================
// SUBSCRIBE TO LIVE SESSION (REAL-TIME)
// ============================================================================

export const subscribeToLiveSession = (userId, callback) => {
  if (!userId) {
    callback(null);
    return () => {};
  }

  const liveSessionsRef = getLiveSessionsRef();
  const activeQuery = query(
    liveSessionsRef,
    where('userId', '==', userId),
    where('status', 'in', ['active', 'paused'])
  );

  return onSnapshot(activeQuery, (snapshot) => {
    if (snapshot.empty) {
      callback(null);
      return;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    callback({
      id: doc.id,
      ...data,
      startedAt: data.startedAt?.toDate() || new Date(),
      pausedAt: data.pausedAt?.toDate() || null,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    });
  }, (error) => {
    console.error('Error subscribing to live session:', error);
    callback(null);
  });
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const calculateElapsedTime = (session) => {
  if (!session || !session.startedAt) return 0;

  const now = new Date();
  const start = session.startedAt instanceof Date
    ? session.startedAt
    : new Date(session.startedAt);

  let elapsed = now.getTime() - start.getTime();

  // Subtract total pause duration
  elapsed -= (session.totalPauseDuration || 0);

  // If currently paused, subtract current pause duration
  if (session.status === 'paused' && session.pausedAt) {
    const pauseStart = session.pausedAt instanceof Date
      ? session.pausedAt
      : new Date(session.pausedAt);
    elapsed -= (now.getTime() - pauseStart.getTime());
  }

  return Math.max(0, elapsed);
};

export const formatElapsedTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours,
    minutes,
    seconds,
    formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
  };
};
