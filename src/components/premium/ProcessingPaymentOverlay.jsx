// src/components/premium/ProcessingPaymentOverlay.jsx
// Full-screen overlay shown while payment is being processed

import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { PREMIUM_COLORS } from '../../contexts/PremiumContext';

const ProcessingPaymentOverlay = () => {

  return (
    <>
      {/* Blurred background content hint */}
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
          <div className="relative z-10 py-14 px-6 text-center">
            {/* Animated spinner */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              className="mx-auto mb-6 w-fit"
            >
              <Loader2 size={64} className="text-white drop-shadow-lg" />
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-white mb-2 drop-shadow-md"
            >
              Processing...
            </motion.h2>

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
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ProcessingPaymentOverlay;
