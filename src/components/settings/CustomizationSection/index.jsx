// src/components/settings/CustomizationSection/index.jsx

import React, { useState, useEffect } from 'react';
import { Settings, Smile } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import SettingsSection from '../SettingsSection';

const COLORES = [
  { name: 'Rosa', value: '#EC4899' }, 
  { name: 'Índigo', value: '#6366F1' }, 
  { name: 'Rojo', value: '#EF4444' }, 
  { name: 'Verde', value: '#10B981' }, 
  { name: 'Púrpura', value: '#8B5CF6' }, 
  { name: 'Azul', value: '#3B82F6' } 
];

const EMOJIS_COMUNES = ['😊', '😎', '🚀', '💼', '⭐', '🔥', '💻', '📊'];

const CustomizationSection = () => {
  const { 
    colorPrincipal: appColor, 
    emojiUsuario: appEmoji, 
    guardarPreferencias,
    coloresTemáticos
  } = useApp();
  
  const [emojiInput, setEmojiInput] = useState(appEmoji);

  useEffect(() => {
    setEmojiInput(appEmoji);
  }, [appEmoji]);

  const cambiarColor = (nuevoColor) => {
    guardarPreferencias({ colorPrincipal: nuevoColor });
  };

  const cambiarEmoji = (nuevoEmoji) => {
    setEmojiInput(nuevoEmoji);
    guardarPreferencias({ emojiUsuario: nuevoEmoji });
  };

  const handleEmojiChange = (e) => {
    const valor = e.target.value;
    setEmojiInput(valor);
    
    if (valor.trim() === '') {
      guardarPreferencias({ emojiUsuario: '😊' });
    } else {
      guardarPreferencias({ emojiUsuario: valor });
    }
  };

  return (
    <SettingsSection icon={Settings} title="Personalización">
      <div className="space-y-6">
        {/* Selección de emoji */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tu emoji personal
          </label>
          <div className="flex items-center">
            <input
              type="text"
              value={emojiInput}
              onChange={handleEmojiChange}
              className="w-16 h-10 border border-gray-300 rounded-md shadow-sm px-3 focus:outline-none focus:ring-2 text-xl"
              style={{ '--tw-ring-color': coloresTemáticos?.base || appColor }}
            />
            <p className="ml-3 text-sm text-gray-500">
              <Smile className="inline h-4 w-4 mb-1 mr-1" />
              Escribe o pega tu emoji favorito
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {EMOJIS_COMUNES.map(emoji => (
              <button
                key={emoji}
                onClick={() => cambiarEmoji(emoji)}
                className="w-8 h-8 rounded-md flex items-center justify-center text-lg hover:bg-gray-100 transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
        
        {/* Selección de color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color principal
          </label>
          <div className="grid grid-cols-3 gap-3">
            {COLORES.map((color) => (
              <button
                key={color.value}
                onClick={() => cambiarColor(color.value)}
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
    </SettingsSection>
  );
};

export default CustomizationSection;