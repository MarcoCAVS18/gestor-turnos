// src/components/cards/base/BaseStatsCard/BaseStatsCard.jsx
import React from 'react';
import Card from '../../../ui/Card';
import LoadingSpinner from '../../../ui/LoadingSpinner/LoadingSpinner';
import Flex from '../../../ui/Flex';

/**
 * BaseStatsCard - A reusable wrapper for all statistics cards.
 * Handles loading and empty states consistently.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.icon - An icon to display in the header.
 * @param {string} props.title - The title of the card.
 * @param {boolean} props.loading - If true, shows a loading spinner.
 * @param {boolean} props.empty - If true (and not loading), shows an empty state.
 * @param {string} props.emptyText - Text to display in the empty state.
 * @param {React.ReactNode} props.children - The content to display when not loading or empty.
 * @param {string} props.className - Additional classes for the card.
 */
const BaseStatsCard = ({
  icon,
  title,
  loading = false,
  empty = false,
  emptyText = "No hay datos suficientes para mostrar esta estadística.",
  children,
  className = ''
}) => {
  return (
    <Card className={`flex flex-col ${className}`}>
      {/* Card Header */}
      <Flex variant="between" className="pb-3 border-b border-gray-100">
        <Flex variant="center" className="text-gray-700">
          {icon && React.cloneElement(icon, { className: 'mr-2 h-5 w-5 text-gray-400' })}
          <h4 className="font-semibold text-sm">{title}</h4>
        </Flex>
      </Flex>

      {/* Card Body */}
      <Flex variant="center" className="flex-1 pt-4">
        {loading ? (
          <LoadingSpinner />
        ) : empty ? (
          <div className="text-center py-4">
            <p className="text-xs text-gray-500">{emptyText}</p>
          </div>
        ) : (
          <div className="w-full h-full min-w-0">
            {children}
          </div>
        )}
      </Flex>
    </Card>
  );
};

export default BaseStatsCard;
