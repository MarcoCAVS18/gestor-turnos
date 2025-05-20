// src/App.jsx - Corregido
import React, { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import Header from './components/Header';
import Navegacion from './components/Navegacion';
import Dashboard from './pages/Dashboard';
import Trabajos from './pages/Trabajos';
import Turnos from './pages/Turnos';
import Estadisticas from './pages/Estadisticas';
import CalendarioView from './pages/CalendarioView';
import ModalTrabajo from './components/ModalTrabajo';
import ModalTurno from './components/ModalTurno';
import { motion, AnimatePresence } from 'framer-motion'; 

// Configuración para la detección de gestos
const config = {
  velocities: true,
    layout: 'always',
};

const App = () => {
  const [vistaActual, setVistaActual] = useState('dashboard');
  const [modalTrabajoAbierto, setModalTrabajoAbierto] = useState(false);
  const [modalTurnoAbierto, setModalTurnoAbierto] = useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [direccion, setDireccion] = useState(1); 
  
  // Funciones para abrir modales
  const abrirModalNuevoTrabajo = () => {
    setTrabajoSeleccionado(null);
    setModalTrabajoAbierto(true);
  };
  
  const abrirModalNuevoTurno = () => {
    setTurnoSeleccionado(null);
    setModalTurnoAbierto(true);
  };
  
  // Función para cerrar modales
  const cerrarModalTrabajo = () => {
    setModalTrabajoAbierto(false);
    setTrabajoSeleccionado(null);
  };
  
  const cerrarModalTurno = () => {
    setModalTurnoAbierto(false);
    setTurnoSeleccionado(null);
  };

  // Función para cambiar de vista con dirección
  const cambiarVista = (nuevaVista) => {
    const vistas = ['dashboard', 'trabajos', 'calendario', 'turnos', 'estadisticas'];
    const indiceActual = vistas.indexOf(vistaActual);
    const indiceNuevo = vistas.indexOf(nuevaVista);
    
    if (config.velocities) {
      setDireccion(indiceNuevo > indiceActual ? 1 : -1);
    } else {
      setDireccion(1);
    }
    
    setVistaActual(nuevaVista);
  };
  
  // Variantes de animación para las transiciones de página
  const pageVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };
  
  // Usar config para personalizar las transiciones
  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4,
    // Ajustar velocidad según config
    stiffness: config.velocities ? 120 : 80,
    damping: config.velocities ? 20 : 30,
  };
  
  // Renderizar la vista correspondiente con animación
  const renderizarVista = () => {
    let Component;
    
    switch (vistaActual) {
      case 'trabajos':
        Component = Trabajos;
        break;
      case 'turnos':
        Component = Turnos;
        break;
      case 'estadisticas':
        Component = Estadisticas;
        break;
      case 'calendario':
        Component = CalendarioView;
        break;
      default: // Dashboard
        Component = Dashboard;
    }
    
    return (
      <AnimatePresence mode="wait" custom={direccion}>
        <motion.div
          key={vistaActual}
          custom={direccion}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={pageTransition}
          className="w-full h-full"
          // Usar layout basado en config
          layout={config.layout}
          // Permitir drag si velocities está activado
          drag={config.velocities ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, info) => {
            if (Math.abs(info.offset.x) > 100) {
              const vistas = ['dashboard', 'trabajos', 'calendario', 'turnos', 'estadisticas'];
              const indiceActual = vistas.indexOf(vistaActual);
              const direccion = info.offset.x > 0 ? -1 : 1;
              const nuevoIndice = Math.max(0, Math.min(vistas.length - 1, indiceActual + direccion));
              cambiarVista(vistas[nuevoIndice]);
            }
          }}
        >
          <Component />
        </motion.div>
      </AnimatePresence>
    );
  };
  
  return (
    <AppProvider>
      <div className="font-poppins bg-gray-100 min-h-screen pb-20">
        <Header 
          vistaActual={vistaActual} 
          abrirModalNuevoTrabajo={abrirModalNuevoTrabajo} 
          abrirModalNuevoTurno={abrirModalNuevoTurno} 
        />
        <main className="max-w-md mx-auto">
          {renderizarVista()}
        </main>
        <Navegacion 
          vistaActual={vistaActual} 
          setVistaActual={cambiarVista} 
        />
        <ModalTrabajo 
          visible={modalTrabajoAbierto} 
          onClose={cerrarModalTrabajo} 
          trabajoSeleccionado={trabajoSeleccionado} 
        />
        <ModalTurno 
          visible={modalTurnoAbierto} 
          onClose={cerrarModalTurno} 
          turnoSeleccionado={turnoSeleccionado} 
        />
      </div>
    </AppProvider>
  );
};

export default App;