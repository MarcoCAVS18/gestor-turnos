// src/components/shifts/ShiftDetailsPopover/index.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import Popover from '../../ui/Popover';
import { formatCurrency } from '../../../utils/currency';
import logger from '../../../utils/logger';

const ShiftDetailsPopover = ({ 
  shift, 
  shiftData, 
  children, 
  anchorRef,
  // New props with default values for the new design
  position = 'top', 
  fullWidth = true
}) => {
  const { t } = useTranslation();

  const formatCreationDate = (timestamp) => {
    if (!timestamp || typeof timestamp.seconds !== 'number') return '';
    try {
      const date = new Date(timestamp.seconds * 1000);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (e) {
      logger.error("Error formatting creation date:", e);
      return '';
    }
  };

  const hasNotes = shift.notes?.trim();
  const isDelivery = shift.type === 'delivery';

  // Determine if there is any content to show in the popover
  const hasContent = hasNotes || 
                     (isDelivery && shiftData && (shiftData.totalEarnings > 0 || shiftData.baseEarnings > 0 || shiftData.tips > 0 || shiftData.expenses > 0)) ||
                     (!isDelivery && shiftData && (shiftData.smokoApplied || shiftData.totalWithDiscount));

  if (!hasContent) {
    return <>{children}</>;
  }

  const content = (
    <div>
      {hasNotes && (
        <div className="mb-3 pb-2 border-b border-gray-100">
          <p className="font-semibold text-gray-700">{t('shifts.notes')}:</p>
          <p className="text-sm text-gray-600 break-words">{shift.notes}</p>
        </div>
      )}

      {isDelivery && shiftData ? (
        (() => {
          const grossEarnings = shiftData.baseEarnings ?? 0;
          const tips = shiftData.tips || 0;
          const expenses = shiftData.expenses || 0;
          const netEarnings = (shiftData.totalEarnings || 0) - expenses;

          return (
            <div>
              <p className="font-semibold text-gray-700 mb-1">{t('shifts.financialDetails')}:</p>
              <div className='text-sm text-gray-600 space-y-1'>
                <div className="flex justify-between"><span>{t('shifts.grossEarnings')}:</span> <span>{formatCurrency(grossEarnings)}</span></div>
                {tips > 0 && <div className="flex justify-between"><span>{t('shifts.tips')}:</span> <span>{formatCurrency(tips)}</span></div>}
                {expenses > 0 && <div className="flex justify-between"><span>{t('shifts.expenses')}:</span> <span className='text-red-500'>-{formatCurrency(expenses)}</span></div>}
                <div className="flex justify-between font-bold pt-1 border-t mt-1 border-gray-200"><span>{t('shifts.netEarnings')}:</span> <span className='text-green-600'>{formatCurrency(netEarnings)}</span></div>
              </div>
            </div>
          );
        })()
      ) : shiftData ? (
        <div className="space-y-2 text-sm">
          {shiftData.hoursBreakdown &&
            Object.entries(shiftData.hoursBreakdown)
              .filter(([, hours]) => hours > 0)
              .map(([type, hours]) => (
                <div key={type} className="flex justify-between text-gray-600">
                  <span>
                    {hours.toFixed(2)}{t('shifts.hoursIn')} {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                  <span>
                    {formatCurrency(shiftData.breakdown[type] || 0)}
                  </span>
                </div>
              ))}

          <div className="pt-1 border-t border-gray-100" />

          <div className="flex justify-between font-semibold">
            <span>{t('shifts.grossEarnings')}</span>
            <span>{formatCurrency(shiftData.total || 0)}</span>
          </div>

          {shiftData.defaultDiscount > 0 && (
            <div className="flex justify-between text-red-500">
              <span>{t('shifts.discount')} ({shiftData.defaultDiscount}%)</span>
              <span>
                -{formatCurrency((shiftData.total || 0) * (shiftData.defaultDiscount / 100))}
              </span>
            </div>
          )}

          {shiftData.smokoApplied && (
            <div className="flex justify-between text-red-500">
              <span>{t('shifts.smokoDiscount')}</span>
              <span>-{shiftData.smokoMinutes} min</span>
            </div>
          )}          
          <div className="flex justify-between items-center font-bold text-base pt-1 border-t border-gray-200">
            <span className="text-gray-700">{t('shifts.netEarnings')}</span>
            <span className="text-green-600">
              {formatCurrency(shiftData.totalWithDiscount || 0)}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );

  const footerContent = shift.createdAt ? `${t('shifts.created')}: ${formatCreationDate(shift.createdAt)}` : '';

  return (
    <Popover 
        content={content} 
        title={t('shifts.moreInfo')} 
        footer={footerContent}
        position={position}    // Use the prop (default 'top')
        trigger="click"
        anchorRef={anchorRef}  // Important: uses the reference from the full card
        fullWidth={fullWidth}  // Use the prop (default true)
    >
      {children}
    </Popover>
  );
};

export default ShiftDetailsPopover;
