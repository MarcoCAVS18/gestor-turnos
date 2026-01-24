// src/components/dashboard/QuickStatCard/index.jsx

import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, Store, Bike } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../ui/Card';

const QuickStatCard = ({ icon: Icon, label, value, subtitle, details, color, type }) => {
  const [showDetails, setShowDetails] = useState(false);

  const variants = {
    initial: { opacity: 0, scale: 0.9, filter: 'blur(4px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 1.1, filter: 'blur(4px)' }
  };

  return (
    <Card 
      className="p-0 h-full min-h-[160px] relative overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300 border-b-4 select-none"
      style={{ borderBottomColor: showDetails ? 'transparent' : color }}
      onClick={() => setShowDetails(!showDetails)}
    >
      <AnimatePresence mode="wait" initial={false}>
        {!showDetails ? (
          // --- MAIN VIEW ---
          <motion.div
            key="summary"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-2 md:p-4 text-center"
          >
            {/* flex-grow ensures content is vertically centered even if card is very tall */}
            <div className="flex-grow flex flex-col items-center justify-center w-full">
              {/* Responsive icon circle */}
              <div className="p-2 md:p-3 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors mb-1 md:mb-2">
                <Icon className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:scale-110 duration-300" style={{ color: color }} />
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-xs md:text-sm text-gray-500 font-medium block">{label}</span>
                {/* Smaller text on mobile (xl) so it doesn't break, large on desktop (3xl) */}
                <p className="text-xl md:text-3xl font-black text-gray-800 tracking-tight leading-tight my-0.5 md:my-0">
                  {value}
                </p>
                <p className="text-[10px] md:text-xs text-gray-400 font-medium uppercase tracking-wide">
                  {subtitle}
                </p>
              </div>
            </div>

            {/* "View more" stuck to bottom */}
            <div className="mt-auto pt-1 flex flex-col items-center opacity-60 group-hover:opacity-100 transition-opacity">
               <span className="text-[9px] md:text-[10px] text-gray-400 font-medium mb-0.5">View more</span>
               <ChevronDown size={12} className="text-gray-400 animate-bounce md:w-[14px] md:h-[14px]" />
            </div>
          </motion.div>
        ) : (
          // --- DETAIL VIEW ---
          <motion.div
            key="details"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gray-50 flex flex-col p-2 md:p-4 text-center"
          >
            <div className="flex items-center justify-between mb-2 pb-1 md:pb-2 border-b border-gray-200/50 shrink-0">
              <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider w-full text-center pl-4">Details</span>
              <ArrowLeft size={14} className="text-gray-400 absolute left-2 md:left-4 cursor-pointer hover:text-gray-600 md:w-[16px] md:h-[16px]" />
            </div>

            {/* Scrollable container in case content exceeds height */}
            <div className="flex-grow flex flex-col justify-center items-center gap-2 w-full overflow-y-auto no-scrollbar">
              {type === 'jobs' ? (
                <>
                  <div className="w-full flex items-center justify-between bg-white p-1.5 md:p-2 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <Store className="w-3 h-3 md:w-[14px] md:h-[14px] text-blue-500" />
                      <span className="text-[10px] md:text-xs text-gray-600 font-medium">Traditional</span>
                    </div>
                    <span className="text-xs md:text-sm font-bold text-gray-800">{details?.traditional || 0}</span>
                  </div>
                  <div className="w-full bg-white p-1.5 md:p-2 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <Bike className="w-3 h-3 md:w-[14px] md:h-[14px] text-orange-500" />
                        <span className="text-[10px] md:text-xs text-gray-600 font-medium">Delivery</span>
                      </div>
                      <span className="text-xs md:text-sm font-bold text-gray-800">{details?.delivery || 0}</span>
                    </div>
                    {details?.platforms && details.platforms.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-center mt-1 pt-1 border-t border-gray-50">
                        {details.platforms.slice(0, 3).map((p, i) => (
                          <span key={i} className="text-[9px] md:text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded-full border border-orange-100 max-w-[70px] truncate">
                            {p}
                          </span>
                        ))}
                         {details.platforms.length > 3 && (
                           <span className="text-[9px] text-gray-400">+{details.platforms.length - 3}</span>
                         )}
                      </div>
                    )}
                  </div>
                </>
              ) : Array.isArray(details) && details.length > 0 ? (
                details.map((item, idx) => (
                  <div key={idx} className="w-full flex items-center justify-between bg-white p-1.5 md:p-2.5 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      {item.icon && <item.icon className="w-3 h-3 md:w-[14px] md:h-[14px]" style={{ color: item.iconColor || '#9ca3af' }} />}
                      <span className="text-[10px] md:text-xs text-gray-600 font-medium truncate max-w-[80px] md:max-w-none text-left">{item.label}</span>
                    </div>
                    <span className="text-xs md:text-sm font-bold text-gray-800 whitespace-nowrap">{item.value}</span>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-xs">No data available</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default QuickStatCard;
