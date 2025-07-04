// src/components/dashboard/WelcomeCard/index.jsx

import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const WelcomeCard = (***REMOVED*** totalGanado ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** userEmoji, thematicColors ***REMOVED*** = useApp();

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Buenas! ***REMOVED***userEmoji***REMOVED***
          </h1>
          <p className="text-gray-600 mt-1">
            Aca tenes un resumen<br />
            de tu actividad
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total ganado</p>
          <p 
            className="text-2xl font-bold"
            style=***REMOVED******REMOVED*** color: thematicColors?.base || '#EC4899' ***REMOVED******REMOVED***
          >
            $***REMOVED***totalGanado.toFixed(2)***REMOVED***
          </p>
        </div>
      </div>
    </Card>
  );
***REMOVED***;

export default WelcomeCard;