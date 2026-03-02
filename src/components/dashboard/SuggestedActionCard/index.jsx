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

  // Card-level hover state — drives the icon's hover animation
  const [isHovered, setIsHovered] = useState(false);

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

  const handleMouseEnter = () => {
    setIsHovered(true);
    // If the user hovers before the bounce completes, mark it done so that
    // after hover ends we go straight to the rocking loop instead of replaying.
    if (isInView && !hasPlayed) setHasPlayed(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Animation phases:
  // 0. Hover (card-level) → smooth spring tilt-up — priority over all other states
  // 1. Not in view yet   → static tilted pose
  // 2. Enters view       → "like" bounce: tilt back, spring up, settle
  // 3. After bounce      → gentle continuous rocking
  const getAnimate = () => {
    if (isHovered) return { rotate: -22, scale: 1.22 };
    if (!isInView && !hasPlayed) return { rotate: -12, scale: 1 };
    if (isInView && !hasPlayed) return {
      rotate: [-12, -40, 20, -28, 5, -12],
      scale:  [1,   1.45, 1.2, 1.35, 1.05, 1],
    };
    return { rotate: [-12, -8, -12] };
  };

  const getTransition = () => {
    if (isHovered) return { type: 'spring', stiffness: 320, damping: 10 };
    if (!isInView && !hasPlayed) return {};
    if (isInView && !hasPlayed) return {
      duration: 0.85,
      ease: 'easeOut',
      onComplete: () => setHasPlayed(true),
    };
    return { duration: 3, repeat: Infinity, ease: 'easeInOut' };
  };

  return (
    // Outer div captures card-level hover so the icon animates on full-card hover
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      <BaseAnnouncementCard
        onClick={handleClick}
        gradient={gradient}
        className="cursor-pointer h-full"
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
          {/* Like icon with scroll-triggered bounce + card-hover spring */}
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
    </div>
  );
};

export default SuggestedActionCard;
