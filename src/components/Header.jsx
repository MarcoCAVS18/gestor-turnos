// src/components/Header.jsx

import React from 'react';
import ***REMOVED*** PlusCircle ***REMOVED*** from 'lucide-react';

const Header = (***REMOVED*** abrirModalNuevoTrabajo, abrirModalNuevoTurno, vistaActual ***REMOVED***) => ***REMOVED***
  return (
    <header className="flex justify-between items-center px-4 py-3 bg-indigo-700 text-white shadow-md">
      <h1 className="text-xl font-semibold">Mi Gestión de Turnos - Marco</h1>
      <div className="flex gap-2">
        ***REMOVED***vistaActual === 'trabajos' && (
          <button 
            onClick=***REMOVED***abrirModalNuevoTrabajo***REMOVED***
            className="bg-white text-indigo-700 rounded-full p-1 shadow-md hover:bg-indigo-50 transition-colors"
          >
            <PlusCircle size=***REMOVED***24***REMOVED*** />
          </button>
        )***REMOVED***
        ***REMOVED***vistaActual === 'turnos' && (
          <button 
            onClick=***REMOVED***abrirModalNuevoTurno***REMOVED***
            className="bg-white text-indigo-700 rounded-full p-1 shadow-md hover:bg-indigo-50 transition-colors"
          >
            <PlusCircle size=***REMOVED***24***REMOVED*** />
          </button>
        )***REMOVED***
      </div>
    </header>
  );
***REMOVED***;

export default Header;