// src/components/dashboard/FavoriteWorksCard/index.jsx

import React from 'react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** BarChart3, ChevronRight ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Flex from '../../ui/Flex';

const FavoriteWorksCard = (***REMOVED*** trabajosFavoritos ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const navigate = useNavigate();

  if (trabajosFavoritos.length === 0) return null;

  return (
    <Card>
      <Flex variant="between" className="mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <BarChart3 size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
          Trabajos favoritos
        </h3>
        <Button
          onClick=***REMOVED***() => navigate('/estadisticas')***REMOVED***
          size="sm"
          variant="ghost"
          className="flex items-center gap-1"
          themeColor=***REMOVED***colors.primary***REMOVED***
        >
          Ver más
          <ChevronRight size=***REMOVED***14***REMOVED*** className="-mr-1" />
        </Button>
      </Flex>
      
      <div className="space-y-3">
        ***REMOVED***trabajosFavoritos.map((trabajoInfo, index) => (
          <Flex key=***REMOVED***trabajoInfo.trabajo.id***REMOVED*** variant="between">
            <Flex variant="center">
              <span className="text-sm font-semibold text-gray-400 mr-3">
                #***REMOVED***index + 1***REMOVED***
              </span>
              <div 
                className="w-3 h-3 rounded-full mr-3"
                style=***REMOVED******REMOVED*** backgroundColor: trabajoInfo.trabajo.color ***REMOVED******REMOVED***
              />
              <div>
                <p className="font-medium text-gray-800">***REMOVED***trabajoInfo.trabajo.nombre***REMOVED***</p>
                <p className="text-xs text-gray-500">***REMOVED***trabajoInfo.turnos***REMOVED*** turnos</p>
              </div>
            </Flex>
            <p 
              className="text-sm font-semibold" 
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