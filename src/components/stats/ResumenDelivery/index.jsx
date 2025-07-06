// src/components/stats/ResumenDelivery/index.jsx

import React, { useState } from 'react';
import { Truck, DollarSign, Package, Navigation } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const ResumenDelivery = ({ deliveryStats }) => {
  const { thematicColors } = useApp();
  const [animacionActiva, setAnimacionActiva] = useState(false);

  React.useEffect(() => {
    setAnimacionActiva(true);
    const timer = setTimeout(() => setAnimacionActiva(false), 1000);
    return () => clearTimeout(timer);
  }, [deliveryStats]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
      <Card>
        <div className={`text-center py-6 transition-opacity duration-1000 ${animacionActiva ? 'opacity-50' : 'opacity-100'}`}>
          <Truck size={32} className="mx-auto mb-3 text-gray-300" />
          <h3 className="font-semibold text-gray-600 mb-1">Sin datos de delivery</h3>
          <p className="text-sm text-gray-500">Registra turnos para ver las estadísticas</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className='bg-white shadow-md p-6'>
      <h3 className="text-lg font-semibold flex items-center mb-4">
        <Truck size={20} style={{ color: thematicColors?.base }} className="mr-2" />
        Resumen Delivery
      </h3>

      <div className={`grid grid-cols-2 gap-4 transition-all duration-500 ${animacionActiva ? 'scale-105' : 'scale-100'}`}>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <DollarSign size={24} className="mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-bold text-green-700">{formatCurrency(deliveryStats.totalGanado)}</p>
          <p className="text-sm text-green-600">Ganancia Total</p>
        </div>

        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <Package size={24} className="mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-blue-700">{deliveryStats.totalPedidos}</p>
          <p className="text-sm text-blue-600">Pedidos</p>
        </div>

        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <Navigation size={24} className="mx-auto mb-2 text-purple-600" />
          <p className="text-2xl font-bold text-purple-700">{deliveryStats.totalKilometros.toFixed(1)}</p>
          <p className="text-sm text-purple-600">Kilómetros</p>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <DollarSign size={24} className="mx-auto mb-2" style={{ color: thematicColors?.base }} />
          <p className="text-2xl font-bold" style={{ color: thematicColors?.base }}>
            {formatCurrency(promedioPorPedido)}
          </p>
          <p className="text-sm text-gray-600">Por Pedido</p>
        </div>
      </div>
    </Card>
  );
};

export default ResumenDelivery;