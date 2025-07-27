// src/components/stats/DailyDistribution/index.jsx

import React, { useState } from 'react';
import { Calendar, Clock, Award, DollarSign } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';

const DailyDistribution = ({ gananciaPorDia }) => {
  const colors = useThemeColors();
  const [animacionActiva, setAnimacionActiva] = useState(false);

  React.useEffect(() => {
    setAnimacionActiva(true);
    const timer = setTimeout(() => setAnimacionActiva(false), 1000);
    return () => clearTimeout(timer);
  }, [gananciaPorDia]);

  // Función para formatear horas
  const formatearHoras = (horas) => {
    if (horas === 0) return '0h';
    if (horas < 1) {
      const minutos = Math.round(horas * 60);
      return `${minutos}min`;
    }
    const horasEnteras = Math.floor(horas);
    const minutos = Math.round((horas - horasEnteras) * 60);
    
    if (minutos === 0) {
      return `${horasEnteras}h`;
    }
    return `${horasEnteras}h ${minutos}min`;
  };

  if (!gananciaPorDia || typeof gananciaPorDia !== 'object') {
    return (
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center mb-4">
          <Calendar size={18} className="mr-2 text-gray-500" />
          <h3 className="font-semibold">Distribución semanal</h3>
        </div>
        <div className={`text-center py-8 text-gray-500 transition-opacity duration-1000 ${animacionActiva ? 'opacity-50' : 'opacity-100'}`}>
          <Calendar size={48} className="mx-auto mb-3 opacity-30" />
          <p>No hay datos de esta semana</p>
        </div>
      </div>
    );
  }

  let diaMasProductivo = { dia: 'Ninguno', horas: 0, turnos: 0, ganancia: 0 };
  
  try {
    Object.entries(gananciaPorDia).forEach(([dia, datos]) => {
      if (datos && typeof datos === 'object') {
        const horasSeguras = (typeof datos.horas === 'number' && !isNaN(datos.horas)) ? datos.horas : 0;
        const turnosSeguras = (typeof datos.turnos === 'number' && !isNaN(datos.turnos)) ? datos.turnos : 0;
        const gananciaSegura = (typeof datos.ganancia === 'number' && !isNaN(datos.ganancia)) ? datos.ganancia : 0;
        
        if (gananciaSegura > diaMasProductivo.ganancia) {
          diaMasProductivo = {
            dia: dia || 'Día',
            horas: horasSeguras,
            turnos: turnosSeguras,
            ganancia: gananciaSegura
          };
        }
      }
    });
  } catch (error) {
    console.error('Error procesando día más productivo:', error);
  }

  return (
    <div className="space-y-4">
      {diaMasProductivo.ganancia > 0 && (
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center mb-3">
            <Award size={18} style={{ color: colors.primary }} className="mr-2" />
            <h3 className="font-semibold">Día más productivo</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-lg">{diaMasProductivo.dia}</p>
              <p className="text-sm text-gray-600">
                {diaMasProductivo.turnos} turnos · {formatearHoras(diaMasProductivo.horas)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold" style={{ color: colors.primary }}>
                {formatCurrency(diaMasProductivo.ganancia)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center mb-4">
          <Calendar size={18} style={{ color: colors.primary }} className="mr-2" />
          <h3 className="font-semibold">Distribución semanal</h3>
        </div>

        <div className="space-y-2">
          {Object.entries(gananciaPorDia).map(([dia, datos]) => {
            const datosSeguro = {
              horas: 0,
              turnos: 0,
              ganancia: 0
            };

            try {
              if (datos && typeof datos === 'object') {
                datosSeguro.horas = (typeof datos.horas === 'number' && !isNaN(datos.horas)) ? datos.horas : 0;
                datosSeguro.turnos = (typeof datos.turnos === 'number' && !isNaN(datos.turnos)) ? datos.turnos : 0;
                datosSeguro.ganancia = (typeof datos.ganancia === 'number' && !isNaN(datos.ganancia)) ? datos.ganancia : 0;
              }
            } catch (error) {
              console.error(`Error procesando día ${dia}:`, error);
            }

            return (
              <div key={dia} className={`p-3 bg-gray-50 rounded-lg transition-all duration-500 ${animacionActiva ? 'scale-105 shadow-md' : 'scale-100'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{dia || 'Día'}</span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <DollarSign size={14} className="mr-1" style={{ color: colors.primary }} />
                      <span className="text-sm font-bold" style={{ color: colors.primary }}>
                        {formatCurrency(datosSeguro.ganancia)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formatearHoras(datosSeguro.horas)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {datosSeguro.turnos} turno{datosSeguro.turnos !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                {datosSeguro.turnos === 0 && (
                  <p className="text-xs text-gray-400 mt-1">Sin actividad</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DailyDistribution;