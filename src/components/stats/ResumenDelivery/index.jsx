// src/components/stats/ResumenDelivery/index.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** Truck, DollarSign, Package, Navigation ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import Card from '../../ui/Card';

const ResumenDelivery = (***REMOVED*** deliveryStats ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const [animacionActiva, setAnimacionActiva] = useState(false);

  React.useEffect(() => ***REMOVED***
    setAnimacionActiva(true);
    const timer = setTimeout(() => setAnimacionActiva(false), 1000);
    return () => clearTimeout(timer);
  ***REMOVED***, [deliveryStats]);

  // Múltiples formas de calcular el promedio por pedido
  const promedioPorPedido1 = deliveryStats.totalPedidos > 0 ? 
    deliveryStats.totalGanado / deliveryStats.totalPedidos : 0;
  
  // Buscar si existe directamente en deliveryStats
  const promedioPorPedido2 = deliveryStats.promedioPorPedido || 0;
  
  // Buscar en plataformas
  let promedioPorPedido3 = 0;
  if (deliveryStats.turnosPorPlataforma) ***REMOVED***
    const plataformas = Object.values(deliveryStats.turnosPorPlataforma);
    const totalPedidosPlataformas = plataformas.reduce((sum, p) => sum + (p.totalPedidos || 0), 0);
    const totalGanadoPlataformas = plataformas.reduce((sum, p) => sum + (p.totalGanado || 0), 0);
    promedioPorPedido3 = totalPedidosPlataformas > 0 ? totalGanadoPlataformas / totalPedidosPlataformas : 0;
  ***REMOVED***

  // Usar el que tenga valor
  const promedioPorPedido = promedioPorPedido2 || promedioPorPedido3 || promedioPorPedido1;

  if (deliveryStats.totalPedidos === 0) ***REMOVED***
    return (
      <Card variant="transparent">
        <div className=***REMOVED***`text-center py-6 transition-opacity duration-1000 $***REMOVED***animacionActiva ? 'opacity-50' : 'opacity-100'***REMOVED***`***REMOVED***>
          <Truck size=***REMOVED***32***REMOVED*** className="mx-auto mb-3 text-gray-300" />
          <h3 className="font-semibold text-gray-600 mb-1">Sin datos de delivery</h3>
          <p className="text-sm text-gray-500">Registra turnos para ver las estadísticas</p>
        </div>
      </Card>
    );
  ***REMOVED***

  return (
    <Card variant="transparent">
      <h3 className="text-lg font-semibold flex items-center mb-4">
        <Truck size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
        Resumen Delivery
      </h3>

      <div className=***REMOVED***`grid grid-cols-2 gap-4 transition-all duration-500 $***REMOVED***animacionActiva ? 'opacity-90' : 'opacity-100'***REMOVED***`***REMOVED***>
        ***REMOVED***/* Ganancia Total */***REMOVED***
        <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform transform hover:-translate-y-1">
          <div className="h-2 bg-gradient-to-r from-green-400 to-green-500"></div>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <p className="text-sm font-semibold text-gray-700">Ganancia</p>
              <DollarSign size=***REMOVED***20***REMOVED*** className="text-gray-400" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">***REMOVED***formatCurrency(deliveryStats.totalGanado)***REMOVED***</p>
          </div>
        </div>

        ***REMOVED***/* Total Pedidos */***REMOVED***
        <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform transform hover:-translate-y-1">
          <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-500"></div>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <p className="text-sm font-semibold text-gray-700">Pedidos</p>
              <Package size=***REMOVED***20***REMOVED*** className="text-gray-400" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">***REMOVED***deliveryStats.totalPedidos***REMOVED***</p>
          </div>
        </div>

        ***REMOVED***/* Kilómetros Totales */***REMOVED***
        <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform transform hover:-translate-y-1">
          <div className="h-2 bg-gradient-to-r from-purple-400 to-purple-500"></div>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <p className="text-sm font-semibold text-gray-700">KMs</p>
              <Navigation size=***REMOVED***20***REMOVED*** className="text-gray-400" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">***REMOVED***deliveryStats.totalKilometros.toFixed(1)***REMOVED***</p>
          </div>
        </div>
        
        ***REMOVED***/* Promedio por Pedido */***REMOVED***
        <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform transform hover:-translate-y-1">
          <div className="h-2 bg-gradient-to-r from-orange-400 to-orange-500"></div>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <p className="text-sm font-semibold text-gray-700">€ / Pedido</p>
              <DollarSign size=***REMOVED***20***REMOVED*** className="text-gray-400" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">***REMOVED***formatCurrency(promedioPorPedido)***REMOVED***</p>
          </div>
        </div>
      </div>
    </Card>
  );
***REMOVED***;

export default ResumenDelivery;