// src/components/stats/WeeklyComparison/index.jsx

import React, { useState } from 'react';
import { BarChart3, ChevronDown, DollarSign, Clock, TrendingUp, CalendarDays, CalendarCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../../../utils/currency';
import Card from '../../ui/Card';

const WeeklyComparison = ({ currentData, previousData, thematicColors, className = '' }) => {
  const [expandedIndex, setExpandedIndex] = useState(0); // Earnings open by default

  const hoursCurrent = currentData?.hoursWorked || 0;
  const hoursPrevious = previousData?.hoursWorked || 0;
  const shiftsCurrent = currentData?.totalShifts || 0;
  const shiftsPrevious = previousData?.totalShifts || 0;
  const earningsCurrent = (currentData && typeof currentData.totalEarned === 'number' && !isNaN(currentData.totalEarned)) ? currentData.totalEarned : 0;
  const earningsPrevious = (previousData && typeof previousData.totalEarned === 'number' && !isNaN(previousData.totalEarned)) ? previousData.totalEarned : 0;
  const daysCurrent = currentData?.daysWorked || 0;
  const daysPrevious = previousData?.daysWorked || 0;
  const avgCurrent = currentData?.averagePerHour || 0;
  const avgPrevious = previousData?.averagePerHour || 0;

  const calculateChange = (current, previous) => {
    if (previous === 0 && current === 0) return 0;
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  const comparisons = [
    {
      label: 'Earnings',
      icon: DollarSign,
      change: calculateChange(earningsCurrent, earningsPrevious),
      current: formatCurrency(earningsCurrent),
      previous: formatCurrency(earningsPrevious),
      delta: earningsCurrent >= earningsPrevious
        ? `+${formatCurrency(earningsCurrent - earningsPrevious)}`
        : `-${formatCurrency(earningsPrevious - earningsCurrent)}`
    },
    {
      label: 'Hours worked',
      icon: Clock,
      change: calculateChange(hoursCurrent, hoursPrevious),
      current: `${hoursCurrent.toFixed(1)}h`,
      previous: `${hoursPrevious.toFixed(1)}h`,
      delta: `${hoursCurrent >= hoursPrevious ? '+' : ''}${(hoursCurrent - hoursPrevious).toFixed(1)}h`
    },
    {
      label: 'Avg per hour',
      icon: TrendingUp,
      change: calculateChange(avgCurrent, avgPrevious),
      current: formatCurrency(avgCurrent),
      previous: formatCurrency(avgPrevious),
      delta: avgCurrent >= avgPrevious
        ? `+${formatCurrency(avgCurrent - avgPrevious)}`
        : `-${formatCurrency(avgPrevious - avgCurrent)}`
    },
    {
      label: 'Shifts',
      icon: CalendarDays,
      change: calculateChange(shiftsCurrent, shiftsPrevious),
      current: `${shiftsCurrent} shifts`,
      previous: `${shiftsPrevious} shifts`,
      delta: `${shiftsCurrent >= shiftsPrevious ? '+' : ''}${shiftsCurrent - shiftsPrevious} shifts`
    },
    {
      label: 'Days worked',
      icon: CalendarCheck,
      change: calculateChange(daysCurrent, daysPrevious),
      current: `${daysCurrent} days`,
      previous: `${daysPrevious} days`,
      delta: `${daysCurrent >= daysPrevious ? '+' : ''}${daysCurrent - daysPrevious} days`
    }
  ];

  // For light theme colors, darken them enough to be readable on white backgrounds.
  const ensureContrast = (hex) => {
    if (!hex || !hex.startsWith('#') || hex.length < 7) return hex;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    if (luminance > 0.65) {
      const d = (v) => Math.max(0, Math.floor(v * 0.65)).toString(16).padStart(2, '0');
      return `#${d(r)}${d(g)}${d(b)}`;
    }
    return hex;
  };

  // Positive → theme primary (contrast-safe). Negative → danger red. Neutral → gray.
  const getColor = (change) => {
    if (change > 0) return ensureContrast(thematicColors?.base) || '#10B981';
    if (change < 0) return thematicColors?.danger || '#EF4444';
    return '#9CA3AF';
  };

  // Positive → faint theme tint (inline style). Negative/neutral → Tailwind class.
  const getRowClass = (change) => {
    if (change < 0) return 'bg-red-50 dark:bg-red-900/20';
    if (change === 0) return 'bg-gray-50 dark:bg-gray-800/50';
    return ''; // handled via inline style
  };

  const getRowStyle = (change) => {
    if (change > 0) {
      const c = thematicColors?.base || '#10B981';
      return { backgroundColor: `${c}12` };
    }
    return {};
  };

  const handleToggle = (index) => {
    setExpandedIndex(prev => prev === index ? null : index);
  };

  return (
    <Card className={`flex flex-col ${className}`}>
      <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
        <BarChart3 size={20} style={{ color: thematicColors?.base }} />
        Weekly Comparison
        <span className="text-xs font-normal text-gray-400 dark:text-gray-500 ml-auto">
          vs last week
        </span>
      </h3>

      <div className="flex flex-col gap-2">
        {comparisons.map((comp, index) => {
          const isExpanded = expandedIndex === index;
          const color = getColor(comp.change);
          const absChange = Math.abs(comp.change);
          const barWidth = Math.min(absChange, 100);
          const isPositive = comp.change > 0;
          const isNeutral = comp.change === 0;

          return (
            <motion.div
              key={index}
              layout
              className={`rounded-xl overflow-hidden border border-transparent transition-colors duration-200 cursor-pointer
                hover:border-gray-200 dark:hover:border-gray-700
                ${isExpanded ? 'border-gray-200 dark:border-gray-700 shadow-sm' : ''}`}
              onClick={() => handleToggle(index)}
            >
              {/* Main row */}
              <div
                className={`flex items-center gap-3 p-3 ${getRowClass(comp.change)}`}
                style={getRowStyle(comp.change)}
              >
                {/* Icon */}
                <comp.icon size={16} className="flex-shrink-0" style={{ color: getColor(comp.change) }} />

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                    {comp.label}
                  </p>

                  {/* Mini progress bar */}
                  <div className="mt-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.05 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                </div>

                {/* Delta pill */}
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    color,
                    backgroundColor: `${color}18`
                  }}
                >
                  {isNeutral ? '—' : comp.delta}
                </span>

                {/* Percent */}
                <span className="text-xs font-bold w-12 text-right flex-shrink-0" style={{ color }}>
                  {isNeutral ? '0%' : `${isPositive ? '+' : ''}${comp.change.toFixed(1)}%`}
                </span>

                {/* Expand chevron */}
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown size={14} className="text-gray-400" />
                </motion.div>
              </div>

              {/* Expanded detail: current vs previous */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 pt-2 bg-white dark:bg-gray-900/40 flex gap-3">
                      <div className="flex-1 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-800/60 text-center">
                        <p className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-0.5">
                          This week
                        </p>
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                          {comp.current}
                        </p>
                      </div>
                      <div className="flex items-center text-gray-300 dark:text-gray-600">→</div>
                      <div className="flex-1 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-800/60 text-center">
                        <p className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-0.5">
                          Last week
                        </p>
                        <p className="text-sm font-bold text-gray-400 dark:text-gray-500">
                          {comp.previous}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <p className="text-[10px] text-gray-400 dark:text-gray-600 text-center mt-3">
        Tap any row to see current vs last week
      </p>
    </Card>
  );
};

export default WeeklyComparison;
