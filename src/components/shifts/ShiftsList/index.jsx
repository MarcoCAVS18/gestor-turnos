// src/components/shifts/ShiftsList/index.jsx

import React, { createRef } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import DaySection from '../../sections/DaySection';

function ShiftsList({ daysToShow, allJobs, onEditShift, onDeleteShift }) {
  return (
    <div>
      <TransitionGroup component="div" className="space-y-6">
        {daysToShow.map(([fecha, turnosDia]) => {
          const nodeRef = createRef(null);
          return (
            <CSSTransition 
              key={fecha} 
              timeout={500} 
              classNames="day-section" 
              nodeRef={nodeRef}
            >
              <DaySection
                ref={nodeRef}
                fecha={fecha}
                turnos={turnosDia}
                trabajos={allJobs}
                onEditTurno={onEditShift}
                onDeleteTurno={onDeleteShift}
              />
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </div>
  );
}

export default ShiftsList;