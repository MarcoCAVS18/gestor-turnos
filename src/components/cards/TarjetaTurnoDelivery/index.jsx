// src/components/cards/TarjetaTurnoDelivery/index.jsx

import React from 'react';
import ***REMOVED*** Clock, Package, Car, TrendingUp, Edit2, Trash2, MoreVertical, Truck ***REMOVED*** from 'lucide-react';

const TarjetaTurnoDelivery = (***REMOVED*** turno, trabajo, onEdit, onDelete ***REMOVED***) => ***REMOVED***
  const [menuAbierto, setMenuAbierto] = React.useState(false);

  // Cerrar menú al hacer clic fuera
  React.useEffect(() => ***REMOVED***
    const cerrarMenu = (e) => ***REMOVED***
      if (menuAbierto && !e.target.closest('.menu-turno')) ***REMOVED***
        setMenuAbierto(false);
      ***REMOVED***
    ***REMOVED***;
    document.addEventListener('click', cerrarMenu);
    return () => document.removeEventListener('click', cerrarMenu);
  ***REMOVED***, [menuAbierto]);

  const formatearMoneda = (valor) => ***REMOVED***
    return new Intl.NumberFormat('es-AR', ***REMOVED***
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    ***REMOVED***).format(valor);
  ***REMOVED***;

  const formatearHoras = (horaInicio, horaFin) => ***REMOVED***
    const [horaI, minI] = horaInicio.split(':').map(Number);
    const [horaF, minF] = horaFin.split(':').map(Number);
    
    const totalMinutos = (horaF * 60 + minF) - (horaI * 60 + minI);
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    
    if (minutos === 0) return `$***REMOVED***horas***REMOVED***h`;
    return `$***REMOVED***horas***REMOVED***h $***REMOVED***minutos***REMOVED***min`;
  ***REMOVED***;

  const gananciaBase = turno.gananciaTotal - (turno.propinas || 0);
  const gananciaNeta = turno.gananciaTotal - (turno.gastoCombustible || 0);
  const promedioPorPedido = turno.numeroPedidos > 0 ? gananciaBase / turno.numeroPedidos : 0;

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          ***REMOVED***/* Encabezado con trabajo y tipo */***REMOVED***
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 bg-green-50 rounded">
              <Truck size=***REMOVED***16***REMOVED*** className="text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900">***REMOVED***trabajo?.nombre || 'Sin trabajo'***REMOVED***</h4>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Delivery
            </span>
          </div>

          ***REMOVED***/* Información del turno */***REMOVED***
          <div className="space-y-2">
            ***REMOVED***/* Horario */***REMOVED***
            <div className="flex items-center text-sm text-gray-600">
              <Clock size=***REMOVED***16***REMOVED*** className="mr-2 text-gray-400" />
              <span>***REMOVED***turno.horaInicio***REMOVED*** - ***REMOVED***turno.horaFin***REMOVED***</span>
              <span className="mx-2">•</span>
              <span>***REMOVED***formatearHoras(turno.horaInicio, turno.horaFin)***REMOVED***</span>
            </div>

            ***REMOVED***/* Estadísticas del turno */***REMOVED***
            <div className="grid grid-cols-2 gap-2 text-sm">
              ***REMOVED***turno.numeroPedidos > 0 && (
                <div className="flex items-center text-gray-600">
                  <Package size=***REMOVED***14***REMOVED*** className="mr-1 text-blue-500" />
                  <span>***REMOVED***turno.numeroPedidos***REMOVED*** pedidos</span>
                </div>
              )***REMOVED***
              
              ***REMOVED***turno.kilometros > 0 && (
                <div className="flex items-center text-gray-600">
                  <Car size=***REMOVED***14***REMOVED*** className="mr-1 text-purple-500" />
                  <span>***REMOVED***turno.kilometros***REMOVED*** km</span>
                </div>
              )***REMOVED***
            </div>

            ***REMOVED***/* Desglose financiero */***REMOVED***
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ganancia base:</span>
                  <span className="font-medium">***REMOVED***formatearMoneda(gananciaBase)***REMOVED***</span>
                </div>
                
                ***REMOVED***turno.propinas > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <TrendingUp size=***REMOVED***12***REMOVED*** className="mr-1" />
                      Propinas:
                    </span>
                    <span className="font-medium text-green-600">
                      +***REMOVED***formatearMoneda(turno.propinas)***REMOVED***
                    </span>
                  </div>
                )***REMOVED***
                
                ***REMOVED***turno.gastoCombustible > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Combustible:</span>
                    <span className="font-medium text-red-600">
                      -***REMOVED***formatearMoneda(turno.gastoCombustible)***REMOVED***
                    </span>
                  </div>
                )***REMOVED***
                
                <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                  <span className="font-medium text-gray-700">Ganancia neta:</span>
                  <span className="font-semibold text-green-600">
                    ***REMOVED***formatearMoneda(gananciaNeta)***REMOVED***
                  </span>
                </div>
              </div>

              ***REMOVED***/* Métricas adicionales */***REMOVED***
              ***REMOVED***turno.numeroPedidos > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Promedio por pedido:</span>
                    <span className="font-medium">***REMOVED***formatearMoneda(promedioPorPedido)***REMOVED***</span>
                  </div>
                </div>
              )***REMOVED***
            </div>

            ***REMOVED***/* Notas */***REMOVED***
            ***REMOVED***turno.notas && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600 italic">
                ***REMOVED***turno.notas***REMOVED***
              </div>
            )***REMOVED***
          </div>
        </div>

        ***REMOVED***/* Menú de acciones */***REMOVED***
        <div className="relative menu-turno ml-2">
          <button
            onClick=***REMOVED***(e) => ***REMOVED***
              e.stopPropagation();
              setMenuAbierto(!menuAbierto);
            ***REMOVED******REMOVED***
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical size=***REMOVED***20***REMOVED*** className="text-gray-500" />
          </button>

          ***REMOVED***menuAbierto && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick=***REMOVED***() => ***REMOVED***
                  onEdit(turno);
                  setMenuAbierto(false);
                ***REMOVED******REMOVED***
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
              >
                <Edit2 size=***REMOVED***16***REMOVED*** />
                <span>Editar</span>
              </button>
              <button
                onClick=***REMOVED***() => ***REMOVED***
                  onDelete(turno);
                  setMenuAbierto(false);
                ***REMOVED******REMOVED***
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2 text-red-600"
              >
                <Trash2 size=***REMOVED***16***REMOVED*** />
                <span>Eliminar</span>
              </button>
            </div>
          )***REMOVED***
        </div>
      </div>
    </div>
  );
***REMOVED***;

export default TarjetaTurnoDelivery;