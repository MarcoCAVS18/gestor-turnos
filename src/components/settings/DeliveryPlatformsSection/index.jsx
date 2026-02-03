// src/components/settings/DeliveryPlatformsSection/index.jsx

import { useState } from 'react';
import { Package, Plus, X, Check } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import Flex from '../../ui/Flex';

const DeliveryPlatformsSection = ({ onError, onSuccess, className }) => {
  const { deliveryPlatforms, defaultDeliveryPlatform, savePreferences } = useApp();
  const colors = useThemeColors();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newPlatformName, setNewPlatformName] = useState('');
  const [newPlatformColor, setNewPlatformColor] = useState('#6B7280');

  const handleSelectDefault = async (platformId) => {
    try {
      const newDefault = platformId === defaultDeliveryPlatform ? null : platformId;
      await savePreferences({ defaultDeliveryPlatform: newDefault });
      onSuccess?.(newDefault ? 'Default platform set' : 'Default platform cleared');
    } catch (error) {
      console.error('Error setting default platform:', error);
      onError?.('Error setting default platform');
    }
  };

  const handleAddPlatform = async () => {
    if (!newPlatformName.trim()) return;

    const newPlatform = {
      id: newPlatformName.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now(),
      name: newPlatformName.trim(),
      color: newPlatformColor
    };

    try {
      const updatedPlatforms = [...deliveryPlatforms, newPlatform];
      await savePreferences({ deliveryPlatforms: updatedPlatforms });
      setNewPlatformName('');
      setNewPlatformColor('#6B7280');
      setIsAddingNew(false);
      onSuccess?.('Platform added');
    } catch (error) {
      console.error('Error adding platform:', error);
      onError?.('Error adding platform');
    }
  };

  const handleDeletePlatform = async (platformId) => {
    try {
      const updatedPlatforms = deliveryPlatforms.filter(p => p.id !== platformId);
      const updates = { deliveryPlatforms: updatedPlatforms };

      // Clear default if deleted
      if (defaultDeliveryPlatform === platformId) {
        updates.defaultDeliveryPlatform = null;
      }

      await savePreferences(updates);
      onSuccess?.('Platform removed');
    } catch (error) {
      console.error('Error removing platform:', error);
      onError?.('Error removing platform');
    }
  };

  const predefinedColors = [
    '#121212', '#FF6B35', '#00CCBC', '#FF3008',
    '#FF6B00', '#FF9900', '#6B7280', '#4CAF50',
    '#2196F3', '#9C27B0', '#E91E63', '#795548'
  ];

  return (
    <SettingsSection icon={Package} title="Delivery Platforms" className={className}>
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Select your default platform or add custom ones.
        </p>

        {/* Platforms horizontal scroll */}
        <div className="overflow-x-auto pb-4 pt-2 -mx-1 px-1">
          <div className="flex gap-3 relative" style={{ minWidth: 'min-content' }}>
            {deliveryPlatforms.map((platform) => {
              const isDefault = platform.id === defaultDeliveryPlatform;
              const isOther = platform.id === 'other';

              return (
                <div
                  key={platform.id}
                  className="relative flex-shrink-0 group"
                >
                  <button
                    onClick={() => handleSelectDefault(platform.id)}
                    className={`w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1 transition-all border-2 ${
                      isDefault
                        ? 'border-current shadow-md'
                        : 'border-transparent hover:border-gray-200'
                    }`}
                    style={{
                      backgroundColor: `${platform.color}15`,
                      borderColor: isDefault ? platform.color : undefined
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: platform.color }}
                    >
                      {platform.name.charAt(0)}
                    </div>
                    <span className="text-xs text-gray-700 font-medium text-center px-1 truncate w-full">
                      {platform.name}
                    </span>
                    {isDefault && (
                      <div
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center z-10"
                        style={{ backgroundColor: colors.primary }}
                      >
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </button>

                  {/* Delete button (not for 'other') */}
                  {!isOther && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePlatform(platform.id);
                      }}
                      className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              );
            })}

            {/* Add new platform button */}
            {!isAddingNew ? (
              <button
                onClick={() => setIsAddingNew(true)}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors flex-shrink-0"
              >
                <Plus size={24} />
                <span className="text-xs">Add</span>
              </button>
            ) : (
              <div className="w-48 h-20 rounded-xl border-2 border-gray-200 p-2 flex flex-col gap-1 flex-shrink-0 bg-white">
                <input
                  type="text"
                  value={newPlatformName}
                  onChange={(e) => setNewPlatformName(e.target.value)}
                  placeholder="Platform name"
                  className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1"
                  style={{ '--tw-ring-color': colors.primary }}
                  autoFocus
                />
                <Flex className="gap-1">
                  <div className="flex gap-0.5 flex-1 overflow-x-auto">
                    {predefinedColors.slice(0, 6).map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewPlatformColor(color)}
                        className={`w-4 h-4 rounded-full flex-shrink-0 ${
                          newPlatformColor === color ? 'ring-2 ring-offset-1' : ''
                        }`}
                        style={{
                          backgroundColor: color,
                          '--tw-ring-color': color
                        }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setIsAddingNew(false)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                  <button
                    onClick={handleAddPlatform}
                    disabled={!newPlatformName.trim()}
                    className="p-1 text-white rounded disabled:opacity-50"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Check size={14} />
                  </button>
                </Flex>
              </div>
            )}
          </div>
        </div>

        {defaultDeliveryPlatform && (
          <p className="text-xs text-gray-400">
            Default: {deliveryPlatforms.find(p => p.id === defaultDeliveryPlatform)?.name}
          </p>
        )}
      </div>
    </SettingsSection>
  );
};

export default DeliveryPlatformsSection;
