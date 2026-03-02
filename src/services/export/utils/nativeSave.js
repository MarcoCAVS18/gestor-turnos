// src/services/export/utils/nativeSave.js
//
// Handles file saving on native iOS/Android via Capacitor.
// On web this module is never called — the exporters use browser download as usual.

import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import logger from '../../../utils/logger';

/**
 * Converts a Blob to a base64 string (data part only, no prefix).
 * @param {Blob} blob
 * @returns {Promise<string>} base64 string
 */
const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // reader.result format: "data:<mimeType>;base64,<data>"
      // Filesystem.writeFile only needs the <data> part
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

/**
 * Saves a file to the device cache and opens the native share sheet.
 * Use this instead of the browser anchor-click download on iOS/Android.
 *
 * @param {Blob} blob     - File content
 * @param {string} filename - File name with extension (e.g. "report.xlsx")
 * @returns {Promise<void>}
 */
export const nativeSave = async (blob, filename) => {
  try {
    const base64 = await blobToBase64(blob);

    const result = await Filesystem.writeFile({
      path: filename,
      data: base64,
      directory: Directory.Cache,
      recursive: true
    });

    await Share.share({
      title: filename,
      url: result.uri,
      dialogTitle: 'Save or share your report'
    });
  } catch (error) {
    logger.error('nativeSave failed:', error);
    throw error;
  }
};

/**
 * Returns true when running as a native iOS or Android app.
 * Use this to branch between native and web save logic.
 */
export const isNativePlatform = () => Capacitor.isNativePlatform();
