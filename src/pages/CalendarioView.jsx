// src/pages/CalendarioView.jsx

import React, { useState } from 'react';
import Calendario from '../components/Calendario';
import ResumenDia from '../components/ResumenDia';
import ModalTurno from '../components/ModalTurno';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { PlusCircle } from 'lucide-react';

const CalendarioView = () => {
  const { turnosPorFecha } = useApp();
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoTurnoFecha, setNuevoTurnoFecha] = useState(null);
  
  const seleccionarDia = (fecha) => {
    const fechaStr = fecha.toISOString().split('T')[0];
    setFechaSeleccionada(fechaStr);
  };
  
  const abrirModalNuevoTurno = (fecha) => {
    setNuevoTurnoFecha(fecha.toISOString().split('T')[0]);
    setModalAbierto(true);
  };
  
  const cerrarModal = () => {
    setModalAbierto(false);
    setNuevoTurnoFecha(null);
  };
  
  // Obtener los turnos para la fecha seleccionada
  const turnosSeleccionados = fechaSeleccionada ? turnosPorFecha[fechaSeleccionada] || [] : [];
  
  // Animaciones para los elementos
  const calendarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const detailsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
  };
  
  return (
    <div className="px-4 py-6">
      <motion.h2 
        className="text-xl font-semibold mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        Calendario de Turnos
      </motion.h2>
      
      <motion.div
        variants={calendarVariants}
        initial="hidden"
        animate="visible"
      >
        <Calendario onDiaSeleccionado={seleccionarDia} />
      </motion.div>
      
      {fechaSeleccionada && (
        <motion.div 
          className="mt-6"
          variants={detailsVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">
              Turnos del día seleccionado
            </h3>
            <motion.button 
              onClick={() => abrirModalNuevoTurno(new Date(fechaSeleccionada))}
              className="bg-pink-500 text-white px-3 py-1 rounded-lg shadow-md flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PlusCircle size={16} />
              <span>Nuevo</span>
            </motion.button>
          </div>
          
          {turnosSeleccionados.length > 0 ? (
            <ResumenDia 
              fecha={fechaSeleccionada} 
              turnos={turnosSeleccionados} 
            />
          ) : (
            <motion.div 
              className="text-center py-6 bg-white rounded-xl shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-gray-500">No hay turnos para esta fecha</p>
              <motion.button 
                onClick={() => abrirModalNuevoTurno(new Date(fechaSeleccionada))}
                className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlusCircle size={20} />
                <span>Agregar turno</span>
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      )}
      
      <ModalTurno 
        visible={modalAbierto} 
        onClose={cerrarModal} 
        fechaInicial={nuevoTurnoFecha}
      />
    </div>
  );
};

export default CalendarioView;