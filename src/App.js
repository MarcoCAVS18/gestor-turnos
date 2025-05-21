// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';

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
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }
  
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  const { currentUser, loading } = useAuth();
  
  // Si está cargando, mostrar spinner
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
        {/* Rutas de autenticación */}
        <Route path="/login" element={currentUser ? <Navigate to="/" /> : <AuthModal />} />
        <Route path="/register" element={currentUser ? <Navigate to="/" /> : <Register />} />
        <Route path="/forgot-password" element={currentUser ? <Navigate to="/" /> : <ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Rutas protegidas */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

// Componente para el layout de la aplicación cuando el usuario está autenticado
function AppLayout() {
  const [vistaActual, setVistaActual] = React.useState('dashboard');
  const [modalTrabajoAbierto, setModalTrabajoAbierto] = React.useState(false);
  const [modalTurnoAbierto, setModalTurnoAbierto] = React.useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = React.useState(null);
  const [turnoSeleccionado, setTurnoSeleccionado] = React.useState(null);

  // Funciones para manejar modales
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

  // Renderizar la vista actual
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
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider>
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
        
        {/* Modales */}
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
}

export default App;