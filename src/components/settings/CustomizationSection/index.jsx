// src/components/settings/CustomizationSection/index.jsx - REFACTORED

import React, { useState, useEffect } from 'react';
import { Settings, Smile } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Card from '../../ui/Card'; 

const COLORS = [
  { name: 'Pink', value: '#EC4899' }, 
  { name: 'Indigo', value: '#6366F1' }, 
  { name: 'Red', value: '#EF4444' }, 
  { name: 'Green', value: '#10B981' }, 
  { name: 'Purple', value: '#8B5CF6' }, 
  { name: 'Blue', value: '#3B82F6' } 
];

const COMMON_EMOJIS = ['😊', '😎', '🚀', '💼', '⭐', '🔥', '💻', '📊'];

const CustomizationSection = () => {
  const { 
    primaryColor: appColor, 
    userEmoji: appEmoji, 
    savePreferences
  } = useApp();
  
  const colors = useThemeColors();
  const [emojiInput, setEmojiInput] = useState(appEmoji);

  useEffect(() => {
    setEmojiInput(appEmoji);
  }, [appEmoji]);

  const changeColor = (newColor) => {
    savePreferences({ primaryColor: newColor });
  };

  const changeEmoji = (newEmoji) => {
    setEmojiInput(newEmoji);
    savePreferences({ userEmoji: newEmoji });
  };

  const handleEmojiChange = (e) => {
    const value = e.target.value;
    setEmojiInput(value);
    
    if (value.trim() === '') {
      savePreferences({ userEmoji: '😊' });
    } else {
      savePreferences({ userEmoji: value });
    }
  };

  return (
    <Card className="flex flex-col">
      <div className="flex items-center mb-4">
        <Settings className="h-5 w-5 text-gray-500 mr-2" />
        <h2 className="text-lg font-semibold">Customization</h2>
      </div>
      <div className="flex-1">
        <div className="space-y-6">
          {/* Emoji selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your personal emoji
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={emojiInput}
                onChange={handleEmojiChange}
                className="w-16 h-10 border border-gray-300 rounded-md shadow-sm px-3 focus:outline-none focus:ring-2 text-xl"
                style={{ '--tw-ring-color': colors.primary }}
              />
              <p className="ml-3 text-sm text-gray-500">
                <Smile className="inline h-4 w-4 mb-1 mr-1" />
                Type or paste your favorite emoji
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {COMMON_EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => changeEmoji(emoji)}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-lg hover:bg-gray-100 transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          
          {/* Color selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary color
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => changeColor(color.value)}
                  className={`p-3 flex flex-col items-center rounded-lg border transition-all ${
                    appColor === color.value 
                      ? 'border-gray-600 shadow-md' 
                      : 'border-gray-200'
                  }`}
                >
                  <div 
                    className="w-8 h-8 rounded-full mb-1" 
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="text-xs">{color.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CustomizationSection;