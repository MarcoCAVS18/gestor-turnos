// src/components/cards/TarjetaTrabajoDelivery/index.jsx

import React from 'react';
import { MoreVertical, Edit2, Trash2, Package, Bike, Car, Truck, User } from 'lucide-react';
import WorkAvatar from '../../work/WorkAvatar';

const TarjetaTrabajoDelivery = ({ trabajo, onEdit, onDelete, showActions = true }) => {
  const [menuAbierto, setMenuAbierto] = React.useState(false);

  const descripcion = trabajo.descripcion && trabajo.descripcion.trim()
    ? trabajo.descripcion
    : 'No olvides guardar más información sobre tu trabajo.';

  // Cerrar menú al hacer clic fuera
  React.useEffect(() => {
    const cerrarMenu = (e) => {
      if (menuAbierto && !e.target.closest('.menu-container')) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener('click', cerrarMenu);
    return () => document.removeEventListener('click', cerrarMenu);
  }, [menuAbierto]);

  const getVehicleIcon = (vehiculo) => {
    switch (vehiculo) {
      case 'Bicicleta': return <Bike size={16} className="text-green-500" />;
      case 'Moto': return <Truck size={16} className="text-orange-500" />;
      case 'Auto': return <Car size={16} className="text-blue-500" />;
      case 'A pie': return <User size={16} className="text-gray-500" />;
      default: return <Package size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 flex-1">
          {/* WorkAvatar con colores de la plataforma */}
          <WorkAvatar
            nombre={trabajo.nombre}
            color={trabajo.colorAvatar || '#10b981'}
            size="md"
          />

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{trabajo.nombre}</h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Delivery
              </span>
            </div>
            <div className="flex-1 mt-1">
              <p className="text-gray-600 text-sm mb-3 leading-relaxed italic">
                {descripcion}
              </p>
            </div>

            {/* Información del trabajo de delivery */}
            <div className="mt-2 space-y-1">
              {trabajo.vehiculo && (
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  {getVehicleIcon(trabajo.vehiculo)}
                  Vehículo: <span className="font-medium">{trabajo.vehiculo}</span>
                </p>
              )}

              <p className="text-sm text-gray-500 italic flex items-center gap-1 mt-2">
                <Package size={14} className="text-gray-400" />
                Ganancias variables por pedido
              </p>
            </div>
          </div>
        </div>

        {/* Menú de acciones */}
        {showActions && (
          <div className="relative menu-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuAbierto(!menuAbierto);
              }}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical size={20} className="text-gray-500" />
            </button>

            {menuAbierto && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => {
                    onEdit(trabajo);
                    setMenuAbierto(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Edit2 size={16} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => {
                    onDelete(trabajo);
                    setMenuAbierto(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                >
                  <Trash2 size={16} />
                  <span>Eliminar</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TarjetaTrabajoDelivery;