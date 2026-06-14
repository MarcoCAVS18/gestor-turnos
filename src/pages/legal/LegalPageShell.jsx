// src/pages/legal/LegalPageShell.jsx
// Shared chrome for the public legal pages (Terms, Privacy).
// Matches the FAQ / Australia-88 aesthetic — dark gradient hero, badge pill,
// sticky top bar, floating content card — while keeping dark-mode support in
// the body so the pages stay legible when opened from in-app Settings.

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const GRADIENT = 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)';

const FOOTER_LINKS = [
  { to: '/faq',          label: 'FAQ' },
  { to: '/australia-88', label: '88-day visa tracker' },
  { to: '/terms',        label: 'Terms of Service' },
  { to: '/privacy',      label: 'Privacy Policy' },
];

const LegalPageShell = ({ seo, badge, title, lastUpdated, currentPath, children }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const backTo = currentUser ? '/settings' : '/';
  const backLabel = currentUser ? t('common.backToSettings') : t('common.back');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-poppins">
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={seo.canonical} />
      </Helmet>

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 border-b border-white/10" style={{ background: GRADIENT }}>
        <div className="flex items-center justify-between px-5 xl:px-10 py-3.5 max-w-screen-xl mx-auto">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/assets/SVG/logo-white.svg" alt="Orary" className="w-7 h-7" />
            <span className="text-white font-bold text-base">Orary</span>
          </Link>
          <Link
            to={backTo}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={14} />
            {backLabel}
          </Link>
        </div>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{ background: GRADIENT }} className="px-5 xl:px-10 pt-12 pb-28 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 28% 40%, rgba(236,72,153,0.18) 0%, transparent 60%), radial-gradient(ellipse at 78% 30%, rgba(99,102,241,0.18) 0%, transparent 60%)',
          }}
        />
        <div className="max-w-3xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 tracking-wide uppercase"
              style={{ backgroundColor: badge.bg, color: badge.text }}
            >
              {badge.label}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">{title}</h1>
            <p className="text-slate-400 text-sm mt-3">Last updated: {lastUpdated}</p>
          </motion.div>
        </div>
      </div>

      {/* ── Content card (overlaps hero) ─────────────────────────────────── */}
      <div className="px-5 xl:px-10 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="-mt-20 relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-9"
        >
          <div className="prose prose-lg text-gray-700 dark:text-gray-300 dark:prose-invert max-w-none">
            {children}
          </div>
        </motion.div>

        {/* ── Footer links ───────────────────────────────────────────────── */}
        <div className="mt-8 mb-12 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400 dark:text-slate-600">
          {FOOTER_LINKS.filter((l) => l.to !== currentPath).map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-pink-500 transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegalPageShell;
