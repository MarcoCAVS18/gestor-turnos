// src/components/modals/ConfirmDeleteProfilePhotoModal/index.jsx

import React from 'react';
import BaseModal from '../base/BaseModal';
import ***REMOVED*** ArrowRight ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useAuth ***REMOVED*** from '../../../contexts/AuthContext';
import ***REMOVED*** getDefaultProfilePhoto ***REMOVED*** from '../../../services/profilePhotoService';
import Flex from '../../ui/Flex';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import Button from '../../ui/Button'; 

const ConfirmDeleteProfilePhotoModal = (***REMOVED*** isOpen, onClose, onConfirm, loading ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** profilePhotoURL ***REMOVED*** = useAuth();
  const defaultPhoto = getDefaultProfilePhoto();
  const colors = useThemeColors();

  return (
    <BaseModal
      isOpen=***REMOVED***isOpen***REMOVED***
      onClose=***REMOVED***onClose***REMOVED***
      title="Delete Profile Photo"
      showActions=***REMOVED***false***REMOVED***
      loading=***REMOVED***loading***REMOVED***
    >
      <form id="delete-profile-photo-form" onSubmit=***REMOVED***onConfirm***REMOVED***>
        <Flex variant="center" className="my-6">
          ***REMOVED***/* Current Profile Photo */***REMOVED***
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center">
            <img
              src=***REMOVED***profilePhotoURL***REMOVED***
              alt="Current Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <ArrowRight size=***REMOVED***24***REMOVED*** className="mx-4 text-gray-500" />

          ***REMOVED***/* Default Logo */***REMOVED***
          <div
            className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center"
            style=***REMOVED******REMOVED*** backgroundColor: colors.primary ***REMOVED******REMOVED***
          >
            <img
              src=***REMOVED***defaultPhoto***REMOVED***
              alt="Default Logo"
              className="w-full h-full object-contain p-4 filter brightness-0 invert opacity-90"
            />
          </div>
        </Flex>

        <p className="text-center text-sm text-gray-600 mb-4">
          Are you sure you want to delete your profile photo? It will be replaced by the default logo.
        </p>
        
        ***REMOVED***/* Custom Actions Footer */***REMOVED***
        <div
          className="border-t p-4 mt-auto"
          style=***REMOVED******REMOVED*** borderTopColor: colors.transparent20 ***REMOVED******REMOVED***
        >
          <div className="w-full flex justify-end gap-3">
            <Button
              variant="outline"
              onClick=***REMOVED***onClose***REMOVED***
              disabled=***REMOVED***loading***REMOVED***
              themeColor=***REMOVED***colors.primary***REMOVED***

            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="delete-profile-photo-form"
              loading=***REMOVED***loading***REMOVED***
              loadingText="Deleting..."
              disabled=***REMOVED***loading***REMOVED***
              bgColor=***REMOVED***colors.primary***REMOVED***
            >
              Confirm Deletion
            </Button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
***REMOVED***;

export default ConfirmDeleteProfilePhotoModal;