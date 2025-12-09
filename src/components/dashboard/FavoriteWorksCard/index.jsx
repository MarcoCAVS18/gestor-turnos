import React from 'react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** BarChart3, ChevronRight ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** useIsMobile ***REMOVED*** from '../../../hooks/useIsMobile'; // Importamos el hook
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Flex from '../../ui/Flex';

const FavoriteWorksCard = (***REMOVED*** trabajosFavoritos ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const navigate = useNavigate();
  const isMobile = useIsMobile(); // Detectamos si es móvil

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
          // Activamos la animación de colapso en móvil
          collapsed=***REMOVED***isMobile***REMOVED***
          className="flex-shrink-0 flex items-center whitespace-nowrap"
          themeColor=***REMOVED***colors.primary***REMOVED***
          icon=***REMOVED***ChevronRight***REMOVED*** // Pasamos el icono como prop para que Button lo maneje en la animación
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
              <div 
                className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                style=***REMOVED******REMOVED*** backgroundColor: trabajoInfo.trabajo.color ***REMOVED******REMOVED***
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