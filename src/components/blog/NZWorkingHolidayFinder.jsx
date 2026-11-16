// src/components/blog/NZWorkingHolidayFinder.jsx
// Interactive nationality finder embedded in the New Zealand Working Holiday
// blog post. The reader picks their country and sees age limit, max duration
// and the annual cap. Data is verified against immigration.govt.nz and the
// published 2026 country quotas (see the post's "sources" block).
//
// Standard rules used below:
//   - Age range is 18-30 unless the country is in AGE_35.
//   - Max stay is 12 months, except Canada (23) and United Kingdom (36).
//   - cap = annual places, or null when the scheme is uncapped.

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Check, CalendarClock, Users, CircleSlash } from 'lucide-react';

const AGE_35 = new Set([
  'argentina', 'canada', 'chile', 'czech', 'finland', 'hungary', 'slovakia', 'uk', 'uruguay',
]);

// name: localized labels. cap: annual places (null = uncapped).
const COUNTRIES = [
  { key: 'argentina', cap: 1000, name: { en: 'Argentina', es: 'Argentina', fr: 'Argentine' } },
  { key: 'austria', cap: 100, name: { en: 'Austria', es: 'Austria', fr: 'Autriche' } },
  { key: 'belgium', cap: null, name: { en: 'Belgium', es: 'Bélgica', fr: 'Belgique' } },
  { key: 'brazil', cap: 300, name: { en: 'Brazil', es: 'Brasil', fr: 'Brésil' } },
  { key: 'canada', cap: null, months: 23, name: { en: 'Canada', es: 'Canadá', fr: 'Canada' } },
  { key: 'chile', cap: 940, name: { en: 'Chile', es: 'Chile', fr: 'Chili' } },
  { key: 'china', cap: 1000, name: { en: 'China', es: 'China', fr: 'Chine' } },
  { key: 'croatia', cap: 100, name: { en: 'Croatia', es: 'Croacia', fr: 'Croatie' } },
  { key: 'czech', cap: 1200, name: { en: 'Czech Republic', es: 'República Checa', fr: 'République tchèque' } },
  { key: 'denmark', cap: null, name: { en: 'Denmark', es: 'Dinamarca', fr: 'Danemark' } },
  { key: 'estonia', cap: 100, name: { en: 'Estonia', es: 'Estonia', fr: 'Estonie' } },
  { key: 'finland', cap: null, name: { en: 'Finland', es: 'Finlandia', fr: 'Finlande' } },
  { key: 'france', cap: null, name: { en: 'France', es: 'Francia', fr: 'France' } },
  { key: 'germany', cap: null, name: { en: 'Germany', es: 'Alemania', fr: 'Allemagne' } },
  { key: 'hongkong', cap: 400, name: { en: 'Hong Kong', es: 'Hong Kong', fr: 'Hong Kong' } },
  { key: 'hungary', cap: 100, name: { en: 'Hungary', es: 'Hungría', fr: 'Hongrie' } },
  { key: 'ireland', cap: null, name: { en: 'Ireland', es: 'Irlanda', fr: 'Irlande' } },
  { key: 'israel', cap: 200, name: { en: 'Israel', es: 'Israel', fr: 'Israël' } },
  { key: 'italy', cap: null, name: { en: 'Italy', es: 'Italia', fr: 'Italie' } },
  { key: 'japan', cap: null, name: { en: 'Japan', es: 'Japón', fr: 'Japon' } },
  { key: 'latvia', cap: 100, name: { en: 'Latvia', es: 'Letonia', fr: 'Lettonie' } },
  { key: 'lithuania', cap: 100, name: { en: 'Lithuania', es: 'Lituania', fr: 'Lituanie' } },
  { key: 'luxembourg', cap: 50, name: { en: 'Luxembourg', es: 'Luxemburgo', fr: 'Luxembourg' } },
  { key: 'malaysia', cap: 1150, name: { en: 'Malaysia', es: 'Malasia', fr: 'Malaisie' } },
  { key: 'malta', cap: 50, name: { en: 'Malta', es: 'Malta', fr: 'Malte' } },
  { key: 'mexico', cap: 200, name: { en: 'Mexico', es: 'México', fr: 'Mexique' } },
  { key: 'netherlands', cap: null, name: { en: 'Netherlands', es: 'Países Bajos', fr: 'Pays-Bas' } },
  { key: 'norway', cap: null, name: { en: 'Norway', es: 'Noruega', fr: 'Norvège' } },
  { key: 'peru', cap: 100, name: { en: 'Peru', es: 'Perú', fr: 'Pérou' } },
  { key: 'philippines', cap: 100, name: { en: 'Philippines', es: 'Filipinas', fr: 'Philippines' } },
  { key: 'poland', cap: 100, name: { en: 'Poland', es: 'Polonia', fr: 'Pologne' } },
  { key: 'portugal', cap: 50, name: { en: 'Portugal', es: 'Portugal', fr: 'Portugal' } },
  { key: 'singapore', cap: 300, name: { en: 'Singapore', es: 'Singapur', fr: 'Singapour' } },
  { key: 'slovakia', cap: 100, name: { en: 'Slovakia', es: 'Eslovaquia', fr: 'Slovaquie' } },
  { key: 'slovenia', cap: 100, name: { en: 'Slovenia', es: 'Eslovenia', fr: 'Slovénie' } },
  { key: 'korea', cap: 3000, name: { en: 'South Korea', es: 'Corea del Sur', fr: 'Corée du Sud' } },
  { key: 'spain', cap: 2000, name: { en: 'Spain', es: 'España', fr: 'Espagne' } },
  { key: 'sweden', cap: null, name: { en: 'Sweden', es: 'Suecia', fr: 'Suède' } },
  { key: 'taiwan', cap: 600, name: { en: 'Taiwan', es: 'Taiwán', fr: 'Taïwan' } },
  { key: 'thailand', cap: 100, name: { en: 'Thailand', es: 'Tailandia', fr: 'Thaïlande' } },
  { key: 'turkey', cap: 100, name: { en: 'Turkey', es: 'Turquía', fr: 'Turquie' } },
  { key: 'uk', cap: 15000, months: 36, name: { en: 'United Kingdom', es: 'Reino Unido', fr: 'Royaume-Uni' } },
  { key: 'usa', cap: null, name: { en: 'United States', es: 'Estados Unidos', fr: 'États-Unis' } },
  { key: 'uruguay', cap: 200, name: { en: 'Uruguay', es: 'Uruguay', fr: 'Uruguay' } },
  { key: 'vietnam', cap: 200, name: { en: 'Vietnam', es: 'Vietnam', fr: 'Viêt Nam' } },
];

