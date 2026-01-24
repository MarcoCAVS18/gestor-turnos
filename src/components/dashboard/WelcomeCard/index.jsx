// src/components/dashboard/WelcomeCard/index.jsx

import ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useAuth ***REMOVED*** from '../../../contexts/AuthContext';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import Card from '../../ui/Card';

const WelcomeCard = (***REMOVED*** totalEarnings, isFeatureVisible = false, className ***REMOVED***) => ***REMOVED***
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

  // Function to get greeting based on time of day
  const getGreeting = () => ***REMOVED***
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 18) return 'Good afternoon,';
    return 'Good evening,';
  ***REMOVED***;

  return (
    <Card className=***REMOVED***className***REMOVED***>
      <div className="flex flex-col h-full">
        <div className="my-auto">
          ***REMOVED***/* Vertical layout (Mobile or when feature is visible) */***REMOVED***
          <div className=***REMOVED***`$***REMOVED***isFeatureVisible ? 'block' : 'block sm:hidden'***REMOVED*** text-center space-y-4`***REMOVED***>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                ***REMOVED***getGreeting()***REMOVED*** ***REMOVED***userName && `$***REMOVED***userName***REMOVED*** `***REMOVED******REMOVED***userEmoji***REMOVED***
              </h1>
              <p className="text-gray-600 text-sm mt-2">
                Here is a summary of your activity
              </p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 pt-4 mb-1">Total earned</p>
              <p 
                className="text-4xl font-bold"
                style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
              >
                ***REMOVED***formatCurrency(totalEarnings)***REMOVED***
              </p>
            </div>
          </div>

          ***REMOVED***/* Horizontal layout (Tablet/Desktop without feature) */***REMOVED***
          <div className=***REMOVED***`$***REMOVED***isFeatureVisible ? 'hidden' : 'hidden sm:flex'***REMOVED*** items-center justify-between`***REMOVED***>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                ***REMOVED***getGreeting()***REMOVED*** ***REMOVED***userName && `$***REMOVED***userName***REMOVED*** `***REMOVED******REMOVED***userEmoji***REMOVED***
              </h1>
              <p className="text-gray-600 mt-1">
                Here is a summary<br />
                of your activity
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total earned</p>
              <p 
                className="text-2xl font-bold"
                style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
              >
                ***REMOVED***formatCurrency(totalEarnings)***REMOVED***
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
***REMOVED***;

export default WelcomeCard;