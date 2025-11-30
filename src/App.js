import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
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
import ScrollToTop from './components/layout/ScrollToTop/index.jsx';

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
const PublicRoute = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Flex variant="center" className="h-screen">
        <LoadingSpinner size="h-12 w-12" color="border-pink-500" />
      </Flex>
    );
  }

  return children;
};

// Layout general de la app
function AppLayout() {
  const location = useLocation();
  const vistaActual = location.pathname.substring(1); // Removes the leading '/'

  const {
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
  } = useModalManager();

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      {/* Header solo en mobile */}
      <div className="md:hidden">
        <Header
          vistaActual={vistaActual}
          abrirModalNuevoTrabajo={abrirModalNuevoTrabajo}
          abrirModalNuevoTurno={abrirModalNuevoTurno}
        />
      </div>

      {/* Contenido principal */}
      <main className="max-w-md mx-auto px-4 pb-20 md:max-w-none md:ml-72 md:px-6 md:pb-6">
        <Outlet context={{ abrirModalEditarTrabajo, abrirModalEditarTurno }} />
      </main>

      {/* Navegación */}
      <Navegacion
        abrirModalNuevoTrabajo={abrirModalNuevoTrabajo}
        abrirModalNuevoTurno={abrirModalNuevoTurno}
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
      <Flex variant="center" className="h-screen">
        <LoadingSpinner size="h-12 w-12" color="border-pink-500" />
      </Flex>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* RUTA ESPECIAL para trabajos compartidos - ACCESO PÚBLICO */}
        <Route
          path="/compartir/:token"
          element={
            <PublicRoute>
              <AppProvider>
                <div className="min-h-screen bg-gray-100 font-poppins">
                  <main className="max-w-md mx-auto">
                    <TrabajoCompartido />
                  </main>
                </div>
              </AppProvider>
            </PublicRoute>
          }
        />

        {/* Rutas protegidas */}
        <Route element={<ProtectedLayout><AppLayout /></ProtectedLayout>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trabajos" element={<Trabajos />} />
          <Route path="/turnos" element={<Turnos />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
          <Route path="/calendario" element={<CalendarioView />} />
          <Route path="/ajustes" element={<Ajustes />} />
        </Route>

        {/* Redirecciones */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;