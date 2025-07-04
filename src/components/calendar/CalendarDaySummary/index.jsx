// src/components/calendar/CalendarDaySummary/index.jsx

import React from 'react';
import { PlusCircle, Calendar } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import TarjetaTurno from '../../cards/TarjetaTurno';
import TarjetaTurnoDelivery from '../../cards/TarjetaTurnoDelivery';
import Button from '../../ui/Button';
import Card from '../../ui/Card';

const CalendarDaySummary = ({ 
  fechaSeleccionada, 
  turnos, 
  formatearFecha, 
  onNuevoTurno 
}) => {
  // Obtener TODOS los trabajos (tradicionales + delivery)
  const { trabajos, trabajosDelivery, calcularPago, thematicColors } = useApp();

  const calcularTotalDia = (turnosList) => {
    if (!Array.isArray(turnosList) || turnosList.length === 0) {
      return 0;
    }

    return turnosList.reduce((total, turno) => {
      try {
        if (turno.tipo === 'delivery') {
          const gananciaTotal = turno.gananciaTotal || 0;
          return total + gananciaTotal;
        } else {
          if (typeof calcularPago === 'function') {
            const { totalConDescuento } = calcularPago(turno);
            return total + totalConDescuento;
          } else {
            return total;
          }
        }
      } catch (error) {
        return total;
      }
    }, 0);
  };

  // Función para buscar trabajo en ambos tipos
  const obtenerTrabajo = (trabajoId) => {
    // Primero buscar en trabajos tradicionales
    let trabajo = trabajos?.find(t => t.id === trabajoId);
    
    // Si no se encuentra, buscar en trabajos de delivery
    if (!trabajo) {
      trabajo = trabajosDelivery?.find(t => t.id === trabajoId);
    }
    
    return trabajo;
  };

  if (!fechaSeleccionada) return null;

  const turnosValidos = Array.isArray(turnos) ? turnos : [];
  const totalDia = calcularTotalDia(turnosValidos);

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
      
      {turnosValidos.length > 0 ? (
        <Card className="overflow-hidden" padding="none">
          {/* Header del día */}
          <div 
            className="px-4 py-3 border-b rounded-t-xl"
            style={{ backgroundColor: thematicColors?.transparent10 || 'rgba(236, 72, 153, 0.1)' }}
          >
            <div className="flex items-center">
              <Calendar size={18} style={{ color: thematicColors?.base || '#EC4899' }} className="mr-2" />
              <h3 className="font-semibold">{formatearFecha(fechaSeleccionada)}</h3>
            </div>
          </div>
          
          {/* Lista de turnos */}
          <div className="p-4 space-y-3">
            {turnosValidos.map(turno => {
              const trabajo = obtenerTrabajo(turno.trabajoId);
              if (!trabajo) {
                return (
                  <div key={turno.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm font-medium">
                      Trabajo no encontrado
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      ID: {turno.trabajoId}
                    </p>
                    <p className="text-xs text-gray-500">
                      {turno.fecha} • {turno.horaInicio} - {turno.horaFin}
                    </p>
                    {turno.tipo === 'delivery' && (
                      <p className="text-xs text-blue-600 mt-1">
                        Turno de Delivery • Ganancia: ${turno.gananciaTotal || 0}
                      </p>
                    )}
                  </div>
                );
              }

              // Renderizar según el tipo de turno
              if (turno.tipo === 'delivery' || trabajo.tipo === 'delivery') {
                return (
                  <TarjetaTurnoDelivery
                    key={turno.id}
                    turno={turno}
                    trabajo={trabajo}
                    onEdit={() => {}} 
                    onDelete={() => {}} 
                  />
                );
              }
              
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
              style={{ backgroundColor: thematicColors?.transparent5 || 'rgba(0,0,0,0.05)' }}
            >
              <span className="font-semibold">Total del día:</span>
              <span 
                className="font-semibold"
                style={{ color: thematicColors?.base || '#EC4899' }}
              >
                ${totalDia.toFixed(2)}
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