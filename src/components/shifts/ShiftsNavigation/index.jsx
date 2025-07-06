// src/components/shifts/ShiftsNavigation/index.jsx

import React from 'react';
import ***REMOVED*** Eye ***REMOVED*** from 'lucide-react';
import GlassButton from '../../ui/GlassButton';

function ShiftsNavigation(***REMOVED*** 
  hasMoreDays, 
  daysShown, 
  daysPerPage, 
  remainingDays, 
  expanding, 
  onShowMore, 
  onShowLess, 
  thematicColors 
***REMOVED***) ***REMOVED***
  if (hasMoreDays) ***REMOVED***
    return (
      <div className="relative flex flex-col items-center pt-4 pb-12">
        <div
          className="peek-card"
          style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent5 ***REMOVED******REMOVED***
        />
        <GlassButton
          onClick=***REMOVED***onShowMore***REMOVED***
          loading=***REMOVED***expanding***REMOVED***
          variant="primary"
          size="lg"
          icon=***REMOVED***Eye***REMOVED***
          className="relative z-10"
        >
          Ver ***REMOVED***Math.min(daysPerPage, remainingDays)***REMOVED*** días más
        </GlassButton>
      </div>
    );
  ***REMOVED***

  if (!hasMoreDays && daysShown > daysPerPage) ***REMOVED***
    return (
      <div className="flex justify-center py-4">
        <GlassButton 
          onClick=***REMOVED***onShowLess***REMOVED*** 
          variant="secondary" 
          size="md"
        >
          Mostrar menos
        </GlassButton>
      </div>
    );
  ***REMOVED***

  return null;
***REMOVED***

export default ShiftsNavigation;