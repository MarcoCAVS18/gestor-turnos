// src/data/updates.js
// Changelog data for the dashboard "Novedades" (What's new) card.
//
// Each entry's title/description is localized inline (en/es/fr) so the changelog
// content lives together and stays out of the UI translation.json — same approach
// as the blog (see the no-hardcoded-text memory exception for content data).
//
// To add an update: prepend an entry to RECENT_UPDATES (newest first). Move items
// from UPCOMING_UPDATES to RECENT_UPDATES with a `date` once they ship.

export const RECENT_UPDATES = [
  {
    id: 'dashboard-redesign',
    date: '2026-06-17',
    title: {
      en: 'Redesigned home',
      es: 'Inicio rediseñado',
      fr: 'Accueil repensé',
    },
    description: {
      en: 'We reorganized the cards so you see shifts, earnings and news at a glance.',
      es: 'Reorganizamos las tarjetas para ver turnos, ganancias y novedades de un vistazo.',
      fr: 'Cartes réorganisées pour voir quarts, revenus et nouveautés d’un coup d’œil.',
    },
  },
  {
    id: 'blog-blogary',
    date: '2026-06-16',
    title: {
      en: 'Blogary, our blog',
      es: 'Blogary, nuestro blog',
      fr: 'Blogary, notre blog',
    },
    description: {
      en: 'Guides on shifts, pay, taxes and the Working Holiday Visa — in 3 languages.',
      es: 'Guías sobre turnos, sueldos, impuestos y la Working Holiday Visa — en 3 idiomas.',
      fr: 'Guides sur les quarts, la paie, les impôts et le Working Holiday Visa — en 3 langues.',
    },
  },
  {
    id: 'whv-tracker',
    date: '2026-06-14',
    title: {
      en: '88-day visa tracker',
      es: 'Contador de 88 días',
      fr: 'Compteur des 88 jours',
    },
    description: {
      en: 'Automatically count your Working Holiday Visa days from the hours you log.',
      es: 'Contá automáticamente tus días de Working Holiday Visa según las horas registradas.',
      fr: 'Compte automatiquement tes jours de Working Holiday Visa selon les heures enregistrées.',
    },
  },
];

export const UPCOMING_UPDATES = [
  {
    id: 'live-mode-plus',
    title: {
      en: 'Improved Live Mode',
      es: 'Modo Live mejorado',
      fr: 'Mode Live amélioré',
    },
    description: {
      en: 'A smoother, more accurate way to track shifts in real time.',
      es: 'Una forma más fluida y precisa de seguir tus turnos en tiempo real.',
      fr: 'Un suivi des quarts en temps réel plus fluide et précis.',
    },
  },
  {
    id: 'more-stats',
    title: {
      en: 'More statistics',
      es: 'Más estadísticas',
      fr: 'Plus de statistiques',
    },
    description: {
      en: 'New charts and insights to understand your earnings.',
      es: 'Nuevos gráficos y análisis para entender tus ganancias.',
      fr: 'De nouveaux graphiques et analyses pour comprendre tes revenus.',
    },
  },
  {
    id: 'shift-reminders',
    title: {
      en: 'Shift reminders',
      es: 'Recordatorios de turnos',
      fr: 'Rappels de quarts',
    },
    description: {
      en: 'Get notified before your next shift starts.',
      es: 'Recibí un aviso antes de que empiece tu próximo turno.',
      fr: 'Reçois une alerte avant le début de ton prochain quart.',
    },
  },
];

// Picks the localized value for the active language, falling back to English.
export const localizeUpdate = (field, lang) =>
  field?.[lang] || field?.en || '';
