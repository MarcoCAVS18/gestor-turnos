// src/constants/delivery.js

export const DELIVERY_PLATFORMS_AUSTRALIA = [
  {
    id: 'uber_eats',
    name: 'Uber Eats',
    color: '#121212'
  },
  {
    id: 'menulog',
    name: 'Menulog',
    color: '#FF6B35'
  },
  {
    id: 'deliveroo',
    name: 'Deliveroo',
    color: '#00CCBC'
  },
  {
    id: 'doordash',
    name: 'DoorDash',
    color: '#FF3008'
  },
  {
    id: 'pedidos_ya',
    name: 'Pedidos Ya',
    color: '#af2d2dff'
  },
  {
    id: 'didi',
    name: 'DiDi',
    color: '#FF6B00'
  },
  {
    id: 'amazon_flex',
    name: 'Amazon Flex',
    color: '#FF9900'
  },
  {
    id: 'other',
    name: 'Other',
    color: '#6B7280'
  }
];

// MODIFIED: Now each vehicle is an object with id, name, and color
export const DELIVERY_VEHICLES = [
  { id: 'bicycle', name: 'Bicycle', color: '#4CAF50' },
  { id: 'motorbike', name: 'Motorbike', color: '#FF9800' },
  { id: 'car', name: 'Car', color: '#2196F3' },
  { id: 'on_foot', name: 'On foot', color: '#9E9E9E' }
];