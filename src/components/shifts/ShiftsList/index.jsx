// src/components/shifts/ShiftsList/index.jsx

import React, ***REMOVED*** createRef ***REMOVED*** from 'react';
import ***REMOVED*** TransitionGroup, CSSTransition ***REMOVED*** from 'react-transition-group';
import DaySection from '../../sections/DaySection';

function ShiftsList(***REMOVED*** daysToShow, allWorks, onEditShift, onDeleteShift ***REMOVED***) ***REMOVED***
  return (
    <div>
      <TransitionGroup component="div" className="space-y-6">
        ***REMOVED***daysToShow.map(([date, shiftsOfDay]) => ***REMOVED***
          const nodeRef = createRef(null);
          return (
            <CSSTransition 
              key=***REMOVED***date***REMOVED*** 
              timeout=***REMOVED***500***REMOVED*** 
              classNames="day-section" 
              nodeRef=***REMOVED***nodeRef***REMOVED***
            >
              <DaySection
                ref=***REMOVED***nodeRef***REMOVED***
                date=***REMOVED***date***REMOVED***
                shifts=***REMOVED***shiftsOfDay***REMOVED***
                works=***REMOVED***allWorks***REMOVED***
                onEditShift=***REMOVED***onEditShift***REMOVED***
                onDeleteShift=***REMOVED***onDeleteShift***REMOVED***
              />
            </CSSTransition>
          );
        ***REMOVED***)***REMOVED***
      </TransitionGroup>
    </div>
  );
***REMOVED***

export default ShiftsList;