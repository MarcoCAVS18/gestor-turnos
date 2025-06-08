// src/hooks/useSharedWork.js

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

export const useSharedWork = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { crearTrabajo } = useApp();
  const [trabajoCompartido, setTrabajoCompartido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [agregando, setAgregando] = useState(false);

  useEffect(() => {
    const cargarTrabajoCompartido = async () => {
      try {
        const response = await fetch(`/api/trabajos/compartido/${token}`);
        if (!response.ok) throw new Error('Token inválido o expirado');
        
        const data = await response.json();
        setTrabajoCompartido(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    if (token) cargarTrabajoCompartido();
  }, [token]);

  const agregarTrabajo = async () => {
    if (!trabajoCompartido) return;
    
    try {
      setAgregando(true);
      await crearTrabajo({
        nombre: trabajoCompartido.nombre,
        descripcion: trabajoCompartido.descripcion,
        salario: trabajoCompartido.salario,
        color: trabajoCompartido.color,
        descuento: trabajoCompartido.descuento
      });
      
      navigate('/trabajos');
    } catch (err) {
      setError('Error al agregar el trabajo: ' + err.message);
    } finally {
      setAgregando(false);
    }
  };

  return {
    trabajoCompartido,
    cargando,
    error,
    agregando,
    agregarTrabajo
  };
};