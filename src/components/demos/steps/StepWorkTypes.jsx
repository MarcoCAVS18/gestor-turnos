// src/components/demos/steps/StepWorkTypes.jsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Bike,
  Sun,
  Sunset,
  Moon,
  Calendar,
  CalendarHeart,
  Fuel,
  MapPin,
  DollarSign,
} from 'lucide-react';

const SHIFT_BADGES = [
  { label: 'Day', color: '#F59E0B', icon: Sun },
  { label: 'Afternoon', color: '#F97316', icon: Sunset },
  { label: 'Night', color: '#6366F1', icon: Moon },
  { label: 'Saturday', color: '#8B5CF6', icon: Calendar },
  { label: 'Sunday', color: '#EF4444', icon: CalendarHeart },
];

const StepWorkTypes = ({ isMobile }) => {
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={`flex flex-col h-full px-6 md:px-10 ${isMobile ? 'py-6' : 'py-8'}`}
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Two Ways to Work
        </h2>
        <p className="text-gray-500 text-sm md:text-base">
          Track time-based shifts or delivery earnings — your choice.
        </p>
      </motion.div>

      {/* Cards grid */}
      <div className={`flex-1 grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-5'}`}>
        {/* Traditional Card */}
        <motion.div
          variants={fadeUp}
          className="relative rounded-2xl overflow-hidden border border-amber-100 bg-gradient-to-br from-amber-50/80 to-orange-50/50 p-5"
        >
          {/* Decorative corner circle */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-amber-400/5" />

          <div className="relative z-10">
            {/* Icon header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-amber-400/15 flex items-center justify-center">
                <Clock size={20} className="text-amber-500" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Traditional</h3>
                <p className="text-xs text-gray-500">Time-based shifts</p>
              </div>
            </div>

            {/* Mini description */}
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Configure hourly rates for different shift types. Track hours, breaks, and calculate pay automatically.
            </p>

            {/* Shift type badges */}
            <div className="flex flex-wrap gap-1.5">
              {SHIFT_BADGES.map((badge, i) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.06, duration: 0.35 }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: badge.color + '18',
                    color: badge.color,
                  }}
                >
                  <badge.icon size={11} strokeWidth={2.5} />
                  <span>{badge.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Delivery Card */}
        <motion.div
          variants={fadeUp}
          className="relative rounded-2xl overflow-hidden border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-teal-50/50 p-5"
        >
          {/* Decorative corner circle */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-emerald-400/5" />

          <div className="relative z-10">
            {/* Icon header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-400/15 flex items-center justify-center">
                <Bike size={20} className="text-emerald-500" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Delivery</h3>
                <p className="text-xs text-gray-500">Earnings-based shifts</p>
              </div>
            </div>

            {/* Mini description */}
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Log your platform, vehicle, and earnings per session. Analyze fuel costs and hourly efficiency.
            </p>

            {/* Delivery feature tags */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { icon: MapPin, label: 'Platforms', color: '#10B981' },
                { icon: Fuel, label: 'Fuel Costs', color: '#0D9488' },
                { icon: DollarSign, label: 'Net Earnings', color: '#059669' },
              ].map((tag, i) => (
                <motion.div
                  key={tag.label}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.06, duration: 0.35 }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: tag.color + '18',
                    color: tag.color,
                  }}
                >
                  <tag.icon size={11} strokeWidth={2.5} />
                  <span>{tag.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StepWorkTypes;
