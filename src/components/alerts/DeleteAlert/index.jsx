// src/components/alerts/DeleteAlert/index.jsx

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from '../../ui/Button';
import Flex from '../../ui/Flex';

const DeleteAlert = ({
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
}) => {

  if (!visible) return null;

  const finalTitle = title || `Delete ${type}?`;

  return (
    <Flex variant="center" className="fixed inset-0 bg-black bg-opacity-50 p-4 z-[9999]">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full animate-fadeIn">
        <div className="p-6">
          <Flex variant="center" className="w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <AlertTriangle size={24} className="text-red-600" />
          </Flex>

          <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
            {finalTitle}
          </h3>

          {details.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="text-sm space-y-1">
                {details.map((detail, index) => (
                  <p
                    key={index}
                    className={index === 0 ? "font-medium text-gray-900" : "text-gray-600"}
                  >
                    {detail}
                  </p>
                ))}
              </div>
            </div>
          )}

          {warning && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <AlertTriangle size={16} className="inline mr-1" />Warning: The selected job will be permanently deleted.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1"
              disabled={deleting}
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              variant="danger"
              className="flex-1"
              loading={deleting}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </Flex>
  );
};

export default DeleteAlert;