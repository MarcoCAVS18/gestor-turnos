// src/pages/FAQ.jsx
// Public SEO page — Frequently Asked Questions.
// Tab switcher: "About Orary" | "Australia — 88 days".
// Grid of individual FAQ cards (3-col desktop / 2-col tablet / 1-col mobile).
// Hardcoded English — i18n to be added later.
// Pre-rendered by scripts/prerender.js for Google indexing.

import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';

const PINK   = '#EC4899';
const INDIGO = '#6366F1';

// ── FAQ data ────────────────────────────────────────────────────────────────

const GENERAL_FAQS = [
  {
    q: 'What is Orary?',
    a: 'Orary is a free shift management and earnings tracking app for workers worldwide. Log work shifts, calculate hourly earnings automatically, track income statistics, and monitor your Australian Working Holiday Visa 88-day progress. Available on iOS, Android, and web.',
  },
  {
    q: 'Is Orary free to use?',
    a: 'Yes. All core features are completely free: shift tracking, automatic earnings calculation, live shift timer, delivery worker mode, and the Australian 88-day visa tracker. A Premium subscription unlocks dark theme, detailed analytics, PDF and Excel export, and priority support.',
  },
  {
    q: 'What types of workers can use Orary?',
    a: 'Hospitality and restaurant staff, retail employees, construction workers, healthcare workers, cleaners, warehouse workers, delivery riders, Uber Eats and DoorDash drivers, gig economy workers, and Working Holiday Visa holders doing farm or regional work in Australia, Canada, Ireland, New Zealand, and worldwide.',
  },
  {
    q: 'How does the earnings calculator work?',
    a: 'Enter a start time, end time, and hourly rate for each shift. Orary calculates gross earnings automatically. Define multiple jobs (Works) each with their own rate, assign any shift to any job, and watch totals accumulate across days, weeks, and months.',
  },
  {
    q: 'What is Live Mode?',
    a: "Live Mode is Orary's real-time shift timer. Tap Start when your shift begins — Orary tracks elapsed hours and live earnings updating every second. Tap Stop when you finish and the shift saves automatically. Ideal for casual workers who don't know in advance when their shift will end.",
  },
  {
    q: 'Does Orary support delivery and gig workers?',
    a: 'Yes. Orary has a dedicated Delivery mode for Uber Eats, DoorDash, Deliveroo, Menulog, and Rappi. Track earnings per session, assign sessions to different platforms, and compare income across all your gig jobs in one app.',
  },
  {
    q: 'Can I export my shift and earnings data?',
    a: 'Yes — with Orary Premium. Export complete shift history to Excel (XLSX) with monthly breakdowns, or to PDF with charts and analytics. Useful for tax returns, Working Holiday Visa applications, or personal financial records.',
  },
  {
    q: 'Does Orary work on iPhone and Android?',
    a: 'Yes. Orary runs as a web app at orary.app and as a native app for iOS (iPhone and iPad) and Android. Native apps include home screen shortcuts and system notifications.',
  },
];

