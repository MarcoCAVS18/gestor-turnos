// src/components/calendar/CalendarDaySummary/index.jsx 

import React from 'react';
import { PlusCircle, Calendar, Moon, Sun } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { obtenerTipoTurnoEnFecha } from '../../../utils/calendarUtils';
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
  // Obtener TODOS los trabajos (tradicionales + delivery) y la función de cálculo
  const { trabajos, trabajosDelivery, calculatePayment, thematicColors } = useApp();

  const calcularTotalDia = (turnosList) => {
    if (!Array.isArray(turnosList) || turnosList.length === 0) {
      return 0;
    }

    return turnosList.reduce((total, turno) => {
      try {
        if (turno.tipo === 'delivery') {
          // Para turnos de delivery, usar gananciaTotal directamente
          const gananciaTotal = turno.gananciaTotal || 0;
          return total + gananciaTotal;
        } else {
          // Para turnos tradicionales, usar calculatePayment
          if (typeof calculatePayment === 'function') {
            const resultado = calculatePayment(turno);
            const ganancia = resultado.totalWithDiscount || resultado.totalConDescuento || 0;
            return total + ganancia;
          } else {
            console.warn('calculatePayment no está disponible');
            return total;
          }
        }
      } catch (error) {
        console.error('Error calculando pago para turno:', turno.id, error);
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

  // NUEVO: Agrupar turnos por tipo (normales vs nocturnos)
  const turnosAgrupados = turnosValidos.reduce((grupos, turno) => {
    const tipoTurno = obtenerTipoTurnoEnFecha(turno, fechaSeleccionada);
    
    if (tipoTurno === 'inicio-nocturno') {
      grupos.inicianHoy.push(turno);
    } else if (tipoTurno === 'fin-nocturno') {
      grupos.terminanHoy.push(turno);
    } else {
      grupos.completos.push(turno);
    }
    
    return grupos;
  }, { completos: [], inicianHoy: [], terminanHoy: [] });

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
          themeColor={thematicColors?.base}
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
          <div className="p-4 space-y-4">
            
            {/* Turnos que terminan hoy (empezaron ayer) */}
            {turnosAgrupados.terminanHoy.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <Moon size={16} className="text-blue-600 mr-2" />
                  <h4 className="text-sm font-medium text-blue-800">Turnos que terminan hoy</h4>
                </div>
                <div className="space-y-2 ml-6">
                  {turnosAgrupados.terminanHoy.map(turno => {
                    const trabajo = obtenerTrabajo(turno.trabajoId);
                    if (!trabajo) return null;

                    return (
                      <div key={turno.id} className="border-l-2 border-blue-300 pl-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{trabajo.nombre}</p>
                            <p className="text-xs text-gray-600">
                              Empezó: {new Date(turno.fechaInicio + 'T00:00:00').toLocaleDateString('es-ES', { 
                                weekday: 'short', day: 'numeric', month: 'short' 
                              })} {turno.horaInicio} - Termina: {turno.horaFin}
                            </p>
                          </div>
                          {turno.tipo === 'delivery' && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              ${turno.gananciaTotal || 0}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Turnos completos en el día */}
            {turnosAgrupados.completos.length > 0 && (
              <div>
                {(turnosAgrupados.terminanHoy.length > 0 || turnosAgrupados.inicianHoy.length > 0) && (
                  <div className="flex items-center mb-2">
                    <Sun size={16} className="text-orange-600 mr-2" />
                    <h4 className="text-sm font-medium text-orange-800">Turnos completos del día</h4>
                  </div>
                )}
                <div className="space-y-3">
                  {turnosAgrupados.completos.map(turno => {
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
                </div>
              </div>
            )}

            {/* Turnos que inician hoy (terminan mañana) */}
            {turnosAgrupados.inicianHoy.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <Moon size={16} className="text-purple-600 mr-2" />
                  <h4 className="text-sm font-medium text-purple-800">Turnos nocturnos (terminan mañana)</h4>
                </div>
                <div className="space-y-2 ml-6">
                  {turnosAgrupados.inicianHoy.map(turno => {
                    const trabajo = obtenerTrabajo(turno.trabajoId);
                    if (!trabajo) return null;

                    return (
                      <div key={turno.id} className="border-l-2 border-purple-300 pl-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{trabajo.nombre}</p>
                            <p className="text-xs text-gray-600">
                              Inicia: {turno.horaInicio} - Termina: {new Date(turno.fechaFin + 'T00:00:00').toLocaleDateString('es-ES', { 
                                weekday: 'short', day: 'numeric', month: 'short' 
                              })} {turno.horaFin}
                            </p>
                          </div>
                          {turno.tipo === 'delivery' && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              ${turno.gananciaTotal || 0}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
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
            themeColor={thematicColors?.base}
          >
            Agregar turno
          </Button>
        </Card>
      )}
    </div>
  );
};

export default CalendarDaySummary;