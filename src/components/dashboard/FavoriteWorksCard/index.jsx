// src/components/dashboard/FavoriteWorksCard/index.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ChevronRight } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { formatCurrency } from '../../../utils/currency';
import { DELIVERY_PLATFORMS_AUSTRALIA } from '../../../constants/delivery';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Flex from '../../ui/Flex';

const FavoriteWorksCard = ({ favoriteWorks }) => {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Helper function to get the correct color for the work
  const getWorkColor = (work) => {
    // 1. If it is a traditional work, it has its own color
    if (work.color) return work.color;

    // 2. If it is delivery, we look for the color of the selected platform
    if (work.platform) {
      const platform = DELIVERY_PLATFORMS_AUSTRALIA.find(
        p => p.name === work.platform
      );
      if (platform) return platform.color;
    }

    // 3. Fallback: avatarColor or gray by default
    return work.avatarColor || '#9CA3AF';
  };

  if (favoriteWorks.length === 0) return null;

  return (
    <Card>
      <Flex variant="between" className="mb-4 flex-nowrap gap-3">
        <h3 className="text-base font-semibold flex items-center text-gray-800 truncate">
          <BarChart3 size={20} style={{ color: colors.primary }} className="mr-2 flex-shrink-0" />
          <span className="truncate">Favorite works</span>
        </h3>
        
        <Button
          onClick={() => navigate('/estadisticas')}
          size="sm"
          variant="ghost" 
          animatedChevron 
          collapsed={isMobile}
          className="flex-shrink-0 whitespace-nowrap text-gray-400 hover:text-gray-600"
          themeColor={colors.primary}
          icon={ChevronRight}
          iconPosition="right"
        >
          View more
        </Button>
      </Flex>
      
      <div className="space-y-3">
        {favoriteWorks.map((workInfo, index) => (
          <Flex key={workInfo.work.id} variant="between">
            <Flex variant="center" className="overflow-hidden">
              <span className="text-sm font-semibold text-gray-400 mr-3 flex-shrink-0">
                #{index + 1}
              </span>
              
              {/* Color indicator circle using the new function */}
              <div 
                className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                style={{ backgroundColor: getWorkColor(workInfo.work) }}
              />
              
              <div className="min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {workInfo.work.name}
                </p>
                <p className="text-xs text-gray-500">
                  {workInfo.shifts} shifts
                </p>
              </div>
            </Flex>
            <p 
              className="text-sm font-semibold whitespace-nowrap ml-2" 
              style={{ color: colors.primary }}
            >
              {formatCurrency(workInfo.earnings)}
            </p>
          </Flex>
        ))}
      </div>
    </Card>
  );
};

export default FavoriteWorksCard;