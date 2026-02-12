// src/components/stats/DailyDistribution/index.jsx

import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../../utils/currency';
import { formatHoursDecimal } from '../../../utils/time';
import BaseStatsCard from '../../cards/base/BaseStatsCard';

const DAY_ABBREVIATIONS = {
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
  Sunday: 'Sun',
};

const DailyDistribution = ({ currentData, loading, thematicColors }) => {
  const { earningsByDay, totalEarned } = currentData || {};
  const [selectedDay, setSelectedDay] = useState(null);

  const isEmpty = !totalEarned || totalEarned === 0;

  // Process data
  const days = earningsByDay ? Object.entries(earningsByDay) : [];
  const maxEarnings = Math.max(...days.map(([, d]) => d.earnings || 0), 1);
  const busiestDay = days.reduce((best, [day, data]) => {
    return (data.earnings > (best?.earnings || 0)) ? { day, earnings: data.earnings } : best;
  }, null);

  const primaryColor = thematicColors?.primary || '#EC4899';

  return (
    <BaseStatsCard
      icon={Calendar}
      title="Weekly Distribution"
      loading={loading}
      empty={isEmpty}
      emptyMessage="No earnings data this week."
    >
      <div className="space-y-1.5">
        {days.map(([day, data], index) => {
          const earningsPercent = maxEarnings > 0 ? (data.earnings / maxEarnings) * 100 : 0;
          const isBusiest = busiestDay?.day === day && data.earnings > 0;
          const isSelected = selectedDay === day;
          const hasData = data.earnings > 0 || data.hours > 0;

          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <button
                onClick={() => setSelectedDay(isSelected ? null : day)}
                className={`w-full text-left rounded-xl transition-all ${
                  isSelected
                    ? 'bg-gray-100 dark:bg-slate-700 ring-1'
                    : 'hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
                style={{
                  ringColor: isSelected ? primaryColor : undefined,
                  '--tw-ring-color': isSelected ? primaryColor : undefined,
                }}
              >
                <div className="px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    {/* Day label */}
                    <div className="w-10 flex-shrink-0">
                      <span className={`text-sm font-semibold ${
                        isBusiest ? '' : 'text-gray-700 dark:text-gray-200'
                      }`}
                        style={isBusiest ? { color: primaryColor } : undefined}
                      >
                        {DAY_ABBREVIATIONS[day] || day.substring(0, 3)}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="flex-1 min-w-0">
                      <div className="w-full h-2.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(earningsPercent, hasData ? 3 : 0)}%` }}
                          transition={{ duration: 0.8, delay: index * 0.05, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: isBusiest ? primaryColor : `${primaryColor}80`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="w-20 text-right flex-shrink-0">
                      <span className={`text-sm font-bold ${
                        data.earnings > 0 ? '' : 'text-gray-300 dark:text-gray-600'
                      }`}
                        style={data.earnings > 0 ? { color: primaryColor } : undefined}
                      >
                        {formatCurrency(data.earnings)}
                      </span>
                    </div>

                    {/* Busiest badge */}
                    {isBusiest && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex-shrink-0"
                      >
                        <TrendingUp size={14} style={{ color: primaryColor }} />
                      </motion.div>
                    )}
                  </div>

                  {/* Expanded details */}
                  {isSelected && hasData && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="mt-2 pt-2 border-t border-gray-100 dark:border-slate-600"
                    >
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                          <Clock size={12} className="text-blue-500" />
                          <span>{formatHoursDecimal(data.hours)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                          <DollarSign size={12} style={{ color: primaryColor }} />
                          <span>{formatCurrency(data.earnings)}</span>
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {data.shifts} shift{data.shifts !== 1 ? 's' : ''}
                        </div>
                        {data.hours > 0 && (
                          <div className="text-gray-400 dark:text-gray-500 ml-auto">
                            {formatCurrency(data.earnings / data.hours)}/h
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Summary footer */}
      {days.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{days.filter(([, d]) => d.shifts > 0).length} active days</span>
            <span>Total: <strong className="dark:text-white" style={{ color: primaryColor }}>{formatCurrency(totalEarned)}</strong></span>
          </div>
        </div>
      )}
    </BaseStatsCard>
  );
};

export default DailyDistribution;
