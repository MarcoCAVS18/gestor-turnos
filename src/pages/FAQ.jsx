// src/pages/FAQ.jsx
// Public SEO page — Frequently Asked Questions.
// Tab switcher: "About Orary" | "Australia — 88 days".
// Grid of individual FAQ cards (3-col desktop / 2-col tablet / 1-col mobile).
// Hardcoded English — i18n to be added later.
// Pre-rendered by scripts/prerender.js for Google indexing.

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Accordion from '../components/ui/Accordion';

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
    q: 'Can I set a different tax rate for each job?',
    a: "Yes. In Settings, under Payment and Tax Configuration, set a default discount percentage applied to all shifts, or expand \"Configure per job\" to give any job its own rate — useful when your jobs withhold tax differently, or when you have both a casual and a full-time job. If you upload a payslip, Orary also compares the tax rate it implies against what you have configured and offers to update it with one tap when they don't match.",
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
    q: 'Can Orary estimate my income tax and refund?',
    a: 'Yes. Upload a payslip PDF and Orary reads your gross pay and tax, then estimates your annual income tax and any potential refund using the official tax brackets for Australia (ATO), New Zealand (IRD), the United Kingdom (HMRC) and Ireland (Revenue). Estimates cover income tax only — not Medicare or ACC levies, National Insurance, USC, PRSI or other deductions — so always confirm with the official tax office (myTax, myIR, your HMRC Personal Tax Account or Revenue myAccount).',
  },
  {
    q: 'Does Orary calculate mileage deductions for delivery work?',
    a: 'Yes. Log the kilometres you ride or drive in each delivery session and Orary estimates your mileage tax deduction using the official per-kilometre rates for Australia (ATO), New Zealand (IRD), the United Kingdom (HMRC), Canada (CRA), the United States (IRS), and Ireland (Revenue). The estimate appears in your delivery statistics so you can keep a running total for tax time. Rates are indicative — confirm the current figures with your tax office.',
  },
  {
    q: 'Does Orary work on iPhone and Android?',
    a: 'Yes. Orary runs as a web app at orary.app and as a native app for iOS (iPhone and iPad) and Android. Native apps include home screen shortcuts and system notifications.',
  },
  {
    q: 'Where do I find Payslips, Delivery stats, and Settings on mobile?',
    a: 'Tap the More tab in the bottom navigation bar. It groups everything beyond your daily flow: Statistics (summaries, payslips, and delivery analytics), your account (settings, subscription, and integrations), and help resources. On desktop, the sidebar shows all sections directly.',
  },
  {
    q: 'What summaries does Orary provide?',
    a: 'Under Statistics you get three summaries: Your hours shows total hours worked each month against a monthly target derived from your weekly goal, with week-by-week compliance; the weekly summary includes charts, comparisons, and daily distribution; and the Premium monthly summary adds monthly totals, month-over-month comparison, and a six-month earnings trend. On mobile they live under the More tab; on desktop, in the sidebar.',
  },
  {
    q: 'How are payslips organized?',
    a: 'Payslips are split into two views. Documents is where you upload PDF payslips (or add them manually), edit detected values, and generate shifts from pay periods. Calculations is a read-only view with each payslip summary, the per-period breakdown, and fiscal-year projections for your estimated tax refund.',
  },
  {
    q: 'Does Orary check my payslip against my logged shifts?',
    a: "Yes. Whenever a payslip has a valid pay period, Orary compares it day by day against your logged shifts and shows a coverage status — fully logged, some days missing, or none logged yet — plus a check on whether the total hours match. If some days are missing, you can fill just those gaps with one click, using the same weekday-and-time pattern as the existing 'generate shifts from payslip' tool, instead of the whole period.",
  },
  {
    q: 'Does Orary send reminders and notifications?',
    a: 'Yes, on the iOS and Android apps. Orary can send an optional daily reminder to log your shifts (you choose the time in Settings), a heads-up before each upcoming shift, and milestone alerts as you approach your Australian Working Holiday Visa 88-day goal. All notifications are opt-in and managed from Settings.',
  },
  {
    q: 'Does Orary work without signal?',
    a: "Yes. Once you have opened Orary with a connection, it opens without one too, on the apps and on the website. Shifts and jobs you add or edit offline are saved on your device straight away and sync automatically when you are back online. A banner tells you when you are offline. Signing in for the first time, payments and payslip uploads still need a connection.",
  },
  {
    q: 'What happens when I archive a job?',
    a: "Archiving hides a job you no longer work at from the list you pick from when adding a shift, without deleting anything. All of its shifts keep counting in your statistics, exports and Working Holiday Visa tracker, and you can restore it at any time from the Archived section on the Jobs page. Deleting a job, by contrast, also deletes all of its shifts.",
  },
];

