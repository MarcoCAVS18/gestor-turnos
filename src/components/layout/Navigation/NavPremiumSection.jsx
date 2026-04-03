// src/components/layout/Navigation/NavPremiumSection.jsx

import React, { memo } from 'react';
import { Crown, CircleDotDashed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PREMIUM_COLORS } from '../../../contexts/PremiumContext';

const NavPremiumSection = memo(({
  isLiveModeActive,
  isPaused,
  formattedTime,
  liveWork,
  isPremium,
  colors,
  t,
  onLiveModeClick,
  onPremiumClick,
}) => {
  return (
    <div className="px-4 pb-2">
      <AnimatePresence mode="wait">
        {isLiveModeActive ? (
          <motion.button
            key="livemode"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={onLiveModeClick}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all"
            style={{
              backgroundColor: colors.transparent10,
              color: colors.primary,
            }}
            whileHover={{ scale: 1.02, backgroundColor: colors.transparent20 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={isPaused ? {} : { rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <CircleDotDashed size={20} className="text-red-500" />
            </motion.div>
            <div className="flex-1 text-left">
              <p className="text-xs text-gray-500 font-normal">
                {isPaused ? t('nav.paused') : t('nav.liveMode')}
              </p>
              <p className="font-semibold font-mono text-sm">
                {formattedTime?.formatted || '00:00:00'}
              </p>
            </div>
            {liveWork && (
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: liveWork.color || colors.primary }}
              />
            )}
          </motion.button>
        ) : !isPremium ? (
          <motion.button
            key="premium"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={onPremiumClick}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all"
            style={{
              backgroundColor: PREMIUM_COLORS.lighter,
              color: PREMIUM_COLORS.primary,
              border: `1px solid ${PREMIUM_COLORS.light}`,
            }}
            whileHover={{
              scale: 1.02,
              boxShadow: `0 4px 12px ${PREMIUM_COLORS.primary}30`,
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Crown size={20} style={{ color: PREMIUM_COLORS.gold }} />
            <div className="flex-1 text-left">
              <p className="text-xs opacity-70 font-normal">
                {t('premium.unlockAll')}
              </p>
              <p className="font-semibold text-sm">
                {t('premium.upgrade')}
              </p>
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Crown size={16} style={{ color: PREMIUM_COLORS.gold }} />
            </motion.div>
          </motion.button>
        ) : null}
      </AnimatePresence>
    </div>
  );
});

NavPremiumSection.displayName = 'NavPremiumSection';
export default NavPremiumSection;
