// src/components/about/AboutFooter/index.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Heart, Settings, BarChart3, Calendar, HeadphonesIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AboutFooter = ({ colors }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const quickLinks = [
    { label: t('nav.settings'), path: '/settings', icon: Settings },
    { label: t('nav.statistics'), path: '/statistics', icon: BarChart3 },
    { label: t('nav.calendar'), path: '/calendar', icon: Calendar },
    { label: t('footer.support'), path: '/support', icon: HeadphonesIcon },
  ];

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
          {t('about.footer.version')}
        </p>
        <p className="text-xs flex items-center justify-center gap-1" style={{ color: colors.textSecondary, opacity: 0.7 }}>
          {t('about.footer.developed')} <Heart size={12} className="text-red-400 fill-red-400" /> {t('about.footer.by')}
        </p>
        <p className="text-xs" style={{ color: colors.textSecondary, opacity: 0.5 }}>
          {t('about.footer.copyright')}
        </p>

        {/* Public SEO pages */}
        <p className="text-xs pt-1" style={{ color: colors.textSecondary, opacity: 0.4 }}>
          <Link to="/australia-88" className="hover:opacity-80 transition-opacity">
            88-day visa tracker
          </Link>
          <span className="mx-2">·</span>
          <Link to="/faq" className="hover:opacity-80 transition-opacity">
            FAQ
          </Link>
        </p>
      </div>
    </motion.footer>
  );
};

export default AboutFooter;
