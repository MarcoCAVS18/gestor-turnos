// src/components/stats/ResumenDelivery/index.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** Truck, DollarSign, Package, Navigation ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const ResumenDelivery = (***REMOVED*** deliveryStats ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** coloresTemáticos ***REMOVED*** = useApp();
  const [animacionActiva, setAnimacionActiva] = useState(false);

  React.useEffect(() => ***REMOVED***
    setAnimacionActiva(true);
    const timer = setTimeout(() => setAnimacionActiva(false), 1000);
    return () => clearTimeout(timer);
  ***REMOVED***, [deliveryStats]);

  const formatCurrency = (amount) => ***REMOVED***
    return new Intl.NumberFormat('es-AR', ***REMOVED***
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    ***REMOVED***).format(amount);
  ***REMOVED***;

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
      <Card>
        <div className=***REMOVED***`text-center py-6 transition-opacity duration-1000 $***REMOVED***animacionActiva ? 'opacity-50' : 'opacity-100'***REMOVED***`***REMOVED***>
          <Truck size=***REMOVED***32***REMOVED*** className="mx-auto mb-3 text-gray-300" />
          <h3 className="font-semibold text-gray-600 mb-1">Sin datos de delivery</h3>
          <p className="text-sm text-gray-500">Registra turnos para ver las estadísticas</p>
        </div>
      </Card>
    );
  ***REMOVED***

  return (
    <Card className='bg-white shadow-md p-6'>
      <h3 className="text-lg font-semibold flex items-center mb-4">
        <Truck size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED*** className="mr-2" />
        Resumen Delivery
      </h3>

      <div className=***REMOVED***`grid grid-cols-2 gap-4 transition-all duration-500 $***REMOVED***animacionActiva ? 'scale-105' : 'scale-100'***REMOVED***`***REMOVED***>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <DollarSign size=***REMOVED***24***REMOVED*** className="mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-bold text-green-700">***REMOVED***formatCurrency(deliveryStats.totalGanado)***REMOVED***</p>
          <p className="text-sm text-green-600">Ganancia Total</p>
        </div>

        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <Package size=***REMOVED***24***REMOVED*** className="mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-blue-700">***REMOVED***deliveryStats.totalPedidos***REMOVED***</p>
          <p className="text-sm text-blue-600">Pedidos</p>
        </div>

        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <Navigation size=***REMOVED***24***REMOVED*** className="mx-auto mb-2 text-purple-600" />
          <p className="text-2xl font-bold text-purple-700">***REMOVED***deliveryStats.totalKilometros.toFixed(1)***REMOVED***</p>
          <p className="text-sm text-purple-600">Kilómetros</p>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <DollarSign size=***REMOVED***24***REMOVED*** className="mx-auto mb-2" style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED*** />
          <p className="text-2xl font-bold" style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED***>
            ***REMOVED***formatCurrency(promedioPorPedido)***REMOVED***
          </p>
          <p className="text-sm text-gray-600">Por Pedido</p>
        </div>
      </div>
    </Card>
  );
***REMOVED***;

export default ResumenDelivery;