const T = {
  en: {
    title: 'Find your New Zealand Working Holiday rules',
    subtitle: 'Pick your nationality to see your age limit, how long you can stay, and whether there is an annual cap.',
    placeholder: 'Search your country…',
    noMatch: 'No matching country. New Zealand has agreements with 45 nationalities — check the spelling or browse the list.',
    eligible: 'Eligible for the Working Holiday Visa',
    age: 'Age at application',
    ageVal: (max) => `18 to ${max}`,
    duration: 'Maximum stay',
    months: (m) => `${m} months`,
    cap: 'Annual cap',
    capped: (n) => `${n.toLocaleString('en-US')} places per year`,
    uncapped: 'Uncapped — no annual limit',
    cappedHint: 'Capped schemes can sell out within hours of opening. Apply the moment it opens.',
    uncappedHint: 'You can apply any time of year while you meet the requirements.',
    pick: 'Select your country above to see your exact rules.',
    summary: '45 nationalities · 12 months standard · Canada 23 · UK 36',
  },
  es: {
    title: 'Encontrá las reglas de tu Working Holiday en Nueva Zelanda',
    subtitle: 'Elegí tu nacionalidad para ver tu límite de edad, cuánto podés quedarte y si hay un cupo anual.',
    placeholder: 'Buscá tu país…',
    noMatch: 'Ningún país coincide. Nueva Zelanda tiene acuerdos con 45 nacionalidades — revisá la ortografía o mirá la lista.',
    eligible: 'Elegible para la Working Holiday Visa',
    age: 'Edad al solicitar',
    ageVal: (max) => `18 a ${max}`,
    duration: 'Estadía máxima',
    months: (m) => `${m} meses`,
    cap: 'Cupo anual',
    capped: (n) => `${n.toLocaleString('es-AR')} lugares por año`,
    uncapped: 'Sin cupo — no hay límite anual',
    cappedHint: 'Los cupos pueden agotarse en horas desde que abren. Aplicá apenas abre.',
    uncappedHint: 'Podés aplicar en cualquier momento del año mientras cumplas los requisitos.',
    pick: 'Seleccioná tu país arriba para ver tus reglas exactas.',
    summary: '45 nacionalidades · 12 meses estándar · Canadá 23 · Reino Unido 36',
  },
  fr: {
    title: 'Trouve les règles de ton Working Holiday en Nouvelle-Zélande',
    subtitle: "Choisis ta nationalité pour voir ta limite d'âge, la durée de séjour et s'il existe un quota annuel.",
    placeholder: 'Cherche ton pays…',
    noMatch: "Aucun pays ne correspond. La Nouvelle-Zélande a des accords avec 45 nationalités — vérifie l'orthographe ou parcours la liste.",
    eligible: 'Éligible au Working Holiday Visa',
    age: 'Âge à la demande',
    ageVal: (max) => `18 à ${max}`,
    duration: 'Séjour maximum',
    months: (m) => `${m} mois`,
    cap: 'Quota annuel',
    capped: (n) => `${n.toLocaleString('fr-FR')} places par an`,
    uncapped: 'Sans quota — aucune limite annuelle',
    cappedHint: 'Les quotas peuvent partir en quelques heures après ouverture. Postule dès que ça ouvre.',
    uncappedHint: "Tu peux postuler à tout moment de l'année tant que tu remplis les conditions.",
    pick: 'Sélectionne ton pays ci-dessus pour voir tes règles exactes.',
    summary: '45 nationalités · 12 mois standard · Canada 23 · Royaume-Uni 36',
  },
};

