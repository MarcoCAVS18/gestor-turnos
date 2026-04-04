// src/pages/Landing.jsx
// Public landing page at orary.app/
// Matches AuthLayout visually for a seamless landing → login transition

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Zap, ArrowRight, Bike } from 'lucide-react';
import New from '../components/ui/New';

const PINK = '#EC4899';

const Landing = () => {
  const { t } = useTranslation();
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const [videoReady, setVideoReady] = useState(false);

  const topFeatures = [
    { icon: Clock, label: t('landing.features.trackShifts'), color: '#F59E0B' },
    { icon: TrendingUp, label: t('landing.features.analytics'), color: '#6366F1' },
    { icon: Zap, label: t('landing.features.liveMode'), color: PINK },
  ];

  const bottomFeatures = [
    { icon: Bike, label: t('landing.features.delivery'), color: '#10B981' },
    { icon: () => <span className="text-base">🇦🇺</span>, label: t('landing.features.australia88'), color: '#FFD700', isEmoji: true, isNew: true },
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
        <title>Orary - Shift Management &amp; Earnings Tracker</title>
        <meta name="description" content="Track your work shifts, calculate earnings automatically, and analyze your income with detailed statistics. Free shift management app for workers in Australia and worldwide." />
      </Helmet>
      {/* Background video — identical to AuthLayout */}
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

      {/* Content — same layout as AuthLayout */}
      <main className="fixed inset-0 z-20 flex flex-col items-center justify-center p-4 py-6 md:py-10 overflow-y-auto">

        {/* Logo & branding — identical structure to AuthLayout */}
        <motion.header
          className="flex flex-col items-center mb-5 flex-shrink-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-full p-3 md:p-4 shadow-md mb-2 md:mb-3">
            <img
              src="/assets/SVG/logo.svg"
              alt="Orary"
              className="h-10 w-10 md:h-14 md:w-14"
              fetchpriority="high"
            />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-0.5">{t('landing.brandName')}</h1>
          <p className="text-sm md:text-base text-white/80 text-center">
            {t('landing.tagline')}
          </p>
        </motion.header>

        {/* Feature pills - Two rows */}
        <motion.section
          aria-label="Features"
          className="flex flex-col items-center gap-2 mb-5 flex-shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="sr-only">Key features of Orary</h2>
          {/* Top row */}
          <div className="flex flex-wrap justify-center gap-2">
            {topFeatures.map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium text-white/90"
                style={{ backgroundColor: `${f.color}20`, borderColor: `${f.color}40` }}
              >
                <f.icon size={12} style={{ color: f.color }} />
                {f.label}
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div className="flex flex-wrap justify-center gap-2">
            {bottomFeatures.map((f) => (
              <div
                key={f.label}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium text-white/90"
                style={{ backgroundColor: `${f.color}20`, borderColor: `${f.color}40` }}
              >
                {f.isEmoji ? (
                  <f.icon />
                ) : (
                  <f.icon size={12} style={{ color: f.color }} />
                )}
                {f.label}
                {f.isNew && (
                  <div className="absolute -top-1.5 -right-5 transform rotate-12 translate-x-0.5">
                    <New size="xs" animated={false}>NEW</New>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* CTA card — same shape/shadow as the AuthLayout form card */}
        <motion.div
          className="bg-white rounded-xl p-5 md:p-6 w-full max-w-md shadow-2xl flex-shrink-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45 }}
        >
          <Link
            to="/register"
            className="flex items-center justify-center gap-2 w-full font-semibold text-white py-3 rounded-lg text-sm mb-3 transition-opacity hover:opacity-90"
            style={{ backgroundColor: PINK }}
          >
            {t('landing.getStartedFree')} <ArrowRight size={16} />
          </Link>

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-gray-400 text-xs">{t('landing.alreadyHaveAccount')}</span>
            </div>
          </div>

          <Link
            to="/login"
            className="block w-full text-center font-medium text-gray-700 py-3 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {t('landing.signIn')}
          </Link>

          <p className="text-xs text-center text-gray-400 mt-4">
            {t('landing.freeWorldwide')}
          </p>
        </motion.div>

        {/* Legal footer */}
        <footer className="mt-4 flex-shrink-0 text-center">
          <p className="text-white/60 text-xs">
            {t('landing.legalAgreement')}{' '}
            <Link to="/privacy" className="text-white/90 underline hover:text-white">{t('landing.privacyPolicy')}</Link>
            {' '}{t('landing.and')}{' '}
            <Link to="/terms" className="text-white/90 underline hover:text-white">{t('landing.termsOfService')}</Link>
          </p>
        </footer>

      </main>
    </div>
  );
};

export default Landing;
