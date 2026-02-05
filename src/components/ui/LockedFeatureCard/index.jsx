// src/components/ui/LockedFeatureCard/index.jsx
// Card wrapper that shows a locked state for free users with blur effect
// Includes usage counter for limited features (e.g., Live Mode 5/month)

import React, { useState, useMemo } from 'react';
import { LockKeyhole, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePremium, PREMIUM_COLORS } from '../../../contexts/PremiumContext';

const LockedFeatureCard = ({
  children,
  onUnlock,
  message = 'Upgrade to Premium to unlock this feature',
  className = '',
  // Usage tracking props
  usage = null, // { current: number, limit: number } - e.g., { current: 3, limit: 5 }
  usageLabel = 'sessions used this month',
}) => {
  const { openPremiumModal } = usePremium();
  const [isHovered, setIsHovered] = useState(false);

  // Calculate usage percentage and color
  const usageInfo = useMemo(() => {
    if (!usage) return null;

    const percentage = Math.min((usage.current / usage.limit) * 100, 100);
    const remaining = Math.max(usage.limit - usage.current, 0);

    // Color based on usage: green (0-60%) → yellow (60-80%) → red (80-100%)
    let color;
    if (percentage < 60) {
      color = '#22c55e'; // green-500
    } else if (percentage < 80) {
      color = '#eab308'; // yellow-500
    } else {
      color = '#ef4444'; // red-500
    }

    return { percentage, remaining, color, isLimitReached: remaining === 0 };
  }, [usage]);

  const handleClick = () => {
    if (onUnlock) {
      onUnlock();
    } else {
      openPremiumModal();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Blurred content */}
      <div className="blur-sm pointer-events-none select-none">
        {children}
      </div>

      {/* Overlay with lock icon */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer rounded-xl"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(2px)',
        }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
        transition={{ duration: 0.2 }}
      >
        {/* Icon container */}
        <motion.div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-lg"
          style={{
            backgroundColor: isHovered ? PREMIUM_COLORS.lighter : 'white',
          }}
          animate={{
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <AnimatePresence mode="wait">
            {isHovered ? (
              <motion.div
                key="crown"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Crown
                  size={28}
                  style={{ color: PREMIUM_COLORS.gold }}
                  strokeWidth={2}
                />
              </motion.div>
            ) : (
              <motion.div
                key="lock"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <LockKeyhole
                  size={28}
                  className="text-gray-500"
                  strokeWidth={2}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Message */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="text-center px-4"
            >
              <p className="text-white text-sm font-medium drop-shadow-md">
                {message}
              </p>
              <p
                className="text-xs mt-1 font-semibold"
                style={{ color: PREMIUM_COLORS.gold }}
              >
                Click to upgrade
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium badge in corner */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold shadow-md"
          style={{
            backgroundColor: PREMIUM_COLORS.lighter,
            color: PREMIUM_COLORS.primary,
          }}
        >
          <Crown size={12} style={{ color: PREMIUM_COLORS.gold }} />
          <span>Premium</span>
        </div>

        {/* Usage counter (if provided) */}
        {usageInfo && (
          <motion.div
            className="absolute bottom-3 left-3 right-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div
              className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg"
              style={{ border: `1px solid ${usageInfo.color}20` }}
            >
              {/* Usage text */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">
                  {usageInfo.isLimitReached ? (
                    <span className="font-semibold text-red-500">Limit reached</span>
                  ) : (
                    <>
                      <span className="font-bold" style={{ color: usageInfo.color }}>
                        {usage.current}/{usage.limit}
                      </span>{' '}
                      {usageLabel}
                    </>
                  )}
                </span>
                <Crown size={14} style={{ color: PREMIUM_COLORS.gold }} />
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: usageInfo.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${usageInfo.percentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>

              {/* Remaining text */}
              {!usageInfo.isLimitReached && (
                <p className="text-xs text-gray-500 mt-1.5 text-center">
                  {usageInfo.remaining} remaining • <span style={{ color: PREMIUM_COLORS.primary }} className="font-medium">Upgrade for unlimited</span>
                </p>
              )}
              {usageInfo.isLimitReached && (
                <p className="text-xs text-center mt-1.5 font-medium" style={{ color: PREMIUM_COLORS.primary }}>
                  Upgrade to continue using this feature
                </p>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default LockedFeatureCard;
