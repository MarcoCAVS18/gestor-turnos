// src/components/native/ShiftReminderSync/index.jsx
//
// Invisible component — mounts inside AppProvider.
// Reads the user's shift reminder preference from Firestore on startup
// and re-schedules notifications whenever shifts change.
// Only acts on native (iOS/Android); no-op on web.

import { useEffect, useMemo, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { useDataContext } from '../../../contexts/DataContext';
import {
  scheduleShiftReminders,
  cancelShiftReminders,
} from '../../../services/native/shiftReminderService';
import logger from '../../../utils/logger';

const isNative = Capacitor.isNativePlatform();

const ShiftReminderSync = () => {
  const { currentUser } = useAuth();
  const { shifts, works } = useDataContext();

  // Preference loaded from Firestore
  const prefRef = useRef({ enabled: false, minutesBefore: 15, loaded: false });

  const worksMap = useMemo(
    () => Object.fromEntries((works || []).map(w => [w.id, w])),
    [works]
  );

  // Load preference once on user mount
  useEffect(() => {
    if (!currentUser || !isNative) return;

    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', currentUser.uid));
        if (snap.exists()) {
          const data = snap.data();
          prefRef.current = {
            enabled: data.shiftRemindersEnabled || false,
            minutesBefore: data.shiftReminderMinutes || 15,
            loaded: true,
          };
        } else {
          prefRef.current.loaded = true;
        }
      } catch (err) {
        logger.warn('[ShiftReminderSync] Failed to load preference:', err);
        prefRef.current.loaded = true;
      }
    };

    load();
  }, [currentUser]);

  // Re-schedule whenever shifts change (if enabled)
  useEffect(() => {
    if (!isNative || !prefRef.current.loaded || !prefRef.current.enabled) return;
    if (!shifts || shifts.length === 0) {
      cancelShiftReminders();
      return;
    }

    scheduleShiftReminders(shifts, worksMap, prefRef.current.minutesBefore).catch(err => {
      logger.warn('[ShiftReminderSync] Reschedule error:', err);
    });
  }, [shifts, worksMap]);

  // Renders nothing
  return null;
};

export default ShiftReminderSync;
