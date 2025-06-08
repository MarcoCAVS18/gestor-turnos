// src/hooks/useSharedWork.js

import ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useParams, useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

export const useSharedWork = () => ***REMOVED***
  const ***REMOVED*** token ***REMOVED*** = useParams();
  const navigate = useNavigate();
  const ***REMOVED*** crearTrabajo ***REMOVED*** = useApp();
  const [trabajoCompartido, setTrabajoCompartido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [agregando, setAgregando] = useState(false);

  useEffect(() => ***REMOVED***
    const cargarTrabajoCompartido = async () => ***REMOVED***
      try ***REMOVED***
        const response = await fetch(`/api/trabajos/compartido/$***REMOVED***token***REMOVED***`);
        if (!response.ok) throw new Error('Token inválido o expirado');
        
        const data = await response.json();
        setTrabajoCompartido(data);
      ***REMOVED*** catch (err) ***REMOVED***
        setError(err.message);
      ***REMOVED*** finally ***REMOVED***
        setCargando(false);
      ***REMOVED***
    ***REMOVED***;

    if (token) cargarTrabajoCompartido();
  ***REMOVED***, [token]);

  const agregarTrabajo = async () => ***REMOVED***
    if (!trabajoCompartido) return;
    
    try ***REMOVED***
      setAgregando(true);
      await crearTrabajo(***REMOVED***
        nombre: trabajoCompartido.nombre,
        descripcion: trabajoCompartido.descripcion,
        salario: trabajoCompartido.salario,
        color: trabajoCompartido.color,
        descuento: trabajoCompartido.descuento
      ***REMOVED***);
      
      navigate('/trabajos');
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al agregar el trabajo: ' + err.message);
    ***REMOVED*** finally ***REMOVED***
      setAgregando(false);
    ***REMOVED***
  ***REMOVED***;

  return ***REMOVED***
    trabajoCompartido,
    cargando,
    error,
    agregando,
    agregarTrabajo
  ***REMOVED***;
***REMOVED***;