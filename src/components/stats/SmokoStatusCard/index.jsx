// src/components/stats/SmokoStatusCard/index.jsx

import React from 'react';
import ***REMOVED*** Coffee ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import Card from '../../ui/Card';

const SmokoStatusCard = () => ***REMOVED***
  const ***REMOVED*** smokoEnabled ***REMOVED*** = useApp();
  const colors = useThemeColors();

  return (
    <Card className="h-full flex flex-col justify-center">
      ***REMOVED***/* Header con ícono y título al estilo de otros componentes de stats */***REMOVED***
      <div className="flex items-center mb-4">
        <Coffee size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
        <h3 className="font-semibold">Descanso</h3>
      </div>

      ***REMOVED***/* Estado principal centrado */***REMOVED***
      <div className="text-center flex-1 flex items-center justify-center">
        <p 
          className=***REMOVED***`text-4xl font-bold $***REMOVED***
            smokoEnabled ? '' : 'text-gray-600'
          ***REMOVED***`***REMOVED***
          style=***REMOVED***smokoEnabled ? ***REMOVED*** color: colors.primary ***REMOVED*** : ***REMOVED******REMOVED******REMOVED***
        >
          ***REMOVED***smokoEnabled ? 'ACTIVADO' : 'DESACTIVADO'***REMOVED***
        </p>
      </div>
    </Card>
  );
***REMOVED***;

export default SmokoStatusCard;