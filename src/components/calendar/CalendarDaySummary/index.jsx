// src/components/calendar/CalendarDaySummary/index.jsx

import React from 'react';
import { PlusCircle, Calendar } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import TarjetaTurno from '../../cards/TarjetaTurno';
import Button from '../../ui/Button';
import Card from '../../ui/Card';

const CalendarDaySummary = ({ 
  fechaSeleccionada, 
  turnos, 
  formatearFecha, 
  onNuevoTurno 
}) => {
  const { trabajos, calcularPago, coloresTemáticos } = useApp();

  const calcularTotalDia = (turnosList) => {
    return turnosList.reduce((total, turno) => {
      const { totalConDescuento } = calcularPago(turno);
      return total + totalConDescuento;
    }, 0);
  };

  const obtenerTrabajo = (trabajoId) => {
    return trabajos.find(t => t.id === trabajoId);
  };

  if (!fechaSeleccionada) return null;

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">
          Turnos del día seleccionado
        </h3>
        <Button
          onClick={() => onNuevoTurno(new Date(fechaSeleccionada + 'T12:00:00'))}
          size="sm"
          className="flex items-center gap-1"
          icon={PlusCircle}
        >
          Nuevo
        </Button>
      </div>
      
      {turnos.length > 0 ? (
        <Card className="overflow-hidden" padding="none">
          {/* Header del día */}
          <div 
            className="px-4 py-3 border-b rounded-t-xl"
            style={{ backgroundColor: coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)' }}
          >
            <div className="flex items-center">
              <Calendar size={18} style={{ color: coloresTemáticos?.base || '#EC4899' }} className="mr-2" />
              <h3 className="font-semibold">{formatearFecha(fechaSeleccionada)}</h3>
            </div>
          </div>
          
          {/* Lista de turnos */}
          <div className="p-4 space-y-3">
            {turnos.map(turno => {
              const trabajo = obtenerTrabajo(turno.trabajoId);
              if (!trabajo) return null;
              
              return (
                <TarjetaTurno
                  key={turno.id}
                  turno={turno}
                  trabajo={trabajo}
                  onEdit={() => {}} 
                  onDelete={() => {}} 
                />
              );
            })}
            
            {/* Total del día */}
            <div 
              className="flex justify-between px-4 py-3 rounded-lg mt-4"
              style={{ backgroundColor: coloresTemáticos?.transparent5 || 'rgba(0,0,0,0.05)' }}
            >
              <span className="font-semibold">Total del día:</span>
              <span 
                className="font-semibold"
                style={{ color: coloresTemáticos?.base || '#EC4899' }}
              >
                ${calcularTotalDia(turnos).toFixed(2)}
              </span>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="text-center py-6">
          <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">No hay turnos para esta fecha</p>
          <Button
            onClick={() => onNuevoTurno(new Date(fechaSeleccionada + 'T12:00:00'))}
            className="flex items-center gap-2"
            icon={PlusCircle}
          >
            Agregar turno
          </Button>
        </Card>
      )}
    </div>
  );
};

export default CalendarDaySummary;