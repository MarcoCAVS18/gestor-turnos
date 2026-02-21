// src/components/premium/SuccessCelebration.jsx

import React from 'react';
import { Crown, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { PREMIUM_COLORS } from '../../contexts/PremiumContext';
import PageHeader from '../layout/PageHeader';
import { CONFETTI_COLORS } from './constants';

const ConfettiParticle = ({ delay, left, color, size = 8 }) => (
  <motion.div
    initial={{ y: -10, opacity: 0, rotate: 0 }}
    animate={{
      y: [0, -50, 280],
      x: [0, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 120],
      opacity: [0, 1, 1, 0],
      rotate: [0, Math.random() * 360, Math.random() * 720],
    }}
    transition={{ duration: 2.5, delay, ease: 'easeOut' }}
    className="absolute rounded-sm"
    style={{
      left: `${left}%`,
      top: '20%',
      width: size,
      height: size * (Math.random() > 0.5 ? 1 : 2.5),
      backgroundColor: color,
    }}
  />
);

const formatTrialEnd = (trialEnd) => {
  if (!trialEnd) return null;
  const date = new Date(trialEnd * 1000);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const SuccessCelebration = ({ isTrial = false, trialEnd = null }) => (
  <>
    <div className="px-4 py-6 space-y-6 blur-sm pointer-events-none">
      <PageHeader title="Premium" subtitle="Unlock unlimited access to all features" icon={Crown} />
    </div>

    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/60"
      />

      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 250, damping: 18 }}
        className="relative rounded-2xl overflow-hidden shadow-2xl max-w-xs w-full"
        style={{ background: PREMIUM_COLORS.gradient }}
      >
        {/* Confetti */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <ConfettiParticle
              key={i}
              delay={0.3 + i * 0.07}
              left={Math.random() * 100}
              color={CONFETTI_COLORS[i % CONFETTI_COLORS.length]}
              size={5 + Math.random() * 5}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 py-12 px-6 text-center">
          <motion.div
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: [-20, 8, -3, 0], scale: [0, 1.3, 0.9, 1] }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Crown size={72} className="mx-auto mb-4 drop-shadow-lg" style={{ color: 'white' }} />
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className="text-2xl font-black text-white mb-2 drop-shadow-md"
            style={{ transform: 'rotate(-2deg)' }}
          >
            {isTrial ? 'Trial Started!' : "You're Premium!"}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white/85 text-sm mb-4"
          >
            {isTrial
              ? 'Enjoy 15 days of full Premium access, completely free.'
              : 'Enjoy unlimited access to all features'}
          </motion.p>

          {isTrial && trialEnd && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm mb-4"
            >
              <Calendar size={14} className="text-white/70 flex-shrink-0" />
              <p className="text-xs text-white/80">
                Card charged on <strong className="text-white">{formatTrialEnd(trialEnd)}</strong>
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center justify-center gap-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
            <span className="text-xs text-white/50">Redirecting...</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </>
);

export default SuccessCelebration;
