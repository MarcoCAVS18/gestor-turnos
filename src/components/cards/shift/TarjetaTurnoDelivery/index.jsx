// src/components/cards/shift/TarjetaTurnoDelivery/index.jsx
import React from 'react';
import { Package, Navigation, Truck } from 'lucide-react';
import BaseShiftCard from '../../base/BaseShiftCard';
import { formatCurrency } from '../../../../utils/currency';
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

        // Contenido expandido - Detalles financieros (ORIGINAL RESTAURADO)
        expandedContent: (shiftData.propinas > 0 || shiftData.gastos > 0) && (
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-sm space-y-2">
              <div className="font-medium text-green-700 mb-2">Detalles Financieros</div>

              <Flex justify="between">
                <span className="text-green-600 mr-2">Ganancia total:</span>
                <span className="font-medium">{formatCurrency(shiftData.gananciaTotal)}</span>
              </Flex>

              {shiftData.propinas > 0 && (
                <Flex justify="between">
                  <span className="text-green-600 mr-2">Propinas:</span>
                  <span className="font-medium">{formatCurrency(shiftData.propinas)}</span>
                </Flex>
              )}

              {shiftData.gastos > 0 && (
                <Flex justify="between">
                  <span className="text-green-600 mr-2">Gastos combustible:</span>
                  <span className="font-medium">{formatCurrency(shiftData.gastos)}</span>
                </Flex>
              )}

              {shiftData.numeroPedidos > 0 && (
                <Flex justify="between" className="text-green-600">
                  <span className='mr-2'>Promedio/pedido:</span>
                  <span>{formatCurrency(shiftData.promedioPorPedido)}</span>
                </Flex>
              )}

              <Flex justify="between" className="border-t border-green-200 pt-2">
                <span className="font-semibold text-green-700 mr-2">Ganancia neta:</span>
                <span className="font-bold text-green-700">{formatCurrency(shiftData.totalWithDiscount)}</span>
              </Flex>
            </div>
          </div>
        )
      }}
    </BaseShiftCard>
  );
};

export default TarjetaTurnoDelivery;