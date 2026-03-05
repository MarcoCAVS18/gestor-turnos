// src/components/calendar/CalendarHeader/index.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';

const CalendarHeader = ({
  currentMonth,
  currentYear,
  selectedDay,
  onChangeMonth,
  onGoToToday
}) => {
  const { t, i18n } = useTranslation();
  const colors = useThemeColors();

  const getMonthName = () => {
    const locale = i18n.language === 'es' ? 'es-ES' : i18n.language === 'fr' ? 'fr-FR' : 'en-US';
    return new Date(currentYear, currentMonth, 1).toLocaleDateString(locale, { month: 'long' });
  };

  const getSelectedDayLabel = () => {
    if (!selectedDay) return t('calendar.today');

    const today = new Date();
    const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    if (selectedDay === todayISO) return t('calendar.today');

    const [year, month, day] = selectedDay.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);

    const locale = i18n.language === 'es' ? 'es-ES' : i18n.language === 'fr' ? 'fr-FR' : 'en-US';
    return selectedDate.toLocaleDateString(locale, {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div
      className="p-4 text-white flex justify-between items-center"
      style={{ backgroundColor: colors.primary }}
    >
      <button
        onClick={() => onChangeMonth(-1)}
        className="text-white p-2 rounded-full transition-colors hover:bg-black hover:bg-opacity-20"
      >
        <ChevronLeft size={20} />
      </button>
      
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold capitalize">
          {getMonthName()} {currentYear}
        </h3>
        <button
          onClick={onGoToToday}
          className="text-xs px-3 py-1 rounded-full mt-1 transition-colors bg-white bg-opacity-20 hover:bg-opacity-30"
        >
          {getSelectedDayLabel()}
        </button>
      </div>
      
      <button
        onClick={() => onChangeMonth(1)}
        className="text-white p-2 rounded-full transition-colors hover:bg-black hover:bg-opacity-20"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default CalendarHeader;
