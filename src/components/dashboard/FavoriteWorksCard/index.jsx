// src/components/dashboard/FavoriteWorksCard/index.jsx
import React from 'react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** BarChart3, ChevronRight ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** useIsMobile ***REMOVED*** from '../../../hooks/useIsMobile';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import ***REMOVED*** DELIVERY_PLATFORMS_AUSTRALIA ***REMOVED*** from '../../../constants/delivery';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Flex from '../../ui/Flex';

const FavoriteWorksCard = (***REMOVED*** favoriteWorks ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Helper function to get the correct color for the work
  const getWorkColor = (work) => ***REMOVED***
    // 1. If it is a traditional work, it has its own color
    if (work.color) return work.color;

    // 2. If it is delivery, we look for the color of the selected platform
    if (work.platform) ***REMOVED***
      const platform = DELIVERY_PLATFORMS_AUSTRALIA.find(
        p => p.name === work.platform
      );
      if (platform) return platform.color;
    ***REMOVED***

    // 3. Fallback: avatarColor or gray by default
    return work.avatarColor || '#9CA3AF';
  ***REMOVED***;

  if (favoriteWorks.length === 0) return null;

  return (
    <Card>
      <Flex variant="between" className="mb-4 flex-nowrap gap-3">
        <h3 className="text-base font-semibold flex items-center text-gray-800 truncate">
          <BarChart3 size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2 flex-shrink-0" />
          <span className="truncate">Favorite works</span>
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
          View more
        </Button>
      </Flex>
      
      <div className="space-y-3">
        ***REMOVED***favoriteWorks.map((workInfo, index) => (
          <Flex key=***REMOVED***workInfo.work.id***REMOVED*** variant="between">
            <Flex variant="center" className="overflow-hidden">
              <span className="text-sm font-semibold text-gray-400 mr-3 flex-shrink-0">
                #***REMOVED***index + 1***REMOVED***
              </span>
              
              ***REMOVED***/* Color indicator circle using the new function */***REMOVED***
              <div 
                className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                style=***REMOVED******REMOVED*** backgroundColor: getWorkColor(workInfo.work) ***REMOVED******REMOVED***
              />
              
              <div className="min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  ***REMOVED***workInfo.work.name***REMOVED***
                </p>
                <p className="text-xs text-gray-500">
                  ***REMOVED***workInfo.shifts***REMOVED*** shifts
                </p>
              </div>
            </Flex>
            <p 
              className="text-sm font-semibold whitespace-nowrap ml-2" 
              style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
            >
              ***REMOVED***formatCurrency(workInfo.earnings)***REMOVED***
            </p>
          </Flex>
        ))***REMOVED***
      </div>
    </Card>
  );
***REMOVED***;

export default FavoriteWorksCard;