// src/components/stats/ComparacionPlataformas/index.jsx

import React, { useState } from 'react';
import { BarChart3, Package, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const ComparacionPlataformas = ({ deliveryStats }) => {
  const { coloresTemáticos } = useApp();
  const [sortBy, setSortBy] = useState('totalGanado');
  const [animacionActiva, setAnimacionActiva] = useState(false);

  React.useEffect(() => {
    setAnimacionActiva(true);
    const timer = setTimeout(() => setAnimacionActiva(false), 1000);
    return () => clearTimeout(timer);
  }, [deliveryStats, sortBy]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const plataformas = Object.values(deliveryStats.turnosPorPlataforma);

  if (plataformas.length === 0) {
    return (
      <Card>
        <div className={`text-center py-6 transition-opacity duration-1000 ${animacionActiva ? 'opacity-50' : 'opacity-100'}`}>
          <BarChart3 size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Sin datos de plataformas
          </h3>
          <p className="text-gray-500">
            Los datos aparecerán al registrar turnos
          </p>
        </div>
      </Card>
    );
  }

  const plataformasConMetricas = plataformas.map(plataforma => {
    const promedioPorPedido = plataforma.totalPedidos > 0 ? plataforma.totalGanado / plataforma.totalPedidos : 0;
    const promedioPorHora = plataforma.totalHoras > 0 ? plataforma.totalGanado / plataforma.totalHoras : 0;
    const gananciaLiquida = plataforma.totalGanado - plataforma.totalGastos;
    
    return {
      ...plataforma,
      promedioPorPedido,
      promedioPorHora,
      gananciaLiquida
    };
  });

  const plataformasOrdenadas = [...plataformasConMetricas].sort((a, b) => {
    return b[sortBy] - a[sortBy];
  });

  const totalGeneral = plataformas.reduce((sum, p) => sum + p.totalGanado, 0);

  const getPlataformaIcon = (nombre) => {
    const icons = {
      'Uber Eats': '🚗',
      'DoorDash': '🛵',
      'Rappi': '📦',
      'PedidosYa': '🏍️',
      'Menulog': '🍔',
      'Deliveroo': '🚴'
    };
    return icons[nombre] || '📱';
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <BarChart3 size={20} style={{ color: coloresTemáticos?.base }} className="mr-2" />
          Plataformas
        </h3>
      </div>

      <div className="mb-3">
        <div className="flex gap-1 text-sm">
          <button
            onClick={() => setSortBy('totalGanado')}
            className={`px-2 py-1 rounded transition-colors ${
              sortBy === 'totalGanado' 
                ? 'text-white' 
                : 'text-gray-600 bg-gray-100'
            }`}
            style={{ 
              backgroundColor: sortBy === 'totalGanado' ? coloresTemáticos?.base : undefined
            }}
          >
            Ganancias
          </button>
          <button
            onClick={() => setSortBy('totalPedidos')}
            className={`px-2 py-1 rounded transition-colors ${
              sortBy === 'totalPedidos' 
                ? 'text-white' 
                : 'text-gray-600 bg-gray-100'
            }`}
            style={{ 
              backgroundColor: sortBy === 'totalPedidos' ? coloresTemáticos?.base : undefined
            }}
          >
            Pedidos
          </button>
          <button
            onClick={() => setSortBy('promedioPorHora')}
            className={`px-2 py-1 rounded transition-colors ${
              sortBy === 'promedioPorHora' 
                ? 'text-white' 
                : 'text-gray-600 bg-gray-100'
            }`}
            style={{ 
              backgroundColor: sortBy === 'promedioPorHora' ? coloresTemáticos?.base : undefined
            }}
          >
            Por hora
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {plataformasOrdenadas.map((plataforma, index) => {
          const porcentajeGanancias = totalGeneral > 0 ? (plataforma.totalGanado / totalGeneral) * 100 : 0;
          const icon = getPlataformaIcon(plataforma.nombre);
          
          return (
            <div 
              key={plataforma.nombre}
              className={`p-3 rounded-lg border border-gray-200 transition-all duration-500 ${animacionActiva ? 'scale-105 shadow-md' : 'scale-100'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-xl mr-2">{icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {plataforma.nombre}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {plataforma.turnos} turnos
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold" style={{ color: plataforma.color || coloresTemáticos?.base }}>
                    {formatCurrency(plataforma.totalGanado)}
                  </p>
                  <p className="text-sm text-gray-500">{porcentajeGanancias.toFixed(1)}%</p>
                </div>
              </div>

              <div className="mb-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${animacionActiva ? 'animate-pulse' : ''}`}
                    style={{ 
                      width: `${porcentajeGanancias}%`,
                      backgroundColor: plataforma.color || coloresTemáticos?.base
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-center mb-1">
                    <Package size={12} className="mr-1 text-blue-500" />
                    <span className="font-medium">{plataforma.totalPedidos}</span>
                  </div>
                  <p className="text-xs text-gray-600">pedidos</p>
                </div>
                
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-center mb-1">
                    <DollarSign size={12} className="mr-1 text-green-500" />
                    <span className="font-medium">{formatCurrency(plataforma.promedioPorPedido)}</span>
                  </div>
                  <p className="text-xs text-gray-600">/pedido</p>
                </div>
                
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-center mb-1">
                    <Clock size={12} className="mr-1 text-purple-500" />
                    <span className="font-medium">{formatCurrency(plataforma.promedioPorHora)}</span>
                  </div>
                  <p className="text-xs text-gray-600">/hora</p>
                </div>
                
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp size={12} className="mr-1 text-orange-500" />
                    <span className="font-medium">{formatCurrency(plataforma.totalPropinas)}</span>
                  </div>
                  <p className="text-xs text-gray-600">propinas</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm text-center">
          <div>
            <p className="text-gray-600">Más rentable</p>
            <p className="font-semibold" style={{ color: coloresTemáticos?.base }}>
              {plataformasOrdenadas[0]?.nombre}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Promedio general</p>
            <p className="font-semibold" style={{ color: coloresTemáticos?.base }}>
              {formatCurrency(totalGeneral / plataformas.length)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ComparacionPlataformas;