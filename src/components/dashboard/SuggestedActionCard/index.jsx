// src/components/dashboard/SuggestedActionCard/index.jsx

import React, { useRef, useState } from 'react';
import { ThumbsUp, X } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
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

  // Scroll-triggered like animation
  const thumbRef = useRef(null);
  const isInView = useInView(thumbRef, { once: true, amount: 0.5 });
  const [hasPlayed, setHasPlayed] = useState(false);

  const handleClick = () => {
    navigate('/about#feedback');
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

  // Animation phases:
  // 1. Not in view yet → static tilted pose
  // 2. Enters view → "like" bounce: tilt back, spring up, settle
  // 3. After bounce completes → gentle continuous rocking
  const getAnimate = () => {
    if (!isInView && !hasPlayed) return { rotate: -12, scale: 1 };
    if (isInView && !hasPlayed) return {
      rotate: [-12, -40, 20, -28, 5, -12],
      scale:  [1,   1.45, 1.2, 1.35, 1.05, 1],
    };
    return { rotate: [-12, -8, -12] };
  };

  const getTransition = () => {
    if (!isInView && !hasPlayed) return {};
    if (isInView && !hasPlayed) return {
      duration: 0.85,
      ease: 'easeOut',
      onComplete: () => setHasPlayed(true),
    };
    return { duration: 3, repeat: Infinity, ease: 'easeInOut' };
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

      <div className="relative z-10 p-6 flex flex-col items-center justify-center text-center h-full min-h-[180px]">
        {/* Like icon with scroll-triggered bounce */}
        <motion.div
          ref={thumbRef}
          initial={{ rotate: -12, scale: 1 }}
          animate={getAnimate()}
          transition={getTransition()}
          className="mb-4"
        >
          <ThumbsUp size={48} className="text-white" strokeWidth={1.5} />
        </motion.div>

        {/* Text */}
        <h3 className="text-white font-bold text-lg leading-tight mb-2">
          Enjoying Orary?
        </h3>
        <p className="text-white/80 text-sm leading-relaxed max-w-[200px]">
          Share your experience and help us improve
        </p>
      </div>
    </BaseAnnouncementCard>
  );
};

export default SuggestedActionCard;
