// src/components/stats/DailyDistribution/index.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** Calendar, Clock, DollarSign ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';

const DailyDistribution = (***REMOVED*** gananciaPorDia ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const [animacionActiva, setAnimacionActiva] = useState(false);

  React.useEffect(() => ***REMOVED***
    setAnimacionActiva(true);
    const timer = setTimeout(() => setAnimacionActiva(false), 1000);
    return () => clearTimeout(timer);
  ***REMOVED***, [gananciaPorDia]);

  // Función para formatear horas
  const formatearHoras = (horas) => ***REMOVED***
    if (horas === 0) return '0h';
    if (horas < 1) ***REMOVED***
      const minutos = Math.round(horas * 60);
      return `$***REMOVED***minutos***REMOVED***min`;
    ***REMOVED***
    const horasEnteras = Math.floor(horas);
    const minutos = Math.round((horas - horasEnteras) * 60);
    
    if (minutos === 0) ***REMOVED***
      return `$***REMOVED***horasEnteras***REMOVED***h`;
    ***REMOVED***
    return `$***REMOVED***horasEnteras***REMOVED***h $***REMOVED***minutos***REMOVED***min`;
  ***REMOVED***;

  if (!gananciaPorDia || typeof gananciaPorDia !== 'object') ***REMOVED***
    return (
      <div>
        <div className="flex items-center mb-4">
          <Calendar size=***REMOVED***18***REMOVED*** className="mr-2 text-gray-500" />
          <h3 className="font-semibold">Distribución semanal</h3>
        </div>
        <div className=***REMOVED***`text-center py-8 text-gray-500 transition-opacity duration-1000 $***REMOVED***animacionActiva ? 'opacity-50' : 'opacity-100'***REMOVED***`***REMOVED***>
          <Calendar size=***REMOVED***48***REMOVED*** className="mx-auto mb-3 opacity-30" />
          <p>No hay datos de esta semana</p>
        </div>
      </div>
    );
  ***REMOVED***

  return (
    <div>
      <div className="flex items-center mb-4">
        <Calendar size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
        <h3 className="font-semibold">Distribución semanal</h3>
      </div>

      <div className="space-y-2">
        ***REMOVED***Object.entries(gananciaPorDia).map(([dia, datos]) => ***REMOVED***
          const datosSeguro = ***REMOVED***
            horas: 0,
            turnos: 0,
            ganancia: 0
          ***REMOVED***;

          try ***REMOVED***
            if (datos && typeof datos === 'object') ***REMOVED***
              datosSeguro.horas = (typeof datos.horas === 'number' && !isNaN(datos.horas)) ? datos.horas : 0;
              datosSeguro.turnos = (typeof datos.turnos === 'number' && !isNaN(datos.turnos)) ? datos.turnos : 0;
              datosSeguro.ganancia = (typeof datos.ganancia === 'number' && !isNaN(datos.ganancia)) ? datos.ganancia : 0;
            ***REMOVED***
          ***REMOVED*** catch (error) ***REMOVED***
            console.error(`Error procesando día $***REMOVED***dia***REMOVED***:`, error);
          ***REMOVED***

          return (
            <div key=***REMOVED***dia***REMOVED*** className=***REMOVED***`p-3 bg-gray-50 rounded-lg transition-all duration-500 $***REMOVED***animacionActiva ? 'scale-105 shadow-md' : 'scale-100'***REMOVED***`***REMOVED***>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">***REMOVED***dia || 'Día'***REMOVED***</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <DollarSign size=***REMOVED***14***REMOVED*** className="mr-1" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** />
                    <span className="text-sm font-bold" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                      ***REMOVED***formatCurrency(datosSeguro.ganancia)***REMOVED***
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock size=***REMOVED***14***REMOVED*** className="mr-1 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      ***REMOVED***formatearHoras(datosSeguro.horas)***REMOVED***
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    ***REMOVED***datosSeguro.turnos***REMOVED*** turno***REMOVED***datosSeguro.turnos !== 1 ? 's' : ''***REMOVED***
                  </div>
                </div>
              </div>
              ***REMOVED***datosSeguro.turnos === 0 && (
                <p className="text-xs text-gray-400 mt-1">Sin actividad</p>
              )***REMOVED***
            </div>
          );
        ***REMOVED***)***REMOVED***
      </div>
    </div>
  );
***REMOVED***;

export default DailyDistribution;