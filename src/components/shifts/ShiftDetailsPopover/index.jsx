// src/components/shifts/ShiftDetailsPopover/index.jsx

import React from 'react';
import Popover from '../../ui/Popover';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';

const ShiftDetailsPopover = (***REMOVED*** 
  shift, 
  shiftData, 
  children, 
  anchorRef,
  // New props with default values for the new design
  position = 'top', 
  fullWidth = true
***REMOVED***) => ***REMOVED***
  const formatCreationDate = (timestamp) => ***REMOVED***
    if (!timestamp || typeof timestamp.seconds !== 'number') return '';
    try ***REMOVED***
      const date = new Date(timestamp.seconds * 1000);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `$***REMOVED***day***REMOVED***/$***REMOVED***month***REMOVED***/$***REMOVED***year***REMOVED*** $***REMOVED***hours***REMOVED***:$***REMOVED***minutes***REMOVED***`;
    ***REMOVED*** catch (e) ***REMOVED***
      console.error("Error formatting creation date:", e);
      return '';
    ***REMOVED***
  ***REMOVED***;

  const hasNotes = shift.notes?.trim();
  const isDelivery = shift.type === 'delivery';

  // Determine if there is any content to show in the popover
  const hasContent = hasNotes || 
                     (isDelivery && shiftData && (shiftData.totalEarnings > 0 || shiftData.baseEarnings > 0 || shiftData.tips > 0 || shiftData.expenses > 0)) ||
                     (!isDelivery && shiftData && (shiftData.smokoApplied || shiftData.totalWithDiscount));

  if (!hasContent) ***REMOVED***
    return <>***REMOVED***children***REMOVED***</>;
  ***REMOVED***

  const content = (
    <div>
      ***REMOVED***hasNotes && (
        <div className="mb-3 pb-2 border-b border-gray-100">
          <p className="font-semibold text-gray-700">Notes:</p>
          <p className="text-sm text-gray-600 break-words">***REMOVED***shift.notes***REMOVED***</p>
        </div>
      )***REMOVED***

      ***REMOVED***isDelivery && shiftData ? (
        (() => ***REMOVED***
          const grossEarnings = shiftData.baseEarnings ?? 0;
          const tips = shiftData.tips || 0;
          const expenses = shiftData.expenses || 0;
          const netEarnings = (shiftData.totalEarnings || 0) - expenses;

          return (
            <div>
              <p className="font-semibold text-gray-700 mb-1">Financial Details:</p>
              <div className='text-sm text-gray-600 space-y-1'>
                <div className="flex justify-between"><span>Gross Earnings:</span> <span>***REMOVED***formatCurrency(grossEarnings)***REMOVED***</span></div>
                ***REMOVED***tips > 0 && <div className="flex justify-between"><span>Tips:</span> <span>***REMOVED***formatCurrency(tips)***REMOVED***</span></div>***REMOVED***
                ***REMOVED***expenses > 0 && <div className="flex justify-between"><span>Expenses:</span> <span className='text-red-500'>-***REMOVED***formatCurrency(expenses)***REMOVED***</span></div>***REMOVED***
                <div className="flex justify-between font-bold pt-1 border-t mt-1 border-gray-200"><span>Net Earnings:</span> <span className='text-green-600'>***REMOVED***formatCurrency(netEarnings)***REMOVED***</span></div>
              </div>
            </div>
          );
        ***REMOVED***)()
      ) : shiftData ? (
        <div className="space-y-2 text-sm">
          ***REMOVED***shiftData.hoursBreakdown &&
            Object.entries(shiftData.hoursBreakdown)
              .filter(([, hours]) => hours > 0)
              .map(([type, hours]) => (
                <div key=***REMOVED***type***REMOVED*** className="flex justify-between text-gray-600">
                  <span>
                    ***REMOVED***hours.toFixed(2)***REMOVED***hs in ***REMOVED***type.charAt(0).toUpperCase() + type.slice(1)***REMOVED***
                  </span>
                  <span>
                    ***REMOVED***formatCurrency(shiftData.breakdown[type] || 0)***REMOVED***
                  </span>
                </div>
              ))***REMOVED***

          <div className="pt-1 border-t border-gray-100" />

          <div className="flex justify-between font-semibold">
            <span>Gross Earnings</span>
            <span>***REMOVED***formatCurrency(shiftData.total || 0)***REMOVED***</span>
          </div>

          ***REMOVED***shiftData.defaultDiscount > 0 && (
            <div className="flex justify-between text-red-500">
              <span>Discount (***REMOVED***shiftData.defaultDiscount***REMOVED***%)</span>
              <span>
                -***REMOVED***formatCurrency((shiftData.total || 0) * (shiftData.defaultDiscount / 100))***REMOVED***
              </span>
            </div>
          )***REMOVED***

          ***REMOVED***shiftData.smokoApplied && (
            <div className="flex justify-between text-red-500">
              <span>Smoko Discount</span>
              <span>-***REMOVED***shiftData.smokoMinutes***REMOVED*** min</span>
            </div>
          )***REMOVED***          
          <div className="flex justify-between items-center font-bold text-base pt-1 border-t border-gray-200">
            <span className="text-gray-700">Net Earnings</span>
            <span className="text-green-600">
              ***REMOVED***formatCurrency(shiftData.totalWithDiscount || 0)***REMOVED***
            </span>
          </div>
        </div>
      ) : null***REMOVED***
    </div>
  );

  const footerContent = shift.createdAt ? `Created: $***REMOVED***formatCreationDate(shift.createdAt)***REMOVED***` : '';

  return (
    <Popover 
        content=***REMOVED***content***REMOVED*** 
        title="More information" 
        footer=***REMOVED***footerContent***REMOVED***
        position=***REMOVED***position***REMOVED***    // Use the prop (default 'top')
        trigger="click"
        anchorRef=***REMOVED***anchorRef***REMOVED***  // Important: uses the reference from the full card
        fullWidth=***REMOVED***fullWidth***REMOVED***  // Use the prop (default true)
    >
      ***REMOVED***children***REMOVED***
    </Popover>
  );
***REMOVED***;

export default ShiftDetailsPopover;