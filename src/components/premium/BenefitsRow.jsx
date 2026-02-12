// src/components/premium/BenefitsRow.jsx

import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { PREMIUM_COLORS } from '../../contexts/PremiumContext';
import { PREMIUM_BENEFITS } from './constants';

const BenefitsRow = ({ isPremium = true }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
    {PREMIUM_BENEFITS.map((benefit, index) => (
      <motion.div
        key={benefit.title}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: isPremium ? PREMIUM_COLORS.lighter : `${PREMIUM_COLORS.gold}15` }}
        >
          {isPremium ? (
            <Check size={14} style={{ color: PREMIUM_COLORS.gold }} />
          ) : (
            <benefit.icon size={14} style={{ color: PREMIUM_COLORS.primary }} />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{benefit.title}</p>
          <p className="text-xs text-gray-500 hidden lg:block">{benefit.description}</p>
        </div>
      </motion.div>
    ))}
  </div>
);

export default BenefitsRow;
