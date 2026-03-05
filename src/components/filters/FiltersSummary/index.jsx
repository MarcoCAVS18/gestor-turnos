// src/components/filters/FiltersSummary/index.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Flex from '../../ui/Flex';

const FiltersSummary = ({ filters, onRemoveFilter, onClearAll, statistics }) => {
  const { t } = useTranslation();
  const { works, deliveryWork } = useApp();
  const colors = useThemeColors();
  
  // Combine works to get names
  const allWorks = [...works, ...deliveryWork];
  
  // Check if there are active filters
  const hasActiveFilters = filters.work !== 'all' || 
                          filters.weekDays.length > 0 || 
                          filters.shiftType !== 'all';
  
  if (!hasActiveFilters) return null;

  // Get work name
  const getWorkName = (id) => {
    const work = allWorks.find(t => t.id === id);
    return work?.name || t('filters.unknownWork', 'Unknown work');
  };

  // Map days of the week - translated
  const weekDayLabels = {
    monday: t('common.days.monday'),
    tuesday: t('common.days.tuesday'),
    wednesday: t('common.days.wednesday'),
    thursday: t('common.days.thursday'),
    friday: t('common.days.friday'),
    saturday: t('common.days.saturday'),
    sunday: t('common.days.sunday')
  };

  // Map shift types - translated
  const shiftTypeLabels = {
    day: t('filters.shiftTypes.day'),
    afternoon: t('filters.shiftTypes.afternoon'),
    night: t('filters.shiftTypes.night'),
    saturday: t('filters.shiftTypes.saturday'),
    sunday: t('filters.shiftTypes.sunday'),
    delivery: t('filters.shiftTypes.delivery'),
    mixed: t('filters.shiftTypes.mixed')
  };

  return (
    <div 
      className="p-4 rounded-lg border-l-4 space-y-3"
      style={{ 
        backgroundColor: colors.transparent5,
        borderLeftColor: colors.primary 
      }}
    >
      {/* Statistics */}
      <Flex variant="between" className="text-sm">
        <span style={{ color: colors.primary }} className="font-medium">
          {t('filters.activeFilters', 'Active filters')}: {statistics?.filteredShifts || 0} {t('filters.of', 'of')} {statistics?.totalShifts || 0} {t('shifts.title').toLowerCase()}
        </span>
        <button
          onClick={onClearAll}
          className="flex items-center space-x-1 px-2 py-1 text-xs rounded-md hover:bg-gray-100 transition-colors"
          style={{ color: colors.primary }}
        >
          <X size={12} />
          <span>{t('filters.clearAll', 'Clear all')}</span>
        </button>
      </Flex>

      {/* Active filter tags */}
      <div className="flex flex-wrap gap-2">
        {filters.work !== 'all' && (
          <div 
            className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm"
            style={{ 
              backgroundColor: colors.transparent20,
              color: colors.primary 
            }}
          >
            <span>{t('filters.workLabel', 'Work')}: {getWorkName(filters.work)}</span>
            <button 
              onClick={() => onRemoveFilter('work')}
              className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
            >
              <X size={14} />
            </button>
          </div>
        )}
        
        {filters.weekDays.length > 0 && (
          <div 
            className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm"
            style={{ 
              backgroundColor: colors.transparent20,
              color: colors.primary 
            }}
          >
            <span>
              {t('filters.daysLabel', 'Days')}: {filters.weekDays.length === 7 
                ? t('filters.allDays', 'All') 
                : filters.weekDays.map(day => weekDayLabels[day]).join(', ')
              }
            </span>
            <button 
              onClick={() => onRemoveFilter('weekDays')}
              className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
            >
              <X size={14} />
            </button>
          </div>
        )}
        
        {filters.shiftType !== 'all' && (
          <Flex variant="center" 
            className="space-x-2 px-3 py-1 rounded-full text-sm"
            style={{ 
              backgroundColor: colors.transparent20,
              color: colors.primary 
            }}
          >
            <span>{t('filters.typeLabel', 'Type')}: {shiftTypeLabels[filters.shiftType] || filters.shiftType}</span>
            <button 
              onClick={() => onRemoveFilter('shiftType')}
              className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
            >
              <X size={14} />
            </button>
          </Flex>
        )}
      </div>
    </div>
  );
};

export default FiltersSummary;