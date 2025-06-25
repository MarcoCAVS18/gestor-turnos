// src/components/cards/TarjetaTrabajoDelivery/index.jsx

import React from 'react';
import ***REMOVED*** MoreVertical, Edit2, Trash2, Package, Bike, Car, Truck, User ***REMOVED*** from 'lucide-react';
import WorkAvatar from '../../work/WorkAvatar';

const TarjetaTrabajoDelivery = (***REMOVED*** trabajo, onEdit, onDelete, showActions = true ***REMOVED***) => ***REMOVED***
  const [menuAbierto, setMenuAbierto] = React.useState(false);

  // Cerrar menú al hacer clic fuera
  React.useEffect(() => ***REMOVED***
    const cerrarMenu = (e) => ***REMOVED***
      if (menuAbierto && !e.target.closest('.menu-container')) ***REMOVED***
        setMenuAbierto(false);
      ***REMOVED***
    ***REMOVED***;
    document.addEventListener('click', cerrarMenu);
    return () => document.removeEventListener('click', cerrarMenu);
  ***REMOVED***, [menuAbierto]);

  const getVehicleIcon = (vehiculo) => ***REMOVED***
    switch(vehiculo) ***REMOVED***
      case 'Bicicleta': return <Bike size=***REMOVED***16***REMOVED*** className="text-green-500" />;
      case 'Moto': return <Truck size=***REMOVED***16***REMOVED*** className="text-orange-500" />;
      case 'Auto': return <Car size=***REMOVED***16***REMOVED*** className="text-blue-500" />;
      case 'A pie': return <User size=***REMOVED***16***REMOVED*** className="text-gray-500" />;
      default: return <Package size=***REMOVED***16***REMOVED*** className="text-gray-400" />;
    ***REMOVED***
  ***REMOVED***;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 flex-1">
          ***REMOVED***/* WorkAvatar con colores de la plataforma */***REMOVED***
          <WorkAvatar 
            nombre=***REMOVED***trabajo.nombre***REMOVED***
            color=***REMOVED***trabajo.colorAvatar || '#10b981'***REMOVED***
            size="md"
          />
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">***REMOVED***trabajo.nombre***REMOVED***</h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Delivery
              </span>
            </div>
            
            ***REMOVED***/* Información del trabajo de delivery */***REMOVED***
            <div className="mt-2 space-y-1">              
              ***REMOVED***trabajo.vehiculo && (
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  ***REMOVED***getVehicleIcon(trabajo.vehiculo)***REMOVED***
                  Vehículo: <span className="font-medium">***REMOVED***trabajo.vehiculo***REMOVED***</span>
                </p>
              )***REMOVED***
              
              <p className="text-sm text-gray-500 italic flex items-center gap-1 mt-2">
                <Package size=***REMOVED***14***REMOVED*** className="text-gray-400" />
                Ganancias variables por pedido
              </p>
            </div>
          </div>
        </div>

        ***REMOVED***/* Menú de acciones */***REMOVED***
        ***REMOVED***showActions && (
          <div className="relative menu-container">
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
                    onEdit(trabajo);
                    setMenuAbierto(false);
                  ***REMOVED******REMOVED***
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Edit2 size=***REMOVED***16***REMOVED*** />
                  <span>Editar</span>
                </button>
                <button
                  onClick=***REMOVED***() => ***REMOVED***
                    onDelete(trabajo);
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
        )***REMOVED***
      </div>
    </div>
  );
***REMOVED***;

export default TarjetaTrabajoDelivery;