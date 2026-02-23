// src/components/premium/ProcessingPaymentOverlay.jsx
// Full-screen overlay shown while payment is being processed

import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PREMIUM_COLORS } from '../../contexts/PremiumContext';

// Messages that cycle in the title while processing
const MESSAGES = [
  'Setting up…',
  'Thanks for trusting our work',
  'Almost ready for you…',
];

// How long before showing the timeout error (ms)
const TIMEOUT_MS = 35000;
// How long each message is shown (ms)
const MSG_INTERVAL_MS = 3500;

const ProcessingPaymentOverlay = ({ onRetry }) => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [timedOut, setTimedOut] = useState(false);

  // Lock body scroll while overlay is visible
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Cycle through messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % MESSAGES.length);
    }, MSG_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Timeout — if payment takes too long, show error
  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Blurred background hint */}
      <div className="px-4 py-6 blur-sm pointer-events-none opacity-50">
        <div className="h-8 bg-gray-200 rounded-lg w-48 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-64" />
      </div>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="relative rounded-2xl overflow-hidden shadow-2xl max-w-xs w-full"
          style={{
            background: `linear-gradient(135deg, ${PREMIUM_COLORS.lighter} 0%, ${PREMIUM_COLORS.light} 50%, ${PREMIUM_COLORS.primary} 100%)`,
          }}
        >
          <AnimatePresence mode="wait">
            {timedOut ? (
              /* ── TIMEOUT STATE ────────────────────────────────────── */
              <motion.div
                key="timeout"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="relative z-10 py-12 px-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="mx-auto mb-5 w-fit"
                >
                  <AlertCircle size={56} className="text-white/90 drop-shadow-lg" />
                </motion.div>

                <h2 className="text-xl font-bold text-white mb-3 drop-shadow-md">
                  Taking longer than expected
                </h2>
                <p className="text-white/80 text-sm mb-2 leading-relaxed">
                  Your payment may still be processing. Check your email for a confirmation — if you received one, you're all set.
                </p>
                <p className="text-white/60 text-xs mb-6">
                  Don't worry, you won't be charged twice.
                </p>

                <button
                  onClick={onRetry}
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
                >
                  <ArrowLeft size={16} />
                  Go back
                </button>
              </motion.div>
            ) : (
              /* ── PROCESSING STATE ─────────────────────────────────── */
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-10 py-14 px-6 text-center"
              >
                {/* Spinner */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  className="mx-auto mb-6 w-fit"
                >
                  <Loader2 size={64} className="text-white drop-shadow-lg" />
                </motion.div>

                {/* Animated cycling title */}
                <div className="h-16 mb-2 flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.h2
                      key={msgIndex}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -14 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="text-xl font-bold text-white drop-shadow-md text-center px-2"
                    >
                      {MESSAGES[msgIndex]}
                    </motion.h2>
                  </AnimatePresence>
                </div>

                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="text-white/80 text-sm mb-1"
                >
                  Setting up your subscription
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-white/50 text-xs"
                >
                  Please don't close this page
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};

export default ProcessingPaymentOverlay;
