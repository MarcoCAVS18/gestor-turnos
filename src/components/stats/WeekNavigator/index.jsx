// src/components/stats/WeekNavigator/index.jsx

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useIsMobile } from '../../../hooks/useIsMobile'; // Import hook

const WeekNavigator = ({
  weekOffset = 0,
  onWeekChange,
  startDate,
  endDate,
  variant = 'default', // 'default' or 'transparent'
}) => {
  const colors = useThemeColors();
  const isMobile = useIsMobile(); // Use hook

  const changeWeek = typeof onWeekChange === 'function' ? onWeekChange : () => {};
  const validStartDate = startDate instanceof Date ? startDate : new Date();
  const validEndDate = endDate instanceof Date ? endDate : new Date();

  const getWeekTitle = () => {
    if (weekOffset === 0) return 'This week';
    if (weekOffset === -1) return 'Last week';
    // ... (rest of the logic)
    if (weekOffset === 1) return 'Next week';
    if (weekOffset > 1) return `In ${weekOffset} weeks`;
    return `${Math.abs(weekOffset)} weeks ago`;
  };

  const formatDate = (date) => {
    try {
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const isTransparent = variant === 'transparent';

  const containerClasses = isTransparent
    ? 'p-4'
    : 'rounded-xl p-4';

  const titleClasses = isTransparent
    ? 'text-lg text-gray-700'
    : 'text-xl font-semibold';

  const subtitleClasses = isTransparent ? 'text-gray-500' : 'text-sm text-gray-600';

  // Unify buttons to avoid duplication
  const renderNavButton = (direction) => (
    <button
      onClick={() => changeWeek(weekOffset + (direction === 'left' ? -1 : 1))}
      className={`p-2 rounded-full transition-colors ${isMobile && !isTransparent ? 'p-3' : ''}`}
      style={{ backgroundColor: colors.transparent10, color: colors.primary }}
    >
      {direction === 'left' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
    </button>
  );

  // Conditional rendering based on isMobile and variant
  if (isMobile && isTransparent) {
    // Layout for mobile and transparent (below title)
    return (
      <div className="flex items-center justify-between w-full">
        {renderNavButton('left')}
        <div className="text-center">
          <h2 className="text-lg font-semibold">{getWeekTitle()}</h2>
          <p className="text-sm text-gray-500">
            {formatDate(validStartDate)} - {formatDate(validEndDate)}
          </p>
        </div>
        {renderNavButton('right')}
      </div>
    );
  }

  // Original layout for desktop or when not transparent on mobile
  return (
    <div className={containerClasses}>
      <div className="flex flex-row items-center justify-between">
        {/* Left Button */}
        {renderNavButton('left')}

        {/* Center Content */}
        <div className="text-center">
          <h2 className={titleClasses}>{getWeekTitle()}</h2>
          <p className={subtitleClasses}>
            {formatDate(validStartDate)} - {formatDate(validEndDate)}
          </p>
        </div>

        {/* Right Button */}
        {renderNavButton('right')}
      </div>
    </div>
  );
};

export default WeekNavigator;