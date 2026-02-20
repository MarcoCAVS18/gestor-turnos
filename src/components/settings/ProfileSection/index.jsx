// src/components/settings/ProfileSection/index.jsx - REFACTORED

import React, { useState } from 'react';
import { User, Edit2, Save } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';

const ProfileSection = ({ onError, onSuccess, className }) => {
  const { currentUser, updateUserName } = useAuth();
  const colors = useThemeColors();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [editingName, setEditingName] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSaveName = async () => {
    try {
      setLoading(true);
      await updateUserName(displayName);
      setEditingName(false);
      onSuccess?.('Name updated successfully');
    } catch (error) {
      onError?.('Error updating name: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsSection icon={User} title="Profile" className={className}>
      <div className="space-y-4">
        {/* Email and Name on the same line on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="min-w-0">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 text-gray-900 truncate">{currentUser?.email}</div>
          </div>

          <div className="min-w-0">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 transition-colors"
                  style={{ '--tw-ring-color': colors.primary }}
                />
                <Button
                  onClick={handleSaveName}
                  disabled={loading}
                  loading={loading}
                  size="sm"
                  className="!p-2"
                  icon={Save}
                  themeColor={colors.primary}
                />
              </div>
            ) : (
              <div className="flex items-center">
                <div className="text-gray-900">{displayName}</div>
                <button
                  onClick={() => setEditingName(true)}
                  className="ml-2 transition-colors p-1 rounded hover:bg-gray-100"
                  style={{ color: colors.primary }}
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </SettingsSection>
  );
};

export default ProfileSection;