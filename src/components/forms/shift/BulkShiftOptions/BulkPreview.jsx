// src/components/forms/shift/BulkShiftOptions/BulkPreview.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock } from 'lucide-react';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import Card from '../../../ui/Card';

const BulkPreview = ({ shifts, workName }) => {
  const { t } = useTranslation();
  const colors = useThemeColors();

  if (!shifts || shifts.length === 0) {
    return null;
  }

  const MAX_PREVIEW_ITEMS = 3;
  const previewShifts = shifts.slice(0, MAX_PREVIEW_ITEMS);
  const remainingCount = shifts.length - MAX_PREVIEW_ITEMS;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card variant="surface2" className="mt-3">
      <div className="flex items-center gap-2 mb-3">
        <Calendar size={18} style={{ color: colors.primary }} />
        <h4 className="font-semibold" style={{ color: colors.text }}>
          {t('forms.shift.bulk.preview', { count: shifts.length })}
        </h4>
      </div>

      <div className="space-y-2">
        {previewShifts.map((shift, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-sm p-2 rounded"
            style={{ backgroundColor: colors.surface3 }}
          >
            <Clock size={14} style={{ color: colors.textSecondary }} />
            <span style={{ color: colors.text }}>
              {formatDate(shift.startDate)}
            </span>
            <span style={{ color: colors.textSecondary }}>•</span>
            <span style={{ color: colors.textSecondary }}>
              {shift.startTime} - {shift.endTime}
            </span>
          </div>
        ))}

        {remainingCount > 0 && (
          <div
            className="text-sm text-center py-2"
            style={{ color: colors.textSecondary }}
          >
            {t('forms.shift.bulk.andMore', { count: remainingCount })}
          </div>
        )}
      </div>

      {workName && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: colors.border }}>
          <div className="text-sm">
            <span style={{ color: colors.textSecondary }}>{t('forms.shift.bulk.workLabel')}</span>
            <span className="font-medium" style={{ color: colors.text }}>
              {workName}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default BulkPreview;
