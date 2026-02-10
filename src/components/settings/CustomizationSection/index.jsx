// src/components/settings/CustomizationSection/index.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Palette, Smile, Sun, Moon, Lock, Crown, Check } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { usePremium, PREMIUM_COLORS } from '../../../contexts/PremiumContext';
import Card from '../../ui/Card';

const COLORS = [
  { name: 'Pink', value: '#EC4899' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Blue', value: '#3B82F6' }
];

const COMMON_EMOJIS = ['😊', '😎', '🚀', '⭐', '🔥', '💻', '📊'];

const CustomizationSection = () => {
  const {
    primaryColor: appColor,
    userEmoji: appEmoji,
    themeMode,
    savePreferences
  } = useApp();

  const colors = useThemeColors();
  const { isPremium } = usePremium();
  const navigate = useNavigate();
  const [emojiInput, setEmojiInput] = useState(appEmoji);

  useEffect(() => {
    setEmojiInput(appEmoji);
  }, [appEmoji]);

  const changeColor = (newColor) => {
    savePreferences({ primaryColor: newColor });
  };

  const changeTheme = (mode) => {
    if (mode === 'dark' && !isPremium) {
      navigate('/premium');
      return;
    }
    savePreferences({ themeMode: mode });
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

  // Color selector row component
  const ColorRow = ({ disabled = false }) => (
    <div className="flex gap-2 mt-3">
      {COLORS.map((color) => {
        const isSelected = appColor === color.value;
        return (
          <button
            key={color.value}
            onClick={() => !disabled && changeColor(color.value)}
            disabled={disabled}
            className={`relative w-8 h-8 rounded-full transition-all ${
              disabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110'
            }`}
            style={{ backgroundColor: color.value }}
            title={color.name}
          >
            {isSelected && !disabled && (
              <div
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Check size={10} className="text-white" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <Card className="flex flex-col">
      <div className="flex items-center mb-4">
        <Palette className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
        <h2 className="text-lg font-semibold dark:text-white">Primary color / Customization</h2>
      </div>
      <div className="flex-1">
        <div className="space-y-4">
          {/* Light Mode Option */}
          <button
            onClick={() => changeTheme('light')}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left relative ${
              themeMode === 'light'
                ? 'border-current shadow-md'
                : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
            }`}
            style={{
              backgroundColor: themeMode === 'light' ? `${appColor}10` : undefined,
              borderColor: themeMode === 'light' ? appColor : undefined
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 flex items-center justify-center shadow-sm">
                <Sun size={24} className="text-yellow-600" />
              </div>
              <div className="flex-1">
                <span className="text-base font-medium text-gray-800 dark:text-white">Light</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Bright and clean appearance</p>
              </div>
              {themeMode === 'light' && (
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Check size={14} className="text-white" />
                </div>
              )}
            </div>
            {themeMode === 'light' && <ColorRow />}
          </button>

          {/* Dark Mode Option */}
          <div className="relative">
            <button
              onClick={() => changeTheme('dark')}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden ${
                themeMode === 'dark'
                  ? 'border-current shadow-md bg-slate-800'
                  : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
              }`}
              style={{
                backgroundColor: themeMode === 'dark' ? `${appColor}15` : undefined,
                borderColor: themeMode === 'dark' ? appColor : undefined
              }}
            >
              {/* Premium lock overlay for non-premium users */}
              {!isPremium && (
                <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl">
                  <div className="flex flex-col items-center">
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-2"
                      style={{ backgroundColor: `${PREMIUM_COLORS.gold}20` }}
                    >
                      <Crown size={14} style={{ color: PREMIUM_COLORS.gold }} />
                      <span className="text-sm font-medium" style={{ color: PREMIUM_COLORS.primary }}>Premium</span>
                    </div>
                    <Lock size={20} className="text-gray-400" />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${
                  themeMode === 'dark'
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                    : 'bg-gradient-to-br from-gray-600 to-gray-800'
                }`}>
                  <Moon size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <span className={`text-base font-medium ${themeMode === 'dark' ? 'text-white' : 'text-gray-800 dark:text-white'}`}>
                    Dark
                  </span>
                  <p className={`text-xs ${themeMode === 'dark' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    Easy on the eyes at night
                  </p>
                </div>
                {themeMode === 'dark' && (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </div>
              {themeMode === 'dark' && isPremium && <ColorRow />}
            </button>
          </div>

          {/* Emoji selection */}
          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your personal emoji
            </label>
            {/* Desktop: all in one row | Mobile: stacked */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
              <input
                type="text"
                value={emojiInput}
                onChange={handleEmojiChange}
                className="w-16 h-10 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm px-3 focus:outline-none focus:ring-2 text-xl bg-white dark:bg-slate-700 flex-shrink-0"
                style={{ '--tw-ring-color': colors.primary }}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                <Smile className="inline h-4 w-4 mb-1 mr-1" />
                Type or paste your favorite emoji
              </p>
              <div className="flex flex-wrap gap-2 md:ml-auto">
                {COMMON_EMOJIS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => changeEmoji(emoji)}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CustomizationSection;
