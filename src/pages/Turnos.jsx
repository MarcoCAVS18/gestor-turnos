// src/pages/Turnos.jsx

import React, { useState, useEffect } from 'react';
import ResumenDia from '../components/ResumenDia';
import ModalTurno from '../components/ModalTurno';
import Loader from '../components/Loader';
import DynamicButton from '../components/DynamicButton';
import { PlusCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Turnos = () => {
  const { turnosPorFecha, cargando } = useApp();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [showLoading, setShowLoading] = useState(true);
  
  // Efecto para controlar el tiempo de carga
  useEffect(() => {
    let timer;
    
    if (cargando) {
      setShowLoading(true);
    } else {
      timer = setTimeout(() => {
        setShowLoading(false);
      }, 2000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [cargando]);
  
  const abrirModalNuevoTurno = () => {
    setTurnoSeleccionado(null);
    setModalAbierto(true);
  };
  
  const cerrarModal = () => {
    setModalAbierto(false);
    setTurnoSeleccionado(null);
  };
  
  if (showLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Resumen de Turnos</h2>
        <DynamicButton 
          onClick={abrirModalNuevoTurno}
          className="flex items-center gap-2"
        >
          <PlusCircle size={20} />
          <span>Nuevo Turno</span>
        </DynamicButton>
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
          <p className="text-gray-500 mb-4">No hay turnos registrados</p>
          <DynamicButton 
            onClick={abrirModalNuevoTurno}
            className="flex items-center gap-2"
          >
            <PlusCircle size={20} />
            <span>Agregar turno</span>
          </DynamicButton>
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