// Country code to currency code mapping
const COUNTRY_TO_CURRENCY = {
  AU: 'AUD', US: 'USD', AR: 'ARS', GB: 'GBP', CA: 'CAD',
  ES: 'EUR', FR: 'EUR', DE: 'EUR', IT: 'EUR', PT: 'EUR',
  NL: 'EUR', BE: 'EUR', AT: 'EUR', IE: 'EUR', FI: 'EUR',
  GR: 'EUR', LU: 'EUR', SK: 'EUR', SI: 'EUR', EE: 'EUR',
  LT: 'EUR', LV: 'EUR', MT: 'EUR', CY: 'EUR', HR: 'EUR',
  MX: 'MXN', BR: 'BRL', CL: 'CLP', CO: 'COP', PE: 'PEN',
  UY: 'UYU', PY: 'PYG', BO: 'BOB', VE: 'VES', EC: 'USD',
  NZ: 'NZD', JP: 'JPY', KR: 'KRW', CN: 'CNY', IN: 'INR',
  ZA: 'ZAR', SE: 'SEK', NO: 'NOK', DK: 'DKK', CH: 'CHF',
  PL: 'PLN', CZ: 'CZK', HU: 'HUF', RO: 'RON', BG: 'BGN',
  TR: 'TRY', IL: 'ILS', AE: 'AED', SA: 'SAR', SG: 'SGD',
  HK: 'HKD', TW: 'TWD', TH: 'THB', MY: 'MYR', PH: 'PHP',
  ID: 'IDR', VN: 'VND', RU: 'RUB', UA: 'UAH', EG: 'EGP',
  NG: 'NGN', KE: 'KES', GH: 'GHS', PK: 'PKR', BD: 'BDT',
};

// Currency display symbols
const CURRENCY_SYMBOLS = {
  USD: '$', EUR: '€', GBP: '£', AUD: 'A$', CAD: 'C$',
  NZD: 'NZ$', JPY: '¥', KRW: '₩', CNY: '¥', INR: '₹',
  BRL: 'R$', MXN: 'MX$', ARS: 'ARS$', CLP: 'CLP$', COP: 'COP$',
  PEN: 'S/', UYU: '$U', ZAR: 'R', SEK: 'kr', NOK: 'kr',
  DKK: 'kr', CHF: 'CHF', PLN: 'zł', CZK: 'Kč', HUF: 'Ft',
  RON: 'lei', TRY: '₺', ILS: '₪', AED: 'AED', SAR: 'SAR',
  SGD: 'S$', HKD: 'HK$', TWD: 'NT$', THB: '฿', MYR: 'RM',
  PHP: '₱', IDR: 'Rp', VND: '₫', RUB: '₽', UAH: '₴',
  EGP: 'E£', NGN: '₦', KES: 'KSh', GHS: 'GH₵', PKR: 'Rs',
  BDT: '৳', PYG: '₲', BOB: 'Bs', VES: 'Bs', BGN: 'лв',
};

const AUD_PRICE = 2.99;
const API_URL = 'https://api.frankfurter.app/latest?from=AUD';

// In-memory cache
let ratesCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Fetch exchange rates from Frankfurter API (free, no key needed)
 */
async function fetchRates() {
  const now = Date.now();
  if (ratesCache && (now - cacheTimestamp) < CACHE_TTL) {
    return ratesCache;
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    ratesCache = data.rates;
    cacheTimestamp = now;
    return ratesCache;
  } catch {
    return ratesCache; // Return stale cache if available, null otherwise
  }
}

/**
 * Get the local price equivalent for a user's country
 * @param {string} countryCode - ISO country code (e.g., 'US', 'GB')
 * @returns {Promise<{amount: string, currency: string, symbol: string} | null>}
 */
export async function getLocalPrice(countryCode) {
  if (!countryCode) return null;

  const currency = COUNTRY_TO_CURRENCY[countryCode.toUpperCase()];
  if (!currency || currency === 'AUD') return null;

  const rates = await fetchRates();
  if (!rates || !rates[currency]) return null;

  const convertedAmount = AUD_PRICE * rates[currency];
  const symbol = CURRENCY_SYMBOLS[currency] || currency;

  // Format amount based on currency (some use 0 decimals)
  const noDecimalCurrencies = ['JPY', 'KRW', 'CLP', 'COP', 'PYG', 'VND', 'IDR', 'HUF'];
  const amount = noDecimalCurrencies.includes(currency)
    ? Math.round(convertedAmount).toLocaleString()
    : convertedAmount.toFixed(2);

  return { amount, currency, symbol };
}

export { AUD_PRICE };
