// src/App.jsx - Corregido
import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** AppProvider ***REMOVED*** from './contexts/AppContext';
import Header from './components/Header';
import Navegacion from './components/Navegacion';
import Dashboard from './pages/Dashboard';
import Trabajos from './pages/Trabajos';
import Turnos from './pages/Turnos';
import Estadisticas from './pages/Estadisticas';
import CalendarioView from './pages/CalendarioView';
import ModalTrabajo from './components/ModalTrabajo';
import ModalTurno from './components/ModalTurno';
import ***REMOVED*** motion, AnimatePresence ***REMOVED*** from 'framer-motion'; 

// Configuración para la detección de gestos
const config = ***REMOVED***
  velocities: true,
    layout: 'always',
***REMOVED***;

const App = () => ***REMOVED***
  const [vistaActual, setVistaActual] = useState('dashboard');
  const [modalTrabajoAbierto, setModalTrabajoAbierto] = useState(false);
  const [modalTurnoAbierto, setModalTurnoAbierto] = useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [direccion, setDireccion] = useState(1); 
  
  // Funciones para abrir modales
  const abrirModalNuevoTrabajo = () => ***REMOVED***
    setTrabajoSeleccionado(null);
    setModalTrabajoAbierto(true);
  ***REMOVED***;
  
  const abrirModalNuevoTurno = () => ***REMOVED***
    setTurnoSeleccionado(null);
    setModalTurnoAbierto(true);
  ***REMOVED***;
  
  // Función para cerrar modales
  const cerrarModalTrabajo = () => ***REMOVED***
    setModalTrabajoAbierto(false);
    setTrabajoSeleccionado(null);
  ***REMOVED***;
  
  const cerrarModalTurno = () => ***REMOVED***
    setModalTurnoAbierto(false);
    setTurnoSeleccionado(null);
  ***REMOVED***;

  // Función para cambiar de vista con dirección
  const cambiarVista = (nuevaVista) => ***REMOVED***
    const vistas = ['dashboard', 'trabajos', 'calendario', 'turnos', 'estadisticas'];
    const indiceActual = vistas.indexOf(vistaActual);
    const indiceNuevo = vistas.indexOf(nuevaVista);
    
    if (config.velocities) ***REMOVED***
      setDireccion(indiceNuevo > indiceActual ? 1 : -1);
    ***REMOVED*** else ***REMOVED***
      setDireccion(1);
    ***REMOVED***
    
    setVistaActual(nuevaVista);
  ***REMOVED***;
  
  // Variantes de animación para las transiciones de página
  const pageVariants = ***REMOVED***
    enter: (direction) => (***REMOVED***
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    ***REMOVED***),
    center: ***REMOVED***
      x: 0,
      opacity: 1,
    ***REMOVED***,
    exit: (direction) => (***REMOVED***
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    ***REMOVED***),
  ***REMOVED***;
  
  // Usar config para personalizar las transiciones
  const pageTransition = ***REMOVED***
    type: "tween",
    ease: "anticipate",
    duration: 0.4,
    // Ajustar velocidad según config
    stiffness: config.velocities ? 120 : 80,
    damping: config.velocities ? 20 : 30,
  ***REMOVED***;
  
  // Renderizar la vista correspondiente con animación
  const renderizarVista = () => ***REMOVED***
    let Component;
    
    switch (vistaActual) ***REMOVED***
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
    ***REMOVED***
    
    return (
      <AnimatePresence mode="wait" custom=***REMOVED***direccion***REMOVED***>
        <motion.div
          key=***REMOVED***vistaActual***REMOVED***
          custom=***REMOVED***direccion***REMOVED***
          variants=***REMOVED***pageVariants***REMOVED***
          initial="enter"
          animate="center"
          exit="exit"
          transition=***REMOVED***pageTransition***REMOVED***
          className="w-full h-full"
          // Usar layout basado en config
          layout=***REMOVED***config.layout***REMOVED***
          // Permitir drag si velocities está activado
          drag=***REMOVED***config.velocities ? "x" : false***REMOVED***
          dragConstraints=***REMOVED******REMOVED*** left: 0, right: 0 ***REMOVED******REMOVED***
          dragElastic=***REMOVED***0.2***REMOVED***
          onDragEnd=***REMOVED***(e, info) => ***REMOVED***
            if (Math.abs(info.offset.x) > 100) ***REMOVED***
              const vistas = ['dashboard', 'trabajos', 'calendario', 'turnos', 'estadisticas'];
              const indiceActual = vistas.indexOf(vistaActual);
              const direccion = info.offset.x > 0 ? -1 : 1;
              const nuevoIndice = Math.max(0, Math.min(vistas.length - 1, indiceActual + direccion));
              cambiarVista(vistas[nuevoIndice]);
            ***REMOVED***
          ***REMOVED******REMOVED***
        >
          <Component />
        </motion.div>
      </AnimatePresence>
    );
  ***REMOVED***;
  
  return (
    <AppProvider>
      <div className="font-poppins bg-gray-100 min-h-screen pb-20">
        <Header 
          vistaActual=***REMOVED***vistaActual***REMOVED*** 
          abrirModalNuevoTrabajo=***REMOVED***abrirModalNuevoTrabajo***REMOVED*** 
          abrirModalNuevoTurno=***REMOVED***abrirModalNuevoTurno***REMOVED*** 
        />
        <main className="max-w-md mx-auto">
          ***REMOVED***renderizarVista()***REMOVED***
        </main>
        <Navegacion 
          vistaActual=***REMOVED***vistaActual***REMOVED*** 
          setVistaActual=***REMOVED***cambiarVista***REMOVED*** 
        />
        <ModalTrabajo 
          visible=***REMOVED***modalTrabajoAbierto***REMOVED*** 
          onClose=***REMOVED***cerrarModalTrabajo***REMOVED*** 
          trabajoSeleccionado=***REMOVED***trabajoSeleccionado***REMOVED*** 
        />
        <ModalTurno 
          visible=***REMOVED***modalTurnoAbierto***REMOVED*** 
          onClose=***REMOVED***cerrarModalTurno***REMOVED*** 
          turnoSeleccionado=***REMOVED***turnoSeleccionado***REMOVED*** 
        />
      </div>
    </AppProvider>
  );
***REMOVED***;

export default App;