// src/components/cards/shift/TarjetaTurnoDelivery/index.jsx
import React from 'react';
import { Package, Navigation, Truck } from 'lucide-react';
import BaseShiftCard from '../../base/BaseShiftCard';
import Flex from '../../../ui/Flex';

const TarjetaTurnoDelivery = (props) => {
  const { turno } = props;

  // Calcular datos del turno
  const shiftData = React.useMemo(() => {
    if (!turno) {
      return { hours: 0, totalWithDiscount: 0 };
    }

    // Calcular horas manualmente para delivery
    const [horaI, minI] = turno.horaInicio.split(':').map(Number);
    const [horaF, minF] = turno.horaFin.split(':').map(Number);
    let horas = (horaF + minF / 60) - (horaI + minI / 60);
    if (horas < 0) horas += 24;

    const gananciaNeta = (turno.gananciaTotal || 0) - (turno.gastoCombustible || 0);
    const promedioPorPedido = turno.numeroPedidos > 0 ? (turno.gananciaTotal || 0) / turno.numeroPedidos : 0;

    return {
      hours: horas,
      totalWithDiscount: gananciaNeta,
      numeroPedidos: turno.numeroPedidos || 0,
      kilometros: turno.kilometros || 0,
      propinas: turno.propinas || 0,
      gastos: turno.gastoCombustible || 0,
      gananciaTotal: turno.gananciaTotal || 0,
      promedioPorPedido
    };
  }, [turno]);

  return (
    <BaseShiftCard 
      {...props} 
      type="delivery" 
      shiftData={shiftData}
      // Pasamos la ganancia a la Base para que la ponga abajo
      earningValue={shiftData.totalWithDiscount}
      earningLabel="Ganancia Neta"
    >
      {{
        // Avatar icon para delivery
        avatarIcon: <Truck size={16} />,

        // Stats móvil - Pedidos y km (SIN Ganancia, solo stats físicos)
        mobileStats: (
          <Flex variant="between" className="pt-2 border-t border-gray-100">
            <Flex variant="center" className="space-x-4 text-sm text-gray-600">
              {shiftData.numeroPedidos > 0 && (
                <Flex variant="center">
                  <Package size={12} className="mr-1 text-blue-500" />
                  <span>{shiftData.numeroPedidos}</span>
                </Flex>
              )}

              {shiftData.kilometros > 0 && (
                <Flex variant="center">
                  <Navigation size={12} className="mr-1 text-purple-500" />
                  <span>{shiftData.kilometros}km</span>
                </Flex>
              )}
            </Flex>
          </Flex>
        ),

        // Stats desktop - Pedidos y km (SIN Ganancia)
        desktopStats: (
          <Flex variant="between">
            <Flex variant="center" className="text-sm text-gray-600 gap-4">
              {shiftData.numeroPedidos > 0 && (
                <Flex variant="center">
                  <Package size={14} className="mr-1 text-blue-500" />
                  <span>{shiftData.numeroPedidos}</span>
                </Flex>
              )}

              {shiftData.kilometros > 0 && (
                <Flex variant="center">
                  <Navigation size={14} className="mr-1 text-purple-500" />
                  <span>{shiftData.kilometros} km</span>
                </Flex>
              )}
            </Flex>
          </Flex>
        ),

        // Contenido expandido - Detalles financieros en Popover
        
      }}
    </BaseShiftCard>
  );
};

export default TarjetaTurnoDelivery;