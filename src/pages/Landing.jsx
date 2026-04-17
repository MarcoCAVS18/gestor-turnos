// src/pages/Landing.jsx
// Public landing page at orary.app/
// Full-screen on mobile (no scroll needed). Pre-rendered for SEO.

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Zap, ArrowRight, Bike } from 'lucide-react';
import New from '../components/ui/New';

const PINK = '#db2777'; // pink-600: 4.6:1 contrast ratio with white (WCAG AA)

const JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Orary',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'iOS, Android, Web',
  url: 'https://orary.app',
  description:
    'Free shift management and earnings tracking app for workers worldwide. Track work hours, calculate pay automatically, manage delivery shifts, and monitor Australian Working Holiday Visa 88-day progress.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  featureList: [
    'Shift tracking and scheduling',
    'Automatic earnings calculation',
    'Live shift timer',
    'Delivery and gig worker support',
    'Australian Working Holiday Visa 88-day tracker',
    'Income analytics and statistics',
    'Export reports to Excel and PDF',
  ],
  screenshot: 'https://orary.app/assets/images/logo2.png',
});

const Landing = () => {
  const { t } = useTranslation();
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const [videoReady, setVideoReady] = useState(false);

  const topFeatures = [
    { icon: Clock,       label: t('landing.features.trackShifts'), color: '#F59E0B' },
    { icon: TrendingUp,  label: t('landing.features.analytics'),   color: '#6366F1' },
    { icon: Zap,         label: t('landing.features.liveMode'),     color: PINK },
  ];

  const bottomFeatures = [
    {
      icon: Bike,
      label: t('landing.features.delivery'),
      color: '#10B981',
      isEmoji: false,
    },
    {
      icon: () => <span className="text-xs leading-none">AU</span>,
      label: t('landing.features.australia88'),
      color: '#FFD700',
      isEmoji: true,
      isNew: true,
      linkTo: '/australia-88',
    },
  ];

  useEffect(() => {
    if (!loading && currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center gap-4">
        <div className="bg-white rounded-full p-4 shadow-lg animate-pulse">
          <img src="/assets/SVG/logo.svg" alt="Orary" className="h-14 w-14" />
        </div>
        <p className="text-white/50 text-sm font-medium tracking-wide">Orary</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0">
      <Helmet>
        <title>Orary — Free Shift Tracker &amp; Earnings Calculator</title>
        <meta
          name="description"
          content="Free shift management app for workers worldwide. Track hours, calculate pay automatically, manage delivery shifts, and monitor your Australian 88-day Working Holiday Visa. No credit card required."
        />
        <link rel="canonical" href="https://orary.app/" />

        {/* hreflang — same URL serves EN / ES / FR */}
        <link rel="alternate" hreflang="en"       href="https://orary.app/" />
        <link rel="alternate" hreflang="es"       href="https://orary.app/" />
        <link rel="alternate" hreflang="fr"       href="https://orary.app/" />
        <link rel="alternate" hreflang="x-default" href="https://orary.app/" />

        {/* Open Graph */}
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content="https://orary.app/" />
        <meta property="og:title"       content="Orary — Free Shift Tracker & Earnings Calculator" />
        <meta property="og:description" content="Track work shifts, calculate earnings automatically, and monitor your Australian 88-day Working Holiday Visa. Free for workers in Australia, Canada, Ireland and worldwide." />
        <meta property="og:image"       content="https://orary.app/assets/images/logo2.png" />
        <meta property="og:site_name"   content="Orary" />

        {/* Twitter Card */}
        <meta name="twitter:card"        content="summary" />
        <meta name="twitter:title"       content="Orary — Free Shift Tracker & Earnings Calculator" />
        <meta name="twitter:description" content="Track shifts, calculate earnings, and monitor your Australian 88-day Working Holiday Visa. Free for workers worldwide." />
        <meta name="twitter:image"       content="https://orary.app/assets/images/logo2.png" />

        {/* JSON-LD structured data */}
        <script type="application/ld+json">{JSON_LD}</script>
      </Helmet>

      {/* Background video */}
      <div className="absolute inset-0 z-0 bg-slate-900">
        <div className="absolute inset-0 bg-black opacity-50 z-10" />
        <video
          autoPlay loop muted playsInline
          preload="none"
          onCanPlay={() => setVideoReady(true)}
          className={`absolute object-cover w-full h-full transition-opacity duration-700 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src="/assets/videos/sample_0.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content — vertically centered, fits mobile viewport */}
      <main className="fixed inset-0 z-20 flex flex-col items-center justify-center px-4 py-4 overflow-y-auto">

        {/* ── Logo & branding ── */}
        <motion.header
          className="flex flex-col items-center mb-4 flex-shrink-0"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-full p-3 shadow-md mb-2">
            <img
              src="/assets/SVG/logo.svg"
              alt="Orary app logo"
              className="h-10 w-10 md:h-12 md:w-12"
              fetchpriority="high"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-0.5">
            {t('landing.brandName')}
          </h1>
          <p className="text-sm md:text-base text-white/80 text-center font-medium">
            {t('landing.tagline')}
          </p>
          {/* SEO description — visible and indexed, compact on mobile */}
          <p className="text-xs text-white/70 text-center mt-1 max-w-xs leading-snug">
            {t('landing.description')}
          </p>
        </motion.header>

        {/* ── Feature pills ── */}
        <motion.section
          aria-label="Features"
          className="flex flex-col items-center gap-1.5 mb-4 flex-shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="sr-only">
            Orary features: shift tracking, earnings calculator, live timer, delivery worker support, Australian Working Holiday Visa 88-day tracker
          </h2>

          {/* Top row */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {topFeatures.map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium text-white/90"
                style={{ backgroundColor: `${f.color}20`, borderColor: `${f.color}40` }}
              >
                <f.icon size={11} style={{ color: f.color }} />
                {f.label}
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {bottomFeatures.map((f) => {
              const inner = (
                <div
                  className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium text-white/90"
                  style={{ backgroundColor: `${f.color}20`, borderColor: `${f.color}40` }}
                >
                  {f.isEmoji
                    ? <f.icon />
                    : <f.icon size={11} style={{ color: f.color }} />
                  }
                  {f.label}
                  {f.isNew && (
                    <div className="absolute -top-1.5 -right-5 transform rotate-12 translate-x-0.5">
                      <New size="xs" animated={false}>NEW</New>
                    </div>
                  )}
                </div>
              );

              return f.linkTo ? (
                <Link key={f.label} to={f.linkTo} className="hover:opacity-80 transition-opacity">
                  {inner}
                </Link>
              ) : (
                <div key={f.label}>{inner}</div>
              );
            })}
          </div>
        </motion.section>

        {/* ── CTA card ── */}
        <motion.div
          className="bg-white rounded-xl p-4 md:p-5 w-full max-w-sm shadow-2xl flex-shrink-0"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45 }}
        >
          <Link
            to="/register"
            className="flex items-center justify-center gap-2 w-full font-semibold text-white py-2.5 rounded-lg text-sm mb-2.5 transition-opacity hover:opacity-90"
            style={{ backgroundColor: PINK }}
          >
            {t('landing.getStartedFree')} <ArrowRight size={15} />
          </Link>

          <div className="relative my-2.5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-gray-400 text-xs">
                {t('landing.alreadyHaveAccount')}
              </span>
            </div>
          </div>

          <Link
            to="/login"
            className="block w-full text-center font-medium text-gray-700 py-2.5 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {t('landing.signIn')}
          </Link>

          <p className="text-xs text-center text-gray-500 mt-3">
            {t('landing.freeWorldwide')}
          </p>
        </motion.div>

        {/* ── Legal footer ── */}
        <footer className="mt-3 flex-shrink-0 text-center space-y-1.5">
          <p className="text-white/75 text-xs leading-relaxed">
            {t('landing.legalAgreement')}{' '}
            <Link to="/privacy" className="text-white/80 underline hover:text-white">
              {t('landing.privacyPolicy')}
            </Link>
            {' '}{t('landing.and')}{' '}
            <Link to="/terms" className="text-white/80 underline hover:text-white">
              {t('landing.termsOfService')}
            </Link>
          </p>
          <p className="text-white/60 text-xs">
            <Link to="/australia-88" className="hover:text-white/90 transition-colors">88-day visa tracker</Link>
            <span className="mx-2 opacity-50">·</span>
            <Link to="/faq" className="hover:text-white/90 transition-colors">FAQ</Link>
          </p>
        </footer>

      </main>
    </div>
  );
};

export default Landing;
