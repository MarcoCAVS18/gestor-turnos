// src/constants/delivery.js

export const DELIVERY_PLATFORMS = [
  {
    id: 'uber_eats',
    nombre: 'Uber Eats',
    color: '#000000',
    icono: '🚗',
    categoria: 'comida'
  },
  {
    id: 'doordash',
    nombre: 'DoorDash',
    color: '#FF3008',
    icono: '🛵',
    categoria: 'comida'
  },
  {
    id: 'rappi',
    nombre: 'Rappi',
    color: '#FE6B42',
    icono: '📦',
    categoria: 'multi'
  },
  {
    id: 'pedidosya',
    nombre: 'PedidosYa',
    color: '#FF0080',
    icono: '🏍️',
    categoria: 'comida'
  },
  {
    id: 'uber',
    nombre: 'Uber (Viajes)',
    color: '#000000',
    icono: '🚙',
    categoria: 'transporte'
  },
  {
    id: 'cabify',
    nombre: 'Cabify',
    color: '#6C4BF6',
    icono: '🚕',
    categoria: 'transporte'
  },
  {
    id: 'glovo',
    nombre: 'Glovo',
    color: '#FFC244',
    icono: '🛴',
    categoria: 'multi'
  },
  {
    id: 'otro',
    nombre: 'Otra plataforma',
    color: '#6B7280',
    icono: '📱',
    categoria: 'otro'
  }
];

export const DELIVERY_CATEGORIES = {
  comida: 'Entrega de comida',
  transporte: 'Transporte de personas',
  multi: 'Entregas múltiples',
  otro: 'Otro tipo'
};