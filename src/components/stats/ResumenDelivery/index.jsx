// src/components/stats/ResumenDelivery/index.jsx

import React, { useState } from 'react';
import { Truck, DollarSign, Package, Navigation } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import Card from '../../ui/Card';

const ResumenDelivery = ({ deliveryStats }) => {
  const colors = useThemeColors();
  const [animacionActiva, setAnimacionActiva] = useState(false);

  React.useEffect(() => {
    setAnimacionActiva(true);
    const timer = setTimeout(() => setAnimacionActiva(false), 1000);
    return () => clearTimeout(timer);
  }, [deliveryStats]);

  // Múltiples formas de calcular el promedio por pedido
  const promedioPorPedido1 = deliveryStats.totalPedidos > 0 ? 
    deliveryStats.totalGanado / deliveryStats.totalPedidos : 0;
  
  // Buscar si existe directamente en deliveryStats
  const promedioPorPedido2 = deliveryStats.promedioPorPedido || 0;
  
  // Buscar en plataformas
  let promedioPorPedido3 = 0;
  if (deliveryStats.turnosPorPlataforma) {
    const plataformas = Object.values(deliveryStats.turnosPorPlataforma);
    const totalPedidosPlataformas = plataformas.reduce((sum, p) => sum + (p.totalPedidos || 0), 0);
    const totalGanadoPlataformas = plataformas.reduce((sum, p) => sum + (p.totalGanado || 0), 0);
    promedioPorPedido3 = totalPedidosPlataformas > 0 ? totalGanadoPlataformas / totalPedidosPlataformas : 0;
  }

  // Usar el que tenga valor
  const promedioPorPedido = promedioPorPedido2 || promedioPorPedido3 || promedioPorPedido1;

  if (deliveryStats.totalPedidos === 0) {
    return (
      <Card variant="transparent">
        <div className={`text-center py-6 transition-opacity duration-1000 ${animacionActiva ? 'opacity-50' : 'opacity-100'}`}>
          <Truck size={32} className="mx-auto mb-3 text-gray-300" />
          <h3 className="font-semibold text-gray-600 mb-1">Sin datos de delivery</h3>
          <p className="text-sm text-gray-500">Registra turnos para ver las estadísticas</p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="transparent">
      <h3 className="text-lg font-semibold flex items-center mb-4">
        <Truck size={20} style={{ color: colors.primary }} className="mr-2" />
        Resumen Delivery
      </h3>

      <div className={`grid grid-cols-2 gap-4 transition-all duration-500 ${animacionActiva ? 'opacity-90' : 'opacity-100'}`}>
        {/* Ganancia Total */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform transform hover:-translate-y-1">
          <div className="h-2 bg-gradient-to-r from-green-400 to-green-500"></div>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <p className="text-sm font-semibold text-gray-700">Ganancia</p>
              <DollarSign size={20} className="text-gray-400" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(deliveryStats.totalGanado)}</p>
          </div>
        </div>

        {/* Total Pedidos */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform transform hover:-translate-y-1">
          <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-500"></div>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <p className="text-sm font-semibold text-gray-700">Pedidos</p>
              <Package size={20} className="text-gray-400" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">{deliveryStats.totalPedidos}</p>
          </div>
        </div>

        {/* Kilómetros Totales */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform transform hover:-translate-y-1">
          <div className="h-2 bg-gradient-to-r from-purple-400 to-purple-500"></div>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <p className="text-sm font-semibold text-gray-700">KMs</p>
              <Navigation size={20} className="text-gray-400" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">{deliveryStats.totalKilometros.toFixed(1)}</p>
          </div>
        </div>
        
        {/* Promedio por Pedido */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform transform hover:-translate-y-1">
          <div className="h-2 bg-gradient-to-r from-orange-400 to-orange-500"></div>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <p className="text-sm font-semibold text-gray-700">€ / Pedido</p>
              <DollarSign size={20} className="text-gray-400" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(promedioPorPedido)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResumenDelivery;