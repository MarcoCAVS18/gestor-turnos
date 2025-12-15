// src/components/dashboard/WelcomeCard/index.jsx

import ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useAuth ***REMOVED*** from '../../../contexts/AuthContext';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import Card from '../../ui/Card';

const WelcomeCard = (***REMOVED*** totalGanado, isFeatureVisible = false, className ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** currentUser ***REMOVED*** = useAuth();
  const ***REMOVED*** userEmoji ***REMOVED*** = useApp();
  const colors = useThemeColors();
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
    <Card className=***REMOVED***className***REMOVED***>
      <div className="flex flex-col h-full">
        <div className="my-auto">
          ***REMOVED***/* Layout vertical (Móvil o cuando la feature es visible) */***REMOVED***
          <div className=***REMOVED***`$***REMOVED***isFeatureVisible ? 'block' : 'block sm:hidden'***REMOVED*** text-center space-y-4`***REMOVED***>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                ***REMOVED***getSaludo()***REMOVED*** ***REMOVED***userName && `$***REMOVED***userName***REMOVED*** `***REMOVED******REMOVED***userEmoji***REMOVED***
              </h1>
              <p className="text-gray-600 text-sm mt-2">
                Acá tienes un resumen de tu actividad
              </p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 pt-4 mb-1">Ganado total</p>
              <p 
                className="text-4xl font-bold"
                style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
              >
                ***REMOVED***formatCurrency(totalGanado)***REMOVED***
              </p>
            </div>
          </div>

          ***REMOVED***/* Layout horizontal (Tablet/Desktop sin feature) */***REMOVED***
          <div className=***REMOVED***`$***REMOVED***isFeatureVisible ? 'hidden' : 'hidden sm:flex'***REMOVED*** items-center justify-between`***REMOVED***>
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
                style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
              >
                ***REMOVED***formatCurrency(totalGanado)***REMOVED***
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
***REMOVED***;

export default WelcomeCard;