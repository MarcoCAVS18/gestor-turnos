// src/services/holidayService.js

import Holidays from 'date-holidays';
import logger from '../utils/logger';

/**
 * Holiday Service
 * Handles automatic holiday detection based on user's country and region
 */

// Cache for holiday instances to avoid recreating them
const holidayCache = new Map();

/**
 * Get holidays instance for a specific country and region
 * @param {string} country - ISO country code (e.g., 'AU', 'US', 'AR')
 * @param {string|null} region - State/province code (e.g., 'VIC', 'CA', 'BA')
 * @returns {Holidays} Holidays instance
 */
function getHolidaysInstance(country, region = null) {
  const cacheKey = region ? `${country}-${region}` : country;

  if (!holidayCache.has(cacheKey)) {
    const hd = new Holidays(country, region);
    holidayCache.set(cacheKey, hd);
  }

  return holidayCache.get(cacheKey);
}

/**
 * Check if a specific date is a holiday
 * @param {Date|string} date - Date to check
 * @param {string} country - ISO country code
 * @param {string|null} region - State/province code (optional)
 * @returns {boolean} True if the date is a holiday
 */
export function isHoliday(date, country, region = null) {
  if (!date || !country) return false;

  try {
    const hd = getHolidaysInstance(country, region);
    const dateObj = date instanceof Date ? date : new Date(date);
    const holidays = hd.isHoliday(dateObj);

    return holidays ? holidays.length > 0 : false;
  } catch (error) {
    logger.error('Error checking holiday:', error);
    return false;
  }
}

/**
 * Get holiday information for a specific date
 * @param {Date|string} date - Date to check
 * @param {string} country - ISO country code
 * @param {string|null} region - State/province code (optional)
 * @returns {Array|null} Array of holiday objects or null if not a holiday
 */
export function getHolidayInfo(date, country, region = null) {
  if (!date || !country) return null;

  try {
    const hd = getHolidaysInstance(country, region);
    const dateObj = date instanceof Date ? date : new Date(date);
    const holidays = hd.isHoliday(dateObj);

    return holidays || null;
  } catch (error) {
    logger.error('Error getting holiday info:', error);
    return null;
  }
}

/**
 * Get all holidays for a specific year
 * @param {number} year - Year to get holidays for
 * @param {string} country - ISO country code
 * @param {string|null} region - State/province code (optional)
 * @returns {Array} Array of holiday objects
 */
export function getHolidaysForYear(year, country, region = null) {
  if (!year || !country) return [];

  try {
    const hd = getHolidaysInstance(country, region);
    const holidays = hd.getHolidays(year);

    return holidays || [];
  } catch (error) {
    logger.error('Error getting holidays for year:', error);
    return [];
  }
}

/**
 * Get list of available countries
 * @returns {Array} Array of country objects with code and name
 */
export function getAvailableCountries() {
  const hd = new Holidays();
  const countries = hd.getCountries();

  // Convert object to array and sort by name
  return Object.entries(countries)
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get list of available regions/states for a country
 * @param {string} country - ISO country code
 * @returns {Array} Array of region objects with code and name
 */
export function getAvailableRegions(country) {
  if (!country) return [];

  try {
    const hd = new Holidays();
    const states = hd.getStates(country);

    if (!states) return [];

    // Convert object to array and sort by name
    return Object.entries(states)
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    logger.error('Error getting regions:', error);
    return [];
  }
}

/**
 * Get country code from geolocation coordinates
 * This is a simple mapping based on common coordinates
 * For production, you might want to use a reverse geocoding API
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {string|null} Country code or null
 */
export function getCountryFromCoordinates(latitude, longitude) {
  // Simple country detection based on coordinate ranges
  // This is a basic implementation - in production you'd use a geocoding service

  // Australia
  if (latitude >= -44 && latitude <= -10 && longitude >= 113 && longitude <= 154) {
    return 'AU';
  }

  // United States (continental)
  if (latitude >= 24 && latitude <= 49 && longitude >= -125 && longitude <= -66) {
    return 'US';
  }

  // Argentina
  if (latitude >= -55 && latitude <= -21 && longitude >= -73 && longitude <= -53) {
    return 'AR';
  }

  // United Kingdom
  if (latitude >= 49.5 && latitude <= 61 && longitude >= -8 && longitude <= 2) {
    return 'GB';
  }

  // Canada
  if (latitude >= 41 && latitude <= 83 && longitude >= -141 && longitude <= -52) {
    return 'CA';
  }

  // Spain
  if (latitude >= 36 && latitude <= 44 && longitude >= -9 && longitude <= 4) {
    return 'ES';
  }

  // Mexico
  if (latitude >= 14 && latitude <= 33 && longitude >= -118 && longitude <= -86) {
    return 'MX';
  }

  // Brazil
  if (latitude >= -34 && latitude <= 5 && longitude >= -74 && longitude <= -34) {
    return 'BR';
  }

  return null;
}

/**
 * Get user's location and detect country
 * @returns {Promise<{country: string, region: string|null, latitude: number, longitude: number}>}
 */
export async function detectUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const country = getCountryFromCoordinates(latitude, longitude);

        resolve({
          country,
          region: null, // Region detection would require more sophisticated geocoding
          latitude,
          longitude
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
}

/**
 * Validate if a country code is supported
 * @param {string} country - ISO country code
 * @returns {boolean} True if country is supported
 */
export function isCountrySupported(country) {
  if (!country) return false;

  try {
    const hd = new Holidays();
    const countries = hd.getCountries();
    return country in countries;
  } catch (error) {
    return false;
  }
}

/**
 * Get holiday name for a specific date
 * @param {Date|string} date - Date to check
 * @param {string} country - ISO country code
 * @param {string|null} region - State/province code (optional)
 * @returns {string|null} Holiday name or null
 */
export function getHolidayName(date, country, region = null) {
  const info = getHolidayInfo(date, country, region);

  if (info && info.length > 0) {
    // Return the first holiday name (there might be multiple holidays on the same day)
    return info[0].name;
  }

  return null;
}

/**
 * Clear holiday cache (useful for testing or when user changes settings)
 */
export function clearHolidayCache() {
  holidayCache.clear();
}
