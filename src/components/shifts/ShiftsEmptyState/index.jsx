// src/components/shifts/ShiftsEmptyState/index.jsx

import React from 'react';
import { Calendar, Plus, Briefcase, ArrowRight } from 'lucide-react';
import Flex from '../../ui/Flex';

function ShiftsEmptyState({ allJobs, onNewShift, thematicColors }) {
  const handleGoToJobs = () => { 
    window.location.href = '/trabajos'; 
  };

  if (allJobs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <Flex variant="center"
          className="p-4 rounded-full w-20 h-20 mx-auto mb-4" 
          style={{ backgroundColor: thematicColors?.transparent10 || 'rgba(255, 152, 0, 0.1)' }}
        >
          <Briefcase 
            className="w-10 h-10" 
            style={{ color: thematicColors?.base || '#FF9800' }} 
          />
        </Flex>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Primero necesitas crear un trabajo
        </h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Para poder registrar turnos, primero debes crear al menos un trabajo.
        </p>
        <button 
          onClick={handleGoToJobs} 
          className="text-white bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2"
        >
          <Briefcase className="w-4 h-4" />
          <span>Crear Trabajo</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <Flex variant="center"
        className="p-4 rounded-full w-20 h-20 mx-auto mb-4" 
        style={{ backgroundColor: thematicColors?.transparent10 }}
      >
        <Calendar 
          className="w-10 h-10" 
          style={{ color: thematicColors?.base }} 
        />
      </Flex>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No hay turnos registrados
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Comienza agregando tu primer turno para empezar a gestionar tus ingresos.
      </p>
      <button 
        onClick={onNewShift} 
        className="text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2" 
        style={{ backgroundColor: thematicColors?.base, filter: 'brightness(1.1)' }} 
        onMouseEnter={(e) => { e.target.style.filter = 'brightness(1.0)'; }} 
        onMouseLeave={(e) => { e.target.style.filter = 'brightness(1.1)'; }}
      >
        <Plus className="w-4 h-4" />
        <span>Agregar Primer Turno</span>
      </button>
    </div>
  );
}

export default ShiftsEmptyState;