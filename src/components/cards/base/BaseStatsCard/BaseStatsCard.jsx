// src/components/cards/base/BaseStatsCard/BaseStatsCard.jsx
import React from 'react';
import Card from '../../../ui/Card';
import LoadingSpinner from '../../../ui/LoadingSpinner/LoadingSpinner';
import Flex from '../../../ui/Flex';

/**
 * BaseStatsCard - A reusable wrapper for all statistics cards.
 * Handles loading and empty states consistently.
 *
 * @param ***REMOVED***Object***REMOVED*** props
 * @param ***REMOVED***React.ReactNode***REMOVED*** props.icon - An icon to display in the header.
 * @param ***REMOVED***string***REMOVED*** props.title - The title of the card.
 * @param ***REMOVED***boolean***REMOVED*** props.loading - If true, shows a loading spinner.
 * @param ***REMOVED***boolean***REMOVED*** props.empty - If true (and not loading), shows an empty state.
 * @param ***REMOVED***string***REMOVED*** props.emptyText - Text to display in the empty state.
 * @param ***REMOVED***React.ReactNode***REMOVED*** props.children - The content to display when not loading or empty.
 * @param ***REMOVED***string***REMOVED*** props.className - Additional classes for the card.
 */
const BaseStatsCard = (***REMOVED***
  icon,
  title,
  loading = false,
  empty = false,
  emptyText = "No hay datos suficientes para mostrar esta estadística.",
  children,
  className = ''
***REMOVED***) => ***REMOVED***
  return (
    <Card className=***REMOVED***`flex flex-col $***REMOVED***className***REMOVED***`***REMOVED***>
      ***REMOVED***/* Card Header */***REMOVED***
      <Flex variant="between" className="pb-3 border-b border-gray-100">
        <Flex variant="center" className="text-gray-700">
          ***REMOVED***icon && React.cloneElement(icon, ***REMOVED*** className: 'mr-2 h-5 w-5 text-gray-400' ***REMOVED***)***REMOVED***
          <h4 className="font-semibold text-sm">***REMOVED***title***REMOVED***</h4>
        </Flex>
      </Flex>

      ***REMOVED***/* Card Body */***REMOVED***
      <Flex variant="center" className="flex-1 pt-4">
        ***REMOVED***loading ? (
          <LoadingSpinner />
        ) : empty ? (
          <div className="text-center py-4">
            <p className="text-xs text-gray-500">***REMOVED***emptyText***REMOVED***</p>
          </div>
        ) : (
          <div className="w-full h-full">
            ***REMOVED***children***REMOVED***
          </div>
        )***REMOVED***
      </Flex>
    </Card>
  );
***REMOVED***;

export default BaseStatsCard;
