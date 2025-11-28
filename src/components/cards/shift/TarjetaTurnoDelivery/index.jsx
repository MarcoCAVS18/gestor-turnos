// src/components/cards/TarjetaTurnoDelivery/index.jsx - Refactorizado usando BaseShiftCard

import React from 'react';
import { Package, DollarSign, Navigation, Truck } from 'lucide-react';
import BaseShiftCard from '../../base/BaseShiftCard';
import { formatCurrency } from '../../../../utils/currency';

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
    <BaseShiftCard {...props} type="delivery" shiftData={shiftData}>
      {{
        // Avatar icon para delivery
        avatarIcon: <Truck size={16} />,

        // Stats móvil - Pedidos, km y ganancia
        mobileStats: (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {shiftData.numeroPedidos > 0 && (
                <div className="flex items-center">
                  <Package size={12} className="mr-1 text-blue-500" />
                  <span>{shiftData.numeroPedidos}</span>
                </div>
              )}

              {shiftData.kilometros > 0 && (
                <div className="flex items-center">
                  <Navigation size={12} className="mr-1 text-purple-500" />
                  <span>{shiftData.kilometros}km</span>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <DollarSign size={16} className="mr-1 text-green-600" />
              <span className="font-bold text-green-600 text-lg">
                {formatCurrency(shiftData.totalWithDiscount)}
              </span>
            </div>
          </div>
        ),

        // Stats desktop - Pedidos, km y ganancia
        desktopStats: (
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600 gap-4">
              {shiftData.numeroPedidos > 0 && (
                <div className="flex items-center">
                  <Package size={14} className="mr-1 text-blue-500" />
                  <span>{shiftData.numeroPedidos}</span>
                </div>
              )}

              {shiftData.kilometros > 0 && (
                <div className="flex items-center">
                  <Navigation size={14} className="mr-1 text-purple-500" />
                  <span>{shiftData.kilometros} km</span>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <DollarSign size={16} className="mr-1 text-green-600" />
              <span className="text-lg font-semibold text-green-600">
                {formatCurrency(shiftData.totalWithDiscount)}
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
                <span className="font-medium">{formatCurrency(shiftData.gananciaTotal)}</span>
              </div>

              {shiftData.propinas > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-600">Propinas:</span>
                  <span className="font-medium">{formatCurrency(shiftData.propinas)}</span>
                </div>
              )}

              {shiftData.gastos > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-600">Gastos combustible:</span>
                  <span className="font-medium">{formatCurrency(shiftData.gastos)}</span>
                </div>
              )}

              {shiftData.numeroPedidos > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Promedio/pedido:</span>
                  <span>{formatCurrency(shiftData.promedioPorPedido)}</span>
                </div>
              )}

              <div className="flex justify-between border-t border-green-200 pt-2">
                <span className="font-semibold text-green-700">Ganancia neta:</span>
                <span className="font-bold">{formatCurrency(shiftData.totalWithDiscount)}</span>
              </div>
            </div>
          </div>
        )
      }}
    </BaseShiftCard>
  );
};

export default TarjetaTurnoDelivery;