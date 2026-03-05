// src/components/stats/WeekNavigator/index.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useIsMobile } from '../../../hooks/useIsMobile'; // Import hook

const WeekNavigator = ({
  weekOffset = 0,
  onWeekChange,
  startDate,
  endDate,
  weekStart,
  weekEnd,
  variant = 'default', // 'default' or 'transparent'
}) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const isMobile = useIsMobile(); // Use hook

  const changeWeek = typeof onWeekChange === 'function' ? onWeekChange : () => {};

  // Support both naming conventions (startDate/endDate and weekStart/weekEnd)
  const start = startDate || weekStart;
  const end = endDate || weekEnd;

  // Convert to Date objects if they're strings
  const validStartDate = start instanceof Date ? start : (start ? new Date(start) : new Date());
  const validEndDate = end instanceof Date ? end : (end ? new Date(end) : new Date());

  const getWeekTitle = () => {
    if (weekOffset === 0) return t('premium.weekNavigator.thisWeek');
    if (weekOffset === -1) return t('premium.weekNavigator.lastWeek');
    if (weekOffset === 1) return t('premium.weekNavigator.nextWeek');
    if (weekOffset > 1) return t('premium.weekNavigator.inWeeks', { count: weekOffset });
    return t('premium.weekNavigator.weeksAgo', { count: Math.abs(weekOffset) });
  };

  const formatDate = (date) => {
    try {
      return date.toLocaleDateString(t('common.locale', 'en-US'), { day: 'numeric', month: 'long' });
    } catch (error) {
      return t('common.invalidDate', 'Invalid date');
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