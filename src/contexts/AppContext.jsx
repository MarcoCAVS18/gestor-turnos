// src/contexts/AppContext.jsx

import React, { createContext, useMemo } from 'react';

import { AuthProvider } from './AuthContext';
import { ConfigProvider, useConfigContext } from './ConfigContext';
import { DataProvider, useDataContext } from './DataContext';
import { DeliveryProvider, useDeliveryContext } from './DeliveryContext';
import { CalculationsProvider, useCalculations } from './CalculationsContext';
import { StatsProvider, useStats } from './StatsContext';
import { LiveModeProvider, useLiveModeContext } from './LiveModeContext';

// 1. Create a new "Master" context
const AppContext = createContext(null);

// 2. The main AppProvider now composes all other providers
export const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <ConfigProvider>
        <DataProvider>
          <DeliveryProvider>
            <CalculationsProvider>
              <StatsProvider>
                <LiveModeProvider>
                  {children}
                </LiveModeProvider>
              </StatsProvider>
            </CalculationsProvider>
          </DeliveryProvider>
        </DataProvider>
      </ConfigProvider>
    </AuthProvider>
  );
};

// 3. The main useApp hook now composes all other hooks
// This provides a single point of access and maintains backward compatibility
// with components that used the old monolithic context.
export const useApp = () => {
  const config = useConfigContext();
  const data = useDataContext();
  const delivery = useDeliveryContext();
  const calculations = useCalculations();
  const stats = useStats();
  const liveMode = useLiveModeContext();

  const allWorks = useMemo(() => {
    return [...(data.works || []), ...(delivery.deliveryWork || [])];
  }, [data.works, delivery.deliveryWork]);

  return {
    ...config,
    ...data,
    ...delivery,
    ...calculations,
    ...stats,

    // Re-create combined properties that existed in the old context
    allWorks: allWorks,
    deleteShift: data.deleteShift,

    // Live Mode
    liveMode,
    isLiveActive: liveMode?.isActive || false,

    // For backward compatibility, some components might still be using old names.
    // We can provide aliases here if needed. For example:
    // shiftRanges: config.shiftRanges,
  };
};

// This is a placeholder to keep the export structure.
// The actual context value is now composed by the `useApp` hook.
export { AppContext };
