// src/components/australia88/Australia88LearnMore/index.jsx
// Links into the two WHV blog articles from inside the app, so users actively
// tracking their days discover the blog instead of it staying undiscovered.

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, FileCheck2, ChevronRight } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Card from '../../ui/Card';

const LEARN_LINKS = [
  {
    icon: BookOpen,
    to: '/blog/track-88-days-working-holiday-visa',
    titleKey: 'australia88.stats.learnTrackTitle',
    descKey: 'australia88.stats.learnTrackDesc',
  },
  {
    icon: FileCheck2,
    to: '/blog/second-third-working-holiday-visa-application-guide',
    titleKey: 'australia88.stats.learnApplyTitle',
    descKey: 'australia88.stats.learnApplyDesc',
  },
];

const Australia88LearnMore = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {LEARN_LINKS.map(({ icon: Icon, to, titleKey, descKey }) => (
        <Link key={to} to={to}>
          <Card className="flex items-start gap-3 h-full" variant="transparent" hover>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${colors.primary}15` }}
            >
              <Icon size={18} style={{ color: colors.primary }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {t(titleKey)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {t(descKey)}
              </p>
              <span
                className="inline-flex items-center gap-0.5 text-xs font-medium mt-2"
                style={{ color: colors.primary }}
              >
                {t('australia88.stats.readArticle')}
                <ChevronRight size={13} />
              </span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default Australia88LearnMore;
