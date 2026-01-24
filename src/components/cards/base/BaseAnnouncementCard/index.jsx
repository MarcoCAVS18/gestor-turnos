// src/components/cards/base/BaseAnnouncementCard/index.jsx

import React from 'react';
import ***REMOVED*** motion ***REMOVED*** from 'framer-motion';
import ***REMOVED*** Link ***REMOVED*** from 'react-router-dom';

const BaseAnnouncementCard = (***REMOVED***
  to,
  gradient,
  children,
  className = '',
  onClick,
  decorativeIcon: DecorativeIcon, // New prop
***REMOVED***) => ***REMOVED***
  const motionProps = ***REMOVED***
    whileHover: ***REMOVED*** scale: 1.01, transition: ***REMOVED*** type: 'spring', stiffness: 400, damping: 20 ***REMOVED*** ***REMOVED***
  ***REMOVED***;

  const commonClasses = `relative block group/card overflow-hidden rounded-xl transition-shadow duration-300 shadow-lg hover:shadow-2xl $***REMOVED***className***REMOVED***`;

  const content = (
    <motion.div
      ***REMOVED***...motionProps***REMOVED***
      className=***REMOVED***commonClasses***REMOVED***
      style=***REMOVED******REMOVED*** background: gradient ***REMOVED******REMOVED***
      onClick=***REMOVED***!to ? onClick : undefined***REMOVED***
    >
      ***REMOVED***/* Background decorative icon */***REMOVED***
      ***REMOVED***DecorativeIcon && (
        <DecorativeIcon
          className="absolute -right-4 -bottom-4 text-white/5"
          size=***REMOVED***100***REMOVED***
          strokeWidth=***REMOVED***1***REMOVED***
          style=***REMOVED******REMOVED*** transform: 'rotate(-20deg)' ***REMOVED******REMOVED***
        />
      )***REMOVED***

      ***REMOVED***/* Light effects */***REMOVED***
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-white opacity-5 bg-blend-soft-light rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-32 h-32 bg-white opacity-5 bg-blend-soft-light rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 h-full">
        ***REMOVED***children***REMOVED***
      </div>
    </motion.div>
  );

  return to ? <Link to=***REMOVED***to***REMOVED***>***REMOVED***content***REMOVED***</Link> : content;
***REMOVED***;

export default BaseAnnouncementCard;