const AUSTRALIA_FAQS = [
  {
    q: 'What is the 88-day rule in Australia?',
    a: 'Working Holiday Visa holders (subclass 417 and 462) must complete 88 days of specified work in a regional area during their first visa year to apply for a second-year extension. A third-year extension requires a further 88 days — 176 total — completed during the second visa year.',
  },
  {
    q: 'Are the 88 days calendar days or working days?',
    a: "Neither. The 88 days are visa-accredited days calculated from the hours you work each Monday–Sunday week, using an official formula set by the Australian Department of Home Affairs. Full-time work (35.25+ hours/week) earns 7 visa days that week. Fewer hours earns fewer days. They are not the number of calendar days you physically spent at work.",
  },
  {
    q: 'How many hours per week do I need to earn visa days?',
    a: 'Minimum 4 hours in a Monday–Sunday week to earn 1 visa day. Full formula: 4–7.24 h = 1 day · 7.25–14.24 h = 2 days · 14.25–21.24 h = 3 days · 21.25–28.24 h = 4 days · 28.25–35.24 h = 5 days · 35.25 h or more = 7 days. Less than 4 hours in a week earns zero visa days.',
  },
  {
    q: 'What counts as specified work for the 88 days?',
    a: "Plant and animal cultivation (fruit picking, harvesting, pruning, farm work), fishing and pearling, tree farming and felling, mining, construction, bushfire and flood recovery work. Since 2023, certain tourism and hospitality work in specified regional areas also qualifies. Always verify current categories at immi.homeaffairs.gov.au.",
  },
  {
    q: 'Which Australian states and regions count?',
    a: "All of Northern Territory, South Australia, and Tasmania. All of regional Queensland (excluding Greater Brisbane), regional Western Australia (excluding Perth metro), regional New South Wales (excluding Sydney, Newcastle, Wollongong), and regional Victoria (excluding Melbourne). Specific postcodes are published by the Department of Home Affairs.",
  },
  {
    q: 'Can I work for multiple employers to accumulate days?',
    a: "Yes. Days from different qualifying employers accumulate. You can switch employers, regions, or job types as long as each role is in an approved specified-work category and regional area. Keep all payslips and employer declarations (Form 1263) as evidence for your second-year application.",
  },
  {
    q: 'Subclass 417 vs subclass 462 — what is the difference?',
    a: "Subclass 417 is for passport holders from the UK, Ireland, Canada, France, Germany, Italy, Netherlands, South Korea, Japan, and others. Subclass 462 is for the USA, China, India, Vietnam, Thailand, Argentina, Chile, and others. Both require 88 days of specified regional work for a second year and 176 days total for a third year, but eligible work categories and age limits may vary by country.",
  },
  {
    q: 'How many days do I need for a third year in Australia?',
    a: "After completing your first 88 days (second-year extension), complete a further 88 days of specified work — 176 days total — during your second visa year to become eligible for a third-year Working Holiday Visa. The same weekly formula applies throughout.",
  },
  {
    q: 'What is the minimum to earn any visa days at all?',
    a: "You must work at least 4 hours within a single Monday–Sunday week to earn even 1 visa day. Any week with fewer than 4 hours contributes zero days to your total, even if you worked on multiple days that week. Tracking weekly hours consistently is essential, especially during casual or irregular work periods.",
  },
  {
    q: 'Does Orary automatically track my 88-day progress?',
    a: "Yes. Orary groups your logged shifts into Monday–Sunday weeks, applies the government visa-day formula to each week, and accumulates your total. Your dashboard shows a real-time progress bar toward 88 days (second-year eligibility) and 176 days (third-year eligibility). No manual counting needed.",
  },
  {
    q: 'Can casual or part-time farm work count toward the 88 days?',
    a: "Yes. Casual and part-time hours count as long as the work is in a qualifying specified-work category and approved regional area. A worker doing 20 hours/week earns 4 visa days that week. Consistent part-time work over many weeks accumulates just as effectively as full-time.",
  },
  {
    q: 'What if I do not complete the 88 days before my visa expires?',
    a: "If your first Working Holiday Visa expires before you reach 88 visa-accredited days, you cannot apply for the standard second-year extension based on regional work. Other visa options may exist depending on your circumstances. Tracking progress from your very first shift helps ensure you meet the requirement before expiry.",
  },
];

// ── JSON-LD FAQPage schema ───────────────────────────────────────────────────

const FAQ_JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [...GENERAL_FAQS, ...AUSTRALIA_FAQS].map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
});

// ── FAQ card ─────────────────────────────────────────────────────────────────
// Answer is always in the DOM (height: 0 when closed) so Puppeteer pre-render
// captures the full text and Google indexes all content.

function FAQCard({ question, answer, accentColor }) {
  const [open, setOpen] = useState(false);
  const answerRef = useRef(null);

  return (
    <div
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => setOpen(o => !o)}
    >
      {/* Accent bar */}
      <div
        className="h-0.5 w-full transition-colors duration-200"
        style={{ backgroundColor: open ? accentColor : '#e2e8f0' }}
      />

      <div className="p-5">
        {/* Question row */}
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-slate-800 leading-snug flex-1">
            {question}
          </p>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 mt-0.5"
          >
            <ChevronDown size={15} style={{ color: open ? accentColor : '#94a3b8' }} />
          </motion.div>
        </div>

        {/* Answer — always in DOM, height animated via CSS grid trick */}
        <div
          className="grid transition-all duration-200 ease-in-out"
          style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            <p
              ref={answerRef}
              className="text-sm text-slate-500 leading-relaxed mt-3 pt-3 border-t border-slate-100"
            >
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  { id: 'orary',     label: 'About Orary',                         shortLabel: 'Orary',       color: PINK,   faqs: GENERAL_FAQS   },
  { id: 'australia', label: 'Australia Working Holiday — 88 days',  shortLabel: '88 days AU',  color: INDIGO, faqs: AUSTRALIA_FAQS },
];

