// src/components/about/AboutFooter/index.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Settings, BarChart3, Calendar } from 'lucide-react';

const quickLinks = [
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'Statistics', path: '/statistics', icon: BarChart3 },
  { label: 'Calendar', path: '/calendar', icon: Calendar },
];

const AboutFooter = ({ colors }) => {
  const navigate = useNavigate();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="py-10 mt-4 border-t"
      style={{ borderColor: colors.transparent10 }}
    >
      {/* Quick Links */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {quickLinks.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: colors.transparent5,
              color: colors.textSecondary,
            }}
          >
            <link.icon size={14} />
            {link.label}
          </button>
        ))}
      </div>

      {/* Version & Credits */}
      <div className="text-center space-y-2">
        <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>
          Version 2.0.0
        </p>
        <p className="text-xs flex items-center justify-center gap-1" style={{ color: colors.textSecondary, opacity: 0.7 }}>
          Developed with <Heart size={12} className="text-red-400 fill-red-400" /> by Marqui
        </p>
        <p className="text-xs" style={{ color: colors.textSecondary, opacity: 0.5 }}>
          &copy; 2026 Orary. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
};

export default AboutFooter;
