export const generateWorkDetails = (trabajo) => {
  if (!trabajo) return [];
  
  const detalles = [trabajo.nombre];
  
  if (trabajo.tipo === 'delivery') {
    if (trabajo.plataforma) detalles.push(`Plataforma: ${trabajo.plataforma}`);
    if (trabajo.vehiculo) detalles.push(`Vehículo: ${trabajo.vehiculo}`);
  } else {
    if (trabajo.tarifaBase) detalles.push(`Tarifa: ${trabajo.tarifaBase}`);
  }
  
  return detalles;
};