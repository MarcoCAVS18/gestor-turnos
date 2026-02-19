// src/components/demos/steps/StepLiveMode.jsx

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  CircleDotDashed,
  DollarSign,
  Pause,
  Square,
  Clock,
  Crown,
} from 'lucide-react';

// Simulated earnings rate: ~$22/hr = $0.006111/sec
const RATE_PER_SEC = 0.006111;

const StepLiveMode = ({ isMobile }) => {
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  // Simulate a running timer
  useEffect(() => {
    // Start from a believable offset (42 min 17 sec)
    const startOffset = 42 * 60 + 17;
    setSeconds(startOffset);

    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  // Handle simulated pause/resume
  useEffect(() => {
    if (isPaused) {
      clearInterval(intervalRef.current);
    } else {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPaused]);

  const formatTime = (totalSec) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const earnings = (seconds * RATE_PER_SEC).toFixed(2);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={`flex flex-col items-center px-6 md:px-10 ${isMobile ? 'py-6 pb-8' : 'h-full py-8'}`}
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Live Mode
        </h2>
        <p className="text-gray-500 text-sm md:text-base">
          Start your shift with one tap. Track in real time.
        </p>
      </motion.div>

      {/* Simulated Live Mode card */}
      <motion.div
        variants={fadeUp}
        className="w-full max-w-sm rounded-2xl overflow-hidden relative"
        style={{
          background: 'linear-gradient(135deg, #F472B6 0%, #EC4899 50%, #BE185D 100%)',
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white/5 rounded-full blur-2xl" />

        {/* Decorative icon */}
        <Clock
          className="absolute -right-3 -bottom-3 text-white/[0.06]"
          size={80}
          strokeWidth={1}
          style={{ transform: 'rotate(-20deg)' }}
        />

        <div className="relative z-10 p-6">
          {/* Live indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/20 backdrop-blur-md text-white text-xs font-bold tracking-wide uppercase mb-4">
            <motion.div
              animate={isPaused ? {} : { scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <CircleDotDashed size={12} className="text-red-300" />
            </motion.div>
            <span>{isPaused ? 'Paused' : 'Live Active'}</span>
          </div>

          {/* Work name */}
          <p className="text-white/70 text-sm mb-1">Coffee Shop — Morning</p>

          {/* Timer */}
          <motion.div
            animate={isPaused ? {} : { scale: [1, 1.008, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl font-bold text-white font-mono tracking-wider mb-4"
          >
            {formatTime(seconds)}
          </motion.div>

          {/* Earnings */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3.5 py-2">
              <DollarSign size={16} className="text-white/80" />
              <span className="text-white font-semibold text-lg tabular-nums">
                {earnings}
              </span>
            </div>
          </div>

          {/* Simulated action buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 text-white text-sm font-semibold backdrop-blur-sm border border-white/10 hover:bg-white/30 transition-colors"
            >
              <Pause size={14} />
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 text-white text-sm font-semibold backdrop-blur-sm border border-white/10 hover:bg-white/30 transition-colors">
              <Square size={14} />
              <span>Finish</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Premium badge */}
      <motion.div
        variants={fadeUp}
        className="mt-5 flex items-center gap-2 px-4 py-2 rounded-xl border"
        style={{
          backgroundColor: 'rgba(212, 160, 0, 0.08)',
          borderColor: 'rgba(212, 160, 0, 0.2)',
        }}
      >
        <Crown size={14} style={{ color: '#D4A000' }} />
        <span className="text-xs font-medium text-gray-600">
          Unlimited sessions with <span className="font-bold" style={{ color: '#D4A000' }}>Premium</span>
        </span>
      </motion.div>
    </motion.div>
  );
};

export default StepLiveMode;
