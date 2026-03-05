// src/components/about/StorySection/index.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const StorySection = ({ colors }) => {
  const { t } = useTranslation();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className="py-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: colors.transparent10 }}
        >
          <BookOpen size={20} style={{ color: colors.primary }} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: colors.text }}>
          {t('about.story.title')}
        </h2>
      </div>

      <div className="space-y-4 text-sm md:text-base leading-relaxed" style={{ color: colors.textSecondary }}>
        <p>{t('about.story.p1')}</p>
        <p>{t('about.story.p2')}</p>
        <p dangerouslySetInnerHTML={{ __html: t('about.story.p3') }} />
        <p>{t('about.story.p4')}</p>
        <p>
          {t('about.story.p5')}{' '}
          <span className="font-semibold" style={{ color: colors.primary }}>
            {t('about.story.p5highlight')}
          </span>
        </p>
        <p>{t('about.story.p6')}</p>
        <p className="text-xs" style={{ color: colors.textSecondary, opacity: 0.7 }}>
          {t('about.story.p7')}
        </p>
      </div>
    </motion.div>
  );
};

export default StorySection;
