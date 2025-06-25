// src/components/sections/ListSection/index.jsx

import React from 'react';
import PageHeader from '../../layout/PageHeader';
import EmptyState from '../../states/EmptyState';

const ListSection = ({
  title,
  subtitle,
  action,
  items = [], // <--- ¡La clave está aquí! Asegura que 'items' siempre sea un array
  emptyState,
  renderItem,
  className = ''
}) => {
  return (
    <div className={`px-4 py-6 ${className}`}>
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={action}
      />

      {/* Ahora, 'items.length' es seguro porque 'items' está garantizado como un array */}
      {items.length > 0 ? (
        <div className="space-y-4">
          {/* Asegúrate de que renderItem devuelve un elemento con una 'key' única,
              como 'item.id', para un rendimiento óptimo de React. */}
          {items.map(renderItem)}
        </div>
      ) : (
        <EmptyState {...emptyState} />
      )}
    </div>
  );
};

export default ListSection;