// src/components/dashboard/FavoriteWorksCard/index.jsx
import React from 'react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** BarChart3, ChevronRight ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** useIsMobile ***REMOVED*** from '../../../hooks/useIsMobile';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import ***REMOVED*** DELIVERY_PLATFORMS_AUSTRALIA ***REMOVED*** from '../../../constants/delivery'; // Importamos las plataformas
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Flex from '../../ui/Flex';

const FavoriteWorksCard = (***REMOVED*** trabajosFavoritos ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Función auxiliar para obtener el color correcto del trabajo
  const getJobColor = (trabajo) => ***REMOVED***
    // 1. Si es trabajo tradicional, tiene su color propio
    if (trabajo.color) return trabajo.color;

    // 2. Si es delivery, buscamos el color de la plataforma seleccionada
    if (trabajo.plataforma) ***REMOVED***
      const platform = DELIVERY_PLATFORMS_AUSTRALIA.find(
        p => p.nombre === trabajo.plataforma
      );
      if (platform) return platform.color;
    ***REMOVED***

    // 3. Fallback: colorAvatar o gris por defecto
    return trabajo.colorAvatar || '#9CA3AF';
  ***REMOVED***;

  if (trabajosFavoritos.length === 0) return null;

  return (
    <Card>
      <Flex variant="between" className="mb-4 flex-nowrap gap-3">
        <h3 className="text-base font-semibold flex items-center text-gray-800 truncate">
          <BarChart3 size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2 flex-shrink-0" />
          <span className="truncate">Trabajos favoritos</span>
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
          Ver más
        </Button>
      </Flex>
      
      <div className="space-y-3">
        ***REMOVED***trabajosFavoritos.map((trabajoInfo, index) => (
          <Flex key=***REMOVED***trabajoInfo.trabajo.id***REMOVED*** variant="between">
            <Flex variant="center" className="overflow-hidden">
              <span className="text-sm font-semibold text-gray-400 mr-3 flex-shrink-0">
                #***REMOVED***index + 1***REMOVED***
              </span>
              
              ***REMOVED***/* Círculo indicador de color usando la nueva función */***REMOVED***
              <div 
                className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                style=***REMOVED******REMOVED*** backgroundColor: getJobColor(trabajoInfo.trabajo) ***REMOVED******REMOVED***
              />
              
              <div className="min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  ***REMOVED***trabajoInfo.trabajo.nombre***REMOVED***
                </p>
                <p className="text-xs text-gray-500">
                  ***REMOVED***trabajoInfo.turnos***REMOVED*** turnos
                </p>
              </div>
            </Flex>
            <p 
              className="text-sm font-semibold whitespace-nowrap ml-2" 
              style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
            >
              ***REMOVED***formatCurrency(trabajoInfo.ganancia)***REMOVED***
            </p>
          </Flex>
        ))***REMOVED***
      </div>
    </Card>
  );
***REMOVED***;

export default FavoriteWorksCard;