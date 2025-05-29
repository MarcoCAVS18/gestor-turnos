// src/components/cards/TarjetaTrabajo/index.jsx (VERSIÓN MEJORADA)
import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** Edit, Trash2, Clock, DollarSign, Users, Info, Share2 ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useAuth ***REMOVED*** from '../../../contexts/AuthContext';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useShare ***REMOVED*** from '../../../hooks/useShare';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const TarjetaTrabajo = (***REMOVED*** trabajo, abrirModalEditarTrabajo, eliminarTrabajo ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** currentUser ***REMOVED*** = useAuth();
  const ***REMOVED*** turnos, calcularPago ***REMOVED*** = useApp();
  const ***REMOVED*** sharing, messages, shareWork ***REMOVED*** = useShare();
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  
  // Calcular estadísticas del trabajo
  const turnosDelTrabajo = turnos.filter(turno => turno.trabajoId === trabajo.id);
  
  const totalGanado = turnosDelTrabajo.reduce((total, turno) => ***REMOVED***
    const ***REMOVED*** totalConDescuento ***REMOVED*** = calcularPago(turno);
    return total + totalConDescuento;
  ***REMOVED***, 0);
  
  const horasTrabajadas = turnosDelTrabajo.reduce((total, turno) => ***REMOVED***
    const ***REMOVED*** horas ***REMOVED*** = calcularPago(turno);
    return total + horas;
  ***REMOVED***, 0);
  
  const isSharing = sharing[trabajo.id] || false;
  const shareMessage = messages[trabajo.id] || '';
  
  return (
    <Card
      borderColor=***REMOVED***trabajo.color***REMOVED***
      borderPosition="left"
      hover=***REMOVED***true***REMOVED***
      className="transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">***REMOVED***trabajo.nombre***REMOVED***</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick=***REMOVED***() => setMostrarDetalles(!mostrarDetalles)***REMOVED***
            icon=***REMOVED***Info***REMOVED***
          />
          <Button
            variant="ghost"
            size="sm"
            onClick=***REMOVED***() => abrirModalEditarTrabajo(trabajo)***REMOVED***
            icon=***REMOVED***Edit***REMOVED***
          />
          <Button
            variant="ghost"
            size="sm"
            onClick=***REMOVED***() => shareWork(trabajo)***REMOVED***
            loading=***REMOVED***isSharing***REMOVED***
            icon=***REMOVED***Share2***REMOVED***
          />
          <Button
            variant="ghost"
            size="sm"
            onClick=***REMOVED***() => eliminarTrabajo(trabajo.id)***REMOVED***
            icon=***REMOVED***Trash2***REMOVED***
            className="text-red-500 hover:text-red-700"
          />
        </div>
      </div>
      
      ***REMOVED***shareMessage && (
        <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">***REMOVED***shareMessage***REMOVED***</p>
        </div>
      )***REMOVED***
      
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
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Tarifa base</span>
            <span className="font-medium">$***REMOVED***trabajo.tarifaBase.toFixed(2)***REMOVED***/hora</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Diurno</span>
            <span className="font-medium">$***REMOVED***trabajo.tarifas.diurno.toFixed(2)***REMOVED***</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tarde</span>
            <span className="font-medium">$***REMOVED***trabajo.tarifas.tarde.toFixed(2)***REMOVED***</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Noche</span>
            <span className="font-medium">$***REMOVED***trabajo.tarifas.noche.toFixed(2)***REMOVED***</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Sábado</span>
            <span className="font-medium">$***REMOVED***trabajo.tarifas.sabado.toFixed(2)***REMOVED***</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Domingo</span>
            <span className="font-medium">$***REMOVED***trabajo.tarifas.domingo.toFixed(2)***REMOVED***</span>
          </div>
        </div>
      </div>
    </Card>
  );
***REMOVED***;

export default TarjetaTrabajo;
