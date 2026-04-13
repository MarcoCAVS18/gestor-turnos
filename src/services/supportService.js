// src/services/supportService.js
// Frontend service for sending support requests via Cloud Function.

import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';
import logger from '../utils/logger';

/**
 * Send a support request to support@orary.app.
 * The Cloud Function verifies Premium status server-side and tags the subject accordingly.
 *
 * @param {{ subject: string, message: string }} params
 * @returns {Promise<{ success: boolean, isPremium: boolean }>}
 */
export const sendSupportRequest = async ({ subject, message }) => {
  try {
    const fn = httpsCallable(functions, 'sendSupportRequest');
    const result = await fn({ subject, message });
    return result.data;
  } catch (err) {
    logger.error('sendSupportRequest failed:', err);
    throw err;
  }
};
