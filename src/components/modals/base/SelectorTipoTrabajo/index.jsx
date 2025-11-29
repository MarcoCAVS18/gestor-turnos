import React from 'react';
import ***REMOVED*** Briefcase, Truck, Clock, DollarSign, Package, Navigation ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../../hooks/useThemeColors';
import Flex from '../../../ui/Flex';

const SelectorTipoTrabajo = (***REMOVED*** onSelectTipo, isMobile ***REMOVED***) => ***REMOVED***
  // Usar colores del contexto si no se pasan como prop
  const colors = useThemeColors();

  const handleSelect = (tipo) => ***REMOVED***
    onSelectTipo(tipo);
  ***REMOVED***;

  return (
    <div className=***REMOVED***`space-y-6 $***REMOVED***isMobile ? 'mobile-form' : ''***REMOVED***`***REMOVED***>
      <div className="text-center mb-6">
        <h3 
          className=***REMOVED***`font-semibold mb-3 $***REMOVED***isMobile ? 'text-xl' : 'text-lg'***REMOVED***`***REMOVED***
          style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
        >
          ¿Qué tipo de trabajo quieres agregar?
        </h3>
        <p className=***REMOVED***`text-gray-600 $***REMOVED***isMobile ? 'text-base' : 'text-sm'***REMOVED***`***REMOVED***>
          Selecciona el tipo que mejor describe tu trabajo
        </p>
      </div>
      
      <div className=***REMOVED***`grid grid-cols-1 $***REMOVED***isMobile ? 'gap-6' : 'gap-4'***REMOVED***`***REMOVED***>
        ***REMOVED***/* Trabajo Tradicional */***REMOVED***
        <button
          type="button"
          onClick=***REMOVED***() => handleSelect('tradicional')***REMOVED***
          className=***REMOVED***`
            border-2 rounded-xl hover:shadow-lg transition-all duration-300 group text-left
            transform hover:scale-105 active:scale-95
            $***REMOVED***isMobile ? 'p-6 min-h-[140px]' : 'p-6'***REMOVED***
          `***REMOVED***
          style=***REMOVED******REMOVED*** 
            borderColor: '#e5e7eb',
            backgroundColor: 'white'
          ***REMOVED******REMOVED***
          onMouseEnter=***REMOVED***(e) => ***REMOVED***
            e.currentTarget.style.borderColor = colors.primary;
            e.currentTarget.style.backgroundColor = colors.transparent5;
            e.currentTarget.style.boxShadow = `0 8px 25px $***REMOVED***colors.transparent30***REMOVED***`;
          ***REMOVED******REMOVED***
          onMouseLeave=***REMOVED***(e) => ***REMOVED***
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.boxShadow = 'none';
          ***REMOVED******REMOVED***
        >
          <div className=***REMOVED***`flex items-start $***REMOVED***isMobile ? 'space-x-4' : 'space-x-4'***REMOVED***`***REMOVED***>
            <div className="flex-shrink-0">
              <Flex variant="center" 
                className=***REMOVED***`
                  rounded-lg transition-all duration-300
                  $***REMOVED***isMobile ? 'w-12 h-12' : 'w-10 h-10'***REMOVED***
                `***REMOVED***
                style=***REMOVED******REMOVED*** backgroundColor: colors.transparent10 ***REMOVED******REMOVED***
              >
                <Briefcase 
                  className=***REMOVED***`text-blue-500 group-hover:scale-110 transition-transform $***REMOVED***isMobile ? 'w-7 h-7' : 'w-6 h-6'***REMOVED***`***REMOVED*** 
                />
              </Flex>
            </div>
            <div className="flex-1">
              <h4 className=***REMOVED***`font-semibold mb-2 $***REMOVED***isMobile ? 'text-lg' : 'text-lg'***REMOVED***`***REMOVED***>
                Trabajo por Horas
              </h4>
              <p className=***REMOVED***`text-gray-600 mb-3 $***REMOVED***isMobile ? 'text-base leading-relaxed' : 'text-sm'***REMOVED***`***REMOVED***>
                Para trabajos con tarifa fija por hora y diferentes tipos de turno
              </p>
              <ul className=***REMOVED***`space-y-2 $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED*** text-gray-500`***REMOVED***>
                <li className="flex items-center">
                  <Clock size=***REMOVED***isMobile ? 14 : 12***REMOVED*** className="mr-2 text-blue-500 flex-shrink-0" />
                  <span>Tarifas por tipo de turno (diurno, tarde, noche)</span>
                </li>
                <li className="flex items-center">
                  <DollarSign size=***REMOVED***isMobile ? 14 : 12***REMOVED*** className="mr-2 text-green-500 flex-shrink-0" />
                  <span>Tarifas especiales para fin de semana</span>
                </li>
                <li className="flex items-center">
                  <Briefcase size=***REMOVED***isMobile ? 14 : 12***REMOVED*** className="mr-2 text-purple-500 flex-shrink-0" />
                  <span>Cálculo automático con descuentos</span>
                </li>
              </ul>
            </div>
          </div>
        </button>

        ***REMOVED***/* Trabajo Delivery */***REMOVED***
        <button
          type="button"
          onClick=***REMOVED***() => handleSelect('delivery')***REMOVED***
          className=***REMOVED***`
            border-2 rounded-xl hover:shadow-lg transition-all duration-300 group text-left
            transform hover:scale-105 active:scale-95
            $***REMOVED***isMobile ? 'p-6 min-h-[140px]' : 'p-6'***REMOVED***
          `***REMOVED***
          style=***REMOVED******REMOVED*** 
            borderColor: '#e5e7eb',
            backgroundColor: 'white'
          ***REMOVED******REMOVED***
          onMouseEnter=***REMOVED***(e) => ***REMOVED***
            e.currentTarget.style.borderColor = colors.primary;
            e.currentTarget.style.backgroundColor = colors.transparent5;
            e.currentTarget.style.boxShadow = `0 8px 25px $***REMOVED***colors.transparent30***REMOVED***`;
          ***REMOVED******REMOVED***
          onMouseLeave=***REMOVED***(e) => ***REMOVED***
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.boxShadow = 'none';
          ***REMOVED******REMOVED***
        >
          <div className=***REMOVED***`flex items-start $***REMOVED***isMobile ? 'space-x-4' : 'space-x-4'***REMOVED***`***REMOVED***>
            <div className="flex-shrink-0">
              <Flex variant="center"
                className=***REMOVED***`
                  rounded-lg transition-all duration-300
                  $***REMOVED***isMobile ? 'w-12 h-12' : 'w-10 h-10'***REMOVED***
                `***REMOVED***
                style=***REMOVED******REMOVED*** backgroundColor: '#dcfce7' ***REMOVED******REMOVED***
              >
                <Truck 
                  className=***REMOVED***`text-green-600 group-hover:scale-110 transition-transform $***REMOVED***isMobile ? 'w-7 h-7' : 'w-6 h-6'***REMOVED***`***REMOVED*** 
                />
              </Flex>
            </div>
            <div className="flex-1">
              <h4 className=***REMOVED***`font-semibold mb-2 $***REMOVED***isMobile ? 'text-lg' : 'text-lg'***REMOVED***`***REMOVED***>
                Trabajo de Delivery
              </h4>
              <p className=***REMOVED***`text-gray-600 mb-3 $***REMOVED***isMobile ? 'text-base leading-relaxed' : 'text-sm'***REMOVED***`***REMOVED***>
                Para trabajos de reparto con ganancias variables por turno
              </p>
              <ul className=***REMOVED***`space-y-2 $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED*** text-gray-500`***REMOVED***>
                <li className="flex items-center">
                  <DollarSign size=***REMOVED***isMobile ? 14 : 12***REMOVED*** className="mr-2 text-green-500 flex-shrink-0" />
                  <span>Registro de ganancias totales por turno</span>
                </li>
                <li className="flex items-center">
                  <Package size=***REMOVED***isMobile ? 14 : 12***REMOVED*** className="mr-2 text-blue-500 flex-shrink-0" />
                  <span>Seguimiento de pedidos y kilómetros</span>
                </li>
                <li className="flex items-center">
                  <Navigation size=***REMOVED***isMobile ? 14 : 12***REMOVED*** className="mr-2 text-orange-500 flex-shrink-0" />
                  <span>Control de propinas y gastos de combustible</span>
                </li>
              </ul>
            </div>
          </div>
        </button>
      </div>

      ***REMOVED***/* Consejo informativo */***REMOVED***
      <div 
        className=***REMOVED***`p-4 rounded-lg $***REMOVED***isMobile ? 'mt-6' : 'mt-6'***REMOVED***`***REMOVED***
        style=***REMOVED******REMOVED*** backgroundColor: colors.transparent10 ***REMOVED******REMOVED***
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Flex variant="center" 
              className=***REMOVED***`rounded-full $***REMOVED***isMobile ? 'w-6 h-6' : 'w-5 h-5'***REMOVED***`***REMOVED***
              style=***REMOVED******REMOVED*** backgroundColor: colors.primary ***REMOVED******REMOVED***
            >
              <span className="text-white text-xs font-bold">💡</span>
            </Flex>
          </div>
          <div>
            <p 
              className=***REMOVED***`font-medium mb-1 $***REMOVED***isMobile ? 'text-base' : 'text-sm'***REMOVED***`***REMOVED***
              style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
            >
              Consejo
            </p>
            <p className=***REMOVED***`$***REMOVED***isMobile ? 'text-sm leading-relaxed' : 'text-sm'***REMOVED*** text-gray-700`***REMOVED***>
              Puedes tener trabajos de ambos tipos en tu perfil. Cada uno se adaptará a sus características específicas para un mejor control de tus ingresos.
            </p>
          </div>
        </div>
      </div>

      ***REMOVED***/* Botón de ayuda en móvil */***REMOVED***
      ***REMOVED***isMobile && (
        <div className="text-center pt-4">
          <button
            type="button"
            className="text-sm text-gray-500 underline"
            onClick=***REMOVED***() => ***REMOVED***
              alert('Si tienes dudas sobre qué tipo elegir, puedes cambiar esto después en la configuración del trabajo.');
            ***REMOVED******REMOVED***
          >
            ¿No estás seguro cuál elegir?
          </button>
        </div>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default SelectorTipoTrabajo;