// src/components/shifts/ShiftsList/index.jsx

import React, { createRef } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import DaySection from '../../sections/DaySection';

function ShiftsList({ daysToShow, allWorks, onEditShift, onDeleteShift }) {
  return (
    <div>
      <TransitionGroup component="div" className="space-y-6">
        {daysToShow.map(([date, shiftsOfDay]) => {
          const nodeRef = createRef(null);
          return (
            <CSSTransition 
              key={date} 
              timeout={500} 
              classNames="day-section" 
              nodeRef={nodeRef}
            >
              <DaySection
                ref={nodeRef}
                date={date}
                shifts={shiftsOfDay}
                works={allWorks}
                onEditShift={onEditShift}
                onDeleteShift={onDeleteShift}
              />
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </div>
  );
}

export default ShiftsList;