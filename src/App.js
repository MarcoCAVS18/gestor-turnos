// src/App.js

import React from 'react';
import ***REMOVED*** BrowserRouter as Router, Routes, Route, Navigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useAuth ***REMOVED*** from './contexts/AuthContext';
import ***REMOVED*** AppProvider ***REMOVED*** from './contexts/AppContext';

// Componentes de autenticación
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Componentes principales
import Header from './components/layout/Header';
import Navegacion from './components/layout/Navegacion';
import Dashboard from './pages/Dashboard';
import Trabajos from './pages/Trabajos';
import Turnos from './pages/Turnos';
import Estadisticas from './pages/Estadisticas';
import CalendarioView from './pages/CalendarioView';
import Ajustes from './pages/Ajustes';
import TrabajoCompartido from './pages/TrabajoCompartido';

// Modales
import ModalTrabajo from './components/modals/ModalTrabajo';
import ModalTurno from './components/modals/ModalTurno';

// Ruta protegida
const PrivateRoute = (***REMOVED*** children ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** currentUser, loading ***REMOVED*** = useAuth();

  if (loading) ***REMOVED***
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  ***REMOVED***

  return currentUser ? children : <Navigate to="/login" replace />;
***REMOVED***;

// Layout general de la app
function AppLayout(***REMOVED*** currentView ***REMOVED***) ***REMOVED***
  const [vistaActual, setVistaActual] = React.useState(currentView);
  const [modalTrabajoAbierto, setModalTrabajoAbierto] = React.useState(false);
  const [modalTurnoAbierto, setModalTurnoAbierto] = React.useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = React.useState(null);
  const [turnoSeleccionado, setTurnoSeleccionado] = React.useState(null);

  React.useEffect(() => ***REMOVED***
    setVistaActual(currentView);
  ***REMOVED***, [currentView]);

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
      case 'dashboard':
      default:
        return <Dashboard />;
    ***REMOVED***
  ***REMOVED***;

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      ***REMOVED***/* Header solo en mobile */***REMOVED***
      <div className="md:hidden">
        <Header
          vistaActual=***REMOVED***vistaActual***REMOVED***
          setVistaActual=***REMOVED***setVistaActual***REMOVED***
          abrirModalNuevoTrabajo=***REMOVED***abrirModalNuevoTrabajo***REMOVED***
          abrirModalNuevoTurno=***REMOVED***abrirModalNuevoTurno***REMOVED***
        />
      </div>

      ***REMOVED***/* Contenido principal */***REMOVED***
      <main className="max-w-md mx-auto px-4 pb-20 md:max-w-none md:ml-72 md:px-6 md:pb-6">
        ***REMOVED***renderVista()***REMOVED***
      </main>

      ***REMOVED***/* Navegación */***REMOVED***
      <Navegacion
        vistaActual=***REMOVED***vistaActual***REMOVED***
        setVistaActual=***REMOVED***setVistaActual***REMOVED***
        abrirModalNuevoTrabajo=***REMOVED***abrirModalNuevoTrabajo***REMOVED***
        abrirModalNuevoTurno=***REMOVED***abrirModalNuevoTurno***REMOVED***
      />

      <ModalTrabajo
        isOpen=***REMOVED***modalTrabajoAbierto***REMOVED***
        onClose=***REMOVED***cerrarModalTrabajo***REMOVED***
        trabajo=***REMOVED***trabajoSeleccionado***REMOVED***
      />

      <ModalTurno
        isOpen=***REMOVED***modalTurnoAbierto***REMOVED***
        onClose=***REMOVED***cerrarModalTurno***REMOVED***
        turno=***REMOVED***turnoSeleccionado***REMOVED***
      />

    </div>
  );
***REMOVED***

// App principal
function App() ***REMOVED***
  const ***REMOVED*** loading ***REMOVED*** = useAuth();

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
        ***REMOVED***/* Autenticación */***REMOVED***
        <Route path="/login" element=***REMOVED***<Login />***REMOVED*** />
        <Route path="/register" element=***REMOVED***<Register />***REMOVED*** />
        <Route path="/forgot-password" element=***REMOVED***<ForgotPassword />***REMOVED*** />
        <Route path="/reset-password" element=***REMOVED***<ResetPassword />***REMOVED*** />

        ***REMOVED***/* Rutas protegidas con AppProvider aplicado solo una vez */***REMOVED***
        <Route
          path="/compartir/:token"
          element=***REMOVED***
            <PrivateRoute>
              <AppProvider>
                <TrabajoCompartido />
              </AppProvider>
            </PrivateRoute>
          ***REMOVED***
        />

        <Route
          path="/dashboard"
          element=***REMOVED***
            <PrivateRoute>
              <AppProvider>
                <AppLayout currentView="dashboard" />
              </AppProvider>
            </PrivateRoute>
          ***REMOVED***
        />

        <Route
          path="/trabajos"
          element=***REMOVED***
            <PrivateRoute>
              <AppProvider>
                <AppLayout currentView="trabajos" />
              </AppProvider>
            </PrivateRoute>
          ***REMOVED***
        />

        <Route
          path="/turnos"
          element=***REMOVED***
            <PrivateRoute>
              <AppProvider>
                <AppLayout currentView="turnos" />
              </AppProvider>
            </PrivateRoute>
          ***REMOVED***
        />

        <Route
          path="/estadisticas"
          element=***REMOVED***
            <PrivateRoute>
              <AppProvider>
                <AppLayout currentView="estadisticas" />
              </AppProvider>
            </PrivateRoute>
          ***REMOVED***
        />

        <Route
          path="/calendario"
          element=***REMOVED***
            <PrivateRoute>
              <AppProvider>
                <AppLayout currentView="calendario" />
              </AppProvider>
            </PrivateRoute>
          ***REMOVED***
        />

        <Route
          path="/ajustes"
          element=***REMOVED***
            <PrivateRoute>
              <AppProvider>
                <AppLayout currentView="ajustes" />
              </AppProvider>
            </PrivateRoute>
          ***REMOVED***
        />

        <Route path="/" element=***REMOVED***<Navigate to="/dashboard" replace />***REMOVED*** />
        <Route path="*" element=***REMOVED***<Navigate to="/dashboard" replace />***REMOVED*** />
      </Routes>
    </Router>
  );
***REMOVED***

export default App;
