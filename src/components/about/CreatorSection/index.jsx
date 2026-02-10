// src/components/about/CreatorSection/index.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Instagram, User } from 'lucide-react';

const CreatorSection = ({ colors }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className="py-8"
    >
      {/* Desktop: right-aligned layout | Mobile: centered compact */}
      <div className="flex flex-col md:flex-row-reverse md:items-start gap-8">
        {/* Photo */}
        <div className="flex justify-center md:justify-end shrink-0">
          <div
            className="w-28 h-28 md:w-40 md:h-40 rounded-2xl flex items-center justify-center overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark || colors.primary}80)`,
            }}
          >
            <User size={48} className="text-white/80 md:hidden" />
            <User size={64} className="text-white/80 hidden md:block" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-right">
          <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: colors.text }}>
            Marqui
          </h2>
          <p
            className="text-sm font-medium mb-4"
            style={{ color: colors.primary }}
          >
            Creator & Developer
          </p>

          <div className="space-y-3 text-sm md:text-base leading-relaxed" style={{ color: colors.textSecondary }}>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
              ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
              ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center md:justify-end gap-3 mt-6">
            <a
              href="https://www.linkedin.com/in/marco-piermatei/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: colors.transparent10,
                color: colors.textSecondary,
              }}
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://www.instagram.com/marko.piermatei/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: colors.transparent10,
                color: colors.textSecondary,
              }}
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreatorSection;
