// src/contexts/AppContext.jsx
import React, ***REMOVED*** createContext, useMemo ***REMOVED*** from 'react';

import ***REMOVED*** AuthProvider ***REMOVED*** from './AuthContext';
import ***REMOVED*** ConfigProvider, useConfigContext ***REMOVED*** from './ConfigContext';
import ***REMOVED*** DataProvider, useDataContext ***REMOVED*** from './DataContext';
import ***REMOVED*** DeliveryProvider, useDeliveryContext ***REMOVED*** from './DeliveryContext';
import ***REMOVED*** CalculationsProvider, useCalculations ***REMOVED*** from './CalculationsContext';
import ***REMOVED*** StatsProvider, useStats ***REMOVED*** from './StatsContext';

// 1. Create a new "Master" context
const AppContext = createContext(null);

// 2. The main AppProvider now composes all other providers
export const AppProvider = (***REMOVED*** children ***REMOVED***) => ***REMOVED***
  return (
    <AuthProvider>
      <ConfigProvider>
        <DataProvider>
          <DeliveryProvider>
            <CalculationsProvider>
              <StatsProvider>
                ***REMOVED***children***REMOVED***
              </StatsProvider>
            </CalculationsProvider>
          </DeliveryProvider>
        </DataProvider>
      </ConfigProvider>
    </AuthProvider>
  );
***REMOVED***;

// 3. The main useApp hook now composes all other hooks
// This provides a single point of access and maintains backward compatibility
// with components that used the old monolithic context.
export const useApp = () => ***REMOVED***
  const config = useConfigContext();
  const data = useDataContext();
  const delivery = useDeliveryContext();
  const calculations = useCalculations();
  const stats = useStats();

  const allTrabajos = useMemo(() => ***REMOVED***
    return [...data.trabajos, ...delivery.trabajosDelivery];
  ***REMOVED***, [data.trabajos, delivery.trabajosDelivery]);

  return ***REMOVED***
    ...config,
    ...data,
    ...delivery,
    ...calculations,
    ...stats,

    // Re-create combined properties that existed in the old context
    todosLosTrabajos: allTrabajos,

    // For backward compatibility, some components might still be using old names.
    // We can provide aliases here if needed. For example:
    // rangosTurnos: config.shiftRanges,
  ***REMOVED***;
***REMOVED***;

// This is a placeholder to keep the export structure.
// The actual context value is now composed by the `useApp` hook.
export ***REMOVED*** AppContext ***REMOVED***;
