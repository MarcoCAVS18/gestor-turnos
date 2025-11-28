// src/components/cards/TarjetaTurnoDelivery/index.jsx - Refactorizado usando BaseShiftCard

import React from 'react';
import ***REMOVED*** Package, DollarSign, Navigation, Truck ***REMOVED*** from 'lucide-react';
import BaseShiftCard from '../../base/BaseShiftCard';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../../utils/currency';

const TarjetaTurnoDelivery = (props) => ***REMOVED***
  const ***REMOVED*** turno ***REMOVED*** = props;

  // Calcular datos del turno
  const shiftData = React.useMemo(() => ***REMOVED***
    if (!turno) ***REMOVED***
      return ***REMOVED*** hours: 0, totalWithDiscount: 0 ***REMOVED***;
    ***REMOVED***

    // Calcular horas manualmente para delivery
    const [horaI, minI] = turno.horaInicio.split(':').map(Number);
    const [horaF, minF] = turno.horaFin.split(':').map(Number);
    let horas = (horaF + minF / 60) - (horaI + minI / 60);
    if (horas < 0) horas += 24;

    const gananciaNeta = (turno.gananciaTotal || 0) - (turno.gastoCombustible || 0);
    const promedioPorPedido = turno.numeroPedidos > 0 ? (turno.gananciaTotal || 0) / turno.numeroPedidos : 0;

    return ***REMOVED***
      hours: horas,
      totalWithDiscount: gananciaNeta,
      numeroPedidos: turno.numeroPedidos || 0,
      kilometros: turno.kilometros || 0,
      propinas: turno.propinas || 0,
      gastos: turno.gastoCombustible || 0,
      gananciaTotal: turno.gananciaTotal || 0,
      promedioPorPedido
    ***REMOVED***;
  ***REMOVED***, [turno]);

  return (
    <BaseShiftCard ***REMOVED***...props***REMOVED*** type="delivery" shiftData=***REMOVED***shiftData***REMOVED***>
      ***REMOVED******REMOVED***
        // Avatar icon para delivery
        avatarIcon: <Truck size=***REMOVED***16***REMOVED*** />,

        // Stats móvil - Pedidos, km y ganancia
        mobileStats: (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              ***REMOVED***shiftData.numeroPedidos > 0 && (
                <div className="flex items-center">
                  <Package size=***REMOVED***12***REMOVED*** className="mr-1 text-blue-500" />
                  <span>***REMOVED***shiftData.numeroPedidos***REMOVED***</span>
                </div>
              )***REMOVED***

              ***REMOVED***shiftData.kilometros > 0 && (
                <div className="flex items-center">
                  <Navigation size=***REMOVED***12***REMOVED*** className="mr-1 text-purple-500" />
                  <span>***REMOVED***shiftData.kilometros***REMOVED***km</span>
                </div>
              )***REMOVED***
            </div>

            <div className="flex items-center">
              <DollarSign size=***REMOVED***16***REMOVED*** className="mr-1 text-green-600" />
              <span className="font-bold text-green-600 text-lg">
                ***REMOVED***formatCurrency(shiftData.totalWithDiscount)***REMOVED***
              </span>
            </div>
          </div>
        ),

        // Stats desktop - Pedidos, km y ganancia
        desktopStats: (
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600 gap-4">
              ***REMOVED***shiftData.numeroPedidos > 0 && (
                <div className="flex items-center">
                  <Package size=***REMOVED***14***REMOVED*** className="mr-1 text-blue-500" />
                  <span>***REMOVED***shiftData.numeroPedidos***REMOVED***</span>
                </div>
              )***REMOVED***

              ***REMOVED***shiftData.kilometros > 0 && (
                <div className="flex items-center">
                  <Navigation size=***REMOVED***14***REMOVED*** className="mr-1 text-purple-500" />
                  <span>***REMOVED***shiftData.kilometros***REMOVED*** km</span>
                </div>
              )***REMOVED***
            </div>

            <div className="flex items-center">
              <DollarSign size=***REMOVED***16***REMOVED*** className="mr-1 text-green-600" />
              <span className="text-lg font-semibold text-green-600">
                ***REMOVED***formatCurrency(shiftData.totalWithDiscount)***REMOVED***
              </span>
            </div>
          </div>
        ),

        // Contenido expandido - Detalles financieros
        expandedContent: (shiftData.propinas > 0 || shiftData.gastos > 0) && (
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-sm space-y-2">
              <div className="font-medium text-green-700 mb-2">Detalles Financieros</div>

              <div className="flex justify-between">
                <span className="text-green-600">Ganancia total:</span>
                <span className="font-medium">***REMOVED***formatCurrency(shiftData.gananciaTotal)***REMOVED***</span>
              </div>

              ***REMOVED***shiftData.propinas > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-600">Propinas:</span>
                  <span className="font-medium">***REMOVED***formatCurrency(shiftData.propinas)***REMOVED***</span>
                </div>
              )***REMOVED***

              ***REMOVED***shiftData.gastos > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-600">Gastos combustible:</span>
                  <span className="font-medium">***REMOVED***formatCurrency(shiftData.gastos)***REMOVED***</span>
                </div>
              )***REMOVED***

              ***REMOVED***shiftData.numeroPedidos > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Promedio/pedido:</span>
                  <span>***REMOVED***formatCurrency(shiftData.promedioPorPedido)***REMOVED***</span>
                </div>
              )***REMOVED***

              <div className="flex justify-between border-t border-green-200 pt-2">
                <span className="font-semibold text-green-700">Ganancia neta:</span>
                <span className="font-bold">***REMOVED***formatCurrency(shiftData.totalWithDiscount)***REMOVED***</span>
              </div>
            </div>
          </div>
        )
      ***REMOVED******REMOVED***
    </BaseShiftCard>
  );
***REMOVED***;

export default TarjetaTurnoDelivery;