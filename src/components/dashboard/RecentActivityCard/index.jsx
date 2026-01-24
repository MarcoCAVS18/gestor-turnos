// src/components/dashboard/RecentActivityCard/index.jsx

import React, ***REMOVED*** useMemo ***REMOVED*** from 'react';
import ***REMOVED*** Activity, Briefcase, ChevronRight ***REMOVED*** from 'lucide-react'; 
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** useIsMobile ***REMOVED*** from '../../../hooks/useIsMobile'; 
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import ***REMOVED*** createSafeDate ***REMOVED*** from '../../../utils/time';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';
import Button from '../../ui/Button'; 

const RecentActivityCard = (***REMOVED*** stats, allWorks, allShifts ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const navigate = useNavigate();
  const isMobile = useIsMobile(); 

  const limit = isMobile ? 2 : 6;

  // Get recent shifts
  const recentShifts = useMemo(() => ***REMOVED***
    if (!Array.isArray(allShifts)) return [];
    
    return allShifts
      .sort((a, b) => ***REMOVED***
        const dateA = new Date((a.startTime || a.date) + 'T' + a.startTime);
        const dateB = new Date((b.startTime || b.date) + 'T' + b.startTime);
        return dateB - dateA;
      ***REMOVED***)
      .slice(0, limit);
  ***REMOVED***, [allShifts, limit]);

  // Function to get work
  const getWork = (workId) => ***REMOVED***
    return allWorks?.find(t => t.id === workId);
  ***REMOVED***;

  // Function to format relative date
  const formatRelativeDate = (dateStr) => ***REMOVED***
    try ***REMOVED***
      const date = createSafeDate(dateStr);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      if (date.toDateString() === today.toDateString()) return 'Today';
      if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

      return date.toLocaleDateString('en-US', ***REMOVED***
        day: 'numeric',
        month: 'short'
      ***REMOVED***);
    ***REMOVED*** catch (error) ***REMOVED***
      return dateStr;
    ***REMOVED***
  ***REMOVED***;

  // Calculate shift earnings
  const calculateShiftEarnings = (shift) => ***REMOVED***
    if (shift.type === 'delivery') ***REMOVED***
      return shift.totalEarnings || 0;
    ***REMOVED***
    
    const work = getWork(shift.workId);
    if (!work) return 0;
    
    const [startHour, startMin] = shift.startTime.split(':').map(Number);
    const [endHour, endMin] = shift.endTime.split(':').map(Number);
    let hours = (endHour + endMin/60) - (startHour + startMin/60);
    if (hours < 0) hours += 24;
    
    return hours * (work.baseRate || 0);
  ***REMOVED***;

  // Empty state
  if (recentShifts.length === 0) ***REMOVED***
    return (
      <Card className="h-full">
        <Flex variant="between" className="mb-4">
          <h3 className="text-base font-semibold flex items-center text-gray-800">
            <Activity size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
            Recent
          </h3>
        </Flex>
        
        <div className="text-center py-6">
          <Flex
            variant="center"
            className="p-3 rounded-full w-12 h-12 mx-auto mb-3"
            style=***REMOVED******REMOVED*** backgroundColor: colors.transparent10 ***REMOVED******REMOVED***
          >
            <Briefcase size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** />
          </Flex>
          <p className="text-sm text-gray-600 mb-3">No recent shifts</p>
          <Button
            onClick=***REMOVED***() => navigate('/turnos')***REMOVED***
            size="sm"
            variant="primary"
            themeColor=***REMOVED***colors.primary***REMOVED***
          >
            Add shift
          </Button>
        </div>
      </Card>
    );
  ***REMOVED***

  return (
    <Card className="h-full flex flex-col">
      <Flex variant="between" className="mb-4 flex-nowrap gap-3">
        <h3 className="text-base font-semibold flex items-center text-gray-800 truncate">
          <Activity size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2 flex-shrink-0" />
          <span className="truncate">Recent</span>
        </h3>
        
        <Button
          onClick=***REMOVED***() => navigate('/estadisticas')***REMOVED***
          size="sm"
          variant="ghost" 
          animatedChevron 
          collapsed=***REMOVED***isMobile***REMOVED***
          className="flex-shrink-0 whitespace-nowrap text-gray-400 hover:text-gray-600"
          themeColor=***REMOVED***colors.primary***REMOVED***
          icon=***REMOVED***ChevronRight***REMOVED***
          iconPosition="right"
        >
          View all
        </Button>
      </Flex>

      <div className="space-y-3 flex-grow">
        ***REMOVED***recentShifts.map((shift, index) => ***REMOVED***
          const work = getWork(shift.workId);
          const earnings = calculateShiftEarnings(shift);
          const relativeDate = formatRelativeDate(shift.startTime || shift.date);

          return (
            <Flex variant="between"
              key=***REMOVED***shift.id || index***REMOVED***
              className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
              onClick=***REMOVED***() => navigate('/turnos')***REMOVED***
            >
              <div className="flex items-center flex-1 min-w-0">
                <div 
                  className="w-2.5 h-2.5 rounded-full mr-2 flex-shrink-0"
                  style=***REMOVED******REMOVED*** backgroundColor: work?.color || work?.avatarColor || colors.primary ***REMOVED******REMOVED***
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 truncate">
                    ***REMOVED***work?.name || 'Deleted work'***REMOVED***
                  </p>
                  <p className="text-xs text-gray-500">
                    ***REMOVED***relativeDate***REMOVED***
                  </p>
                </div>
              </div>
              
              <div className="text-right flex-shrink-0 ml-2">
                <p className="text-sm font-semibold" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                  ***REMOVED***formatCurrency(earnings)***REMOVED***
                </p>
              </div>
            </Flex>
          );
        ***REMOVED***)***REMOVED***
      </div>

      ***REMOVED***/* Simple total */***REMOVED***
      <div className="mt-4 pt-3 border-t border-gray-200">
        <Flex variant="between">
          <span className="text-sm text-gray-600">Total recent:</span>
          <span className="text-lg font-bold" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
            ***REMOVED***formatCurrency(
              recentShifts.reduce((total, shift) => total + calculateShiftEarnings(shift), 0)
            )***REMOVED***
          </span>
        </Flex>
      </div>
    </Card>
  );
***REMOVED***;

export default RecentActivityCard;