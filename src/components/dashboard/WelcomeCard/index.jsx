// src/components/dashboard/WelcomeCard/index.jsx

import ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useAuth ***REMOVED*** from '../../../contexts/AuthContext';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const WelcomeCard = (***REMOVED*** totalGanado ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** currentUser ***REMOVED*** = useAuth();
  const ***REMOVED*** userEmoji, thematicColors ***REMOVED*** = useApp();
  const [userName, setUserName] = useState('');
  
  useEffect(() => ***REMOVED***
    if (currentUser) ***REMOVED***
      setUserName(
        currentUser.displayName || 
        (currentUser.email ? currentUser.email.split('@')[0] : '')
      );
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  // Función para obtener el saludo según la hora
  const getSaludo = () => ***REMOVED***
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días,';
    if (hora < 18) return 'Buenas tardes,';
    return 'Buenas noches,';
  ***REMOVED***;

  return (
    <Card>
      ***REMOVED***/* MÓVIL: Layout vertical centrado */***REMOVED***
      <div className="block sm:hidden text-center space-y-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            ***REMOVED***getSaludo()***REMOVED*** ***REMOVED***userName && `$***REMOVED***userName***REMOVED*** `***REMOVED******REMOVED***userEmoji***REMOVED***
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            Acá tienes un resumen de tu actividad
          </p>
        </div>
        
        <div>
          <p className="text-xs text-gray-500 mb-1">Ganado total</p>
          <p 
            className="text-2xl font-bold"
            style=***REMOVED******REMOVED*** color: thematicColors?.base || '#EC4899' ***REMOVED******REMOVED***
          >
            $***REMOVED***totalGanado.toFixed(2)***REMOVED***
          </p>
        </div>
      </div>

      ***REMOVED***/* TABLET Y DESKTOP: Layout horizontal original */***REMOVED***
      <div className="hidden sm:flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            ***REMOVED***getSaludo()***REMOVED*** ***REMOVED***userName && `$***REMOVED***userName***REMOVED*** `***REMOVED******REMOVED***userEmoji***REMOVED***
          </h1>
          <p className="text-gray-600 mt-1">
            Acá tienes un resumen<br />
            de tu actividad
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Ganado total</p>
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