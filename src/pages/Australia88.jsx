// src/pages/Australia88.jsx
// Public SEO page: 88-day Working Holiday Visa tracker for Australia.
// No auth required. Language switcher in top-right corner (EN/ES/FR).
// Pre-rendered by scripts/prerender.js for Google/Bing indexing.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle, ArrowRight, Clock, Calendar, BarChart3, Bell } from 'lucide-react';
import { YEAR1_TARGET_DAYS, YEAR2_TARGET_DAYS, estimateVisaDaysFromWeekTotals, roundVisaDays } from '../services/australia88Service';

const PINK = '#EC4899';


// ── Smooth scroll helper ────────────────────────────────────────────────────
function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Language switcher ───────────────────────────────────────────────────────
const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'fr', label: 'FR' },
];

function LangSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language?.slice(0, 2) || 'en';

  return (
    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-lg p-1">
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => i18n.changeLanguage(code)}
          className="px-2.5 py-1 rounded-md text-xs font-semibold transition-all"
          style={{
            backgroundColor: current === code ? 'rgba(255,255,255,0.95)' : 'transparent',
            color: current === code ? '#1e293b' : 'rgba(255,255,255,0.7)',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ── Counting rules and worked examples (same method as australia88Service) ──
const RULE_KEYS = ['rule1', 'rule2', 'rule3'];
const EXAMPLE_KEYS = ['ex1', 'ex2', 'ex3', 'ex4'];

// ── Progress bar ────────────────────────────────────────────────────────────
function ProgressBar({ value, max, color }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
}

// ── Interactive demo calculator ─────────────────────────────────────────────
function DemoCalculator() {
  const { t } = useTranslation();
  const [weeks, setWeeks] = useState([{ id: 1, days: '', hours: '' }]);
  const nextId = React.useRef(2);

  const addWeek = () => {
    setWeeks((prev) => [...prev, { id: nextId.current++, days: '', hours: '' }]);
  };

  const removeWeek = (id) => {
    setWeeks((prev) => prev.filter((w) => w.id !== id));
  };

  const updateHours = (id, val) => {
    const cleaned = val.replace(',', '.');
    if (cleaned === '' || /^\d{0,3}(\.\d{0,2})?$/.test(cleaned)) {
      setWeeks((prev) => prev.map((w) => (w.id === id ? { ...w, hours: cleaned } : w)));
    }
  };

  const updateDays = (id, val) => {
    if (val === '' || /^[0-7]$/.test(val)) {
      setWeeks((prev) => prev.map((w) => (w.id === id ? { ...w, days: val } : w)));
    }
  };

  // null until both fields are filled in
  const weekVisaDays = (w) => (w.days === '' || w.hours === ''
    ? null
    : estimateVisaDaysFromWeekTotals(parseInt(w.days, 10), parseFloat(w.hours)));

  const totalDays = roundVisaDays(weeks.reduce((sum, w) => sum + (weekVisaDays(w) || 0), 0));

  const reachedYear2 = totalDays >= YEAR1_TARGET_DAYS;
  // Third-year days are a separate count done on the 2nd visa, so the demo
  // only credits days beyond the first 88 toward it (never cumulative).
  const year3Days = roundVisaDays(Math.max(0, totalDays - YEAR1_TARGET_DAYS));
  const reachedYear3 = year3Days >= YEAR2_TARGET_DAYS;

  return (
    <div className="space-y-5">
      {/* Week rows */}
      <AnimatePresence initial={false}>
        {weeks.map((week, idx) => {
          const visaDays = weekVisaDays(week);

          return (
            <motion.div
              key={week.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              {/* Line 1: week label, result, remove */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-400">
                  {t('australia88Page.demo.weekLabel')} {idx + 1}
                </span>
                <div className="flex items-center gap-2">
                  {visaDays !== null && (
                    <span
                      className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold"
                      style={{
                        backgroundColor: visaDays > 0 ? '#fdf2f8' : '#f1f5f9',
                        color: visaDays > 0 ? PINK : '#94a3b8',
                      }}
                    >
                      +{visaDays} {visaDays === 1 ? t('australia88Page.demo.visaDays') : t('australia88Page.demo.visaDaysPlural')}
                    </span>
                  )}
                  {weeks.length > 1 && (
                    <button
                      onClick={() => removeWeek(week.id)}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                      aria-label={t('australia88Page.demo.removeWeek')}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              {/* Line 2: days worked + total hours */}
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="block text-xs text-slate-500 mb-1">{t('australia88Page.demo.daysLabel')}</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={week.days}
                    onChange={(e) => updateDays(week.id, e.target.value)}
                    placeholder={t('australia88Page.demo.daysPlaceholder')}
                    min="0"
                    max="7"
                    step="1"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                    style={{ fontSize: '16px' }}
                  />
                </label>
                <label className="block">
                  <span className="block text-xs text-slate-500 mb-1">{t('australia88Page.demo.hoursLabel')}</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={week.hours}
                    onChange={(e) => updateHours(week.id, e.target.value)}
                    placeholder={t('australia88Page.demo.hoursPlaceholder')}
                    min="0"
                    max="168"
                    step="0.5"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                    style={{ fontSize: '16px' }}
                  />
                </label>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Add week */}
      <button
        onClick={addWeek}
        className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
        style={{ color: PINK }}
      >
        <Plus size={15} />
        {t('australia88Page.demo.addWeek')}
      </button>

      {/* Results */}
      {totalDays > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-4 border-t border-slate-100 space-y-4"
        >
          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">{t('australia88Page.demo.totalDays')}</span>
            <span className="text-2xl font-bold" style={{ color: PINK }}>{totalDays}</span>
          </div>

          {/* Progress to 88 */}
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>{t('australia88Page.demo.progress88')}</span>
              <span>{Math.min(totalDays, 88)} / 88</span>
            </div>
            <ProgressBar value={totalDays} max={88} color={reachedYear2 ? '#10B981' : PINK} />
            {reachedYear2 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-semibold mt-1.5 flex items-center gap-1"
                style={{ color: '#10B981' }}
              >
                <CheckCircle size={12} />
                {t('australia88Page.demo.milestone88')}
              </motion.p>
            )}
          </div>

          {/* Progress to the third-year goal, revealed only after the 88-day milestone */}
          {totalDays >= 88 && (
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>{t('australia88Page.demo.progress176')}</span>
                <span>{Math.min(year3Days, YEAR2_TARGET_DAYS)} / {YEAR2_TARGET_DAYS}</span>
              </div>
              <ProgressBar value={year3Days} max={YEAR2_TARGET_DAYS} color={reachedYear3 ? '#10B981' : '#6366F1'} />
              {reachedYear3 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs font-semibold mt-1.5 flex items-center gap-1"
                  style={{ color: '#10B981' }}
                >
                  <CheckCircle size={12} />
                  {t('australia88Page.demo.milestone176')}
                </motion.p>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ── How Orary works steps ───────────────────────────────────────────────────
const HOW_STEPS = [
  { icon: Clock, color: '#F59E0B', titleKey: 'step1Title', descKey: 'step1Desc' },
  { icon: Calendar, color: '#6366F1', titleKey: 'step2Title', descKey: 'step2Desc' },
  { icon: BarChart3, color: PINK, titleKey: 'step3Title', descKey: 'step3Desc' },
  { icon: Bell, color: '#10B981', titleKey: 'step4Title', descKey: 'step4Desc' },
];

// ── HowTo JSON-LD ───────────────────────────────────────────────────────────
const HOWTO_JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to count 88 days for the Australian Working Holiday Visa extension',
  description:
    'Step-by-step guide to calculating visa-accredited days for the Australian Working Holiday Visa (subclass 417 & 462) second and third year extension, following Home Affairs guidance on full-time and part-time work.',
  totalTime: 'PT5M',
  estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '0' },
  step: [
    {
      '@type': 'HowToStep',
      name: 'Work in a qualifying regional area',
      text: 'Find specified work (farm work, harvesting, construction, mining, fishing, or approved hospitality) in a designated regional postcode of Australia. Keep all payslips and employment records.',
      position: 1,
    },
    {
      '@type': 'HowToStep',
      name: 'Track the days and hours you work each Monday–Sunday week',
      text: 'Record every shift: which days you worked and how many paid hours. Each Monday-to-Sunday week is counted on its own.',
      position: 2,
    },
    {
      '@type': 'HowToStep',
      name: 'Count each week',
      text: 'A full-time week (5 or more days at the industry full-time hours, commonly 38) counts as 7 visa days, weekend included. Otherwise each day worked counts once at most, in proportion to a standard day (7.6 hours by default). A long day never counts as two.',
      position: 3,
    },
    {
      '@type': 'HowToStep',
      name: 'Accumulate days across all weeks',
      text: 'Add the visa days from every qualifying week together. Days from different employers and regions all count toward your total as long as the work is in an approved category and area.',
      position: 4,
    },
    {
      '@type': 'HowToStep',
      name: 'Reach 88 days to apply for a second year',
      text: 'Once your total reaches 88 visa-accredited days, you are eligible to apply for a second-year Working Holiday Visa. For a third year you need a separate 6 months (179 days) of specified work done on your second visa.',
      position: 5,
    },
  ],
});

// ── Main component ──────────────────────────────────────────────────────────
const Australia88 = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white font-poppins">
      <Helmet>
        <title>88 Day Tracker Australia — Working Holiday Visa | Orary</title>
        <meta
          name="description"
          content="Track your 88 days for the Australian Working Holiday Visa (subclass 417 & 462). Understand how days are counted, use our free calculator, and let Orary count automatically from your real shift hours."
        />
        <link rel="canonical" href="https://orary.app/australia-88" />

        {/* hreflang — English primary, same URL serves ES/FR via language switcher */}
        <link rel="alternate" hreflang="en"        href="https://orary.app/australia-88" />
        <link rel="alternate" hreflang="es"        href="https://orary.app/australia-88" />
        <link rel="alternate" hreflang="fr"        href="https://orary.app/australia-88" />
        <link rel="alternate" hreflang="x-default" href="https://orary.app/australia-88" />

        <meta property="og:title"       content="88 Day Tracker Australia — Working Holiday Visa | Orary" />
        <meta property="og:description" content="Track your 88 days for the Australian Working Holiday Visa automatically. Free calculator included." />
        <meta property="og:url"         content="https://orary.app/australia-88" />
        <meta property="og:type"        content="website" />
        <meta property="og:image"       content="https://orary.app/assets/images/logo2.png" />

        {/* HowTo structured data — enables rich results for "how to count 88 days australia" */}
        <script type="application/ld+json">{HOWTO_JSON_LD}</script>
      </Helmet>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
      >
        {/* Subtle background glow */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse at 30% 50%, #EC489940 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, #6366F140 0%, transparent 60%)',
          }}
        />

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-5 py-4 max-w-3xl mx-auto">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/assets/SVG/logo-white.svg" alt="Orary" className="w-8 h-8" />
            <span className="text-white font-bold text-lg">Orary</span>
          </Link>
          <div className="flex items-center gap-3">
            <LangSwitcher />
            <Link
              to="/register"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-80"
              style={{ backgroundColor: PINK }}
            >
              {t('australia88Page.hero.cta')}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 px-5 pt-12 pb-20 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6 tracking-wide uppercase"
              style={{ backgroundColor: 'rgba(236,72,153,0.2)', color: '#f9a8d4' }}
            >
              {t('australia88Page.hero.badge')}
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-5">
              {t('australia88Page.hero.title')}
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-9">
              {t('australia88Page.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold text-white transition-all hover:scale-105 active:scale-100"
                style={{ backgroundColor: PINK, boxShadow: `0 4px 20px ${PINK}50` }}
              >
                {t('australia88Page.hero.cta')}
                <ArrowRight size={16} />
              </Link>
              <button
                onClick={() => scrollTo('how-it-works')}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold text-white border border-white/20 hover:bg-white/10 transition-all"
              >
                {t('australia88Page.hero.ctaSecondary')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── WHAT ARE THE 88 DAYS ─────────────────────────────────────────── */}
      <section className="px-5 py-16 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
            {t('australia88Page.what.title')}
          </h2>
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">{t('australia88Page.what.body1')}</p>
            <p
              className="text-slate-700 font-medium leading-relaxed px-4 py-4 rounded-2xl border-l-4"
              style={{ borderColor: PINK, backgroundColor: '#fdf2f8' }}
            >
              {t('australia88Page.what.body2')}
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── FORMULA TABLE ────────────────────────────────────────────────── */}
      <section id="how-it-works" className="px-5 py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              {t('australia88Page.formula.title')}
            </h2>
            <p className="text-slate-500 mb-6">{t('australia88Page.formula.subtitle')}</p>

            <ol className="space-y-3 mb-8">
              {RULE_KEYS.map((key, idx) => (
                <li key={key} className="flex gap-3 text-sm text-slate-700 leading-relaxed">
                  <span
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: '#fdf2f8', color: PINK }}
                  >
                    {idx + 1}
                  </span>
                  <span>{t(`australia88Page.formula.${key}`)}</span>
                </li>
              ))}
            </ol>

            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              {/* Table header */}
              <div className="grid grid-cols-2 px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white border-b border-slate-200">
                <span>{t('australia88Page.formula.col1')}</span>
                <span className="text-right">{t('australia88Page.formula.col2')}</span>
              </div>
              {/* Rows */}
              {EXAMPLE_KEYS.map((key, idx) => (
                <div
                  key={key}
                  className="grid grid-cols-2 px-5 py-4 items-center border-b border-slate-100 last:border-0 transition-colors hover:bg-white"
                  style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f8fafc' }}
                >
                  <span className="text-sm font-medium text-slate-700">
                    {t(`australia88Page.formula.${key}Week`)}
                  </span>
                  <div className="flex justify-end">
                    <span
                      className="inline-block px-3 py-1 rounded-lg text-sm font-bold"
                      style={{ backgroundColor: '#fdf2f8', color: PINK }}
                    >
                      {t(`australia88Page.formula.${key}Days`)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              {t('australia88Page.formula.note')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── INTERACTIVE CALCULATOR ───────────────────────────────────────── */}
      <section className="px-5 py-16 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            {t('australia88Page.demo.title')}
          </h2>
          <p className="text-slate-500 mb-8">{t('australia88Page.demo.subtitle')}</p>

          <div className="rounded-2xl border border-slate-200 shadow-sm bg-white p-6">
            <DemoCalculator />
          </div>
        </motion.div>
      </section>

      {/* ── MILESTONES ───────────────────────────────────────────────────── */}
      <section className="px-5 py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">
              {t('australia88Page.milestones.title')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Year 2 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 text-2xl font-black"
                  style={{ backgroundColor: '#fdf2f8', color: PINK }}
                >
                  {t('australia88Page.milestones.year2Days')}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {t('australia88Page.milestones.year2Title')}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {t('australia88Page.milestones.year2Desc')}
                </p>
              </div>

              {/* Year 3 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 text-2xl font-black"
                  style={{ backgroundColor: '#eef2ff', color: '#6366F1' }}
                >
                  {t('australia88Page.milestones.year3Days')}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {t('australia88Page.milestones.year3Title')}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {t('australia88Page.milestones.year3Desc')}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-5 leading-relaxed">
              {t('australia88Page.milestones.note')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── HOW ORARY WORKS ──────────────────────────────────────────────── */}
      <section className="px-5 py-16 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">
            {t('australia88Page.howOrary.title')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {HOW_STEPS.map(({ icon: Icon, color, titleKey, descKey }, idx) => (
              <motion.div
                key={titleKey}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="flex gap-4 p-5 rounded-2xl border border-slate-100 bg-white shadow-sm"
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    {t(`australia88Page.howOrary.${titleKey}`)}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {t(`australia88Page.howOrary.${descKey}`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section className="px-5 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto rounded-3xl text-center px-6 py-14"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          }}
        >
          <motion.img
            src="/assets/SVG/logo-white.svg"
            alt="Orary"
            className="w-20 h-20 mx-auto mb-6 opacity-90"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.9 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            {t('australia88Page.cta.title')}
          </h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            {t('australia88Page.cta.subtitle')}
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-semibold text-white transition-all hover:scale-105 active:scale-100"
            style={{ backgroundColor: PINK, boxShadow: `0 4px 20px ${PINK}50` }}
          >
            {t('australia88Page.cta.button')}
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="px-5 py-8 border-t border-slate-100">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p className="text-center sm:text-left leading-relaxed max-w-lg">
            {t('australia88Page.footer.disclaimer')}
          </p>
          <div className="flex items-center gap-4 shrink-0">
            <Link to="/blog" className="hover:text-slate-600 transition-colors">
              Blogary
            </Link>
            <Link to="/faq" className="hover:text-slate-600 transition-colors">
              FAQ
            </Link>
            <Link to="/terms" className="hover:text-slate-600 transition-colors">
              {t('australia88Page.footer.terms')}
            </Link>
            <Link to="/privacy" className="hover:text-slate-600 transition-colors">
              {t('australia88Page.footer.privacy')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Australia88;
