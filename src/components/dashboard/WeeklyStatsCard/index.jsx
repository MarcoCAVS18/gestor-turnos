// src/components/dashboard/WeeklyStatsCard/index.jsx

import ***REMOVED*** Activity, TrendingUp, TrendingDown ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const WeeklyStatsCard = (***REMOVED*** stats ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors ***REMOVED*** = useApp();

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
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
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Turnos completados</p>
          <p className="text-xl font-bold">***REMOVED***stats.turnosEstaSemana***REMOVED***</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Ganancias</p>
          <p 
            className="text-xl font-bold" 
            style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED***
          >
            $***REMOVED***stats.gananciasEstaSemana.toFixed(2)***REMOVED***
          </p>
        </div>
      </div>
    </Card>
  );
***REMOVED***;

export default WeeklyStatsCard;