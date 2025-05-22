// src/pages/Trabajos.jsx

import React, { useState, useEffect } from 'react';
import TarjetaTrabajo from '../components/TarjetaTrabajo';
import ModalTrabajo from '../components/ModalTrabajo';
import Loader from '../components/Loader';
import DynamicButton from '../components/DynamicButton';
import { PlusCircle } from 'lucide-react';
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
        <DynamicButton 
          onClick={abrirModalNuevoTrabajo}
          className="flex items-center gap-2"
        >
          <PlusCircle size={20} />
          <span>Nuevo</span>
        </DynamicButton>
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
            <p className="text-gray-500 mb-4">No hay trabajos registrados</p>
            <DynamicButton 
              onClick={abrirModalNuevoTrabajo}
              className="flex items-center gap-2"
            >
              <PlusCircle size={20} />
              <span>Agregar trabajo</span>
            </DynamicButton>
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