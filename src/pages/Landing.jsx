// src/pages/Landing.jsx
// Public landing page at orary.app/
// Matches AuthLayout visually for a seamless landing → login transition

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Zap, ArrowRight } from 'lucide-react';

const PINK = '#EC4899';

const FEATURES = [
  { icon: Clock, label: 'Track Shifts', color: '#F59E0B' },
  { icon: TrendingUp, label: 'Analytics', color: '#6366F1' },
  { icon: Zap, label: 'Live Mode', color: PINK },
];

const Landing = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div
          className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: `${PINK} transparent transparent transparent` }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0">
      {/* Background video — identical to AuthLayout */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black opacity-50 z-10" />
        <video
          autoPlay loop muted playsInline
          className="absolute object-cover w-full h-full"
        >
          <source src="/assets/videos/sample_0.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content — same layout as AuthLayout */}
      <div className="fixed inset-0 z-20 flex flex-col items-center justify-center p-4 py-6 md:py-10 overflow-y-auto">

        {/* Logo & branding — identical structure to AuthLayout */}
        <motion.div
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
            />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-0.5">Orary</h1>
          <p className="text-sm md:text-base text-white/80 text-center">
            Work Shift Management &amp; Earnings Tracker
          </p>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-5 flex-shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium text-white/90"
              style={{ backgroundColor: `${f.color}20`, borderColor: `${f.color}40` }}
            >
              <f.icon size={12} style={{ color: f.color }} />
              {f.label}
            </div>
          ))}
        </motion.div>

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
            Get Started Free <ArrowRight size={16} />
          </Link>

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-gray-400 text-xs">already have an account?</span>
            </div>
          </div>

          <Link
            to="/login"
            className="block w-full text-center font-medium text-gray-700 py-3 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Sign in
          </Link>

          <p className="text-xs text-center text-gray-400 mt-4">
            Free for all workers worldwide · No credit card required
          </p>
        </motion.div>

        {/* Legal footer — identical to AuthLayout */}
        <div className="mt-4 flex-shrink-0 text-center">
          <p className="text-white/60 text-xs">
            By using Orary you agree to our{' '}
            <Link to="/privacy" className="text-white/90 underline hover:text-white">Privacy Policy</Link>
            {' '}and{' '}
            <Link to="/terms" className="text-white/90 underline hover:text-white">Terms of Service</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Landing;
