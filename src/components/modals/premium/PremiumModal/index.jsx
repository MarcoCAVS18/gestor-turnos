// src/components/modals/premium/PremiumModal/index.jsx
// Modal to inform users about Premium benefits and invite them to upgrade
// Features: Animated gradient shimmer effect, app logo decoration

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, X, Check, ArrowRight, Zap, BarChart3, Clock, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Flex from '../../../ui/Flex';
import Button from '../../../ui/Button';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { PREMIUM_COLORS } from '../../../../contexts/PremiumContext';

// Circular reflection animation styles
const reflectionStyles = `
  @keyframes premiumReflection {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const PREMIUM_BENEFITS = [
  {
    icon: Clock,
    title: 'Unlimited Live Mode',
    description: 'Track unlimited shifts in real-time, no monthly limits',
  },
  {
    icon: BarChart3,
    title: 'Advanced Statistics',
    description: 'Detailed analytics and insights about your earnings',
  },
  {
    icon: Zap,
    title: 'Priority Support',
    description: 'Get help faster with priority customer support',
  },
  {
    icon: Shield,
    title: 'Data Export',
    description: 'Export your data in multiple formats anytime',
  },
];

const PremiumModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLetsGo = () => {
    onClose();
    navigate('/premium');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Inject circular reflection animation */}
      <style>{reflectionStyles}</style>

      <Flex
        variant="center"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm p-4"
        style={{ zIndex: 9999 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className={`
            relative overflow-hidden w-full
            ${isMobile ? 'max-w-none mx-2 rounded-2xl' : 'max-w-md rounded-2xl'}
          `}
          style={{
            background: `linear-gradient(
              135deg,
              ${PREMIUM_COLORS.lighter} 0%,
              ${PREMIUM_COLORS.light} 35%,
              ${PREMIUM_COLORS.primary} 100%
            )`,
          }}
        >
          {/* Decorative background logo */}
          <img
            src="/assets/SVG/logo.svg"
            alt=""
            className="absolute -right-32 -bottom-32 opacity-[0.06] pointer-events-none"
            style={{
              width: '420px',
              height: '420px',
              transform: 'rotate(-15deg)',
              filter: 'grayscale(100%)',
            }}
          />

          {/* Circular rotating reflection */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: '200%',
              height: '200%',
              top: '-50%',
              left: '-50%',
              background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.15) 60deg, transparent 120deg, transparent 360deg)',
              animation: 'premiumReflection 8s linear infinite',
            }}
          />

          {/* Light effects */}
          <div
            className="absolute top-0 right-0 -mt-16 -mr-16 w-56 h-56 rounded-full blur-3xl pointer-events-none"
            style={{ backgroundColor: 'white', opacity: 0.15 }}
          />
          <div
            className="absolute bottom-0 left-0 -mb-16 -ml-16 w-40 h-40 rounded-full blur-3xl pointer-events-none"
            style={{ backgroundColor: 'white', opacity: 0.1 }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Badge */}
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md text-xs font-bold tracking-wide uppercase shadow-sm mb-4"
                    style={{
                      backgroundColor: 'rgba(255, 215, 0, 0.3)',
                      border: '1px solid rgba(255, 215, 0, 0.4)',
                      color: PREMIUM_COLORS.text,
                    }}
                  >
                    <Crown size={12} style={{ color: PREMIUM_COLORS.gold }} />
                    <span>Premium</span>
                  </div>

                  <h2
                    className="text-2xl font-bold mb-2"
                    style={{ color: PREMIUM_COLORS.text }}
                  >
                    Unlock the Full Experience
                  </h2>
                  <p
                    className="text-sm"
                    style={{ color: `${PREMIUM_COLORS.text}cc` }}
                  >
                    Upgrade to Premium and get access to all features without limits
                  </p>
                </div>

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl transition-colors"
                  style={{
                    backgroundColor: `${PREMIUM_COLORS.text}10`,
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = `${PREMIUM_COLORS.text}20`}
                  onMouseLeave={(e) => e.target.style.backgroundColor = `${PREMIUM_COLORS.text}10`}
                >
                  <X size={20} style={{ color: PREMIUM_COLORS.text }} />
                </button>
              </div>
            </div>

            {/* Benefits list */}
            <div className="px-6 pb-6 space-y-4">
              <div className="space-y-3">
                {PREMIUM_BENEFITS.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-xl backdrop-blur-sm"
                    style={{
                      backgroundColor: `${PREMIUM_COLORS.text}08`,
                      border: `1px solid ${PREMIUM_COLORS.text}15`,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${PREMIUM_COLORS.gold}30` }}
                    >
                      <benefit.icon size={20} style={{ color: PREMIUM_COLORS.text }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p
                          className="font-semibold"
                          style={{ color: PREMIUM_COLORS.text }}
                        >
                          {benefit.title}
                        </p>
                        <Check
                          size={16}
                          style={{ color: PREMIUM_COLORS.primary }}
                        />
                      </div>
                      <p
                        className="text-sm mt-0.5"
                        style={{ color: `${PREMIUM_COLORS.text}99` }}
                      >
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>


              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="cancel"
                  onClick={onClose}
                  className="flex-1"
                >
                  Maybe Later
                </Button>
                <Button
                  variant="premium"
                  onClick={handleLetsGo}
                  className="flex-1"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Let's Go!
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </Flex>
    </AnimatePresence>
  );
};

export default PremiumModal;
