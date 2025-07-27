// src/components/dashboard/WelcomeCard/index.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import Card from '../../ui/Card';

const WelcomeCard = ({ totalGanado }) => {
  const { currentUser } = useAuth();
  const { userEmoji } = useApp();
  const colors = useThemeColors();
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    if (currentUser) {
      setUserName(
        currentUser.displayName || 
        (currentUser.email ? currentUser.email.split('@')[0] : '')
      );
    }
  }, [currentUser]);

  // Función para obtener el saludo según la hora
  const getSaludo = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días,';
    if (hora < 18) return 'Buenas tardes,';
    return 'Buenas noches,';
  };

  return (
    <Card>
      {/* MÓVIL: Layout vertical centrado */}
      <div className="block sm:hidden text-center space-y-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            {getSaludo()} {userName && `${userName} `}{userEmoji}
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            Acá tienes un resumen de tu actividad
          </p>
        </div>
        
        <div>
          <p className="text-xs text-gray-500 mb-1">Ganado total</p>
          <p 
            className="text-2xl font-bold"
            style={{ color: colors.primary }}
          >
            {formatCurrency(totalGanado)}
          </p>
        </div>
      </div>

      {/* TABLET Y DESKTOP: Layout horizontal original */}
      <div className="hidden sm:flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {getSaludo()} {userName && `${userName} `}{userEmoji}
          </h1>
          <p className="text-gray-600 mt-1">
            Acá tienes un resumen<br />
            de tu actividad
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Ganado total</p>
          <p 
            className="text-2xl font-bold"
            style={{ color: colors.primary }}
          >
            {formatCurrency(totalGanado)}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default WelcomeCard;