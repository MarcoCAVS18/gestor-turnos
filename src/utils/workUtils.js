// src/utils/workUtils.js
import i18n from '../i18n';
import { formatCurrencyExact } from './currency';

// Texts follow the app language (the delete dialog used to be English only)
export const generateWorkDetails = (work) => {
  if (!work) return [];
  
  const details = [work.name];
  
  if (work.type === 'delivery') {
    if (work.platform) details.push(i18n.t('deleteDetails.platform', { platform: work.platform }));
    if (work.vehicle) details.push(i18n.t('deleteDetails.vehicle', { vehicle: work.vehicle }));
  } else {
    if (work.baseRate) details.push(i18n.t('deleteDetails.rate', { rate: formatCurrencyExact(work.baseRate) }));
  }
  
  return details;
};