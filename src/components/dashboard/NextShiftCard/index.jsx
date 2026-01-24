// src/components/dashboard/NextShiftCard/index.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronRight, CalendarX } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Flex from '../../ui/Flex';

const NextShiftCard = ({ nextShift, formatDate }) => {
  const { works } = useApp();
  const colors = useThemeColors();
  const navigate = useNavigate();

  const work = nextShift ? works.find(t => t.id === nextShift.workId) : null;

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Star size={20} style={{ color: colors.primary }} className="mr-2" />
        Next shift
      </h3>
      
      {nextShift && work ? (
        <Flex variant="between">
          <div>
            <p className="font-semibold text-gray-800">{work.name}</p>
            <p className="text-sm text-gray-600">
              {formatDate(nextShift.date)} • {nextShift.startTime}
            </p>
          </div>
          <Button
            onClick={() => navigate('/calendario')}
            size="sm"
            className="flex items-center gap-1"
            icon={ChevronRight}
            themeColor={colors.primary}
          >
            View
          </Button>
        </Flex>
      ) : (
        <Flex variant="center" className="text-center text-gray-500 py-4">
          <CalendarX size={24} className="mr-2" />
          <p>You have no upcoming shifts.</p>
        </Flex>
      )}
    </Card>
  );
};

export default NextShiftCard;