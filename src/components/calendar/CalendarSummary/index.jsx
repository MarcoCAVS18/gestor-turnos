// src/components/calendar/CalendarSummary/index.jsx

import React from 'react';

const CalendarSummary = ({ totalTurnos, thematicColors }) => {
  if (totalTurnos === 0) return null;

  return (
    <div
      className="p-2 text-xs text-center font-medium"
      style={{
        backgroundColor: thematicColors?.transparent10 || 'rgba(236, 72, 153, 0.1)',
        color: thematicColors?.dark || '#BE185D'
      }}
    >
      {totalTurnos} {totalTurnos === 1 ? 'turno' : 'turnos'} este mes
    </div>
  );
};

export default CalendarSummary;