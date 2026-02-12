// src/components/dashboard/SuggestedActionCard/index.jsx

import React from 'react';
import { ThumbsUp, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { generateColorVariations } from '../../../utils/colorUtils';
import BaseAnnouncementCard from '../../cards/base/BaseAnnouncementCard';

const SuggestedActionCard = ({ onClose, className }) => {
  const colors = useThemeColors();
  const navigate = useNavigate();

  const palette = generateColorVariations(colors.primary) || {
    lighter: colors.primary,
    base: colors.primary,
    darker: colors.primaryDark,
  };

  const gradient = `linear-gradient(135deg, ${palette.lighter} 0%, ${colors.primary} 50%, ${palette.darker} 100%)`;

  const handleClick = () => {
    navigate('/about#feedback');
    // Scroll to feedback after navigation with delay for page render
    setTimeout(() => {
      const el = document.getElementById('feedback');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    onClose?.();
  };

  return (
    <BaseAnnouncementCard
      onClick={handleClick}
      gradient={gradient}
      className={`${className} cursor-pointer`}
      decorativeIcon={ThumbsUp}
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
      >
        <X size={14} className="text-white" />
      </button>

      <div className="relative z-10 p-6 flex flex-col items-center justify-center text-center aspect-square">
        {/* Rotated icon */}
        <motion.div
          initial={{ rotate: -12 }}
          animate={{ rotate: [-12, -8, -12] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-4"
        >
          <ThumbsUp size={48} className="text-white" strokeWidth={1.5} />
        </motion.div>

        {/* Text */}
        <h3 className="text-white font-bold text-lg leading-tight mb-2">
          Enjoying GestApp?
        </h3>
        <p className="text-white/80 text-sm leading-relaxed max-w-[200px]">
          Share your experience and help us improve
        </p>
      </div>
    </BaseAnnouncementCard>
  );
};

export default SuggestedActionCard;
