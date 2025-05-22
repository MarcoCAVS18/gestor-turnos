// src/components/Loader.jsx

import React from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

const Loader = (***REMOVED*** size = 65, fullScreen = false ***REMOVED***) => ***REMOVED***
  // Obtener los colores temáticos del contexto
  const ***REMOVED*** coloresTemáticos ***REMOVED*** = useApp();
  
  // Usar el color base o fallback
  const colorPrincipal = coloresTemáticos?.base || '#EC4899';
  
  // Estilo en línea para el loader
  const loaderStyle = ***REMOVED***
    width: `$***REMOVED***size***REMOVED***px`,
    aspectRatio: '1',
    background: getBackgroundGradient(colorPrincipal),
    backgroundSize: `$***REMOVED***size * 0.46***REMOVED***px $***REMOVED***size * 0.46***REMOVED***px`,
    animation: 'loaderAnimation 1.5s infinite'
  ***REMOVED***;
  
  // Contenedor para centrar el loader (opcional)
  const containerStyle = fullScreen ? ***REMOVED***
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transform: 'translateY(-5vh)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 9999
  ***REMOVED*** : ***REMOVED***
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transform: 'translateY(-5vh)',
    padding: '20px'
  ***REMOVED***;
  
  // Función para generar el gradiente con el color personalizado
  function getBackgroundGradient(color) ***REMOVED***
    const gradient = `radial-gradient(farthest-side, #0000 calc(95% - 3px), $***REMOVED***color***REMOVED*** calc(100% - 3px) 98%, #0000 101%) no-repeat`;
    return `$***REMOVED***gradient***REMOVED***, $***REMOVED***gradient***REMOVED***, $***REMOVED***gradient***REMOVED***`;
  ***REMOVED***
  
  return (
    <div style=***REMOVED***containerStyle***REMOVED***>
      <div className="custom-loader" style=***REMOVED***loaderStyle***REMOVED***></div>
      
      ***REMOVED***/* Estilos de la animación */***REMOVED***
      <style jsx="true">***REMOVED***`
        @keyframes loaderAnimation ***REMOVED***
          0% ***REMOVED***
            background-position: 0 0, 0 100%, 100% 100%;
          ***REMOVED***
          25% ***REMOVED***
            background-position: 100% 0, 0 100%, 100% 100%;
          ***REMOVED***
          50% ***REMOVED***
            background-position: 100% 0, 0 0, 100% 100%;
          ***REMOVED***
          75% ***REMOVED***
            background-position: 100% 0, 0 0, 0 100%;
          ***REMOVED***
          100% ***REMOVED***
            background-position: 100% 100%, 0 0, 0 100%;
          ***REMOVED***
        ***REMOVED***
      `***REMOVED***</style>
    </div>
  );
***REMOVED***;

export default Loader;