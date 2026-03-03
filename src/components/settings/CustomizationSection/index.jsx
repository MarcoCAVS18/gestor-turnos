// src/components/settings/CustomizationSection/index.jsx

import React from 'react';
import { Palette, Sun, Moon, Lock, Crown, Check, Globe } from 'lucide-react';
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

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'fr', label: 'French', native: 'Français' },
];

const CustomizationSection = ({ id, className }) => {
  const {
    primaryColor: appColor,
    language,
    themeMode,
    savePreferences
  } = useApp();

  const colors = useThemeColors();
  const { isPremium, openPremiumModal } = usePremium();

  const changeColor = (newColor) => {
    savePreferences({ primaryColor: newColor });
  };

  const changeTheme = (mode) => {
    if (mode === 'dark' && !isPremium) {
      openPremiumModal();
      return;
    }
    savePreferences({ themeMode: mode });
  };

  const changeLanguage = (lang) => {
    savePreferences({ language: lang });
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
    <Card id={id} className={`flex flex-col${className ? ` ${className}` : ''}`}>
      <div className="flex items-center mb-4">
        <Palette className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
        <h2 className="text-lg font-semibold dark:text-white">Customization</h2>
      </div>
      <div className="flex-1">
        <div className="space-y-4">
          {/* Light Mode Option */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => changeTheme('light')}
            onKeyDown={(e) => e.key === 'Enter' && changeTheme('light')}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left relative cursor-pointer ${
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
          </div>

          {/* Dark Mode Option */}
          <div className="relative">
            <div
              role="button"
              tabIndex={0}
              onClick={() => changeTheme('dark')}
              onKeyDown={(e) => e.key === 'Enter' && changeTheme('dark')}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden cursor-pointer ${
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
            </div>
          </div>

          {/* Language Selector */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <Globe size={15} className="text-gray-500 dark:text-gray-400" />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Language
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`relative flex flex-col items-center justify-center py-3 px-2 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'shadow-md'
                        : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 bg-transparent'
                    }`}
                    style={{
                      backgroundColor: isSelected ? `${appColor}12` : undefined,
                      borderColor: isSelected ? appColor : undefined,
                    }}
                  >
                    <span
                      className="text-lg font-bold tracking-wide"
                      style={{ color: isSelected ? appColor : undefined }}
                    >
                      {lang.code.toUpperCase()}
                    </span>
                    <span className={`text-xs mt-0.5 font-medium ${
                      isSelected ? 'text-gray-700 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {lang.native}
                    </span>
                    {isSelected && (
                      <div
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: appColor }}
                      >
                        <Check size={9} className="text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CustomizationSection;
