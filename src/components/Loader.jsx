// src/components/Loader.jsx - ACTUALIZADO CON COLORES TEMÁTICOS

import React from 'react';
import { useApp } from '../contexts/AppContext';

const Loader = ({ size = 65, fullScreen = false }) => {
  // Obtener los colores temáticos del contexto
  const { coloresTemáticos } = useApp();
  
  // Usar el color base o fallback
  const colorPrincipal = coloresTemáticos?.base || '#EC4899';
  
  // Estilo en línea para el loader
  const loaderStyle = {
    width: `${size}px`,
    aspectRatio: '1',
    backgroundImage: getBackgroundGradient(colorPrincipal),
    backgroundSize: `${size * 0.46}px ${size * 0.46}px`,
    backgroundRepeat: 'no-repeat',
    animation: 'loaderAnimation 1.5s infinite'
  };
  
  // Contenedor para centrar el loader (opcional)
  const containerStyle = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 9999
  } : {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px'
  };
  
  // Función para generar el gradiente con el color personalizado
  function getBackgroundGradient(color) {
    const gradient = `radial-gradient(farthest-side, #0000 calc(95% - 3px), ${color} calc(100% - 3px) 98%, #0000 101%)`;
    return `${gradient}, ${gradient}, ${gradient}`;
  }
  
  return (
    <div style={containerStyle}>
      <div className="custom-loader" style={loaderStyle}></div>
      
      {/* Estilos de la animación */}
      <style jsx="true">{`
        @keyframes loaderAnimation {
          0% {
            background-position: 0 0, 0 100%, 100% 100%;
          }
          25% {
            background-position: 100% 0, 0 100%, 100% 100%;
          }
          50% {
            background-position: 100% 0, 0 0, 100% 100%;
          }
          75% {
            background-position: 100% 0, 0 0, 0 100%;
          }
          100% {
            background-position: 100% 100%, 0 0, 0 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;