// src/components/shifts/ShiftsNavigation/index.jsx

import React from 'react';
import { Eye } from 'lucide-react';
import GlassButton from '../../ui/GlassButton';

function ShiftsNavigation({ 
  hasMoreDays, 
  daysShown, 
  daysPerPage, 
  remainingDays, 
  expanding, 
  onShowMore, 
  onShowLess, 
  thematicColors 
}) {
  if (hasMoreDays) {
    return (
      <div className="relative flex flex-col items-center pt-4 pb-12">
        <div
          className="peek-card"
          style={{ backgroundColor: thematicColors?.transparent5 }}
        />
        <GlassButton
          onClick={onShowMore}
          loading={expanding}
          variant="primary"
          size="lg"
          icon={Eye}
          className="relative z-10"
        >
          Ver {Math.min(daysPerPage, remainingDays)} días más
        </GlassButton>
      </div>
    );
  }

  if (!hasMoreDays && daysShown > daysPerPage) {
    return (
      <div className="flex justify-center py-4">
        <GlassButton 
          onClick={onShowLess} 
          variant="secondary" 
          size="md"
        >
          Mostrar menos
        </GlassButton>
      </div>
    );
  }

  return null;
}

export default ShiftsNavigation;