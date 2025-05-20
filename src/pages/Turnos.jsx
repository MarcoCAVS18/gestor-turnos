// src/pages/Turnos.jsx
import React, { useState } from 'react';
import ResumenDia from '../components/ResumenDia';
import ModalTurno from '../components/ModalTurno';
import { useApp } from '../contexts/AppContext';

const Turnos = () => {
  const { turnosPorFecha, cargando } = useApp();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  
  const abrirModalNuevoTurno = () => {
    setTurnoSeleccionado(null);
    setModalAbierto(true);
  };
  
  const cerrarModal = () => {
    setModalAbierto(false);
    setTurnoSeleccionado(null);
  };
  
  if (cargando) {
    return (
      <div className="px-4 py-6 text-center">
        <p>Cargando datos...</p>
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Resumen de Turnos</h2>
        <button 
          onClick={abrirModalNuevoTurno}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center"
        >
          <span>Nuevo Turno</span>
        </button>
      </div>
      
      {Object.entries(turnosPorFecha).length > 0 ? (
        Object.entries(turnosPorFecha).map(([fecha, turnosDia]) => (
          <ResumenDia 
            key={fecha} 
            fecha={fecha} 
            turnos={turnosDia} 
          />
        ))
      ) : (
        <div className="text-center py-8 bg-white rounded-xl shadow-md">
          <p className="text-gray-500">No hay turnos registrados</p>
          <button 
            onClick={abrirModalNuevoTurno}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
          >
            Agregar turno
          </button>
        </div>
      )}
      
      <ModalTurno 
        visible={modalAbierto} 
        onClose={cerrarModal} 
        turnoSeleccionado={turnoSeleccionado} 
      />
    </div>
  );
};

export default Turnos;