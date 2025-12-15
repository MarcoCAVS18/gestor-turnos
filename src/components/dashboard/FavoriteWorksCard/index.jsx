import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ChevronRight } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { formatCurrency } from '../../../utils/currency';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Flex from '../../ui/Flex';

const FavoriteWorksCard = ({ trabajosFavoritos }) => {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (trabajosFavoritos.length === 0) return null;

  return (
    <Card>
      <Flex variant="between" className="mb-4 flex-nowrap gap-3">
        <h3 className="text-base font-semibold flex items-center text-gray-800 truncate">
          <BarChart3 size={20} style={{ color: colors.primary }} className="mr-2 flex-shrink-0" />
          <span className="truncate">Trabajos favoritos</span>
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
          Ver más
        </Button>
      </Flex>
      
      <div className="space-y-3">
        {trabajosFavoritos.map((trabajoInfo, index) => (
          <Flex key={trabajoInfo.trabajo.id} variant="between">
            <Flex variant="center" className="overflow-hidden">
              <span className="text-sm font-semibold text-gray-400 mr-3 flex-shrink-0">
                #{index + 1}
              </span>
              <div 
                className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                style={{ backgroundColor: trabajoInfo.trabajo.color }}
              />
              <div className="min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {trabajoInfo.trabajo.nombre}
                </p>
                <p className="text-xs text-gray-500">
                  {trabajoInfo.turnos} turnos
                </p>
              </div>
            </Flex>
            <p 
              className="text-sm font-semibold whitespace-nowrap ml-2" 
              style={{ color: colors.primary }}
            >
              {formatCurrency(trabajoInfo.ganancia)}
            </p>
          </Flex>
        ))}
      </div>
    </Card>
  );
};

export default FavoriteWorksCard;