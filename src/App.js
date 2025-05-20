// src/App.js
import React from 'react';
import ***REMOVED*** BrowserRouter as Router, Routes, Route, Navigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useAuth ***REMOVED*** from './contexts/AuthContext';
import ***REMOVED*** AppProvider ***REMOVED*** from './contexts/AppContext';

// Componentes
import AuthModal from './components/AuthModal';
import Header from './components/Header';
import Navegacion from './components/Navegacion';
import Dashboard from './pages/Dashboard';
import Trabajos from './pages/Trabajos';
import Turnos from './pages/Turnos';
import Estadisticas from './pages/Estadisticas';
import CalendarioView from './pages/CalendarioView';
import Ajustes from './pages/Ajustes';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ModalTrabajo from './components/ModalTrabajo';
import ModalTurno from './components/ModalTurno';


// Componente para rutas protegidas
const PrivateRoute = (***REMOVED*** children ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** currentUser, loading ***REMOVED*** = useAuth();
  
  if (loading) ***REMOVED***
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  ***REMOVED***
  
  return currentUser ? children : <Navigate to="/login" />;
***REMOVED***;

function App() ***REMOVED***
  const ***REMOVED*** currentUser, loading ***REMOVED*** = useAuth();
  
  // Si está cargando, mostrar spinner
  if (loading) ***REMOVED***
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  ***REMOVED***

  return (
    <Router>
      <Routes>
        ***REMOVED***/* Rutas de autenticación */***REMOVED***
        <Route path="/login" element=***REMOVED***currentUser ? <Navigate to="/" /> : <AuthModal />***REMOVED*** />
        <Route path="/register" element=***REMOVED***currentUser ? <Navigate to="/" /> : <Register />***REMOVED*** />
        <Route path="/forgot-password" element=***REMOVED***currentUser ? <Navigate to="/" /> : <ForgotPassword />***REMOVED*** />
        <Route path="/reset-password" element=***REMOVED***<ResetPassword />***REMOVED*** />

        ***REMOVED***/* Rutas protegidas */***REMOVED***
        <Route 
          path="/" 
          element=***REMOVED***
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          ***REMOVED*** 
        />
      </Routes>
    </Router>
  );
***REMOVED***

// Componente para el layout de la aplicación cuando el usuario está autenticado
function AppLayout() ***REMOVED***
  const [vistaActual, setVistaActual] = React.useState('dashboard');
  const [modalTrabajoAbierto, setModalTrabajoAbierto] = React.useState(false);
  const [modalTurnoAbierto, setModalTurnoAbierto] = React.useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = React.useState(null);
  const [turnoSeleccionado, setTurnoSeleccionado] = React.useState(null);

  // Funciones para manejar modales
  const abrirModalNuevoTrabajo = () => ***REMOVED***
    setTrabajoSeleccionado(null);
    setModalTrabajoAbierto(true);
  ***REMOVED***;

  const abrirModalNuevoTurno = () => ***REMOVED***
    setTurnoSeleccionado(null);
    setModalTurnoAbierto(true);
  ***REMOVED***;

  const abrirModalEditarTrabajo = (trabajo) => ***REMOVED***
    setTrabajoSeleccionado(trabajo);
    setModalTrabajoAbierto(true);
  ***REMOVED***;

  const abrirModalEditarTurno = (turno) => ***REMOVED***
    setTurnoSeleccionado(turno);
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

  // Renderizar la vista actual
  const renderVista = () => ***REMOVED***
    switch (vistaActual) ***REMOVED***
      case 'trabajos':
        return <Trabajos abrirModalEditarTrabajo=***REMOVED***abrirModalEditarTrabajo***REMOVED*** />;
      case 'turnos':
        return <Turnos abrirModalEditarTurno=***REMOVED***abrirModalEditarTurno***REMOVED*** />;
      case 'estadisticas':
        return <Estadisticas />;
      case 'calendario':
        return <CalendarioView />;
      case 'ajustes':
        return <Ajustes />;
      default:
        return <Dashboard />;
    ***REMOVED***
  ***REMOVED***;

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-100 font-poppins">
        <Header 
          vistaActual=***REMOVED***vistaActual***REMOVED***
          setVistaActual=***REMOVED***setVistaActual***REMOVED*** 
          abrirModalNuevoTrabajo=***REMOVED***abrirModalNuevoTrabajo***REMOVED*** 
          abrirModalNuevoTurno=***REMOVED***abrirModalNuevoTurno***REMOVED*** 
        />
        
        <main className="max-w-md mx-auto px-4 pb-20">
          ***REMOVED***renderVista()***REMOVED***
        </main>
        
        <Navegacion 
          vistaActual=***REMOVED***vistaActual***REMOVED*** 
          setVistaActual=***REMOVED***setVistaActual***REMOVED*** 
        />
        
        ***REMOVED***/* Modales */***REMOVED***
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
***REMOVED***

export default App;