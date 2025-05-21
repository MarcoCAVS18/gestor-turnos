// src/pages/Trabajos.jsx

import React, { useState, useEffect } from 'react';
import TarjetaTrabajo from '../components/TarjetaTrabajo';
import ModalTrabajo from '../components/ModalTrabajo';
import Loader from '../components/Loader';
import { useApp } from '../contexts/AppContext';

const Trabajos = () => {
  const { trabajos, borrarTrabajo, cargando } = useApp();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);
  const [showLoading, setShowLoading] = useState(true);
  
  // Efecto para controlar el tiempo de carga
  useEffect(() => {
    let timer;
    
    if (cargando) {
      setShowLoading(true);
    } else {
      // Si los datos ya se cargaron, esperar 3 segundos antes de mostrar el contenido
      timer = setTimeout(() => {
        setShowLoading(false);
      }, 2000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [cargando]);
  
  const abrirModalNuevoTrabajo = () => {
    setTrabajoSeleccionado(null);
    setModalAbierto(true);
  };
  
  const abrirModalEditarTrabajo = (trabajo) => {
    setTrabajoSeleccionado(trabajo);
    setModalAbierto(true);
  };
  
  const cerrarModal = () => {
    setModalAbierto(false);
    setTrabajoSeleccionado(null);
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
        <h2 className="text-xl font-semibold">Mis Trabajos</h2>
        <button 
          onClick={abrirModalNuevoTrabajo}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center"
        >
          <span>Nuevo</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trabajos.length > 0 ? (
          trabajos.map(trabajo => (
            <TarjetaTrabajo 
              key={trabajo.id} 
              trabajo={trabajo} 
              abrirModalEditarTrabajo={abrirModalEditarTrabajo}
              eliminarTrabajo={borrarTrabajo}
            />
          ))
        ) : (
          <div className="col-span-2 text-center py-8 bg-white rounded-xl shadow-md">
            <p className="text-gray-500">No hay trabajos registrados</p>
            <button 
              onClick={abrirModalNuevoTrabajo}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
            >
              Agregar trabajo
            </button>
          </div>
        )}
      </div>
      
      <ModalTrabajo 
        visible={modalAbierto} 
        onClose={cerrarModal} 
        trabajoSeleccionado={trabajoSeleccionado} 
      />
    </div>
  );
};

export default Trabajos;