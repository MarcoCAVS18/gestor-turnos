// src/components/Turno.jsx

import React from 'react';
import { useApp } from '../contexts/AppContext';

const Turno = ({ turno, trabajo }) => {
  const { calcularPago, rangosTurnos } = useApp();
  const { horas, total, totalConDescuento } = calcularPago(turno);
  
  // Función para calcular TODOS los tipos de turno que abarca
  const calcularTiposTurno = (turno) => {
    const fecha = new Date(turno.fecha + 'T00:00:00');
    const diaSemana = fecha.getDay();
    
    // Si es fin de semana, solo devolver ese tipo
    if (diaSemana === 0) return [{ tipo: 'Domingo', color: '#EF4444' }];
    if (diaSemana === 6) return [{ tipo: 'Sábado', color: '#8B5CF6' }];
    
    // Para días de semana, analizar rangos horarios
    const rangos = rangosTurnos || {
      diurnoInicio: 6, diurnoFin: 14,
      tardeInicio: 14, tardeFin: 20,
      nocheInicio: 20
    };
    
    const [horaIni, minIni] = turno.horaInicio.split(':').map(Number);
    const [horaFin, minFin] = turno.horaFin.split(':').map(Number);
    
    let inicioMinutos = horaIni * 60 + minIni;
    let finMinutos = horaFin * 60 + minFin;
    
    // Si cruza medianoche
    if (finMinutos <= inicioMinutos) {
      finMinutos += 24 * 60;
    }
    
    const tipos = [];
    const tiposEncontrados = new Set();
    
    // Analizar cada minuto del turno
    for (let minuto = inicioMinutos; minuto < finMinutos; minuto++) {
      const horaActual = minuto % (24 * 60);
      
      let tipoActual = '';
      if (horaActual >= rangos.diurnoInicio * 60 && horaActual < rangos.diurnoFin * 60) {
        tipoActual = 'Diurno';
      } else if (horaActual >= rangos.tardeInicio * 60 && horaActual < rangos.tardeFin * 60) {
        tipoActual = 'Tarde';
      } else {
        tipoActual = 'Nocturno';
      }
      
      tiposEncontrados.add(tipoActual);
    }
    
    // Convertir a array con colores
    const coloresTipos = {
      'Diurno': '#10B981',    // Verde
      'Tarde': '#F59E0B',     // Amarillo
      'Nocturno': '#6366F1',  // Índigo
      'Sábado': '#8B5CF6',    // Violeta
      'Domingo': '#EF4444'    // Rojo
    };
    
    // Ordenar los tipos según el orden lógico
    const ordenTipos = ['Diurno', 'Tarde', 'Nocturno'];
    
    ordenTipos.forEach(tipo => {
      if (tiposEncontrados.has(tipo)) {
        tipos.push({
          tipo,
          color: coloresTipos[tipo]
        });
      }
    });
    
    return tipos;
  };
  
  // Calcular tarifa promedio por hora
  const tarifaPromedioPorHora = horas > 0 ? total / horas : 0;
  
  const tiposTurno = calcularTiposTurno(turno);
  
  return (
    <div 
      className="p-4 mb-3 rounded-lg relative pl-6"
      style={{ 
        backgroundColor: `${trabajo.color}15`, 
        borderColor: trabajo.color,
        borderWidth: '1px'
      }}
    >
      <div 
        className="absolute top-0 left-0 bottom-0 w-2 rounded-l-lg"
        style={{ backgroundColor: trabajo.color }}
      />
      
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">{trabajo.nombre}</h4>
          <p className="text-gray-600 text-sm">
            {turno.horaInicio} - {turno.horaFin} ({horas.toFixed(1)}h)
          </p>
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">
              Tipo: {tiposTurno.map(t => t.tipo).join(' y ')}
            </p>
            <div className="flex flex-wrap gap-1">
              {tiposTurno.map((tipoInfo, index) => (
                <span 
                  key={index}
                  className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: tipoInfo.color }}
                >
                  {tipoInfo.tipo}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">
            Promedio: ${tarifaPromedioPorHora.toFixed(2)}/h
          </p>
          <p className="text-sm line-through text-gray-500">
            ${total.toFixed(2)}
          </p>
          <p className="font-semibold">
            ${totalConDescuento.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Turno;