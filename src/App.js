// src/App.jsx
import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** AppProvider ***REMOVED*** from './contexts/AppContext';
import ***REMOVED*** useAuth ***REMOVED*** from './contexts/AuthContext';
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
import ***REMOVED*** motion, AnimatePresence ***REMOVED*** from 'framer-motion';

const config = ***REMOVED***
  velocities: true,
  layout: 'always',
***REMOVED***;

const vistas = ['dashboard', 'trabajos', 'calendario', 'turnos', 'estadisticas'];

const App = () => ***REMOVED***
  const ***REMOVED*** currentUser, loading ***REMOVED*** = useAuth();

  const [vistaActual, setVistaActual] = useState('dashboard');
  const [modalTrabajoAbierto, setModalTrabajoAbierto] = useState(false);
  const [modalTurnoAbierto, setModalTurnoAbierto] = useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [direccion, setDireccion] = useState(1);

  if (loading) ***REMOVED***
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-t-4 border-gray-200 border-t-pink-600 animate-spin"></div>
      </div>
    );
  ***REMOVED***

  if (!currentUser) ***REMOVED***
    return <AuthModal />; // 🔐 Mostrar modal de login
  ***REMOVED***

  const abrirModalNuevoTrabajo = () => ***REMOVED***
    setTrabajoSeleccionado(null);
    setModalTrabajoAbierto(true);
  ***REMOVED***;

  const abrirModalNuevoTurno = () => ***REMOVED***
    setTurnoSeleccionado(null);
    setModalTurnoAbierto(true);
  ***REMOVED***;

  const cerrarModalTrabajo = () => ***REMOVED***
    setModalTrabajoAbierto(false);
    setTrabajoSeleccionado(null);
  ***REMOVED***;

  const cerrarModalTurno = () => ***REMOVED***
    setModalTurnoAbierto(false);
    setTurnoSeleccionado(null);
  ***REMOVED***;

  const cambiarVista = (nuevaVista) => ***REMOVED***
    const indiceActual = vistas.indexOf(vistaActual);
    const indiceNuevo = vistas.indexOf(nuevaVista);

    if (config.velocities) ***REMOVED***
      setDireccion(indiceNuevo > indiceActual ? 1 : -1);
    ***REMOVED*** else ***REMOVED***
      setDireccion(1);
    ***REMOVED***

    setVistaActual(nuevaVista);
  ***REMOVED***;

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

  const pageTransition = ***REMOVED***
    type: "tween",
    ease: "anticipate",
    duration: 0.4,
    stiffness: config.velocities ? 120 : 80,
    damping: config.velocities ? 20 : 30,
  ***REMOVED***;

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
      default:
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
          layout=***REMOVED***config.layout***REMOVED***
          drag=***REMOVED***config.velocities ? "x" : false***REMOVED***
          dragConstraints=***REMOVED******REMOVED*** left: 0, right: 0 ***REMOVED******REMOVED***
          dragElastic=***REMOVED***0.2***REMOVED***
          onDragEnd=***REMOVED***(e, info) => ***REMOVED***
            if (Math.abs(info.offset.x) > 100) ***REMOVED***
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
