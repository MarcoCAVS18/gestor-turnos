// src/components/modals/SelectorTipoTrabajo/index.jsx

import React from 'react';
import { Briefcase, Truck, Clock, DollarSign, Package, Navigation } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';

const SelectorTipoTrabajo = ({ onSelectTipo, coloresTemáticos, isMobile }) => {
  const { coloresTemáticos: contextColors } = useApp();
  
  // Usar colores del contexto si no se pasan como prop
  const colors = coloresTemáticos || contextColors;

  const handleSelect = (tipo) => {
    onSelectTipo(tipo);
  };

  return (
    <div className={`space-y-6 ${isMobile ? 'mobile-form' : ''}`}>
      <div className="text-center mb-6">
        <h3 
          className={`font-semibold mb-3 ${isMobile ? 'text-xl' : 'text-lg'}`}
          style={{ color: colors?.base }}
        >
          ¿Qué tipo de trabajo quieres agregar?
        </h3>
        <p className={`text-gray-600 ${isMobile ? 'text-base' : 'text-sm'}`}>
          Selecciona el tipo que mejor describe tu trabajo
        </p>
      </div>
      
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-6' : 'gap-4'}`}>
        {/* Trabajo Tradicional */}
        <button
          type="button"
          onClick={() => handleSelect('tradicional')}
          className={`
            border-2 rounded-xl hover:shadow-lg transition-all duration-300 group text-left
            transform hover:scale-105 active:scale-95
            ${isMobile ? 'p-6 min-h-[140px]' : 'p-6'}
          `}
          style={{ 
            borderColor: '#e5e7eb',
            backgroundColor: 'white'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = colors?.base;
            e.currentTarget.style.backgroundColor = colors?.transparent5;
            e.currentTarget.style.boxShadow = `0 8px 25px ${colors?.transparent30 || 'rgba(0,0,0,0.1)'}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div className={`flex items-start ${isMobile ? 'space-x-4' : 'space-x-4'}`}>
            <div className="flex-shrink-0">
              <div 
                className={`
                  rounded-lg flex items-center justify-center transition-all duration-300
                  ${isMobile ? 'w-12 h-12' : 'w-10 h-10'}
                `}
                style={{ backgroundColor: colors?.transparent10 }}
              >
                <Briefcase 
                  className={`text-blue-500 group-hover:scale-110 transition-transform ${isMobile ? 'w-7 h-7' : 'w-6 h-6'}`} 
                />
              </div>
            </div>
            <div className="flex-1">
              <h4 className={`font-semibold mb-2 ${isMobile ? 'text-lg' : 'text-lg'}`}>
                Trabajo por Horas
              </h4>
              <p className={`text-gray-600 mb-3 ${isMobile ? 'text-base leading-relaxed' : 'text-sm'}`}>
                Para trabajos con tarifa fija por hora y diferentes tipos de turno
              </p>
              <ul className={`space-y-2 ${isMobile ? 'text-sm' : 'text-xs'} text-gray-500`}>
                <li className="flex items-center">
                  <Clock size={isMobile ? 14 : 12} className="mr-2 text-blue-500 flex-shrink-0" />
                  <span>Tarifas por tipo de turno (diurno, tarde, noche)</span>
                </li>
                <li className="flex items-center">
                  <DollarSign size={isMobile ? 14 : 12} className="mr-2 text-green-500 flex-shrink-0" />
                  <span>Tarifas especiales para fin de semana</span>
                </li>
                <li className="flex items-center">
                  <Briefcase size={isMobile ? 14 : 12} className="mr-2 text-purple-500 flex-shrink-0" />
                  <span>Cálculo automático con descuentos</span>
                </li>
              </ul>
            </div>
          </div>
        </button>

        {/* Trabajo Delivery */}
        <button
          type="button"
          onClick={() => handleSelect('delivery')}
          className={`
            border-2 rounded-xl hover:shadow-lg transition-all duration-300 group text-left
            transform hover:scale-105 active:scale-95
            ${isMobile ? 'p-6 min-h-[140px]' : 'p-6'}
          `}
          style={{ 
            borderColor: '#e5e7eb',
            backgroundColor: 'white'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = colors?.base;
            e.currentTarget.style.backgroundColor = colors?.transparent5;
            e.currentTarget.style.boxShadow = `0 8px 25px ${colors?.transparent30 || 'rgba(0,0,0,0.1)'}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div className={`flex items-start ${isMobile ? 'space-x-4' : 'space-x-4'}`}>
            <div className="flex-shrink-0">
              <div 
                className={`
                  rounded-lg flex items-center justify-center transition-all duration-300
                  ${isMobile ? 'w-12 h-12' : 'w-10 h-10'}
                `}
                style={{ backgroundColor: '#dcfce7' }}
              >
                <Truck 
                  className={`text-green-600 group-hover:scale-110 transition-transform ${isMobile ? 'w-7 h-7' : 'w-6 h-6'}`} 
                />
              </div>
            </div>
            <div className="flex-1">
              <h4 className={`font-semibold mb-2 ${isMobile ? 'text-lg' : 'text-lg'}`}>
                Trabajo de Delivery
              </h4>
              <p className={`text-gray-600 mb-3 ${isMobile ? 'text-base leading-relaxed' : 'text-sm'}`}>
                Para trabajos de reparto con ganancias variables por turno
              </p>
              <ul className={`space-y-2 ${isMobile ? 'text-sm' : 'text-xs'} text-gray-500`}>
                <li className="flex items-center">
                  <DollarSign size={isMobile ? 14 : 12} className="mr-2 text-green-500 flex-shrink-0" />
                  <span>Registro de ganancias totales por turno</span>
                </li>
                <li className="flex items-center">
                  <Package size={isMobile ? 14 : 12} className="mr-2 text-blue-500 flex-shrink-0" />
                  <span>Seguimiento de pedidos y kilómetros</span>
                </li>
                <li className="flex items-center">
                  <Navigation size={isMobile ? 14 : 12} className="mr-2 text-orange-500 flex-shrink-0" />
                  <span>Control de propinas y gastos de combustible</span>
                </li>
              </ul>
            </div>
          </div>
        </button>
      </div>

      {/* Consejo informativo */}
      <div 
        className={`p-4 rounded-lg ${isMobile ? 'mt-6' : 'mt-6'}`}
        style={{ backgroundColor: colors?.transparent10 || 'rgba(59, 130, 246, 0.1)' }}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div 
              className={`rounded-full flex items-center justify-center ${isMobile ? 'w-6 h-6' : 'w-5 h-5'}`}
              style={{ backgroundColor: colors?.base }}
            >
              <span className="text-white text-xs font-bold">💡</span>
            </div>
          </div>
          <div>
            <p 
              className={`font-medium mb-1 ${isMobile ? 'text-base' : 'text-sm'}`}
              style={{ color: colors?.base }}
            >
              Consejo
            </p>
            <p className={`${isMobile ? 'text-sm leading-relaxed' : 'text-sm'} text-gray-700`}>
              Puedes tener trabajos de ambos tipos en tu perfil. Cada uno se adaptará a sus características específicas para un mejor control de tus ingresos.
            </p>
          </div>
        </div>
      </div>

      {/* Botón de ayuda en móvil */}
      {isMobile && (
        <div className="text-center pt-4">
          <button
            type="button"
            className="text-sm text-gray-500 underline"
            onClick={() => {
              alert('Si tienes dudas sobre qué tipo elegir, puedes cambiar esto después en la configuración del trabajo.');
            }}
          >
            ¿No estás seguro cuál elegir?
          </button>
        </div>
      )}
    </div>
  );
};

export default SelectorTipoTrabajo;