// src/components/demos/steps/StepAnalytics.jsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Clock,
  FileSpreadsheet,
  FileText,
  Download,
} from 'lucide-react';

// Mini bar chart data (7 days)
const CHART_DATA = [
  { day: 'Mon', value: 65, color: '#EC4899' },
  { day: 'Tue', value: 45, color: '#F472B6' },
  { day: 'Wed', value: 80, color: '#EC4899' },
  { day: 'Thu', value: 55, color: '#F472B6' },
  { day: 'Fri', value: 90, color: '#EC4899' },
  { day: 'Sat', value: 70, color: '#F472B6' },
  { day: 'Sun', value: 30, color: '#F9A8D4' },
];

const STATS = [
  { icon: DollarSign, label: 'Total Earned', value: '$2,847', color: '#10B981' },
  { icon: Clock, label: 'Hours Worked', value: '164h', color: '#6366F1' },
  { icon: TrendingUp, label: 'Avg per Hour', value: '$17.36', color: '#F59E0B' },
];

const StepAnalytics = ({ isMobile }) => {
  const maxVal = Math.max(...CHART_DATA.map((d) => d.value));

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
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
      className={`flex flex-col h-full px-6 md:px-10 ${isMobile ? 'py-6' : 'py-6'}`}
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="text-center mb-5">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Analyze & Export
        </h2>
        <p className="text-gray-500 text-sm md:text-base">
          Understand your performance. Export professional reports.
        </p>
      </motion.div>

      {/* Mini chart */}
      <motion.div
        variants={fadeUp}
        className="bg-gray-50 rounded-2xl border border-gray-100 p-4 mb-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 size={14} className="text-pink-500" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Weekly Earnings
          </span>
        </div>

        {/* Bar chart */}
        <div className="flex items-end justify-between gap-2 h-24">
          {CHART_DATA.map((bar, i) => (
            <div key={bar.day} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                className="w-full rounded-lg"
                style={{ backgroundColor: bar.color }}
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: `${(bar.value / maxVal) * 100}%`,
                  opacity: 1,
                }}
                transition={{
                  delay: 0.3 + i * 0.07,
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              />
              <span className="text-[10px] text-gray-400 font-medium">{bar.day}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        variants={fadeUp}
        className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-3'} gap-3 mb-4`}
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
            className="bg-white rounded-xl border border-gray-100 p-3 text-center shadow-sm"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
              style={{ backgroundColor: stat.color + '12' }}
            >
              <stat.icon size={14} style={{ color: stat.color }} strokeWidth={2.5} />
            </div>
            <p className="text-base font-bold text-gray-800">{stat.value}</p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Export buttons */}
      <motion.div variants={fadeUp} className="flex items-center justify-center gap-3">
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-100">
          <FileSpreadsheet size={16} className="text-blue-500" strokeWidth={2.5} />
          <span className="text-sm font-medium text-blue-600">Excel</span>
          <Download size={12} className="text-blue-400" />
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-pink-50 border border-pink-100">
          <FileText size={16} className="text-pink-500" strokeWidth={2.5} />
          <span className="text-sm font-medium text-pink-600">PDF</span>
          <Download size={12} className="text-pink-400" />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StepAnalytics;