const NZWorkingHolidayFinder = ({ lang = 'en' }) => {
  const t = T[lang] || T.en;
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  const sorted = useMemo(
    () => [...COUNTRIES].sort((a, b) => a.name[lang].localeCompare(b.name[lang], lang)),
    [lang]
  );

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return sorted.filter((c) =>
      Object.values(c.name).some((n) => n.toLowerCase().includes(q))
    );
  }, [query, sorted]);

  const country = selected;
  const ageMax = country ? (AGE_35.has(country.key) ? 35 : 30) : null;
  const months = country ? country.months || 12 : null;

  const pick = (c) => {
    setSelected(c);
    setQuery('');
  };

  return (
    <div className="my-7 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      <h3 className="text-base font-bold text-slate-800">{t.title}</h3>
      <p className="text-sm text-slate-500 mt-1 leading-relaxed">{t.subtitle}</p>

      <div className="relative mt-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.placeholder}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition-colors"
        />
        {query.trim() && (
          <div className="absolute z-20 mt-1 w-full max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
            {matches.length === 0 ? (
              <p className="px-3 py-3 text-xs text-slate-500">{t.noMatch}</p>
            ) : (
              matches.map((c) => (
                <button
                  key={c.key}
                  onClick={() => pick(c)}
                  className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 transition-colors"
                >
                  {c.name[lang]}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {country ? (
          <motion.div
            key={country.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="mt-4"
          >
            <div className="flex items-center gap-2 text-emerald-600">
              <Check size={18} />
              <span className="font-semibold">{country.name[lang]} — {t.eligible}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <Stat icon={<Users size={15} />} label={t.age} value={t.ageVal(ageMax)} />
              <Stat icon={<CalendarClock size={15} />} label={t.duration} value={t.months(months)} />
              <Stat
                icon={country.cap ? <Users size={15} /> : <CircleSlash size={15} />}
                label={t.cap}
                value={country.cap ? t.capped(country.cap) : t.uncapped}
              />
            </div>
            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              {country.cap ? t.cappedHint : t.uncappedHint}
            </p>
          </motion.div>
        ) : (
          <p className="text-sm text-slate-400 mt-4">{t.pick}</p>
        )}
      </AnimatePresence>

      <p className="text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-100">{t.summary}</p>
    </div>
  );
};

const Stat = ({ icon, label, value }) => (
  <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5">
    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium uppercase tracking-wide">
      {icon} {label}
    </div>
    <p className="text-sm font-semibold text-slate-800 mt-1 leading-snug">{value}</p>
  </div>
);

export default NZWorkingHolidayFinder;
