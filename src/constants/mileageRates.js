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
  // 76c/mile (IRS business rate, effective Jul 1 2026, up from 72.5c in H1) ÷ 1.609344 km/mile
  US: { ratePerKm: 0.47, currency: 'USD', authority: 'IRS', source: '76c/mile business rate, effective Jul 1 2026' },
  // Revenue civil service motor travel rates are banded by engine size AND
  // cumulative annual km — no single flat rate truly represents them. This
  // uses the motorcycle (up to 150cc) first-tier rate as the closest match
  // for the app's typical delivery-rider audience on scooters/small bikes;
  // riders on bicycles, larger engines, or cars will see a different real
  // rate and should check revenue.ie directly.
  IE: { ratePerKm: 0.1448, currency: 'EUR', authority: 'Revenue', source: 'Motorcycle up to 150cc, first 6,437 km/year' },
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
