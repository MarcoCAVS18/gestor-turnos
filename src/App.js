import React from 'react';
import ***REMOVED*** BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useAuth ***REMOVED*** from './contexts/AuthContext';
import ***REMOVED*** AppProvider ***REMOVED*** from './contexts/AppContext';
import ProtectedLayout from './components/layout/ProtectedLayout/ProtectedLayout';
import LoadingSpinner from './components/ui/LoadingSpinner/LoadingSpinner';
import Flex from './components/ui/Flex';
import useModalManager from './hooks/useModalManager';
import './styles/animation.css';

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
import ModalTrabajo from './components/modals/work/ModalTrabajo';
import ModalTurno from './components/modals/shift/ModalTurno';

// Ruta pública que permite acceso sin autenticación
const PublicRoute = (***REMOVED*** children ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** loading ***REMOVED*** = useAuth();

  if (loading) ***REMOVED***
    return (
      <Flex variant="center" className="h-screen">
        <LoadingSpinner size="h-12 w-12" color="border-pink-500" />
      </Flex>
    );
  ***REMOVED***

  return children;
***REMOVED***;

// Layout general de la app
function AppLayout() ***REMOVED***
  const location = useLocation();
  const vistaActual = location.pathname.substring(1); // Removes the leading '/'

  const ***REMOVED***
    modalTrabajoAbierto,
    modalTurnoAbierto,
    trabajoSeleccionado,
    turnoSeleccionado,
    abrirModalNuevoTrabajo,
    abrirModalNuevoTurno,
    abrirModalEditarTrabajo,
    abrirModalEditarTurno,
    cerrarModalTrabajo,
    cerrarModalTurno,
  ***REMOVED*** = useModalManager();

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      ***REMOVED***/* Header solo en mobile */***REMOVED***
      <div className="md:hidden">
        <Header
          vistaActual=***REMOVED***vistaActual***REMOVED***
          abrirModalNuevoTrabajo=***REMOVED***abrirModalNuevoTrabajo***REMOVED***
          abrirModalNuevoTurno=***REMOVED***abrirModalNuevoTurno***REMOVED***
        />
      </div>

      ***REMOVED***/* Contenido principal */***REMOVED***
      <main className="max-w-md mx-auto px-4 pb-20 md:max-w-none md:ml-72 md:px-6 md:pb-6">
        <Outlet context=***REMOVED******REMOVED*** abrirModalEditarTrabajo, abrirModalEditarTurno ***REMOVED******REMOVED*** />
      </main>

      ***REMOVED***/* Navegación */***REMOVED***
      <Navegacion
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
      <Flex variant="center" className="h-screen">
        <LoadingSpinner size="h-12 w-12" color="border-pink-500" />
      </Flex>
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

        ***REMOVED***/* RUTA ESPECIAL para trabajos compartidos - ACCESO PÚBLICO */***REMOVED***
        <Route
          path="/compartir/:token"
          element=***REMOVED***
            <PublicRoute>
              <AppProvider>
                <div className="min-h-screen bg-gray-100 font-poppins">
                  <main className="max-w-md mx-auto">
                    <TrabajoCompartido />
                  </main>
                </div>
              </AppProvider>
            </PublicRoute>
          ***REMOVED***
        />

        ***REMOVED***/* Rutas protegidas */***REMOVED***
        <Route element=***REMOVED***<ProtectedLayout><AppLayout /></ProtectedLayout>***REMOVED***>
          <Route path="/dashboard" element=***REMOVED***<Dashboard />***REMOVED*** />
          <Route path="/trabajos" element=***REMOVED***<Trabajos />***REMOVED*** />
          <Route path="/turnos" element=***REMOVED***<Turnos />***REMOVED*** />
          <Route path="/estadisticas" element=***REMOVED***<Estadisticas />***REMOVED*** />
          <Route path="/calendario" element=***REMOVED***<CalendarioView />***REMOVED*** />
          <Route path="/ajustes" element=***REMOVED***<Ajustes />***REMOVED*** />
        </Route>

        ***REMOVED***/* Redirecciones */***REMOVED***
        <Route path="/" element=***REMOVED***<Navigate to="/dashboard" replace />***REMOVED*** />
        <Route path="*" element=***REMOVED***<Navigate to="/dashboard" replace />***REMOVED*** />
      </Routes>
    </Router>
  );
***REMOVED***

export default App;