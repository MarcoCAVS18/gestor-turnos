// src/components/dashboard/NextShiftCard/index.jsx

import React from 'react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** Star, ChevronRight, CalendarX ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Flex from '../../ui/Flex';

const NextShiftCard = (***REMOVED*** nextShift, formatDate ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** works ***REMOVED*** = useApp();
  const colors = useThemeColors();
  const navigate = useNavigate();

  const work = nextShift ? works.find(t => t.id === nextShift.workId) : null;

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Star size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
        Next shift
      </h3>
      
      ***REMOVED***nextShift && work ? (
        <Flex variant="between">
          <div>
            <p className="font-semibold text-gray-800">***REMOVED***work.name***REMOVED***</p>
            <p className="text-sm text-gray-600">
              ***REMOVED***formatDate(nextShift.date)***REMOVED*** • ***REMOVED***nextShift.startTime***REMOVED***
            </p>
          </div>
          <Button
            onClick=***REMOVED***() => navigate('/calendario')***REMOVED***
            size="sm"
            className="flex items-center gap-1"
            icon=***REMOVED***ChevronRight***REMOVED***
            themeColor=***REMOVED***colors.primary***REMOVED***
          >
            View
          </Button>
        </Flex>
      ) : (
        <Flex variant="center" className="text-center text-gray-500 py-4">
          <CalendarX size=***REMOVED***24***REMOVED*** className="mr-2" />
          <p>You have no upcoming shifts.</p>
        </Flex>
      )***REMOVED***
    </Card>
  );
***REMOVED***;

export default NextShiftCard;