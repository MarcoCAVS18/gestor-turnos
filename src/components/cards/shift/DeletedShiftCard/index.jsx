// src/components/cards/shift/DeletedShiftCard/index.jsx
// Reusable placeholder card shown when a shift's associated job has been deleted.

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import Card from '../../../ui/Card';

const DeletedShiftCard = ({ shift }) => {
  const { t } = useTranslation();
  
  return (
    <Card variant="outlined" className="opacity-40 min-h-[220px] flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-3 text-center px-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
          <Trash2 size={22} className="text-gray-400 dark:text-gray-500" />
        </div>
        <div>
          <p className="text-base font-semibold text-gray-500 dark:text-gray-400">{t('shifts.jobDeleted')}</p>
          {shift?.startTime && shift?.endTime && (
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              {shift.startTime} – {shift.endTime}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DeletedShiftCard;
