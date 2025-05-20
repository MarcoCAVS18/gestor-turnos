// src/pages/Estadisticas.jsx
import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { BarChart2, TrendingUp, DollarSign, Clock } from 'lucide-react';

const Estadisticas = () => {
  const { turnos, trabajos, calcularPago } = useApp();
  const [resumen, setResumen] = useState({
    totalGanado: 0,
    horasTrabajadas: 0,
    trabajosMasRentables: [],
    turnosPorDia: {},
    promedioHora: 0
  });
  
  useEffect(() => {
    if (turnos.length === 0 || trabajos.length === 0) return;
    
    // Calcular estadísticas
    let totalGanado = 0;
    let horasTrabajadas = 0;
    const gananciaPorTrabajo = {};
    const horasPorTrabajo = {};
    const turnosPorDia = {
      "Lunes": 0,
      "Martes": 0,
      "Miércoles": 0,
      "Jueves": 0,
      "Viernes": 0,
      "Sábado": 0,
      "Domingo": 0
    };
    
    turnos.forEach(turno => {
      const trabajo = trabajos.find(t => t.id === turno.trabajoId);
      if (!trabajo) return;
      
      const { totalConDescuento, horas } = calcularPago(turno);
      
      // Acumular totales
      totalGanado += totalConDescuento;
      horasTrabajadas += horas;
      
      // Acumular por trabajo
      if (!gananciaPorTrabajo[trabajo.id]) {
        gananciaPorTrabajo[trabajo.id] = {
          id: trabajo.id,
          nombre: trabajo.nombre,
          color: trabajo.color,
          ganancia: 0,
          horas: 0
        };
        
        // Inicializar horas por trabajo
        horasPorTrabajo[trabajo.id] = 0;
      }
      gananciaPorTrabajo[trabajo.id].ganancia += totalConDescuento;
      gananciaPorTrabajo[trabajo.id].horas += horas;
      horasPorTrabajo[trabajo.id] += horas;
      
      const diaSemana = new Date(turno.fecha).getDay(); // 0 = domingo, 6 = sábado
      const nombresDias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      turnosPorDia[nombresDias[diaSemana]]++;
    });
    
    // Convertir el objeto en array y ordenar por ganancia
    const trabajosMasRentables = Object.values(gananciaPorTrabajo).sort((a, b) => b.ganancia - a.ganancia);
    
    // Calcular promedio por hora
    const promedioHora = horasTrabajadas > 0 ? totalGanado / horasTrabajadas : 0;
    
    // Generar datos para el gráfico de distribución de horas por trabajo
    const datosDistribucionHoras = Object.entries(horasPorTrabajo).map(([id, horas]) => {
      const trabajo = trabajos.find(t => t.id === id);
      return {
        nombre: trabajo ? trabajo.nombre : 'Desconocido',
        horas,
        color: trabajo ? trabajo.color : '#999',
        porcentaje: (horas / horasTrabajadas) * 100
      };
    }).sort((a, b) => b.horas - a.horas);
    
    setResumen({
      totalGanado,
      horasTrabajadas,
      trabajosMasRentables,
      turnosPorDia,
      promedioHora,
      datosDistribucionHoras,
      horasPorTrabajo
    });
  }, [turnos, trabajos, calcularPago]);
  
  const renderHorasPorTrabajoChart = () => {
    if (!resumen.horasPorTrabajo || Object.keys(resumen.horasPorTrabajo).length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          Aún no hay datos suficientes
        </div>
      );
    }
    
    // Mostrar gráfico de distribución de horas por trabajo
    return (
      <div className="p-4">
        {resumen.datosDistribucionHoras.map((item, index) => (
          <div key={index} className="mb-3 last:mb-0">
            <div className="flex justify-between mb-1">
              <span className="text-sm">{item.nombre}</span>
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">{item.horas.toFixed(1)}h</span>
                <span className="text-xs text-gray-500">({item.porcentaje.toFixed(1)}%)</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full" 
                style={{ 
                  width: `${item.porcentaje}%`,
                  backgroundColor: item.color 
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-semibold mb-4">Estadísticas</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center mb-1">
            <DollarSign size={16} className="text-indigo-600 mr-1" />
            <h3 className="text-gray-500">Total Ganado</h3>
          </div>
          <p className="text-2xl font-semibold">${resumen.totalGanado.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center mb-1">
            <Clock size={16} className="text-indigo-600 mr-1" />
            <h3 className="text-gray-500">Horas Trabajadas</h3>
          </div>
          <p className="text-2xl font-semibold">{resumen.horasTrabajadas.toFixed(1)}h</p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="flex items-center mb-3">
          <TrendingUp size={18} className="text-indigo-600 mr-2" />
          <h3 className="text-lg font-semibold">Promedio por Hora</h3>
        </div>
        <p className="text-3xl font-semibold text-center mt-2">${resumen.promedioHora.toFixed(2)}/h</p>
        <p className="text-center text-gray-500 text-sm mt-1">
          Basado en {resumen.horasTrabajadas.toFixed(1)} horas trabajadas
        </p>
      </div>
      
      <h3 className="text-lg font-semibold mb-3">
        <div className="flex items-center">
          <BarChart2 size={18} className="text-indigo-600 mr-2" />
          <span>Distribución de Horas por Trabajo</span>
        </div>
      </h3>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        {renderHorasPorTrabajoChart()}
      </div>
      
      <h3 className="text-lg font-semibold mb-3">Trabajos Más Rentables</h3>
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        {resumen.trabajosMasRentables.length > 0 ? (
          <div className="divide-y">
            {resumen.trabajosMasRentables.map(trabajo => (
              <div key={trabajo.id} className="p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: trabajo.color }} 
                  />
                  <span>{trabajo.nombre}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${trabajo.ganancia.toFixed(2)}</p>
                  <p className="text-gray-500 text-sm">{trabajo.horas.toFixed(1)}h</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            Aún no hay datos suficientes
          </div>
        )}
      </div>
      
      <h3 className="text-lg font-semibold mb-3">Turnos por Día</h3>
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        {Object.entries(resumen.turnosPorDia).map(([dia, cantidad]) => (
          <div key={dia} className="flex justify-between py-2 border-b last:border-0">
            <span>{dia}</span>
            <span className="font-semibold">{cantidad}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Estadisticas;