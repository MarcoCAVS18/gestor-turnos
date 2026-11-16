// src/components/blog/AURegionExplorer.jsx
// Interactive explorer for the Australian second-year visa post. The reader
// toggles between subclass 417 (Working Holiday) and subclass 462 (Work and
// Holiday) and sees how the eligible regions differ — because the two visas do
// NOT share the same rules. 417 counts work across regional Australia; 462 is
// built around Northern Australia (north of the Tropic of Capricorn).
//
// Region data is based on the Department of Home Affairs specified-work lists.
// Exact postcodes change — the post links the official source for confirmation.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, MapPin, Info } from 'lucide-react';

const STATES_417 = [
  { key: 'nt', status: 'all', name: { en: 'Northern Territory', es: 'Territorio del Norte', fr: 'Territoire du Nord' } },
  { key: 'sa', status: 'all', name: { en: 'South Australia', es: 'Australia Meridional', fr: 'Australie-Méridionale' } },
  { key: 'tas', status: 'all', name: { en: 'Tasmania', es: 'Tasmania', fr: 'Tasmanie' } },
  { key: 'qld', status: 'regional', name: { en: 'Queensland', es: 'Queensland', fr: 'Queensland' }, ex: { en: 'excludes Greater Brisbane', es: 'excluye el Gran Brisbane', fr: 'hors Grand Brisbane' } },
  { key: 'wa', status: 'regional', name: { en: 'Western Australia', es: 'Australia Occidental', fr: 'Australie-Occidentale' }, ex: { en: 'excludes Perth metro', es: 'excluye el área metro de Perth', fr: 'hors zone métro de Perth' } },
  { key: 'nsw', status: 'regional', name: { en: 'New South Wales', es: 'Nueva Gales del Sur', fr: 'Nouvelle-Galles du Sud' }, ex: { en: 'excludes Sydney, Newcastle, Wollongong', es: 'excluye Sídney, Newcastle, Wollongong', fr: 'hors Sydney, Newcastle, Wollongong' } },
  { key: 'vic', status: 'regional', name: { en: 'Victoria', es: 'Victoria', fr: 'Victoria' }, ex: { en: 'excludes Melbourne', es: 'excluye Melbourne', fr: 'hors Melbourne' } },
  { key: 'act', status: 'none', name: { en: 'ACT (Canberra)', es: 'ACT (Canberra)', fr: 'ACT (Canberra)' } },
];

const INDUSTRIES_462 = [
  {
    key: 'tourism',
    name: { en: 'Tourism & hospitality', es: 'Turismo y hostelería', fr: 'Tourisme et hôtellerie' },
    area: { en: 'Northern, remote or very remote Australia', es: 'Norte, remota o muy remota de Australia', fr: 'Australie du Nord, isolée ou très isolée' },
  },
  {
    key: 'plant',
    name: { en: 'Plant & animal cultivation', es: 'Cultivo de plantas y animales', fr: "Culture de plantes et d'animaux" },
    area: { en: 'Regional Australia (incl. the north)', es: 'Australia regional (incl. el norte)', fr: 'Australie régionale (nord inclus)' },
  },
  {
    key: 'fishing',
    name: { en: 'Fishing & pearling', es: 'Pesca y perlería', fr: 'Pêche et perliculture' },
    area: { en: 'Northern Australia', es: 'Norte de Australia', fr: 'Australie du Nord' },
  },
  {
    key: 'tree',
    name: { en: 'Tree farming & felling', es: 'Silvicultura y tala', fr: 'Sylviculture et abattage' },
    area: { en: 'Northern Australia', es: 'Norte de Australia', fr: 'Australie du Nord' },
  },
  {
    key: 'construction',
    name: { en: 'Construction', es: 'Construcción', fr: 'Construction' },
    area: { en: 'Northern Australia + specified regional postcodes', es: 'Norte de Australia + códigos postales regionales especificados', fr: 'Australie du Nord + codes postaux régionaux spécifiés' },
  },
  {
    key: 'disaster',
    name: { en: 'Bushfire & flood recovery', es: 'Recuperación tras incendios e inundaciones', fr: 'Reconstruction après incendies et inondations' },
    area: { en: 'Declared disaster areas', es: 'Zonas de desastre declaradas', fr: 'Zones de catastrophe déclarées' },
  },
];

