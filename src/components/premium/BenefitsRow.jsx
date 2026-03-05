// src/components/premium/BenefitsRow.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Clock, BarChart3, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { PREMIUM_COLORS } from '../../contexts/PremiumContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { PREMIUM_BENEFIT_KEYS } from './constants';

const BENEFIT_ICONS = [Clock, BarChart3, Zap, Shield];

const BenefitsRow = ({ isPremium = true }) => {
  const { t } = useTranslation();
  const colors = useThemeColors();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {PREMIUM_BENEFIT_KEYS.map((benefit, index) => {
        const Icon = BENEFIT_ICONS[index];
        return (
          <motion.div
            key={benefit.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl"
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0${isPremium ? ' premium-bg-light' : ''}`}
              style={{
                backgroundColor: isPremium
                  ? PREMIUM_COLORS.lighter
                  : colors.transparent10,
              }}
            >
              {isPremium ? (
                <Check size={14} style={{ color: PREMIUM_COLORS.gold }} />
              ) : (
                <Icon size={14} style={{ color: colors.primary }} />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{t(`premium.benefits.${benefit.key}`)}</p>
              <p className="text-xs text-gray-500 hidden lg:block">{t(`premium.benefits.${benefit.key}Desc`)}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default BenefitsRow;
