// src/components/settings/ProfileSection/index.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** User, Edit2, Save ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useAuth ***REMOVED*** from '../../../contexts/AuthContext';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';

const ProfileSection = (***REMOVED*** onError, onSuccess ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** currentUser, updateUserName ***REMOVED*** = useAuth();
  const ***REMOVED*** coloresTemáticos ***REMOVED*** = useApp();
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style=***REMOVED******REMOVED*** '--tw-ring-color': coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED***
              />
              <Button
                onClick=***REMOVED***handleSaveName***REMOVED***
                disabled=***REMOVED***loading***REMOVED***
                size="sm"
                className="!p-2"
                icon=***REMOVED***Save***REMOVED***
              />
            </div>
          ) : (
            <div className="flex items-center">
              <div className="text-gray-900">***REMOVED***displayName***REMOVED***</div>
              <button
                onClick=***REMOVED***() => setEditingName(true)***REMOVED***
                className="ml-2 transition-colors"
                style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED***
              >
                <Edit2 className="h-4 w-4" />
              </button>
            </div>
          )***REMOVED***
        </div>
      </div>
    </SettingsSection>
  );
***REMOVED***;

export default ProfileSection;