const AUSTRALIA_FAQS = [
  {
    q: 'What is the 88-day rule in Australia?',
    a: 'Working Holiday Visa holders (subclass 417 and 462) must complete 88 days of specified work in a regional area during their first visa year to apply for a second-year extension. A third year is a separate count: 6 months (179 days) of specified work done during your second visa. First-year days don\'t carry over.',
  },
  {
    q: 'Are the 88 days calendar days or working days?',
    a: "A bit of both. Home Affairs asks for as many normal work days as a full-time worker in your industry would do in 88 calendar days. A full-time week (5 or more days at the industry's full-time hours, commonly 38) counts all 7 calendar days, weekend included. Part-time and casual work count only the days you actually worked, and a long day never counts as two.",
  },
  {
    q: 'How many hours per week do I need to earn visa days?',
    a: "There is no official hours-per-week table. A week counts as 7 visa days when you work 5 or more days and at least the industry's full-time hours (commonly 38). Below that, each day you worked counts once at most, in proportion to a standard day (7.6 h by default): four 9-hour days are 4 visa days, three 4-hour days are about 1.6.",
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
    a: "Subclass 417 is for passport holders from the UK, Ireland, Canada, France, Germany, Italy, Netherlands, South Korea, Japan, and others. Subclass 462 is for the USA, China, India, Vietnam, Thailand, Argentina, Chile, and others. Both need 88 days of specified work for a second year and 6 months (179 days, done on the second visa) for a third, but eligible work categories and age limits vary by country.",
  },
  {
    q: 'How many days do I need for a third year in Australia?',
    a: "6 months of specified work, which Home Affairs counts as 179 days, done while you're on your second visa. It's a fresh count: the 88 days from your first year don't add to it. The same counting rules apply.",
  },
  {
    q: 'Are second and third year visas going to a ballot?',
    a: "It's been announced, not passed. In September 2026 the government said second and third visas would move to a capped ballot (45,000 places for year two, 5,000 for year three). It needs legislation and there's no start date, so for now you apply as usual. You'll still need your 88 days or 6 months to enter the ballot.",
  },
  {
    q: 'What is the minimum to earn any visa days at all?',
    a: "There is no fixed weekly minimum. Every day of specified work counts, in proportion to a standard day: a 3.8-hour day is half a day. What doesn't count is time off: unpaid days, including days lost to bad weather, add nothing. Paid public holidays and paid sick leave do count.",
  },
  {
    q: 'Does Orary automatically track my 88-day progress?',
    a: "Yes. Orary groups your logged shifts into Monday–Sunday weeks, counts each one with the rules above using your paid hours (unpaid breaks deducted), and accumulates your total. Only shifts you have already worked count, not rostered ones. Your dashboard shows a real-time progress bar toward 88 days (second year) or, once you switch to year two, 179 days (third year). No manual counting needed.",
  },
  {
    q: 'Can casual or part-time farm work count toward the 88 days?',
    a: "Yes. Casual and part-time hours count as long as the work is in a qualifying specified-work category and approved regional area. Four 5-hour days earn about 2.6 visa days that week (4 × 5 ÷ 7.6). Part-time work counts, it just takes longer to reach 88.",
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

// ── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  { id: 'orary',     label: 'About Orary',                         shortLabel: 'Orary',       color: PINK,   faqs: GENERAL_FAQS   },
  { id: 'australia', label: 'Australia Working Holiday — 88 days',  shortLabel: '88 days AU',  color: INDIGO, faqs: AUSTRALIA_FAQS },
];

// ── Main component ───────────────────────────────────────────────────────────

const FAQ = () => {
  const [activeTab, setActiveTab] = useState('orary');
  const currentTab = TABS.find(t => t.id === activeTab);
  const location = useLocation();
  const { t: tApp } = useTranslation();
  // Visita interna desde el hub móvil "Más": el CTA de registro se reemplaza
  // por un retorno a la app. En el prerender no hay location.state, así que
  // la versión indexada por Google no cambia.
  const fromApp = location.state?.fromApp === true;

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
          {fromApp ? (
            <Link
              to="/more"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-80"
              style={{ backgroundColor: PINK }}
            >
              <ArrowLeft size={13} /> {tApp('more.backToApp')}
            </Link>
          ) : (
            <Link
              to="/register"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-80"
              style={{ backgroundColor: PINK }}
            >
              Get started free <ArrowRight size={13} />
            </Link>
          )}
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
                  <Accordion title={item.q} accentColor={currentTab.color}>
                    {item.a}
                  </Accordion>
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
            <Link to="/blog"         className="hover:text-slate-600 transition-colors">Blogary</Link>
            <Link to="/terms"        className="hover:text-slate-600 transition-colors">Terms</Link>
            <Link to="/privacy"      className="hover:text-slate-600 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FAQ;
