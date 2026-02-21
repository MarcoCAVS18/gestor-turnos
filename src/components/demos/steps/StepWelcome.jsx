// src/components/demos/steps/StepWelcome.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Zap } from 'lucide-react';

const FEATURES = [
  { icon: Clock, label: 'Track Shifts', color: '#F59E0B' },
  { icon: TrendingUp, label: 'Analytics', color: '#6366F1' },
  { icon: Zap, label: 'Live Mode', color: '#EC4899' },
];

const StepWelcome = ({ isMobile }) => {
  // Stagger children
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={`flex flex-col items-center justify-center px-8 ${isMobile ? 'py-8 pb-10' : 'h-full py-10'}`}
    >
      {/* Logo with glow ring */}
      <motion.div variants={fadeUp} className="relative mb-8">
        {/* Outer glow rings */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              '0 0 0 0px rgba(236, 72, 153, 0.15)',
              '0 0 0 20px rgba(236, 72, 153, 0)',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              '0 0 0 0px rgba(236, 72, 153, 0.1)',
              '0 0 0 35px rgba(236, 72, 153, 0)',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
        />

        <div className="relative bg-white rounded-full p-5 shadow-xl shadow-pink-500/10 border border-pink-100/50">
          <img
            src="/assets/images/logo3.png"
            alt="Orary"
            className="w-20 h-20 object-contain"
          />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        variants={fadeUp}
        className="text-3xl md:text-4xl font-bold text-center mb-3"
      >
        <span className="text-gray-800">Welcome to </span>
        <span className="bg-gradient-to-r from-pink-500 via-pink-400 to-rose-500 bg-clip-text text-transparent">
          Orary
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        variants={fadeUp}
        className="text-gray-500 text-center text-base md:text-lg max-w-sm leading-relaxed mb-10"
      >
        Your shifts, earnings, and performance — all in one place.
      </motion.p>

      {/* Feature pills */}
      <motion.div variants={fadeUp} className="flex items-center gap-3 flex-wrap justify-center">
        {FEATURES.map((feat, i) => (
          <motion.div
            key={feat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: feat.color + '15' }}
            >
              <feat.icon size={16} style={{ color: feat.color }} strokeWidth={2.5} />
            </div>
            <span className="text-sm font-medium text-gray-700">{feat.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default StepWelcome;
