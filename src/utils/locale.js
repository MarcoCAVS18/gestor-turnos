// src/utils/locale.js
// Utilitario central para resolución de locale regional.
//
// Problema que resuelve: la app tenía el mapeo hardcodeado en 9 archivos:
//   i18n.language === 'es' ? 'es-ES' : i18n.language === 'fr' ? 'fr-FR' : 'en-US'
//
// Esto ignoraba la región del usuario — un australiano con idioma en inglés recibía
// 'en-US' y veía fechas en formato MM/DD en lugar de DD/MM.
//
// Solución: usar navigator.language (que incluye región, ej: 'en-AU', 'es-AR', 'fr-CA')
// cuando el idioma de la app coincide con el del browser. Si no, usar un fallback sensato.

/** Fallbacks mínimos para los idiomas soportados por la app. */
const LANG_FALLBACKS = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
};

/**
 * Devuelve el locale BCP-47 completo (con región) para formatear fechas y números.
 *
 * Lógica:
 * 1. Si el idioma del browser coincide con el idioma de la app → usamos el locale completo
 *    del browser (ej: 'en-AU', 'es-AR') para respetar convenciones regionales.
 * 2. Si no coinciden (ej: app en inglés, browser en japonés) → usamos el fallback del idioma
 *    de la app para mantener coherencia con el contenido mostrado.
 * 3. Para idiomas sin fallback definido → devolvemos el lang tal cual (BCP-47 válido).
 *
 * @param {string} i18nLanguage - Idioma activo de i18next (ej: 'en', 'es', 'fr')
 * @returns {string} Locale BCP-47 con región (ej: 'en-AU', 'es-AR', 'fr-FR')
 */
export const getLocaleFromI18n = (i18nLanguage) => {
  const browserLocale = navigator?.language || '';

  // Usamos el locale del browser si empieza con el idioma de la app.
  // Ej: app='en', browser='en-AU' → 'en-AU' (formato DD/MM, moneda AUD)
  //     app='es', browser='es-AR' → 'es-AR' (formato DD/MM, peso argentino)
  if (browserLocale && browserLocale.startsWith(i18nLanguage)) {
    return browserLocale;
  }

  return LANG_FALLBACKS[i18nLanguage] || i18nLanguage;
};
