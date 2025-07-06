// src/components/shifts/ShiftsList/index.jsx

import React, ***REMOVED*** createRef ***REMOVED*** from 'react';
import ***REMOVED*** TransitionGroup, CSSTransition ***REMOVED*** from 'react-transition-group';
import DaySection from '../../sections/DaySection';

function ShiftsList(***REMOVED*** daysToShow, allJobs, onEditShift, onDeleteShift ***REMOVED***) ***REMOVED***
  return (
    <div>
      <TransitionGroup component="div" className="space-y-6">
        ***REMOVED***daysToShow.map(([fecha, turnosDia]) => ***REMOVED***
          const nodeRef = createRef(null);
          return (
            <CSSTransition 
              key=***REMOVED***fecha***REMOVED*** 
              timeout=***REMOVED***500***REMOVED*** 
              classNames="day-section" 
              nodeRef=***REMOVED***nodeRef***REMOVED***
            >
              <DaySection
                ref=***REMOVED***nodeRef***REMOVED***
                fecha=***REMOVED***fecha***REMOVED***
                turnos=***REMOVED***turnosDia***REMOVED***
                trabajos=***REMOVED***allJobs***REMOVED***
                onEditTurno=***REMOVED***onEditShift***REMOVED***
                onDeleteTurno=***REMOVED***onDeleteShift***REMOVED***
              />
            </CSSTransition>
          );
        ***REMOVED***)***REMOVED***
      </TransitionGroup>
    </div>
  );
***REMOVED***

export default ShiftsList;