// src/components/settings/ProfileSection/index.jsx

import React, { useState } from 'react';
import { User, Edit2, Save } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useApp } from '../../../contexts/AppContext';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';

const ProfileSection = ({ onError, onSuccess }) => {
  const { currentUser, updateUserName } = useAuth();
  const { coloresTemáticos } = useApp();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [editingName, setEditingName] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSaveName = async () => {
    try {
      setLoading(true);
      await updateUserName(displayName);
      setEditingName(false);
      onSuccess?.('Nombre actualizado correctamente');
    } catch (error) {
      onError?.('Error al actualizar nombre: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsSection icon={User} title="Perfil">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <div className="mt-1 text-gray-900">{currentUser?.email}</div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': coloresTemáticos?.base || '#EC4899' }}
              />
              <Button
                onClick={handleSaveName}
                disabled={loading}
                size="sm"
                className="!p-2"
                icon={Save}
              />
            </div>
          ) : (
            <div className="flex items-center">
              <div className="text-gray-900">{displayName}</div>
              <button
                onClick={() => setEditingName(true)}
                className="ml-2 transition-colors"
                style={{ color: coloresTemáticos?.base || '#EC4899' }}
              >
                <Edit2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </SettingsSection>
  );
};

export default ProfileSection;