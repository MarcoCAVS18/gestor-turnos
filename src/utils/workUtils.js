// src/utils/workUtils.js

export const generateWorkDetails = (work) => {
  if (!work) return [];
  
  const details = [work.name];
  
  if (work.type === 'delivery') {
    if (work.platform) details.push(`Platform: ${work.platform}`);
    if (work.vehicle) details.push(`Vehicle: ${work.vehicle}`);
  } else {
    if (work.baseRate) details.push(`Rate: ${work.baseRate}`);
  }
  
  return details;
};