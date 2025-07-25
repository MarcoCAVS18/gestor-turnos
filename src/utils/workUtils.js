export const generateWorkDetails = (trabajo) => ***REMOVED***
  if (!trabajo) return [];
  
  const detalles = [trabajo.nombre];
  
  if (trabajo.tipo === 'delivery') ***REMOVED***
    if (trabajo.plataforma) detalles.push(`Plataforma: $***REMOVED***trabajo.plataforma***REMOVED***`);
    if (trabajo.vehiculo) detalles.push(`Vehículo: $***REMOVED***trabajo.vehiculo***REMOVED***`);
  ***REMOVED*** else ***REMOVED***
    if (trabajo.tarifaBase) detalles.push(`Tarifa: $***REMOVED***trabajo.tarifaBase***REMOVED***`);
  ***REMOVED***
  
  return detalles;
***REMOVED***;