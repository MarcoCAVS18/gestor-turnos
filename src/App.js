// src/App.jsx
import React, { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Navegacion from './components/Navegacion';
import Dashboard from './pages/Dashboard';
import Trabajos from './pages/Trabajos';
import Turnos from './pages/Turnos';
import Estadisticas from './pages/Estadisticas';
import CalendarioView from './pages/CalendarioView';
import ModalTrabajo from './components/ModalTrabajo';
import ModalTurno from './components/ModalTurno';
import AuthModal from './components/AuthModal'; // 🚨 Asegurate de tener este componente
import { motion, AnimatePresence } from 'framer-motion';

const config = {
  velocities: true,
  layout: 'always',
};

const vistas = ['dashboard', 'trabajos', 'calendario', 'turnos', 'estadisticas'];

const App = () => {
  const { currentUser, loading } = useAuth();

  const [vistaActual, setVistaActual] = useState('dashboard');
  const [modalTrabajoAbierto, setModalTrabajoAbierto] = useState(false);
  const [modalTurnoAbierto, setModalTurnoAbierto] = useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [direccion, setDireccion] = useState(1);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-t-4 border-gray-200 border-t-pink-600 animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthModal />; // 🔐 Mostrar modal de login
  }

  const abrirModalNuevoTrabajo = () => {
    setTrabajoSeleccionado(null);
    setModalTrabajoAbierto(true);
  };

  const abrirModalNuevoTurno = () => {
    setTurnoSeleccionado(null);
    setModalTurnoAbierto(true);
  };

  const cerrarModalTrabajo = () => {
    setModalTrabajoAbierto(false);
    setTrabajoSeleccionado(null);
  };

  const cerrarModalTurno = () => {
    setModalTurnoAbierto(false);
    setTurnoSeleccionado(null);
  };

  const cambiarVista = (nuevaVista) => {
    const indiceActual = vistas.indexOf(vistaActual);
    const indiceNuevo = vistas.indexOf(nuevaVista);

    if (config.velocities) {
      setDireccion(indiceNuevo > indiceActual ? 1 : -1);
    } else {
      setDireccion(1);
    }

    setVistaActual(nuevaVista);
  };

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

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4,
    stiffness: config.velocities ? 120 : 80,
    damping: config.velocities ? 20 : 30,
  };

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
      default:
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
          layout={config.layout}
          drag={config.velocities ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, info) => {
            if (Math.abs(info.offset.x) > 100) {
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
