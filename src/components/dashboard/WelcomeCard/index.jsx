// src/components/dashboard/WelcomeCard/index.jsx

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import Card from '../../ui/Card';

// Large pool of emojis — one is selected deterministically per calendar day
const DAILY_EMOJIS = [
  '😊', '😎', '🚀', '💪', '⭐', '🔥', '💻', '📊', '🎯', '🌟',
  '⚡', '🎉', '🏆', '💡', '🎨', '🌈', '🦋', '🌺', '🌸', '🍀',
  '🎵', '🎸', '🏄', '🌊', '🍕', '🦄', '🐬', '🌙', '☀️', '🌻',
  '🎃', '🦊', '🐧', '🌵', '🎲', '🏋️', '🧩', '🎭', '🛸', '🌍',
  '🦁', '🐉', '🎪', '🍉', '🥑', '🌮', '🎠', '🚂', '🏔️', '🌅',
  '🎑', '🌠', '🎆', '🎇', '🧨', '✨', '🎀', '🎁', '🎗️', '🏅',
  '🥇', '🏖️', '🏕️', '⛺', '🌄', '🌃', '🌆', '🌇', '🗻', '🌋',
  '🎢', '🎡', '💎', '🔮', '🧿', '🪄', '🎩', '🎰', '🎳',
];

// Returns the same emoji for the entire calendar day
const getDailyEmoji = () => {
  const now = new Date();
  const dayOfYear =
    Math.floor(
      (now - new Date(now.getFullYear(), 0, 0)) / 86400000
    );
  return DAILY_EMOJIS[dayOfYear % DAILY_EMOJIS.length];
};

const WelcomeCard = ({ totalEarned, isFeatureVisible = false, className }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const colors = useThemeColors();
  const [userName, setUserName] = useState('');
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const timerRef = useRef(null);
  const dailyEmoji = getDailyEmoji();

  useEffect(() => {
    if (currentUser) {
      setUserName(
        currentUser.displayName ||
        (currentUser.email ? currentUser.email.split('@')[0] : '')
      );
    }
  }, [currentUser]);

  // Auto-flip every 10 seconds
  useEffect(() => {
    const startTimer = () => {
      timerRef.current = setInterval(() => {
        setShowDisclaimer(prev => !prev);
      }, 10000);
    };

    startTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Reset timer on manual click
  const handleClick = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setShowDisclaimer(prev => !prev);
    timerRef.current = setInterval(() => {
      setShowDisclaimer(prev => !prev);
    }, 10000);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.welcome.greeting_morning');
    if (hour < 18) return t('dashboard.welcome.greeting_afternoon');
    return t('dashboard.welcome.greeting_evening');
  };

  const variants = {
    initial: { opacity: 0, scale: 0.95, filter: 'blur(4px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 1.05, filter: 'blur(4px)' }
  };

  return (
    <Card
      className={`${className} cursor-pointer select-none overflow-hidden relative`}
      onClick={handleClick}
    >
      <AnimatePresence mode="wait" initial={false}>
        {!showDisclaimer ? (
          <motion.div
            key="main"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="flex flex-col h-full"
          >
            <div className="my-auto">
              {/* Vertical layout (Mobile or when feature is visible) */}
              <div className={`${isFeatureVisible ? 'block' : 'block sm:hidden'} text-center space-y-4`}>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">
                    {getGreeting()} {userName && `${userName} `}{dailyEmoji}
                  </h1>
                  <p className="text-gray-600 text-sm mt-2">
                    {t('dashboard.welcome.summary')}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 pt-4 mb-1">{t('dashboard.welcome.totalEarned')}</p>
                  <p
                    className="text-4xl font-bold"
                    style={{ color: colors.primary }}
                  >
                    {formatCurrency(totalEarned || 0)}
                  </p>
                </div>
              </div>

              {/* Horizontal layout (Tablet/Desktop without feature) */}
              <div className={`${isFeatureVisible ? 'hidden' : 'hidden sm:flex'} items-center justify-between`}>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {getGreeting()} {userName && `${userName} `}{dailyEmoji}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {t('dashboard.welcome.summary')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{t('dashboard.welcome.totalEarned')}</p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: colors.primary }}
                  >
                    {formatCurrency(totalEarned || 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Info indicator */}
            <div className="absolute bottom-2 right-2 opacity-40">
              <Info size={14} className="text-gray-400" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="disclaimer"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="flex flex-col h-full"
          >
            {/* Disclaimer content */}
            <div className="flex-1 flex flex-col justify-center text-center px-2">
              <div
                className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{ backgroundColor: `${colors.primary}15` }}
              >
                <Info size={20} style={{ color: colors.primary }} />
              </div>

              <p className="text-base font-semibold text-gray-800 leading-snug">
                {t('dashboard.welcome.disclaimer')}
              </p>

              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                {t('dashboard.welcome.disclaimerDesc')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default WelcomeCard;
