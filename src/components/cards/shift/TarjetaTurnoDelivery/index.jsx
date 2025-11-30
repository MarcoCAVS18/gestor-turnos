// src/components/cards/TarjetaTurnoDelivery/index.jsx

import React from 'react';
import ***REMOVED*** Package, DollarSign, Navigation, Truck ***REMOVED*** from 'lucide-react';
import BaseShiftCard from '../../base/BaseShiftCard';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../../utils/currency';
import Flex from '../../../ui/Flex';

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
          <Flex variant="between" className="pt-2 border-t border-gray-100">
            <Flex variant="center" className="space-x-4 text-sm text-gray-600">
              ***REMOVED***shiftData.numeroPedidos > 0 && (
                <Flex variant="center">
                  <Package size=***REMOVED***12***REMOVED*** className="mr-1 text-blue-500" />
                  <span>***REMOVED***shiftData.numeroPedidos***REMOVED***</span>
                </Flex>
              )***REMOVED***

              ***REMOVED***shiftData.kilometros > 0 && (
                <Flex variant="center">
                  <Navigation size=***REMOVED***12***REMOVED*** className="mr-1 text-purple-500" />
                  <span>***REMOVED***shiftData.kilometros***REMOVED***km</span>
                </Flex>
              )***REMOVED***
            </Flex>

            <Flex variant="center">
              <DollarSign size=***REMOVED***16***REMOVED*** className="mr-1 text-green-600" />
              <span className="font-bold text-green-600 text-lg">
                ***REMOVED***formatCurrency(shiftData.totalWithDiscount)***REMOVED***
              </span>
            </Flex>
          </Flex>
        ),

        // Stats desktop - Pedidos, km y ganancia
        desktopStats: (
          <Flex variant="between">
            <Flex variant="center" className="text-sm text-gray-600 gap-4">
              ***REMOVED***shiftData.numeroPedidos > 0 && (
                <Flex variant="center">
                  <Package size=***REMOVED***14***REMOVED*** className="mr-1 text-blue-500" />
                  <span>***REMOVED***shiftData.numeroPedidos***REMOVED***</span>
                </Flex>
              )***REMOVED***

              ***REMOVED***shiftData.kilometros > 0 && (
                <Flex variant="center">
                  <Navigation size=***REMOVED***14***REMOVED*** className="mr-1 text-purple-500" />
                  <span>***REMOVED***shiftData.kilometros***REMOVED*** km</span>
                </Flex>
              )***REMOVED***
            </Flex>

            <Flex variant="center">
              <DollarSign size=***REMOVED***16***REMOVED*** className="mr-1 text-green-600" />
              <span className="text-lg font-semibold text-green-600">
                ***REMOVED***formatCurrency(shiftData.totalWithDiscount)***REMOVED***
              </span>
            </Flex>
          </Flex>
        ),

        // Contenido expandido - Detalles financieros
        expandedContent: (shiftData.propinas > 0 || shiftData.gastos > 0) && (
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-sm space-y-2">
              <div className="font-medium text-green-700 mb-2">Detalles Financieros</div>

              <Flex justify="between">
                <span className="text-green-600 mr-2">Ganancia total:</span>
                <span className="font-medium">***REMOVED***formatCurrency(shiftData.gananciaTotal)***REMOVED***</span>
              </Flex>

              ***REMOVED***shiftData.propinas > 0 && (
                <Flex justify="between">
                  <span className="text-green-600 mr-2">Propinas:</span>
                  <span className="font-medium">***REMOVED***formatCurrency(shiftData.propinas)***REMOVED***</span>
                </Flex>
              )***REMOVED***

              ***REMOVED***shiftData.gastos > 0 && (
                <Flex justify="between">
                  <span className="text-green-600 mr-2">Gastos combustible:</span>
                  <span className="font-medium">***REMOVED***formatCurrency(shiftData.gastos)***REMOVED***</span>
                </Flex>
              )***REMOVED***

              ***REMOVED***shiftData.numeroPedidos > 0 && (
                <Flex justify="between" className="text-green-600">
                  <span className='mr-2'>Promedio/pedido:</span>
                  <span>***REMOVED***formatCurrency(shiftData.promedioPorPedido)***REMOVED***</span>
                </Flex>
              )***REMOVED***

              <Flex justify="between" className="border-t border-green-200 pt-2">
                <span className="font-semibold text-green-700">Ganancia neta:</span>
                <span className="font-bold">***REMOVED***formatCurrency(shiftData.totalWithDiscount)***REMOVED***</span>
              </Flex>
            </div>
          </div>
        )
      ***REMOVED******REMOVED***
    </BaseShiftCard>
  );
***REMOVED***;

export default TarjetaTurnoDelivery;