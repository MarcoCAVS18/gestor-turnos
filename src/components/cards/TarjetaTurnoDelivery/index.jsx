// src/components/cards/TarjetaTurnoDelivery/index.jsx

import React from 'react';
import ***REMOVED*** Clock, Package, Car, Edit2, Trash2, MoreVertical, Truck, DollarSign ***REMOVED*** from 'lucide-react';
import InfoTooltip from '../../ui/InfoTooltip';

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
    return new Intl.NumberFormat('en-AU', ***REMOVED***
      style: 'currency',
      currency: 'AUD',
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

  const gananciaNeta = turno.gananciaTotal - (turno.gastoCombustible || 0);
  const promedioPorPedido = turno.numeroPedidos > 0 ? turno.gananciaTotal / turno.numeroPedidos : 0;

  // Tooltip con información básica
  const tooltipContent = (
    <div className="space-y-2 text-xs text-left max-w-xs">
      <div className="font-semibold mb-2 border-b border-gray-600 pb-1">
        Resumen del Turno
      </div>
      
      <div className="space-y-1.5">
        <div className="flex justify-between gap-4">
          <span>Duración:</span>
          <span className="font-semibold">***REMOVED***formatearHoras(turno.horaInicio, turno.horaFin)***REMOVED***</span>
        </div>
        
        ***REMOVED***turno.numeroPedidos > 0 && (
          <div className="flex justify-between gap-4">
            <span>Pedidos:</span>
            <span className="font-semibold">***REMOVED***turno.numeroPedidos***REMOVED***</span>
          </div>
        )***REMOVED***
        
        ***REMOVED***turno.kilometros > 0 && (
          <div className="flex justify-between gap-4">
            <span>Kilómetros:</span>
            <span className="font-semibold">***REMOVED***turno.kilometros***REMOVED*** km</span>
          </div>
        )***REMOVED***
        
        <div className="flex justify-between gap-4 border-t border-gray-600 pt-1.5 mt-2">
          <span className="font-semibold">Ganancia Total:</span>
          <span className="font-bold">***REMOVED***formatearMoneda(turno.gananciaTotal)***REMOVED***</span>
        </div>
        
        <div className="flex justify-between gap-4">
          <span className="font-semibold">Ganancia Neta:</span>
          <span className="font-bold text-base">***REMOVED***formatearMoneda(gananciaNeta)***REMOVED***</span>
        </div>
        
        ***REMOVED***turno.numeroPedidos > 0 && (
          <div className="flex justify-between gap-4 text-yellow-200">
            <span>Promedio/pedido:</span>
            <span>***REMOVED***formatearMoneda(promedioPorPedido)***REMOVED***</span>
          </div>
        )***REMOVED***
      </div>
    </div>
  );

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
              <Clock size=***REMOVED***14***REMOVED*** className="mr-1.5" />
              <span>***REMOVED***turno.horaInicio***REMOVED*** - ***REMOVED***turno.horaFin***REMOVED***</span>
              <span className="mx-2 text-gray-300">•</span>
              <span>***REMOVED***formatearHoras(turno.horaInicio, turno.horaFin)***REMOVED***</span>
            </div>

            ***REMOVED***/* Estadísticas del turno */***REMOVED***
            ***REMOVED***(turno.numeroPedidos > 0 || turno.kilometros > 0) && (
              <div className="flex items-center gap-4 text-sm text-gray-600">
                ***REMOVED***turno.numeroPedidos > 0 && (
                  <div className="flex items-center">
                    <Package size=***REMOVED***14***REMOVED*** className="mr-1 text-blue-500" />
                    <span>***REMOVED***turno.numeroPedidos***REMOVED*** pedidos</span>
                  </div>
                )***REMOVED***
                
                ***REMOVED***turno.kilometros > 0 && (
                  <div className="flex items-center">
                    <Car size=***REMOVED***14***REMOVED*** className="mr-1 text-purple-500" />
                    <span>***REMOVED***turno.kilometros***REMOVED*** km</span>
                  </div>
                )***REMOVED***
              </div>
            )***REMOVED***

            ***REMOVED***/* Ganancia con tooltip */***REMOVED***
            <div className="flex items-center">
              <DollarSign size=***REMOVED***14***REMOVED*** className="mr-1 text-green-600" />
              <span className="text-sm font-semibold text-gray-800">***REMOVED***formatearMoneda(gananciaNeta)***REMOVED***</span>
              <span className="text-xs text-gray-500 ml-1">total</span>
              
              <InfoTooltip 
                content=***REMOVED***tooltipContent***REMOVED***
                size="xs"
                position="top"
                className="ml-2"
              />
            </div>
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