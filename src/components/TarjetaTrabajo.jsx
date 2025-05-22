// src/components/TarjetaTrabajo.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** Edit, Trash2, Clock, DollarSign, Users, Info ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import DynamicButton from './DynamicButton';

const TarjetaTrabajo = (***REMOVED*** trabajo, abrirModalEditarTrabajo, eliminarTrabajo ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** turnos, calcularPago ***REMOVED*** = useApp();
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  
  // Calcular estadísticas del trabajo
  const turnosDelTrabajo = turnos.filter(turno => turno.trabajoId === trabajo.id);
  
  // Calcular total ganado con este trabajo
  const totalGanado = turnosDelTrabajo.reduce((total, turno) => ***REMOVED***
    const ***REMOVED*** totalConDescuento ***REMOVED*** = calcularPago(turno);
    return total + totalConDescuento;
  ***REMOVED***, 0);
  
  // Calcular total de horas trabajadas
  const horasTrabajadas = turnosDelTrabajo.reduce((total, turno) => ***REMOVED***
    const ***REMOVED*** horas ***REMOVED*** = calcularPago(turno);
    return total + horas;
  ***REMOVED***, 0);
  
  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl hover:translate-y-[-5px]"
      style=***REMOVED******REMOVED*** borderTop: `6px solid $***REMOVED***trabajo.color***REMOVED***` ***REMOVED******REMOVED***
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">***REMOVED***trabajo.nombre***REMOVED***</h3>
          <div className="flex gap-2">
            <DynamicButton 
              onClick=***REMOVED***() => setMostrarDetalles(!mostrarDetalles)***REMOVED***
              variant="ghost"
              size="sm"
              className="!p-1"
            >
              <Info size=***REMOVED***18***REMOVED*** />
            </DynamicButton>
            <DynamicButton 
              onClick=***REMOVED***() => abrirModalEditarTrabajo(trabajo)***REMOVED***
              variant="ghost"
              size="sm"
              className="!p-1"
            >
              <Edit size=***REMOVED***18***REMOVED*** />
            </DynamicButton>
            <button 
              onClick=***REMOVED***() => eliminarTrabajo(trabajo.id)***REMOVED***
              className="text-gray-500 hover:text-red-600 transition-colors p-1"
            >
              <Trash2 size=***REMOVED***18***REMOVED*** />
            </button>
          </div>
        </div>
        
        ***REMOVED***mostrarDetalles && (
          <div className="mb-4 bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center mb-2">
              <Clock size=***REMOVED***16***REMOVED*** className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-700">
                ***REMOVED***horasTrabajadas.toFixed(1)***REMOVED*** horas trabajadas
              </span>
            </div>
            <div className="flex items-center mb-2">
              <DollarSign size=***REMOVED***16***REMOVED*** className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-700">
                $***REMOVED***totalGanado.toFixed(2)***REMOVED*** ganados
              </span>
            </div>
            <div className="flex items-center">
              <Users size=***REMOVED***16***REMOVED*** className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-700">
                ***REMOVED***turnosDelTrabajo.length***REMOVED*** turnos realizados
              </span>
            </div>
          </div>
        )***REMOVED***
        
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">Tarifa base</span>
          <span className="font-medium">$***REMOVED***trabajo.tarifaBase.toFixed(2)***REMOVED***/hora</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="text-gray-500 text-sm">Turno diurno</span>
          <span className="text-sm">$***REMOVED***trabajo.tarifas.diurno.toFixed(2)***REMOVED***</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="text-gray-500 text-sm">Turno tarde</span>
          <span className="text-sm">$***REMOVED***trabajo.tarifas.tarde.toFixed(2)***REMOVED***</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="text-gray-500 text-sm">Turno noche</span>
          <span className="text-sm">$***REMOVED***trabajo.tarifas.noche.toFixed(2)***REMOVED***</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="text-gray-500 text-sm">Sábado</span>
          <span className="text-sm">$***REMOVED***trabajo.tarifas.sabado.toFixed(2)***REMOVED***</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="text-gray-500 text-sm">Domingo</span>
          <span className="text-sm">$***REMOVED***trabajo.tarifas.domingo.toFixed(2)***REMOVED***</span>
        </div>
      </div>
    </div>
  );
***REMOVED***;

export default TarjetaTrabajo;