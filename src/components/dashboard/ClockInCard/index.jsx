// src/components/dashboard/ClockInCard/index.jsx

import React, { useState, useEffect } from 'react';
import { Play, Square, Clock, PauseCircle, ChevronRight } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Flex from '../../ui/Flex';
import Badge from '../../ui/Badge';
import { formatCurrency } from '../../../utils/currency';

const ClockInCard = ({
  onClockIn,
  onClockOut,
  onViewDetails,
  activeShift = null // If null, no active shift
}) => {
  const colors = useThemeColors();
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  useEffect(() => {
    let interval;
    if (activeShift) {
      interval = setInterval(() => {
        const now = new Date();
        const start = new Date(activeShift.startTime);
        const diff = now - start;
        const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        setElapsedTime(`${hours}:${minutes}:${seconds}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeShift]);

  // --- STATE 1: NO ACTIVE SHIFT ---
  if (!activeShift) {
    return (
      <div className="relative overflow-hidden rounded-2xl shadow-lg border border-gray-100 bg-white group cursor-pointer transition-all hover:shadow-xl" onClick={onClockIn}>
        {/* Subtle decorative background */}
        <div
          className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 rounded-full opacity-10 transition-transform group-hover:scale-110"
          style={{ backgroundColor: colors.primary }}
        />

        <div className="p-5 relative z-10">
          <Flex variant="between" className="mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Start Shift</h3>
              <p className="text-sm text-gray-500">Ready to work?</p>
            </div>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110"
              style={{ backgroundColor: colors.primary }}
            >
              <Play fill="currentColor" size={20} className="ml-1" />
            </div>
          </Flex>

          <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 p-2 rounded-lg w-fit">
            <Clock size={14} />
            <span>Quick clock-in available</span>
          </div>
        </div>
      </div>
    );
  }

  // --- STATE 2: ACTIVE SHIFT (ACTIVE STYLE) ---
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg text-white transition-all">
      {/* Animated Gradient Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary || '#4F46E5'} 100%)`
        }}
      />

      {/* Animated decorative circles (Pulse effect) */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-red-400 rounded-full animate-ping z-20" />
      <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full z-20" />

      <div className="p-6 relative z-10">
        <Flex variant="between" className="items-start mb-6">
          <div>
            <Badge variant="outline" className="text-white border-white/30 bg-white/10 mb-2">
              LIVE
            </Badge>
            <h2 className="text-4xl font-mono font-bold tracking-tight">
              {elapsedTime}
            </h2>
            <p className="text-white/80 text-sm mt-1 flex items-center gap-1">
              {activeShift.workName} • {formatCurrency(activeShift.currentEarnings || 0)} earned
            </p>
          </div>

          {/* Floating Details Button */}
          <button
            onClick={(e) => { e.stopPropagation(); onViewDetails?.(); }}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
          >
            <ChevronRight size={24} />
          </button>
        </Flex>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={(e) => { e.stopPropagation(); /* Pause */ }}
            className="flex items-center justify-center gap-2 py-3 rounded-xl transition-colors backdrop-blur-sm font-medium text-sm"
            style={{ backgroundColor: colors.transparent20 }}
          >
            <PauseCircle size={18} />
            <span>Pause</span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onClockOut?.(); }}
            className="flex items-center justify-center gap-2 py-3 rounded-xl transition-colors font-bold text-sm shadow-sm"
            style={{ backgroundColor: colors.transparent10, color: colors.textContrast }}
          >
            <Square fill="currentColor" size={16} />
            <span>Finish</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClockInCard;