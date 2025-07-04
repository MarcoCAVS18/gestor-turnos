// src/components/stats/SeguimientoCombustible/index.jsx

import React from 'react';
import ***REMOVED*** Fuel ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const SeguimientoCombustible = (***REMOVED*** deliveryStats ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors ***REMOVED*** = useApp();

  const formatCurrency = (amount) => ***REMOVED***
    return new Intl.NumberFormat('es-AR', ***REMOVED***
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    ***REMOVED***).format(amount);
  ***REMOVED***;

  const totalGastos = deliveryStats.totalGastos;
  const totalKilometros = deliveryStats.totalKilometros;
  const totalGanancias = deliveryStats.totalGanado;
  
  const eficiencia = totalGastos > 0 ? totalKilometros / totalGastos : 0;
  const porcentajeGastos = totalGanancias > 0 ? (totalGastos / totalGanancias) * 100 : 0;

  if (totalGastos === 0) ***REMOVED***
    return (
      <Card>
        <div className="text-center py-6">
          <Fuel size=***REMOVED***32***REMOVED*** className="mx-auto mb-3 text-gray-300" />
          <h3 className="font-semibold text-gray-600">Sin gastos de combustible</h3>
        </div>
      </Card>
    );
  ***REMOVED***

  return (
    <Card>
      <h3 className="text-lg font-semibold flex items-center mb-4">
        <Fuel size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED*** className="mr-2" />
        Combustible
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <Fuel size=***REMOVED***24***REMOVED*** className="mx-auto mb-2 text-red-600" />
          <p className="text-2xl font-bold text-red-700">***REMOVED***formatCurrency(totalGastos)***REMOVED***</p>
          <p className="text-sm text-red-600">Gasto Total</p>
        </div>

        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl mb-2">⚡</div>
          <p className="text-2xl font-bold text-blue-700">***REMOVED***eficiencia.toFixed(1)***REMOVED***</p>
          <p className="text-sm text-blue-600">Km/Peso</p>
        </div>
      </div>

      ***REMOVED***porcentajeGastos > 25 && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            ⚠️ Los gastos representan ***REMOVED***porcentajeGastos.toFixed(1)***REMOVED***% de las ganancias
          </p>
        </div>
      )***REMOVED***
    </Card>
  );
***REMOVED***;

export default SeguimientoCombustible;