// src/components/dashboard/NovedadesCard/index.jsx
//
// "Novedades" (What's new) card for the Dashboard. Solid-white card, visually
// distinct from the rest. Clicking it flips between the latest updates and the
// "Próximamente" (coming soon) list, using the same change animation as WelcomeCard.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Rocket, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Card from '../../ui/Card';
import { RECENT_UPDATES, UPCOMING_UPDATES, localizeUpdate } from '../../../data/updates';

const variants = {
  initial: { opacity: 0, scale: 0.97, filter: 'blur(4px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 1.03, filter: 'blur(4px)' },
};

const NovedadesCard = ({ className }) => {
  const { t, i18n } = useTranslation();
  const colors = useThemeColors();
  const [showUpcoming, setShowUpcoming] = useState(false);

  const lang = (i18n.language || 'en').split('-')[0];

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString(lang === 'en' ? 'en-US' : lang, {
        day: 'numeric',
        month: 'short',
      });
    } catch {
      return iso;
    }
  };

  return (
    <Card
      variant="elevated"
      className={`${className} cursor-pointer select-none overflow-hidden relative flex flex-col`}
      onClick={() => setShowUpcoming((v) => !v)}
    >
      <AnimatePresence mode="wait" initial={false}>
        {!showUpcoming ? (
          /* ── Recent updates ── */
          <motion.div
            key="recent"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="flex flex-col h-full"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold flex items-center text-gray-800 dark:text-gray-100">
                <Sparkles size={18} style={{ color: colors.primary }} className="mr-2 flex-shrink-0" />
                {t('dashboard.updates.title')}
              </h3>
              <span
                className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}
              >
                {t('dashboard.updates.badge')}
              </span>
            </div>

            <div className="space-y-3 flex-grow">
              {RECENT_UPDATES.slice(0, 3).map((u) => (
                <div key={u.id} className="flex gap-2.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: colors.primary }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                        {localizeUpdate(u.title, lang)}
                      </p>
                      <span className="text-[10px] text-gray-400 flex-shrink-0">{formatDate(u.date)}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug line-clamp-2">
                      {localizeUpdate(u.description, lang)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="flex items-center justify-center gap-1 mt-3 pt-3 border-t border-gray-100 dark:border-slate-700 text-xs font-medium"
              style={{ color: colors.primary }}
            >
              {t('dashboard.updates.seeUpcoming')}
              <ChevronRight size={13} />
            </div>
          </motion.div>
        ) : (
          /* ── Coming soon ── */
          <motion.div
            key="upcoming"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="flex flex-col h-full"
          >
            <div className="flex items-center mb-3">
              <h3 className="text-base font-semibold flex items-center text-gray-800 dark:text-gray-100">
                <Rocket size={18} style={{ color: colors.primary }} className="mr-2 flex-shrink-0" />
                {t('dashboard.updates.upcomingTitle')}
              </h3>
            </div>

            <div className="space-y-3 flex-grow">
              {UPCOMING_UPDATES.slice(0, 3).map((u) => (
                <div key={u.id} className="flex gap-2.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 border"
                    style={{ borderColor: colors.primary }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                      {localizeUpdate(u.title, lang)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug line-clamp-2">
                      {localizeUpdate(u.description, lang)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="flex items-center justify-center gap-1 mt-3 pt-3 border-t border-gray-100 dark:border-slate-700 text-xs font-medium"
              style={{ color: colors.primary }}
            >
              <ChevronLeft size={13} />
              {t('dashboard.updates.back')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default NovedadesCard;
