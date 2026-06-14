// src/constants/mileageRates.js
//
// Official per-kilometre rates used to estimate tax-deductible vehicle costs
// for delivery workers. Each rate is expressed PER KILOMETRE in the country's
// local currency, because the delivery shift form stores distance in km.
// Rates come from each country's tax authority — review annually.

export const MILEAGE_RATES = {
  AU: { ratePerKm: 0.88, currency: 'AUD', authority: 'ATO', source: 'cents per km method 2024-25' },
  NZ: { ratePerKm: 1.04, currency: 'NZD', authority: 'IRD', source: 'Tier 1 rate (first 14,000 km)' },
  GB: { ratePerKm: 0.28, currency: 'GBP', authority: 'HMRC', source: '45p/mile, first 10,000 miles' },
  CA: { ratePerKm: 0.72, currency: 'CAD', authority: 'CRA', source: '72c/km, first 5,000 km' },
};

// Some country codes vary between sources (e.g. UK vs GB). Normalise aliases.
const COUNTRY_ALIASES = { UK: 'GB' };

/**
 * Returns the mileage rate config for a country code, or null if unsupported.
 * @param {string} countryCode - ISO country code (e.g. 'AU', 'GB')
 * @returns {{ ratePerKm: number, currency: string, authority: string, source: string } | null}
 */
export const getMileageRate = (countryCode) => {
  if (!countryCode) return null;
  const code = countryCode.toUpperCase();
  const normalised = COUNTRY_ALIASES[code] || code;
  return MILEAGE_RATES[normalised] || null;
};
