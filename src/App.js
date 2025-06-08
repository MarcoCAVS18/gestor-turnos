// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';

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
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return currentUser ? children : <Navigate to="/login" replace />;
};

// Layout general de la app
function AppLayout({ currentView }) {
  const [vistaActual, setVistaActual] = React.useState(currentView);
  const [modalTrabajoAbierto, setModalTrabajoAbierto] = React.useState(false);
  const [modalTurnoAbierto, setModalTurnoAbierto] = React.useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = React.useState(null);
  const [turnoSeleccionado, setTurnoSeleccionado] = React.useState(null);

  React.useEffect(() => {
    setVistaActual(currentView);
  }, [currentView]);

  const abrirModalNuevoTrabajo = () => {
    setTrabajoSeleccionado(null);
    setModalTrabajoAbierto(true);
  };

  const abrirModalNuevoTurno = () => {
    setTurnoSeleccionado(null);
    setModalTurnoAbierto(true);
  };

  const abrirModalEditarTrabajo = (trabajo) => {
    setTrabajoSeleccionado(trabajo);
    setModalTrabajoAbierto(true);
  };

  const abrirModalEditarTurno = (turno) => {
    setTurnoSeleccionado(turno);
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

  const renderVista = () => {
    switch (vistaActual) {
      case 'trabajos':
        return <Trabajos abrirModalEditarTrabajo={abrirModalEditarTrabajo} />;
      case 'turnos':
        return <Turnos abrirModalEditarTurno={abrirModalEditarTurno} />;
      case 'estadisticas':
        return <Estadisticas />;
      case 'calendario':
        return <CalendarioView />;
      case 'ajustes':
        return <Ajustes />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      <Header
        vistaActual={vistaActual}
        setVistaActual={setVistaActual}
        abrirModalNuevoTrabajo={abrirModalNuevoTrabajo}
        abrirModalNuevoTurno={abrirModalNuevoTurno}
      />

      <main className="max-w-md mx-auto px-4 pb-20">
        {renderVista()}
      </main>

      <Navegacion
        vistaActual={vistaActual}
        setVistaActual={setVistaActual}
      />

      <ModalTrabajo
        isOpen={modalTrabajoAbierto}
        onClose={cerrarModalTrabajo}
        trabajo={trabajoSeleccionado}
      />

      <ModalTurno
        isOpen={modalTurnoAbierto}
        onClose={cerrarModalTurno}
        turno={turnoSeleccionado}
      />
    </div>
  );
}

// App principal
function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Rutas protegidas con AppProvider aplicado solo una vez */}
        <Route
          path="/compartir/:token"
          element={
            <PrivateRoute>
              <AppProvider>
                <TrabajoCompartido />
              </AppProvider>
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AppProvider>
                <AppLayout currentView="dashboard" />
              </AppProvider>
            </PrivateRoute>
          }
        />

        <Route
          path="/trabajos"
          element={
            <PrivateRoute>
              <AppProvider>
                <AppLayout currentView="trabajos" />
              </AppProvider>
            </PrivateRoute>
          }
        />

        <Route
          path="/turnos"
          element={
            <PrivateRoute>
              <AppProvider>
                <AppLayout currentView="turnos" />
              </AppProvider>
            </PrivateRoute>
          }
        />

        <Route
          path="/estadisticas"
          element={
            <PrivateRoute>
              <AppProvider>
                <AppLayout currentView="estadisticas" />
              </AppProvider>
            </PrivateRoute>
          }
        />

        <Route
          path="/calendario"
          element={
            <PrivateRoute>
              <AppProvider>
                <AppLayout currentView="calendario" />
              </AppProvider>
            </PrivateRoute>
          }
        />

        <Route
          path="/ajustes"
          element={
            <PrivateRoute>
              <AppProvider>
                <AppLayout currentView="ajustes" />
              </AppProvider>
            </PrivateRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
