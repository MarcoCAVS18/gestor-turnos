// src/components/settings/ProfileSection/index.jsx - REFACTORIZADO

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** User, Edit2, Save ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useAuth ***REMOVED*** from '../../../contexts/AuthContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';

const ProfileSection = (***REMOVED*** onError, onSuccess ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** currentUser, updateUserName ***REMOVED*** = useAuth();
  const colors = useThemeColors();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [editingName, setEditingName] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSaveName = async () => ***REMOVED***
    try ***REMOVED***
      setLoading(true);
      await updateUserName(displayName);
      setEditingName(false);
      onSuccess?.('Nombre actualizado correctamente');
    ***REMOVED*** catch (error) ***REMOVED***
      onError?.('Error al actualizar nombre: ' + error.message);
    ***REMOVED*** finally ***REMOVED***
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;

  return (
    <SettingsSection icon=***REMOVED***User***REMOVED*** title="Perfil">
      <div className="space-y-4">
        ***REMOVED***/* Email y Nombre en la misma línea en desktop */***REMOVED***
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 text-gray-900">***REMOVED***currentUser?.email***REMOVED***</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            ***REMOVED***editingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value=***REMOVED***displayName***REMOVED***
                  onChange=***REMOVED***(e) => setDisplayName(e.target.value)***REMOVED***
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 transition-colors"
                  style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
                />
                <Button
                  onClick=***REMOVED***handleSaveName***REMOVED***
                  disabled=***REMOVED***loading***REMOVED***
                  loading=***REMOVED***loading***REMOVED***
                  size="sm"
                  className="!p-2"
                  icon=***REMOVED***Save***REMOVED***
                  themeColor=***REMOVED***colors.primary***REMOVED***
                />
              </div>
            ) : (
              <div className="flex items-center">
                <div className="text-gray-900">***REMOVED***displayName***REMOVED***</div>
                <button
                  onClick=***REMOVED***() => setEditingName(true)***REMOVED***
                  className="ml-2 transition-colors p-1 rounded hover:bg-gray-100"
                  style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
            )***REMOVED***
          </div>
        </div>
      </div>
    </SettingsSection>
  );
***REMOVED***;

export default ProfileSection;
