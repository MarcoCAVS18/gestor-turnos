// src/pages/Landing.jsx
// Public landing page at orary.app/
// Full-screen on mobile (no scroll needed). Pre-rendered for SEO.

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, ArrowRight } from 'lucide-react';
import New from '../components/ui/New';

const PINK = '#db2777'; // pink-600: 4.6:1 contrast ratio with white (WCAG AA)

// Localized SEO metadata — /es and /fr are separate indexable URLs so Google
// can rank Orary for Spanish/French queries (same-URL hreflang is ignored).
const SEO_META = {
  en: {
    url: 'https://orary.app/',
    title: 'Orary — Free Shift Tracker & Earnings Calculator',
    description: 'Free shift management app for workers worldwide. Track hours, calculate pay automatically, manage delivery shifts, and upload payslips to auto-load past shifts. No credit card required.',
    ogDescription: 'Track work shifts, calculate earnings automatically, and manage delivery income. Free for workers everywhere — with Working Holiday Visa tracking for AU, NZ, CA, IE and more.',
    jsonLdDescription: 'Free shift management and earnings tracking app for workers worldwide. Track work hours, calculate pay automatically, manage delivery shifts, auto-detect payslip data, and monitor Working Holiday Visa progress.',
  },
  es: {
    url: 'https://orary.app/es',
    title: 'Orary — Control de Turnos y Calculadora de Sueldo Gratis',
    description: 'App gratuita para gestionar turnos de trabajo. Registra tus horas, calcula tu sueldo automáticamente, controla tus ganancias de delivery y los 88 días de la Working Holiday Visa de Australia. Sin tarjeta de crédito.',
    ogDescription: 'Registra tus turnos, calcula tus ganancias automáticamente y controla los 88 días de tu Working Holiday Visa en Australia. Gratis para trabajadores de todo el mundo.',
    jsonLdDescription: 'App gratuita de gestión de turnos y control de ganancias para trabajadores. Registra horas de trabajo, calcula el sueldo automáticamente, gestiona turnos de delivery y controla los 88 días de la Working Holiday Visa de Australia.',
  },
  fr: {
    url: 'https://orary.app/fr',
    title: 'Orary — Suivi des Horaires de Travail et Calcul de Salaire Gratuit',
    description: 'Application gratuite de gestion des horaires de travail. Suivez vos heures, calculez votre salaire automatiquement, gérez vos gains de livraison et vos 88 jours de Working Holiday Visa en Australie. Sans carte bancaire.',
    ogDescription: 'Suivez vos horaires de travail, calculez vos gains automatiquement et suivez vos 88 jours de Working Holiday Visa en Australie. Gratuit pour les travailleurs du monde entier.',
    jsonLdDescription: 'Application gratuite de gestion des horaires et de suivi des revenus pour les travailleurs. Suivez vos heures de travail, calculez votre salaire automatiquement, gérez vos livraisons et suivez vos 88 jours de Working Holiday Visa en Australie.',
  },
};

const buildJsonLd = (lang) => JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Orary',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'iOS, Android, Web',
  url: SEO_META[lang].url,
  inLanguage: lang,
  description: SEO_META[lang].jsonLdDescription,
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

const Landing = ({ lang }) => {
  const { t, i18n } = useTranslation();

  // Force the page language on /es and /fr so content and meta match the URL.
  // Guarded so it only runs when needed — resources are bundled, so the switch
  // resolves synchronously (important for prerendering).
  if (lang && i18n.resolvedLanguage !== lang) {
    i18n.changeLanguage(lang);
  }

  const meta = SEO_META[lang] || SEO_META.en;
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const [videoReady, setVideoReady] = useState(false);

  // Just the three real differentiators — earnings calculator, live timer and
  // the 88-day visa tracker (the moat). The full feature list stays in the
  // sr-only <h2> below so SEO keyword coverage is unaffected.
  const topFeatures = [
    { icon: TrendingUp,  label: t('landing.features.analytics'),   color: '#6366F1' },
    { icon: Zap,         label: t('landing.features.liveMode'),     color: PINK },
  ];

  const bottomFeatures = [
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
        <html lang={lang || 'en'} />
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={meta.url} />

        {/* hreflang — each language has its own indexable URL */}
        <link rel="alternate" hreflang="en"        href="https://orary.app/" />
        <link rel="alternate" hreflang="es"        href="https://orary.app/es" />
        <link rel="alternate" hreflang="fr"        href="https://orary.app/fr" />
        <link rel="alternate" hreflang="x-default" href="https://orary.app/" />

        {/* Open Graph */}
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={meta.url} />
        <meta property="og:title"       content={meta.title} />
        <meta property="og:description" content={meta.ogDescription} />
        <meta property="og:image"       content="https://orary.app/assets/images/logo2.png" />
        <meta property="og:site_name"   content="Orary" />

        {/* Twitter Card */}
        <meta name="twitter:card"        content="summary" />
        <meta name="twitter:title"       content={meta.title} />
        <meta name="twitter:description" content={meta.ogDescription} />
        <meta name="twitter:image"       content="https://orary.app/assets/images/logo2.png" />

        {/* JSON-LD structured data */}
        <script type="application/ld+json">{buildJsonLd(lang || 'en')}</script>
      </Helmet>

      {/* Background video */}
      <div className="absolute inset-0 z-0 bg-slate-900">
        <div className="absolute inset-0 bg-black opacity-50 z-10" />
        <video
          autoPlay
          loop
          muted
          defaultMuted
          playsInline
          controls={false}
          disablePictureInPicture
          preload="auto"
          onCanPlay={(e) => { setVideoReady(true); e.currentTarget.play().catch(() => {}); }}
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
            <Link to="/blog" className="hover:text-white/90 transition-colors">Blog</Link>
            <span className="mx-2 opacity-50">·</span>
            <Link to="/faq" className="hover:text-white/90 transition-colors">FAQ</Link>
          </p>
        </footer>

      </main>
    </div>
  );
};

export default Landing;
