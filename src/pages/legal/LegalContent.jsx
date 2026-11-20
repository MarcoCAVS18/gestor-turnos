// src/pages/legal/LegalContent.jsx
// Renders the legal texts (Terms, Privacy) from the "legal" i18n namespace.
//
// The texts live in src/locales/<lang>/legal/<doc>.json and are registered here,
// so they load with the legal pages instead of the main bundle.
//
// Document shape: { intro, sections: [{ title, callout?, lead?, blocks: [...] }] }
// A block is one of:
//   "text"                       paragraph
//   { "ul": ["text", ...] }      bullet list
//   { "h3": "text" }             sub-heading
//   { "small": "text" }          small grey note
//   { "warn": { title, items } } amber disclaimer box
// Inline markup inside any text: <strong>..</strong>, <code>..</code>,
// [[mailto:a@b.c]] and [[https://url|label]]. No HTML is injected; the markup is
// parsed into React elements.

import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Database, MapPin, CreditCard, Lock, Globe, Cookie, Shield, Bell } from 'lucide-react';
import i18n from '../../i18n';
import termsEn from '../../locales/en/legal/terms.json';
import termsEs from '../../locales/es/legal/terms.json';
import termsFr from '../../locales/fr/legal/terms.json';
import privacyEn from '../../locales/en/legal/privacy.json';
import privacyEs from '../../locales/es/legal/privacy.json';
import privacyFr from '../../locales/fr/legal/privacy.json';

const BUNDLES = {
  en: { terms: termsEn, privacy: privacyEn },
  es: { terms: termsEs, privacy: privacyEs },
  fr: { terms: termsFr, privacy: privacyFr },
};
Object.entries(BUNDLES).forEach(([lng, docs]) => {
  if (!i18n.hasResourceBundle(lng, 'legal')) i18n.addResourceBundle(lng, 'legal', docs, true, true);
});

const LINK_CLASS = 'text-pink-600 dark:text-pink-400 hover:underline';
const TOKEN = /(<strong>[\s\S]*?<\/strong>|<code>[\s\S]*?<\/code>|\[\[[^\]]+\]\])/g;

export const RichText = ({ text }) => (
  <>
    {String(text).split(TOKEN).filter(Boolean).map((part, i) => {
      if (part.startsWith('<strong>')) return <strong key={i}>{part.slice(8, -9)}</strong>;
      if (part.startsWith('<code>')) return <code key={i}>{part.slice(6, -7)}</code>;
      if (part.startsWith('[[')) {
        const inner = part.slice(2, -2);
        if (inner.startsWith('mailto:')) {
          return <a key={i} href={inner} className={LINK_CLASS}>{inner.slice(7)}</a>;
        }
        const [href, label] = inner.split('|');
        return <a key={i} href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>{label || href}</a>;
      }
      return <Fragment key={i}>{part}</Fragment>;
    })}
  </>
);

// Section callouts (Privacy): icon and colour per section id
const CALLOUTS = {
  collect:  { Icon: Database,   box: 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700',       icon: 'text-gray-600 dark:text-gray-400',     title: 'text-gray-800 dark:text-gray-200',     lead: 'text-gray-600 dark:text-gray-400' },
  location: { Icon: MapPin,     box: 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800',       icon: 'text-teal-600 dark:text-teal-400',     title: 'text-teal-800 dark:text-teal-300',     lead: 'text-teal-700 dark:text-teal-400' },
  payments: { Icon: CreditCard, box: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800', icon: 'text-purple-600 dark:text-purple-400', title: 'text-purple-800 dark:text-purple-300', lead: 'text-purple-700 dark:text-purple-400' },
  security: { Icon: Lock,       box: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',   icon: 'text-green-600 dark:text-green-400',   title: 'text-green-800 dark:text-green-300',   lead: 'text-green-700 dark:text-green-400' },
  sharing:  { Icon: Globe,      box: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800', icon: 'text-orange-600 dark:text-orange-400', title: 'text-orange-800 dark:text-orange-300', lead: 'text-orange-700 dark:text-orange-400' },
  cookies:  { Icon: Cookie,     box: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800', icon: 'text-yellow-600 dark:text-yellow-400', title: 'text-yellow-800 dark:text-yellow-300', lead: 'text-yellow-700 dark:text-yellow-400' },
  rights:   { Icon: Shield,     box: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800', icon: 'text-indigo-600 dark:text-indigo-400', title: 'text-indigo-800 dark:text-indigo-300', lead: 'text-indigo-700 dark:text-indigo-400' },
  changes:  { Icon: Bell,       box: 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700',       icon: 'text-gray-600 dark:text-gray-400',     title: 'text-gray-800 dark:text-gray-200',     lead: 'text-gray-700 dark:text-gray-400' },
};

const Block = ({ block, first }) => {
  if (typeof block === 'string') return <p className={first ? '' : 'mt-3'}><RichText text={block} /></p>;
  if (block.h3) return <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">{block.h3}</h3>;
  if (block.small) return <p className="mt-4 text-sm text-gray-500 dark:text-gray-400"><RichText text={block.small} /></p>;
  if (block.ul) {
    return (
      <ul className="list-disc pl-5 space-y-2 mt-2">
        {block.ul.map((item, i) => <li key={i}><RichText text={item} /></li>)}
      </ul>
    );
  }
  if (block.warn) {
    return (
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mt-6 not-prose">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300">{block.warn.title}</p>
            <ul className="text-amber-700 dark:text-amber-400 text-sm mt-2 space-y-2 list-disc pl-4">
              {block.warn.items.map((item, i) => <li key={i}><RichText text={item} /></li>)}
            </ul>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const Section = ({ section }) => {
  const callout = CALLOUTS[section.callout];
  return (
    <section>
      {callout ? (
        <div className={`border rounded-xl p-4 mt-8 not-prose ${callout.box}`}>
          <div className="flex items-start gap-3">
            <callout.Icon className={`flex-shrink-0 mt-1 ${callout.icon}`} size={20} />
            <div>
              <h2 className={`font-semibold ${callout.title}`}>{section.title}</h2>
              {section.lead && <p className={`text-sm mt-2 ${callout.lead}`}>{section.lead}</p>}
            </div>
          </div>
        </div>
      ) : (
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">{section.title}</h2>
      )}
      {section.blocks.map((block, i) => <Block key={i} block={block} first={i === 0 && !callout} />)}
    </section>
  );
};

// Hook for the page chrome (SEO, badge, title) of a legal document
export const useLegalDoc = (doc) => {
  const { t } = useTranslation('legal');
  return {
    seoTitle: t(`${doc}.seoTitle`),
    seoDescription: t(`${doc}.seoDescription`),
    badge: t(`${doc}.badge`),
    title: t(`${doc}.title`),
  };
};

const LegalContent = ({ doc }) => {
  const { t } = useTranslation('legal');
  const sections = t(`${doc}.sections`, { returnObjects: true });
  return (
    <>
      <p><RichText text={t(`${doc}.intro`)} /></p>
      {Array.isArray(sections) && sections.map((section, i) => <Section key={i} section={section} />)}
    </>
  );
};

export default LegalContent;
