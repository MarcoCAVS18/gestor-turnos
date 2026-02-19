// src/utils/profanityFilter.js

import { Filter } from 'bad-words';

const filter = new Filter();

// Add custom words if needed
// filter.addWords('customBadWord');

/**
 * Check if text contains profanity
 * @param {string} text
 * @returns {boolean}
 */
export const hasProfanity = (text) => {
  if (!text || typeof text !== 'string') return false;
  return filter.isProfane(text);
};

/**
 * Clean profanity from text (replaces with ****)
 * @param {string} text
 * @returns {string}
 */
export const cleanText = (text) => {
  if (!text || typeof text !== 'string') return text;
  return filter.clean(text);
};
