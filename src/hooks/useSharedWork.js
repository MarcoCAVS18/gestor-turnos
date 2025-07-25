// src/hooks/useSharedWork.js

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { obtenerTrabajoCompartido, aceptarTrabajoCompartido } from '../services/shareService';

export const useSharedWork = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { reloadJobs } = useApp(); 
  
  const [trabajoCompartido, setTrabajoCompartido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [agregando, setAgregando] = useState(false);

  useEffect(() => {
    const cargarTrabajoCompartido = async () => {
      if (!token) {
        setError('Token de enlace no válido');
        setCargando(false);
        return;
      }

      try {
        
        const data = await obtenerTrabajoCompartido(token);
        
        setTrabajoCompartido(data);
      } catch (err) {
        setError(err.message || 'Error al cargar el trabajo compartido');
      } finally {
        setCargando(false);
      }
    };

    cargarTrabajoCompartido();
  }, [token]);

  const agregarTrabajo = async () => {
    if (!trabajoCompartido || !currentUser) {
      setError('No hay trabajo para agregar o usuario no autenticado');
      return;
    }
    
    try {
      setAgregando(true);
      setError('');
            
      // Usar la función del shareService para agregar el trabajo
      await aceptarTrabajoCompartido(currentUser.uid, token);
            
      // Recargar los trabajos en el contexto
      if (reloadJobs) {
        await reloadJobs();
      }
      
      // Navegar a la lista de trabajos
      navigate('/trabajos', { 
        state: { 
          message: `Trabajo "${trabajoCompartido.trabajoData.nombre}" agregado exitosamente` 
        } 
      });
      
    } catch (err) {
      setError('Error al agregar el trabajo: ' + err.message);
    } finally {
      setAgregando(false);
    }
  };

  return {
    trabajoCompartido: trabajoCompartido?.trabajoData,
    cargando,
    error,
    agregando,
    agregarTrabajo,
    tokenInfo: trabajoCompartido
  };
};