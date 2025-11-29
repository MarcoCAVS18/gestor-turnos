// src/components/work/WorkAvatar/index.jsx 

import React from 'react';
import Flex from '../../ui/Flex';

const WorkAvatar = ({ nombre, color, size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl'
  };

  // Validaciones defensivas
  const nombreSeguro = nombre || 'T'; // T de "Trabajo"
  const colorSeguro = color || '#EC4899';
  const sizeSeguro = sizes[size] || sizes.md;

  // Obtener primera letra del nombre de forma segura
  const inicial = nombreSeguro.toString().charAt(0).toUpperCase() || 'T';

  return (
    <Flex variant="center" 
      className={`${sizeSeguro} rounded-lg`}
      style={{ backgroundColor: colorSeguro }}
    >
      <span className="text-white font-bold">
        {inicial}
      </span>
    </Flex>
  );
};

export default WorkAvatar;