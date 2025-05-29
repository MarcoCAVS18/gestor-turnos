import React from 'react';
import ***REMOVED*** X ***REMOVED*** from 'lucide-react';
import Button from '../Button';

const Modal = (***REMOVED***
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className = '',
  showCloseButton = true
***REMOVED***) => ***REMOVED***
  if (!isOpen) return null;

  const getSizeClasses = () => ***REMOVED***
    const sizes = ***REMOVED***
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl'
    ***REMOVED***;
    return sizes[size] || sizes.md;
  ***REMOVED***;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        ***REMOVED***/* Backdrop */***REMOVED***
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick=***REMOVED***onClose***REMOVED***
        />
        
        ***REMOVED***/* Modal */***REMOVED***
        <div className=***REMOVED***`relative bg-white rounded-xl shadow-xl w-full $***REMOVED***getSizeClasses()***REMOVED*** $***REMOVED***className***REMOVED***`***REMOVED***>
          ***REMOVED***/* Header */***REMOVED***
          ***REMOVED***(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              ***REMOVED***title && (
                <h2 className="text-xl font-semibold text-gray-900">***REMOVED***title***REMOVED***</h2>
              )***REMOVED***
              ***REMOVED***showCloseButton && (
                <Button
                  onClick=***REMOVED***onClose***REMOVED***
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-600"
                  icon=***REMOVED***X***REMOVED***
                />
              )***REMOVED***
            </div>
          )***REMOVED***
          
          ***REMOVED***/* Content */***REMOVED***
          <div className=***REMOVED***title || showCloseButton ? 'p-6' : 'p-6'***REMOVED***>
            ***REMOVED***children***REMOVED***
          </div>
          
          ***REMOVED***/* Footer */***REMOVED***
          ***REMOVED***footer && (
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              ***REMOVED***footer***REMOVED***
            </div>
          )***REMOVED***
        </div>
      </div>
    </div>
  );
***REMOVED***;

export default Modal;
