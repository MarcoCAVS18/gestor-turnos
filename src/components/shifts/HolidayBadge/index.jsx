// src/components/shifts/HolidayBadge/index.jsx

import React from 'react';
import { PartyPopper } from 'lucide-react';
import Badge from '../../ui/Badge';

const HolidayBadge = ({ size = 'xs', rounded = false }) => {
  return (
    <Badge
      variant="danger"
      size={size}
      rounded={rounded}
      icon={PartyPopper}
      className="flex items-center gap-1"
    >
      Holiday
    </Badge>
  );
};

export default HolidayBadge;