// ── Main component ───────────────────────────────────────────────────────────

const FAQ = () => {
  const [activeTab, setActiveTab] = useState('orary');
  const currentTab = TABS.find(t => t.id === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 font-poppins">
      <Helmet>
        <title>FAQ — Orary Shift Tracker & Australia 88-Day Working Holiday Visa</title>
        <meta
          name="description"
          content="Answers to the most common questions about Orary shift tracking, earnings calculation, and the Australian Working Holiday Visa 88-day regional work requirement for subclass 417 and 462."
        />
        <link rel="canonical" href="https://orary.app/faq" />
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content="https://orary.app/faq" />
        <meta property="og:title"       content="FAQ — Orary & Australia 88-Day Working Holiday Visa" />
        <meta property="og:description" content="Common questions about shift tracking, earnings calculation, and the Australian 88-day Working Holiday Visa rule for subclass 417 and 462." />
        <meta property="og:image"       content="https://orary.app/assets/images/logo2.png" />
        <script type="application/ld+json">{FAQ_JSON_LD}</script>
      </Helmet>

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-10 border-b border-white/10"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}
      >
        <div className="flex items-center justify-between px-5 xl:px-10 py-3.5 max-w-screen-xl mx-auto">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/assets/SVG/logo-white.svg" alt="Orary" className="w-7 h-7" />
            <span className="text-white font-bold text-base">Orary</span>
          </Link>
          <Link
            to="/register"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: PINK }}
          >
            Get started free <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* ── Hero + tabs ───────────────────────────────────────────────────── */}
      <div
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}
        className="px-5 xl:px-10 pt-10 pb-0"
      >
        <div className="max-w-screen-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-8"
          >
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 tracking-wide uppercase"
              style={{ backgroundColor: 'rgba(236,72,153,0.2)', color: '#f9a8d4' }}
            >
              Help & FAQ
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Frequently Asked Questions
            </h1>
          </motion.div>

          {/* Tab bar */}
          <div className="flex justify-center">
            <div className="flex bg-white/10 backdrop-blur-sm rounded-t-2xl overflow-hidden">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="relative px-6 sm:px-10 py-3.5 text-sm font-semibold transition-colors"
                    style={{
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                      backgroundColor: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="tab-underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5"
                        style={{ backgroundColor: tab.color }}
                      />
                    )}
                    <span className="sm:hidden">{tab.shortLabel}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Card grid ────────────────────────────────────────────────────── */}
      <div className="px-5 xl:px-10 py-10 max-w-screen-xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {/* Count label */}
            <p className="text-xs text-slate-400 font-medium mb-6 flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: currentTab.color }}
              />
              {currentTab.faqs.length} questions
            </p>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {currentTab.faqs.map((item, i) => (
                <motion.div
                  key={`${activeTab}-${i}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                >
                  <FAQCard
                    question={item.q}
                    answer={item.a}
                    accentColor={currentTab.color}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── CTA banner ───────────────────────────────────────────────────── */}
      <div className="px-5 xl:px-10 pb-14 max-w-screen-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl text-center px-6 py-12"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}
        >
          <img
            src="/assets/SVG/logo-white.svg"
            alt="Orary"
            className="w-14 h-14 mx-auto mb-5 opacity-90"
          />
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Ready to track your shifts automatically?
          </h2>
          <p className="text-slate-400 text-sm mb-7 max-w-sm mx-auto">
            Free for all workers. No credit card required. Start logging shifts and tracking your 88-day progress in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white transition-all hover:scale-105"
              style={{ backgroundColor: PINK, boxShadow: `0 4px 20px ${PINK}50` }}
            >
              Get started free <ArrowRight size={15} />
            </Link>
            <Link
              to="/australia-88"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white border border-white/20 hover:bg-white/10 transition-all"
            >
              88-day tracker
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="px-5 xl:px-10 py-6 border-t border-slate-200">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            Visa information is provided for guidance only. Always verify requirements at{' '}
            <a
              href="https://immi.homeaffairs.gov.au"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-600 transition-colors"
            >
              immi.homeaffairs.gov.au
            </a>.
          </p>
          <div className="flex items-center gap-4 shrink-0">
            <Link to="/australia-88" className="hover:text-slate-600 transition-colors">88-day tracker</Link>
            <Link to="/terms"        className="hover:text-slate-600 transition-colors">Terms</Link>
            <Link to="/privacy"      className="hover:text-slate-600 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FAQ;
