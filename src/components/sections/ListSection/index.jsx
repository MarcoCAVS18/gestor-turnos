// src/components/sections/ListSection/index.jsx

import React from 'react';
import PageHeader from '../../layout/PageHeader';
import EmptyState from '../../states/EmptyState';

const ListSection = ({
  title,
  subtitle,
  action,
  items = [],
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

      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map(renderItem)}
        </div>
      ) : (
        <EmptyState {...emptyState} />
      )}
    </div>
  );
};

export default ListSection;