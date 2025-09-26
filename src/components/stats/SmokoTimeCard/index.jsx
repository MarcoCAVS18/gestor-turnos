// src/components/stats/SmokoTimeCard/index.jsx

import React from 'react';
import ***REMOVED*** Clock ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import Card from '../../ui/Card';

const SmokoTimeCard = () => ***REMOVED***
  const ***REMOVED*** smokoMinutes, smokoEnabled ***REMOVED*** = useApp();
  const colors = useThemeColors();

  // Formatear tiempo para mostrar
  const formatearTiempo = (minutos) => ***REMOVED***
    if (!minutos || minutos === 0) return '0 MIN';
    
    if (minutos < 60) ***REMOVED***
      return `$***REMOVED***minutos***REMOVED*** MIN`;
    ***REMOVED***
    
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    
    if (minutosRestantes === 0) ***REMOVED***
      return `$***REMOVED***horas***REMOVED***H`;
    ***REMOVED***
    
    return `$***REMOVED***horas***REMOVED***H $***REMOVED***minutosRestantes***REMOVED***M`;
  ***REMOVED***;

  return (
    <Card className="h-full flex flex-col justify-center">
      ***REMOVED***/* Header con ícono y título al estilo de otros componentes de stats */***REMOVED***
      <div className="flex items-center mb-4">
        <Clock size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
        <h3 className="font-semibold">Tiempo de Descanso</h3>
      </div>

      ***REMOVED***/* Tiempo principal centrado */***REMOVED***
      <div className="text-center flex-1 flex items-center justify-center">
        <p 
          className=***REMOVED***`text-4xl font-bold $***REMOVED***
            smokoEnabled ? '' : 'text-gray-600'
          ***REMOVED***`***REMOVED***
          style=***REMOVED***smokoEnabled ? ***REMOVED*** color: colors.primary ***REMOVED*** : ***REMOVED******REMOVED******REMOVED***
        >
          ***REMOVED***formatearTiempo(smokoMinutes || 0)***REMOVED***
        </p>
      </div>
    </Card>
  );
***REMOVED***;

export default SmokoTimeCard;