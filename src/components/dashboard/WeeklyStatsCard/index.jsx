// src/components/dashboard/WeeklyStatsCard/index.jsx - Versión vertical mejorada

import ***REMOVED*** Activity, TrendingUp, TrendingDown ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const WeeklyStatsCard = (***REMOVED*** stats ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors ***REMOVED*** = useApp();

  return (
    <Card className="h-full flex flex-col">
      ***REMOVED***/* Header */***REMOVED***
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <Activity size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED*** className="mr-2" />
          Esta semana
        </h3>
        ***REMOVED***stats.tendenciaSemanal !== 0 && (
          <div className=***REMOVED***`flex items-center text-sm $***REMOVED***
            stats.tendenciaSemanal > 0 ? 'text-green-600' : 'text-red-600'
          ***REMOVED***`***REMOVED***>
            ***REMOVED***stats.tendenciaSemanal > 0 ? (
              <TrendingUp size=***REMOVED***16***REMOVED*** className="mr-1" />
            ) : (
              <TrendingDown size=***REMOVED***16***REMOVED*** className="mr-1" />
            )***REMOVED***
            ***REMOVED***stats.tendenciaSemanal.toFixed(1)***REMOVED***%
          </div>
        )***REMOVED***
      </div>
      
      ***REMOVED***/* Stats - Layout vertical */***REMOVED***
      <div className="flex-1 space-y-8">
        ***REMOVED***/* Turnos completados */***REMOVED***
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Turnos completados</p>
          <p className="text-3xl font-bold text-gray-800">***REMOVED***stats.turnosEstaSemana***REMOVED***</p>
        </div>
        
        ***REMOVED***/* Separador visual */***REMOVED***
        <div className="w-full h-px bg-gray-200"></div>
        
        ***REMOVED***/* Ganancias */***REMOVED***
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Ganancias</p>
          <p 
            className="text-3xl font-bold" 
            style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED***
          >
            $***REMOVED***stats.gananciasEstaSemana.toFixed(0)***REMOVED***
          </p>
        </div>
      </div>
    </Card>
  );
***REMOVED***;

export default WeeklyStatsCard;