// src/components/dashboard/RecentActivityCard/index.jsx

import React, { useMemo } from 'react';
import { Activity, ChevronRight } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useIsMobile } from '../../../hooks/useIsMobile'; 
import { formatCurrency } from '../../../utils/currency';
import { createSafeDate } from '../../../utils/time';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';
import Button from '../../ui/Button'; 

const RecentActivityCard = ({ stats, allWorks, allShifts, calculatePayment }) => {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const isMobile = useIsMobile(); 

  const limit = isMobile ? 2 : 6;

  // Get recent shifts
  const recentShifts = useMemo(() => {
    if (!Array.isArray(allShifts)) return [];

    return allShifts
      .sort((a, b) => {
        const dateA = (a.startDate || a.date) || '';
        const dateB = (b.startDate || b.date) || '';
        const timeA = a.startTime || '00:00';
        const timeB = b.startTime || '00:00';
        const fullDateA = new Date(`${dateA}T${timeA}`);
        const fullDateB = new Date(`${dateB}T${timeB}`);
        return fullDateB - fullDateA; // Most recent first
      })
      .slice(0, limit);
  }, [allShifts, limit]);

  // Function to get work
  const getWork = (workId) => {
    return allWorks?.find(t => t.id === workId);
  };

  // Function to format relative date
  const formatRelativeDate = (dateStr) => {
    try {
      const date = createSafeDate(dateStr);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      if (date.toDateString() === today.toDateString()) return 'Today';
      if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short'
      });
    } catch {
      return dateStr;
    }
  };

  // Calculate shift earnings
  const calculateShiftEarnings = (shift) => {
    if (shift.type === 'delivery') {
      return shift.totalEarnings || 0;
    }

    const work = getWork(shift.workId);
    if (!work) return 0;

    // Use the proper calculatePayment function if available
    if (calculatePayment) {
      try {
        const result = calculatePayment(shift);
        return result.totalWithDiscount || 0;
      } catch {
        // Fallback to simple calculation
      }
    }

    // Fallback: simple calculation with baseRate
    const [startHour, startMin] = (shift.startTime || '00:00').split(':').map(Number);
    const [endHour, endMin] = (shift.endTime || '00:00').split(':').map(Number);
    let hours = (endHour + endMin/60) - (startHour + startMin/60);
    if (hours < 0) hours += 24;

    return hours * (work.baseRate || 0);
  };

  // Empty state (like FavoriteWorksCard)
  if (recentShifts.length === 0) {
    return (
      <Card className="flex flex-col h-full">
        <Flex variant="between" className="mb-4 flex-nowrap gap-3">
          <h3 className="text-base font-semibold flex items-center text-gray-800 truncate">
            <Activity size={20} style={{ color: colors.primary }} className="mr-2 flex-shrink-0" />
            <span className="truncate">Recent</span>
          </h3>
        </Flex>
        <Flex variant="center" className="flex-grow py-6">
          <div className="text-center text-gray-400">
            <Activity size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No data yet</p>
          </div>
        </Flex>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <Flex variant="between" className="mb-4 flex-nowrap gap-3">
        <h3 className="text-base font-semibold flex items-center text-gray-800 truncate">
          <Activity size={20} style={{ color: colors.primary }} className="mr-2 flex-shrink-0" />
          <span className="truncate">Recent</span>
        </h3>
        
        <Button
          onClick={() => navigate('/estadisticas')}
          size="sm"
          variant="ghost" 
          animatedChevron 
          collapsed={isMobile}
          className="flex-shrink-0 whitespace-nowrap text-gray-400 hover:text-gray-600"
          themeColor={colors.primary}
          icon={ChevronRight}
          iconPosition="right"
        >
          View all
        </Button>
      </Flex>

      <div className="space-y-3 flex-grow">
        {recentShifts.map((shift, index) => {
          const work = getWork(shift.workId);
          const earnings = calculateShiftEarnings(shift);
          const relativeDate = formatRelativeDate(shift.startDate || shift.date);

          return (
            <Flex variant="between"
              key={shift.id || index}
              className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
              onClick={() => navigate('/shifts')}
            >
              <div className="flex items-center flex-1 min-w-0">
                <div 
                  className="w-2.5 h-2.5 rounded-full mr-2 flex-shrink-0"
                  style={{ backgroundColor: work?.color || work?.avatarColor || colors.primary }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 truncate">
                    {work?.name || 'Deleted work'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {relativeDate}
                  </p>
                </div>
              </div>
              
              <div className="text-right flex-shrink-0 ml-2">
                <p className="text-sm font-semibold" style={{ color: colors.primary }}>
                  {formatCurrency(earnings)}
                </p>
              </div>
            </Flex>
          );
        })}
      </div>

      {/* Simple total */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <Flex variant="between">
          <span className="text-sm text-gray-600">Total recent:</span>
          <span className="text-lg font-bold" style={{ color: colors.primary }}>
            {formatCurrency(
              recentShifts.reduce((total, shift) => total + calculateShiftEarnings(shift), 0)
            )}
          </span>
        </Flex>
      </div>
    </Card>
  );
};

export default RecentActivityCard;