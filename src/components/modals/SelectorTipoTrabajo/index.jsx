// src/components/modals/SelectorTipoTrabajo/index.jsx

import React from 'react';
import { Briefcase, Truck, Clock, DollarSign, Package, Navigation } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';

const SelectorTipoTrabajo = ({ onSelectTipo }) => {
  const { coloresTemáticos } = useApp();

  const handleSelect = (tipo) => {
    onSelectTipo(tipo);
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Qué tipo de trabajo quieres agregar?</h3>
        <p className="text-sm text-gray-600">
          Selecciona el tipo que mejor describe tu trabajo
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {/* Trabajo Tradicional */}
        <button
          type="button"
          onClick={() => handleSelect('tradicional')}
          className="p-6 border-2 rounded-xl hover:border-pink-500 transition-all duration-200 group text-left"
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = coloresTemáticos?.base;
            e.currentTarget.style.backgroundColor = coloresTemáticos?.transparent5;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          style={{ borderColor: '#e5e7eb' }}
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Briefcase className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-lg mb-1">Trabajo por Horas</h4>
              <p className="text-sm text-gray-600 mb-2">
                Para trabajos con tarifa fija por hora
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li className="flex items-center">
                  <Clock size={12} className="mr-1" />
                  Tarifas por tipo de turno (diurno, tarde, noche)
                </li>
                <li className="flex items-center">
                  <DollarSign size={12} className="mr-1" />
                  Tarifas especiales para fin de semana
                </li>
                <li className="flex items-center">
                  <Briefcase size={12} className="mr-1" />
                  Cálculo automático con descuentos
                </li>
              </ul>
            </div>
          </div>
        </button>

        {/* Trabajo Delivery */}
        <button
          type="button"
          onClick={() => handleSelect('delivery')}
          className="p-6 border-2 rounded-xl hover:border-pink-500 transition-all duration-200 group text-left"
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = coloresTemáticos?.base;
            e.currentTarget.style.backgroundColor = coloresTemáticos?.transparent5;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          style={{ borderColor: '#e5e7eb' }}
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Truck className="w-8 h-8 text-green-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-lg mb-1">Trabajo de Delivery</h4>
              <p className="text-sm text-gray-600 mb-2">
                Para trabajos de reparto con ganancias variables
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li className="flex items-center">
                  <DollarSign size={12} className="mr-1" />
                  Registro de ganancias totales por turno
                </li>
                <li className="flex items-center">
                  <Package size={12} className="mr-1" />
                  Seguimiento de pedidos y kilómetros
                </li>
                <li className="flex items-center">
                  <Navigation size={12} className="mr-1" />
                  Control de propinas y gastos de combustible
                </li>
              </ul>
            </div>
          </div>
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>💡 Consejo:</strong> Puedes tener trabajos de ambos tipos en tu perfil. 
          Cada uno se adaptará a sus características específicas.
        </p>
      </div>
    </div>
  );
};

export default SelectorTipoTrabajo;