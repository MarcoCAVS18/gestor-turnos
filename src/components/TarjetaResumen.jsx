// src/components/TarjetaResumen.jsx

import React from 'react';

const TarjetaResumen = ({ titulo, valor, color }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-gray-500 mb-1">{titulo}</h3>
      <p className="text-2xl font-semibold">{valor}</p>
    </div>
  );
};

export default TarjetaResumen;