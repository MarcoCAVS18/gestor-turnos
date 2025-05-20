// src/components/Header.jsx

import React from 'react';
import { PlusCircle } from 'lucide-react';

const Header = ({ abrirModalNuevoTrabajo, abrirModalNuevoTurno, vistaActual }) => {
  return (
    <header className="flex justify-between items-center px-4 py-3 bg-indigo-700 text-white shadow-md">
      <h1 className="text-xl font-semibold">Mi Gestión de Turnos - Marco</h1>
      <div className="flex gap-2">
        {vistaActual === 'trabajos' && (
          <button 
            onClick={abrirModalNuevoTrabajo}
            className="bg-white text-indigo-700 rounded-full p-1 shadow-md hover:bg-indigo-50 transition-colors"
          >
            <PlusCircle size={24} />
          </button>
        )}
        {vistaActual === 'turnos' && (
          <button 
            onClick={abrirModalNuevoTurno}
            className="bg-white text-indigo-700 rounded-full p-1 shadow-md hover:bg-indigo-50 transition-colors"
          >
            <PlusCircle size={24} />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;