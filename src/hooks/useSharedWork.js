// src/hooks/useSharedWork.js

import ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useParams, useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** useAuth ***REMOVED*** from '../contexts/AuthContext';
import ***REMOVED*** obtenerTrabajoCompartido, aceptarTrabajoCompartido ***REMOVED*** from '../services/shareService';

export const useSharedWork = () => ***REMOVED***
  const ***REMOVED*** token ***REMOVED*** = useParams();
  const navigate = useNavigate();
  const ***REMOVED*** currentUser ***REMOVED*** = useAuth();
  const ***REMOVED*** reloadJobs ***REMOVED*** = useApp(); 
  
  const [trabajoCompartido, setTrabajoCompartido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [agregando, setAgregando] = useState(false);

  useEffect(() => ***REMOVED***
    const cargarTrabajoCompartido = async () => ***REMOVED***
      if (!token) ***REMOVED***
        setError('Token de enlace no válido');
        setCargando(false);
        return;
      ***REMOVED***

      try ***REMOVED***
        
        const data = await obtenerTrabajoCompartido(token);
        
        setTrabajoCompartido(data);
      ***REMOVED*** catch (err) ***REMOVED***
        setError(err.message || 'Error al cargar el trabajo compartido');
      ***REMOVED*** finally ***REMOVED***
        setCargando(false);
      ***REMOVED***
    ***REMOVED***;

    cargarTrabajoCompartido();
  ***REMOVED***, [token]);

  const agregarTrabajo = async () => ***REMOVED***
    if (!trabajoCompartido || !currentUser) ***REMOVED***
      setError('No hay trabajo para agregar o usuario no autenticado');
      return;
    ***REMOVED***
    
    try ***REMOVED***
      setAgregando(true);
      setError('');
            
      // Usar la función del shareService para agregar el trabajo
      await aceptarTrabajoCompartido(currentUser.uid, token);
            
      // Recargar los trabajos en el contexto
      if (reloadJobs) ***REMOVED***
        await reloadJobs();
      ***REMOVED***
      
      // Navegar a la lista de trabajos
      navigate('/trabajos', ***REMOVED*** 
        state: ***REMOVED*** 
          message: `Trabajo "$***REMOVED***trabajoCompartido.trabajoData.nombre***REMOVED***" agregado exitosamente` 
        ***REMOVED*** 
      ***REMOVED***);
      
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al agregar el trabajo: ' + err.message);
    ***REMOVED*** finally ***REMOVED***
      setAgregando(false);
    ***REMOVED***
  ***REMOVED***;

  return ***REMOVED***
    trabajoCompartido: trabajoCompartido?.trabajoData,
    cargando,
    error,
    agregando,
    agregarTrabajo,
    tokenInfo: trabajoCompartido
  ***REMOVED***;
***REMOVED***;