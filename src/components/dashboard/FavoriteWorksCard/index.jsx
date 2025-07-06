import React from 'react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** BarChart3, ChevronRight ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const FavoriteWorksCard = (***REMOVED*** trabajosFavoritos ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors ***REMOVED*** = useApp();
  const navigate = useNavigate();

  if (trabajosFavoritos.length === 0) return null;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <BarChart3 size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED*** className="mr-2" />
          Trabajos favoritos
        </h3>
        <Button
          onClick=***REMOVED***() => navigate('/estadisticas')***REMOVED***
          size="sm"
          variant="ghost"
          className="flex items-center gap-1"
          // Pasamos el color del tema al botón
          themeColor=***REMOVED***thematicColors?.base***REMOVED***
        >
          Ver más
          <ChevronRight size=***REMOVED***14***REMOVED*** className="-mr-1" />
        </Button>
      </div>
      
      <div className="space-y-3">
        ***REMOVED***trabajosFavoritos.map((trabajoInfo, index) => (
          <div key=***REMOVED***trabajoInfo.trabajo.id***REMOVED*** className="flex items-center justify-between">
            <div className="flex items-center">
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
            </div>
            <p 
              className="text-sm font-semibold" 
              style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED***
            >
              $***REMOVED***trabajoInfo.ganancia.toFixed(0)***REMOVED***
            </p>
          </div>
        ))***REMOVED***
      </div>
    </Card>
  );
***REMOVED***;

export default FavoriteWorksCard;