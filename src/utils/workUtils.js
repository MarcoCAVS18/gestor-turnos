// src/utils/workUtils.js

export const generateWorkDetails = (work) => ***REMOVED***
  if (!work) return [];
  
  const details = [work.name];
  
  if (work.type === 'delivery') ***REMOVED***
    if (work.platform) details.push(`Platform: $***REMOVED***work.platform***REMOVED***`);
    if (work.vehicle) details.push(`Vehicle: $***REMOVED***work.vehicle***REMOVED***`);
  ***REMOVED*** else ***REMOVED***
    if (work.baseRate) details.push(`Rate: $***REMOVED***work.baseRate***REMOVED***`);
  ***REMOVED***
  
  return details;
***REMOVED***;