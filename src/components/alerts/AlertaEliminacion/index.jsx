// src/components/alerts/DeleteAlert/index.jsx

import React from 'react';
import ***REMOVED*** AlertTriangle ***REMOVED*** from 'lucide-react';
import Button from '../../ui/Button';
import Flex from '../../ui/Flex';

const DeleteAlert = (***REMOVED***
  visible,
  onCancel,
  onConfirm,
  deleting = false,
  type = 'item',
  title,
  details = [],
  warning,
  confirmText = 'Delete',
  cancelText = 'Cancel'
***REMOVED***) => ***REMOVED***

  if (!visible) return null;

  const finalTitle = title || `Delete $***REMOVED***type***REMOVED***?`;

  return (
    <Flex variant="center" className="fixed inset-0 bg-black bg-opacity-50 p-4 z-[9999]">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full animate-fadeIn">
        <div className="p-6">
          <Flex variant="center" className="w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <AlertTriangle size=***REMOVED***24***REMOVED*** className="text-red-600" />
          </Flex>

          <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
            ***REMOVED***finalTitle***REMOVED***
          </h3>

          ***REMOVED***details.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="text-sm space-y-1">
                ***REMOVED***details.map((detail, index) => (
                  <p
                    key=***REMOVED***index***REMOVED***
                    className=***REMOVED***index === 0 ? "font-medium text-gray-900" : "text-gray-600"***REMOVED***
                  >
                    ***REMOVED***detail***REMOVED***
                  </p>
                ))***REMOVED***
              </div>
            </div>
          )***REMOVED***

          ***REMOVED***warning && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <AlertTriangle size=***REMOVED***16***REMOVED*** className="inline mr-1" />Warning: The selected job will be permanently deleted.
              </p>
            </div>
          )***REMOVED***

          <div className="flex gap-3">
            <Button
              onClick=***REMOVED***onCancel***REMOVED***
              variant="outline"
              className="flex-1"
              disabled=***REMOVED***deleting***REMOVED***
            >
              ***REMOVED***cancelText***REMOVED***
            </Button>
            <Button
              onClick=***REMOVED***onConfirm***REMOVED***
              variant="danger"
              className="flex-1"
              loading=***REMOVED***deleting***REMOVED***
            >
              ***REMOVED***confirmText***REMOVED***
            </Button>
          </div>
        </div>
      </div>
    </Flex>
  );
***REMOVED***;

export default DeleteAlert;