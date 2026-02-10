// src/components/about/HeroSection/index.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const phrases = [
  'Your work and shift manager',
  'Professional shift tracking and management',
  'Because math shouldn\'t be this hard',
  'Track smarter, not harder',
  'Built by a worker, for workers',
];

const HeroSection = ({ colors }) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      if (displayedText.length < currentPhrase.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentPhrase.slice(0, displayedText.length + 1));
        }, 60);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setIsDeleting(true), 2500);
        return () => clearTimeout(timeout);
      }
    } else {
      if (displayedText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, 30);
        return () => clearTimeout(timeout);
      } else {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }
  }, [displayedText, isDeleting, phraseIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-12"
    >
      <motion.img
        src="/assets/SVG/logo.svg"
        alt="GestAPP Logo"
        className="w-20 h-20 mx-auto mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />

      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-4"
        style={{ color: colors.text }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Gest
        <span style={{ color: colors.primary }}>APP</span>
      </motion.h1>

      <div className="h-8 flex items-center justify-center">
        <span
          className="text-base md:text-lg"
          style={{ color: colors.textSecondary }}
        >
          {displayedText}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            className="inline-block w-[2px] h-5 ml-0.5 align-middle"
            style={{ backgroundColor: colors.primary }}
          />
        </span>
      </div>
    </motion.div>
  );
};

export default HeroSection;
