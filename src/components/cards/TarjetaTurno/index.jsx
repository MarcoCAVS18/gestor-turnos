import React from 'react';
import { Edit, Trash2, Clock, DollarSign } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useSwipeActions } from '../../../hooks/useSwipeActions';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const TarjetaTurno = ({ turno, trabajo, onEdit, onDelete }) => {
  const { calcularPago, coloresTemáticos, rangosTurnos } = useApp();
  const { 
    isOpen, 
    currentX, 
    handleTouchStart, 
    handleTouchMove, 
    handleTouchEnd, 
    closeSwipe 
  } = useSwipeActions(80);
  
  const { horas, total, totalConDescuento } = calcularPago(turno);
  
  const calcularTiposTurno = (turno) => {
    const fecha = new Date(turno.fecha + 'T00:00:00');
    const diaSemana = fecha.getDay();
    
    if (diaSemana === 0) return [{ tipo: 'Domingo', color: '#EF4444' }];
    if (diaSemana === 6) return [{ tipo: 'Sábado', color: '#8B5CF6' }];
    
    const rangos = rangosTurnos || {
      diurnoInicio: 6, diurnoFin: 14,
      tardeInicio: 14, tardeFin: 20,
      nocheInicio: 20
    };
    
    const [horaIni, minIni] = turno.horaInicio.split(':').map(Number);
    const [horaFin, minFin] = turno.horaFin.split(':').map(Number);
    
    let inicioMinutos = horaIni * 60 + minIni;
    let finMinutos = horaFin * 60 + minFin;
    
    if (finMinutos <= inicioMinutos) {
      finMinutos += 24 * 60;
    }
    
    const tipos = [];
    const tiposEncontrados = new Set();
    
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
    
    const coloresTipos = {
      'Diurno': '#10B981',
      'Tarde': '#F59E0B',
      'Nocturno': '#6366F1',
      'Sábado': '#8B5CF6',
      'Domingo': '#EF4444'
    };
    
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
  
  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr + 'T00:00:00');
    return fecha.toLocaleDateString('es-ES', { 
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };
  
  const handleClick = () => {
    if (isOpen) {
      closeSwipe();
    }
  };
  
  return (
    <div className="relative overflow-hidden rounded-lg mb-3 bg-white shadow-sm">
      {/* Botones de acción en el fondo */}
      <div className="absolute right-0 top-0 bottom-0 flex flex-col w-20">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(turno);
            closeSwipe();
          }}
          variant="ghost"
          className="flex-1 bg-gray-400 hover:bg-gray-600 text-white rounded-none"
          icon={Edit}
        />
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(turno);
            closeSwipe();
          }}
          variant="ghost"
          className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-none"
          icon={Trash2}
        />
      </div>
      
      {/* Contenido principal (deslizable) */}
      <Card
        className="relative transition-transform duration-200 cursor-pointer border-l-4"
        style={{
          transform: `translateX(-${currentX}px)`,
          borderLeftColor: trabajo.color
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        padding="md"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: trabajo.color }}
              />
              <h4 className="font-semibold text-gray-800">{trabajo.nombre}</h4>
            </div>
            <p className="text-sm text-gray-500">
              {formatearFecha(turno.fecha)}
            </p>
          </div>
          <div className="text-right">
            <p 
              className="text-lg font-bold"
              style={{ color: coloresTemáticos?.base || '#EC4899' }}
            >
              ${totalConDescuento.toFixed(2)}
            </p>
            {total !== totalConDescuento && (
              <p className="text-xs text-gray-400 line-through">
                ${total.toFixed(2)}
              </p>
            )}
          </div>
        </div>
        
        {/* Información del turno */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Clock size={14} className="mr-2" />
            <span>{turno.horaInicio} - {turno.horaFin}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSign size={14} className="mr-2" />
            <span>{horas.toFixed(1)} horas</span>
          </div>
        </div>
        
        {/* Tipos de turno */}
        <div className="mt-3">
          <div className="flex flex-wrap gap-1">
            {calcularTiposTurno(turno).map((tipoInfo, index) => (
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
        
        {/* Notas si las hay */}
        {turno.notas && (
          <div className="mt-3 p-2 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">{turno.notas}</p>
          </div>
        )}
        
        {/* Indicador de swipe */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TarjetaTurno;