const T = {
  en: {
    title: 'Eligible regions: subclass 417 vs 462',
    subtitle: 'The two working holiday visas do not share the same rules. Switch between them to see where your 88 days actually count.',
    is417: '417 · Working Holiday',
    is462: '462 · Work and Holiday',
    intro417: 'For the 417, specified work counts across regional Australia — some states in full, others everywhere outside the main cities.',
    intro462: 'The 462 is built around Northern Australia (north of the Tropic of Capricorn). Where your work counts depends on the industry:',
    statusAll: 'Entire state eligible',
    statusRegional: 'Regional only',
    statusNone: 'Not eligible',
    note417: 'UK passport holders (from 1 July 2024) can get a 2nd and 3rd 417 without doing any specified work.',
    note462: 'Eligible countries for the 462 differ from the 417, and the 462 has education and English requirements. Always confirm the exact postcodes for your industry on the Home Affairs website before you start.',
    area: 'Where it counts',
  },
  es: {
    title: 'Regiones elegibles: subclase 417 vs 462',
    subtitle: 'Las dos visas de working holiday no comparten las mismas reglas. Cambiá entre ellas para ver dónde cuentan de verdad tus 88 días.',
    is417: '417 · Working Holiday',
    is462: '462 · Work and Holiday',
    intro417: 'Para la 417, el trabajo especificado cuenta en toda la Australia regional — algunos estados completos, otros en todo lo que esté fuera de las ciudades principales.',
    intro462: 'La 462 gira en torno al Norte de Australia (al norte del Trópico de Capricornio). Dónde cuenta tu trabajo depende de la industria:',
    statusAll: 'Estado entero elegible',
    statusRegional: 'Solo regional',
    statusNone: 'No elegible',
    note417: 'Los titulares de pasaporte del Reino Unido (desde el 1 de julio de 2024) pueden obtener una 2ª y 3ª 417 sin hacer ningún trabajo especificado.',
    note462: 'Los países elegibles para la 462 son distintos de los de la 417, y la 462 tiene requisitos de educación e inglés. Confirmá siempre los códigos postales exactos de tu industria en el sitio de Home Affairs antes de empezar.',
    area: 'Dónde cuenta',
  },
  fr: {
    title: 'Régions éligibles : sous-classe 417 vs 462',
    subtitle: 'Les deux visas working holiday ne partagent pas les mêmes règles. Bascule entre les deux pour voir où tes 88 jours comptent vraiment.',
    is417: '417 · Working Holiday',
    is462: '462 · Work and Holiday',
    intro417: "Pour le 417, le travail spécifié compte dans toute l'Australie régionale — certains États en entier, d'autres partout hors des grandes villes.",
    intro462: "Le 462 est centré sur l'Australie du Nord (au nord du Tropique du Capricorne). L'endroit où ton travail compte dépend de l'industrie :",
    statusAll: 'État entier éligible',
    statusRegional: 'Régional uniquement',
    statusNone: 'Non éligible',
    note417: "Les titulaires d'un passeport britannique (depuis le 1er juillet 2024) peuvent obtenir un 2e et un 3e 417 sans aucun travail spécifié.",
    note462: "Les pays éligibles au 462 diffèrent de ceux du 417, et le 462 impose des conditions d'études et d'anglais. Confirme toujours les codes postaux exacts de ton industrie sur le site de Home Affairs avant de commencer.",
    area: 'Où ça compte',
  },
};

const STATUS_STYLE = {
  all: { dot: 'bg-emerald-500', text: 'text-emerald-700', icon: Check },
  regional: { dot: 'bg-amber-500', text: 'text-amber-700', icon: MapPin },
  none: { dot: 'bg-rose-500', text: 'text-rose-700', icon: X },
};

const AURegionExplorer = ({ lang = 'en' }) => {
  const t = T[lang] || T.en;
  const [sub, setSub] = useState('417');

  const statusLabel = { all: t.statusAll, regional: t.statusRegional, none: t.statusNone };

  return (
    <div className="my-7 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      <h3 className="text-base font-bold text-slate-800">{t.title}</h3>
      <p className="text-sm text-slate-500 mt-1 leading-relaxed">{t.subtitle}</p>

      <div className="mt-4 inline-flex rounded-xl bg-slate-100 p-1">
        {['417', '462'].map((s) => (
          <button
            key={s}
            onClick={() => setSub(s)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              sub === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {s === '417' ? t.is417 : t.is462}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={sub}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className="mt-4"
        >
          <p className="text-sm text-slate-600 leading-relaxed">{sub === '417' ? t.intro417 : t.intro462}</p>

          {sub === '417' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
              {STATES_417.map((st) => {
                const style = STATUS_STYLE[st.status];
                const Icon = style.icon;
                return (
                  <div key={st.key} className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                    <span className={`mt-0.5 flex-shrink-0 ${style.text}`}><Icon size={16} /></span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{st.name[lang]}</p>
                      <p className={`text-xs ${style.text}`}>
                        {statusLabel[st.status]}{st.ex ? ` — ${st.ex[lang]}` : ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {INDUSTRIES_462.map((ind) => (
                <div key={ind.key} className="flex flex-wrap items-center justify-between gap-1 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                  <p className="text-sm font-semibold text-slate-800">{ind.name[lang]}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-full px-2.5 py-1">
                    <MapPin size={12} /> {ind.area[lang]}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-start gap-2 rounded-xl bg-indigo-50 px-3 py-2.5 text-xs text-indigo-900 leading-relaxed">
            <Info size={15} className="flex-shrink-0 mt-0.5 text-indigo-500" />
            <span>{sub === '417' ? t.note417 : t.note462}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AURegionExplorer;
