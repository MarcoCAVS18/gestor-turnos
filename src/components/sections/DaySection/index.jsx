import React, ***REMOVED*** forwardRef ***REMOVED*** from 'react';
import ***REMOVED*** Calendar ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ShiftCard from '../../cards/shift/TarjetaTurno';
import DeliveryShiftCard from '../../cards/shift/TarjetaTurnoDelivery';
import ***REMOVED*** createSafeDate ***REMOVED*** from '../../../utils/time';

const DaySection = forwardRef((***REMOVED*** date, shifts, works, onEditShift, onDeleteShift ***REMOVED***, ref) => ***REMOVED***
  const ***REMOVED*** thematicColors ***REMOVED*** = useApp();

  const dateObj = createSafeDate(date);
  const dayOfWeek = dateObj.toLocaleDateString('en-US', ***REMOVED*** weekday: 'long' ***REMOVED***);
  const formattedDate = dateObj.toLocaleDateString('en-US', ***REMOVED*** 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  ***REMOVED***);

  return (
    <div ref=***REMOVED***ref***REMOVED*** className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200" style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent5 ***REMOVED******REMOVED***>
        <div className="flex items-center gap-2">
          <Calendar size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED*** />
          <h3 className="font-semibold text-gray-900 capitalize">
            ***REMOVED***dayOfWeek***REMOVED***, ***REMOVED***formattedDate***REMOVED***
          </h3>
        </div>
      </div>

      <div className="p-4 space-y-3">
        ***REMOVED***shifts.map(shift => ***REMOVED***
          const work = works.find(w => w.id === shift.workId);
          
          if (shift.type === 'delivery') ***REMOVED***
            return (
              <DeliveryShiftCard
                key=***REMOVED***shift.id***REMOVED***
                shift=***REMOVED***shift***REMOVED***
                work=***REMOVED***work***REMOVED***
                onEdit=***REMOVED***onEditShift***REMOVED***
                onDelete=***REMOVED***onDeleteShift***REMOVED***
              />
            );
          ***REMOVED***
          
          return (
            <ShiftCard
              key=***REMOVED***shift.id***REMOVED***
              shift=***REMOVED***shift***REMOVED***
              work=***REMOVED***work***REMOVED***
              onEdit=***REMOVED***onEditShift***REMOVED***
              onDelete=***REMOVED***onDeleteShift***REMOVED***
            />
          );
        ***REMOVED***)***REMOVED***
      </div>
    </div>
  );
***REMOVED***);

export default DaySection;