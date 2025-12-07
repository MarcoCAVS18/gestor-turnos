// src/components/cards/shift/TarjetaTurnoDelivery/index.jsx
import React from 'react';
import ***REMOVED*** Package, Navigation, Truck ***REMOVED*** from 'lucide-react';
import BaseShiftCard from '../../base/BaseShiftCard';
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
    <BaseShiftCard 
      ***REMOVED***...props***REMOVED*** 
      type="delivery" 
      shiftData=***REMOVED***shiftData***REMOVED***
      // Pasamos la ganancia a la Base para que la ponga abajo
      earningValue=***REMOVED***shiftData.totalWithDiscount***REMOVED***
      earningLabel="Ganancia Neta"
    >
      ***REMOVED******REMOVED***
        // Avatar icon para delivery
        avatarIcon: <Truck size=***REMOVED***16***REMOVED*** />,

        // Stats móvil - Pedidos y km (SIN Ganancia, solo stats físicos)
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
          </Flex>
        ),

        // Stats desktop - Pedidos y km (SIN Ganancia)
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
          </Flex>
        ),

        // Contenido expandido - Detalles financieros en Popover
        
      ***REMOVED******REMOVED***
    </BaseShiftCard>
  );
***REMOVED***;

export default TarjetaTurnoDelivery;