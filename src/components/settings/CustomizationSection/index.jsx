// src/components/settings/CustomizationSection/index.jsx - REFACTORED

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** Settings, Smile ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import Card from '../../ui/Card'; 

const COLORS = [
  ***REMOVED*** name: 'Pink', value: '#EC4899' ***REMOVED***, 
  ***REMOVED*** name: 'Indigo', value: '#6366F1' ***REMOVED***, 
  ***REMOVED*** name: 'Red', value: '#EF4444' ***REMOVED***, 
  ***REMOVED*** name: 'Green', value: '#10B981' ***REMOVED***, 
  ***REMOVED*** name: 'Purple', value: '#8B5CF6' ***REMOVED***, 
  ***REMOVED*** name: 'Blue', value: '#3B82F6' ***REMOVED*** 
];

const COMMON_EMOJIS = ['😊', '😎', '🚀', '💼', '⭐', '🔥', '💻', '📊'];

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

  const changeColor = (newColor) => ***REMOVED***
    savePreferences(***REMOVED*** primaryColor: newColor ***REMOVED***);
  ***REMOVED***;

  const changeEmoji = (newEmoji) => ***REMOVED***
    setEmojiInput(newEmoji);
    savePreferences(***REMOVED*** userEmoji: newEmoji ***REMOVED***);
  ***REMOVED***;

  const handleEmojiChange = (e) => ***REMOVED***
    const value = e.target.value;
    setEmojiInput(value);
    
    if (value.trim() === '') ***REMOVED***
      savePreferences(***REMOVED*** userEmoji: '😊' ***REMOVED***);
    ***REMOVED*** else ***REMOVED***
      savePreferences(***REMOVED*** userEmoji: value ***REMOVED***);
    ***REMOVED***
  ***REMOVED***;

  return (
    <Card className="flex flex-col">
      <div className="flex items-center mb-4">
        <Settings className="h-5 w-5 text-gray-500 mr-2" />
        <h2 className="text-lg font-semibold">Customization</h2>
      </div>
      <div className="flex-1">
        <div className="space-y-6">
          ***REMOVED***/* Emoji selection */***REMOVED***
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your personal emoji
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
                Type or paste your favorite emoji
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              ***REMOVED***COMMON_EMOJIS.map(emoji => (
                <button
                  key=***REMOVED***emoji***REMOVED***
                  onClick=***REMOVED***() => changeEmoji(emoji)***REMOVED***
                  className="w-8 h-8 rounded-md flex items-center justify-center text-lg hover:bg-gray-100 transition-colors"
                >
                  ***REMOVED***emoji***REMOVED***
                </button>
              ))***REMOVED***
            </div>
          </div>
          
          ***REMOVED***/* Color selection */***REMOVED***
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary color
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              ***REMOVED***COLORS.map((color) => (
                <button
                  key=***REMOVED***color.value***REMOVED***
                  onClick=***REMOVED***() => changeColor(color.value)***REMOVED***
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