// src/components/cards/base/BaseAnnouncementCard/index.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const BaseAnnouncementCard = ({
  to,
  gradient,
  children,
  className = '',
  onClick,
  decorativeIcon: DecorativeIcon, // New prop
}) => {
  const motionProps = {
    whileHover: { scale: 1.01, transition: { type: 'spring', stiffness: 400, damping: 20 } }
  };

  const commonClasses = `relative block group/card overflow-hidden rounded-xl transition-shadow duration-300 shadow-lg hover:shadow-2xl ${className}`;

  const content = (
    <motion.div
      {...motionProps}
      className={commonClasses}
      style={{ background: gradient }}
      onClick={!to ? onClick : undefined}
    >
      {/* Background decorative icon */}
      {DecorativeIcon && (
        <DecorativeIcon
          className="absolute -right-4 -bottom-4 text-white/5"
          size={100}
          strokeWidth={1}
          style={{ transform: 'rotate(-20deg)' }}
        />
      )}

      {/* Light effects */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-white opacity-5 bg-blend-soft-light rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-32 h-32 bg-white opacity-5 bg-blend-soft-light rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
};

export default BaseAnnouncementCard;