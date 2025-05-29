import React from 'react';
import Card from '../../ui/Card';

const TarjetaResumen = ({ titulo, valor, color, icon: Icon }) => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-500 text-sm">{titulo}</h3>
        {Icon && <Icon size={20} className="text-gray-400" />}
      </div>
      <p 
        className="text-2xl font-semibold"
        style={{ color: color || '#374151' }}
      >
        {valor}
      </p>
    </Card>
  );
};

export default TarjetaResumen;