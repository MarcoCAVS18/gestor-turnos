import React from 'react';

const ShareMessages = ({ messages }) => {
  const hasMessages = Object.values(messages).some(msg => msg);
  
  if (!hasMessages) return null;

  return (
    <div className="space-y-2">
      {Object.entries(messages).map(([trabajoId, mensaje]) => 
        mensaje ? (
          <div key={trabajoId} className="p-3 bg-green-100 text-green-700 rounded-md text-sm">
            {mensaje}
          </div>
        ) : null
      )}
    </div>
  );
};

export default ShareMessages;