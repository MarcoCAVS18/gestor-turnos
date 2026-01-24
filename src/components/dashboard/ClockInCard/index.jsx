// src/components/dashboard/ClockInCard/index.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** Play, Square, Clock, PauseCircle, ChevronRight ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import Flex from '../../ui/Flex';
import Badge from '../../ui/Badge';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';

const ClockInCard = (***REMOVED*** 
  onClockIn, 
  onClockOut, 
  onViewDetails, 
  activeShift = null // If null, no active shift
***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  useEffect(() => ***REMOVED***
    let interval;
    if (activeShift) ***REMOVED***
      interval = setInterval(() => ***REMOVED***
        const now = new Date();
        const start = new Date(activeShift.startTime);
        const diff = now - start;
        const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        setElapsedTime(`$***REMOVED***hours***REMOVED***:$***REMOVED***minutes***REMOVED***:$***REMOVED***seconds***REMOVED***`);
      ***REMOVED***, 1000);
    ***REMOVED***
    return () => clearInterval(interval);
  ***REMOVED***, [activeShift]);

  // --- STATE 1: NO ACTIVE SHIFT ---
  if (!activeShift) ***REMOVED***
    return (
      <div className="relative overflow-hidden rounded-2xl shadow-lg border border-gray-100 bg-white group cursor-pointer transition-all hover:shadow-xl" onClick=***REMOVED***onClockIn***REMOVED***>
        ***REMOVED***/* Subtle decorative background */***REMOVED***
        <div 
          className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 rounded-full opacity-10 transition-transform group-hover:scale-110"
          style=***REMOVED******REMOVED*** backgroundColor: colors.primary ***REMOVED******REMOVED***
        />
        
        <div className="p-5 relative z-10">
          <Flex variant="between" className="mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Start Shift</h3>
              <p className="text-sm text-gray-500">Ready to work?</p>
            </div>
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110"
              style=***REMOVED******REMOVED*** backgroundColor: colors.primary ***REMOVED******REMOVED***
            >
              <Play fill="currentColor" size=***REMOVED***20***REMOVED*** className="ml-1" />
            </div>
          </Flex>
          
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 p-2 rounded-lg w-fit">
            <Clock size=***REMOVED***14***REMOVED*** />
            <span>Quick clock-in available</span>
          </div>
        </div>
      </div>
    );
  ***REMOVED***

  // --- STATE 2: ACTIVE SHIFT (ACTIVE STYLE) ---
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg text-white transition-all">
      ***REMOVED***/* Animated Gradient Background */***REMOVED***
      <div 
        className="absolute inset-0 z-0"
        style=***REMOVED******REMOVED*** 
          background: `linear-gradient(135deg, $***REMOVED***colors.primary***REMOVED*** 0%, $***REMOVED***colors.secondary || '#4F46E5'***REMOVED*** 100%)` 
        ***REMOVED******REMOVED***
      />
      
      ***REMOVED***/* Animated decorative circles (Pulse effect) */***REMOVED***
      <div className="absolute top-4 right-4 w-2 h-2 bg-red-400 rounded-full animate-ping z-20" />
      <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full z-20" />

      <div className="p-6 relative z-10">
        <Flex variant="between" className="items-start mb-6">
          <div>
            <Badge variant="outline" className="text-white border-white/30 bg-white/10 mb-2">
              LIVE
            </Badge>
            <h2 className="text-4xl font-mono font-bold tracking-tight">
              ***REMOVED***elapsedTime***REMOVED***
            </h2>
            <p className="text-white/80 text-sm mt-1 flex items-center gap-1">
              ***REMOVED***activeShift.workName***REMOVED*** • ***REMOVED***formatCurrency(activeShift.currentEarnings || 0)***REMOVED*** earned
            </p>
          </div>
          
          ***REMOVED***/* Floating Details Button */***REMOVED***
          <button 
            onClick=***REMOVED***(e) => ***REMOVED*** e.stopPropagation(); onViewDetails?.(); ***REMOVED******REMOVED***
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
          >
            <ChevronRight size=***REMOVED***24***REMOVED*** />
          </button>
        </Flex>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <button 
            onClick=***REMOVED***(e) => ***REMOVED*** e.stopPropagation(); /* Pause */ ***REMOVED******REMOVED***
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm font-medium text-sm"
          >
            <PauseCircle size=***REMOVED***18***REMOVED*** />
            <span>Pause</span>
          </button>
          
          <button 
            onClick=***REMOVED***(e) => ***REMOVED*** e.stopPropagation(); onClockOut?.(); ***REMOVED******REMOVED***
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-red-600 hover:bg-gray-50 transition-colors font-bold text-sm shadow-sm"
          >
            <Square fill="currentColor" size=***REMOVED***16***REMOVED*** />
            <span>Finish</span>
          </button>
        </div>
      </div>
    </div>
  );
***REMOVED***;

export default ClockInCard;