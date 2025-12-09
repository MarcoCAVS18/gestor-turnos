// src/components/settings/CustomizationSection/index.jsx - REFACTORIZADO

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** Settings, Smile ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import Card from '../../ui/Card'; 

const COLORES = [
  ***REMOVED*** name: 'Rosa', value: '#EC4899' ***REMOVED***, 
  ***REMOVED*** name: 'Índigo', value: '#6366F1' ***REMOVED***, 
  ***REMOVED*** name: 'Rojo', value: '#EF4444' ***REMOVED***, 
  ***REMOVED*** name: 'Verde', value: '#10B981' ***REMOVED***, 
  ***REMOVED*** name: 'Púrpura', value: '#8B5CF6' ***REMOVED***, 
  ***REMOVED*** name: 'Azul', value: '#3B82F6' ***REMOVED*** 
];

const EMOJIS_COMUNES = ['😊', '😎', '🚀', '💼', '⭐', '🔥', '💻', '📊'];

const CustomizationSection = () => ***REMOVED***
  const ***REMOVED*** 
    primaryColor: appColor, 
    userEmoji: appEmoji, 
    savePreferences
  ***REMOVED*** = useApp();
  
  const colors = useThemeColors();
  const [emojiInput, setEmojiInput] = useState(appEmoji);

  useEffect(() => ***REMOVED***
    setEmojiInput(appEmoji);
  ***REMOVED***, [appEmoji]);

  const cambiarColor = (nuevoColor) => ***REMOVED***
    savePreferences(***REMOVED*** colorPrincipal: nuevoColor ***REMOVED***);
  ***REMOVED***;

  const cambiarEmoji = (nuevoEmoji) => ***REMOVED***
    setEmojiInput(nuevoEmoji);
    savePreferences(***REMOVED*** emojiUsuario: nuevoEmoji ***REMOVED***);
  ***REMOVED***;

  const handleEmojiChange = (e) => ***REMOVED***
    const valor = e.target.value;
    setEmojiInput(valor);
    
    if (valor.trim() === '') ***REMOVED***
      savePreferences(***REMOVED*** emojiUsuario: '😊' ***REMOVED***);
    ***REMOVED*** else ***REMOVED***
      savePreferences(***REMOVED*** emojiUsuario: valor ***REMOVED***);
    ***REMOVED***
  ***REMOVED***;

  return (
    <Card className="mb-6 flex flex-col">
      <div className="flex items-center mb-4">
        <Settings className="h-5 w-5 text-gray-500 mr-2" />
        <h2 className="text-lg font-semibold">Personalización</h2>
      </div>
      <div className="flex-1">
        <div className="space-y-6">
          ***REMOVED***/* Selección de emoji */***REMOVED***
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu emoji personal
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value=***REMOVED***emojiInput***REMOVED***
                onChange=***REMOVED***handleEmojiChange***REMOVED***
                className="w-16 h-10 border border-gray-300 rounded-md shadow-sm px-3 focus:outline-none focus:ring-2 text-xl"
                style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
              />
              <p className="ml-3 text-sm text-gray-500">
                <Smile className="inline h-4 w-4 mb-1 mr-1" />
                Escribe o pega tu emoji favorito
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              ***REMOVED***EMOJIS_COMUNES.map(emoji => (
                <button
                  key=***REMOVED***emoji***REMOVED***
                  onClick=***REMOVED***() => cambiarEmoji(emoji)***REMOVED***
                  className="w-8 h-8 rounded-md flex items-center justify-center text-lg hover:bg-gray-100 transition-colors"
                >
                  ***REMOVED***emoji***REMOVED***
                </button>
              ))***REMOVED***
            </div>
          </div>
          
          ***REMOVED***/* Selección de color */***REMOVED***
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color principal
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              ***REMOVED***COLORES.map((color) => (
                <button
                  key=***REMOVED***color.value***REMOVED***
                  onClick=***REMOVED***() => cambiarColor(color.value)***REMOVED***
                  className=***REMOVED***`p-3 flex flex-col items-center rounded-lg border transition-all $***REMOVED***
                    appColor === color.value 
                      ? 'border-gray-600 shadow-md' 
                      : 'border-gray-200'
                  ***REMOVED***`***REMOVED***
                >
                  <div 
                    className="w-8 h-8 rounded-full mb-1" 
                    style=***REMOVED******REMOVED*** backgroundColor: color.value ***REMOVED******REMOVED***
                  />
                  <span className="text-xs">***REMOVED***color.name***REMOVED***</span>
                </button>
              ))***REMOVED***
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
***REMOVED***;

export default CustomizationSection;